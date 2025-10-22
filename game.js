class Bot {
  constructor(id, x, y, playerId) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.playerId = playerId;
    this.hp = 10;
    this.maxHp = 10;
    this.moveQueue = [];
    this.ability = null;
    this.lastDirection = { dx: 0, dy: -1 }; // default up
  }

  addMove(direction) {
    this.moveQueue.push(direction);
  }

  clearQueue() {
    this.moveQueue = [];
  }

  getNextMove() {
    return this.moveQueue.shift();
  }

  hasQueuedMoves() {
    return this.moveQueue.length > 0;
  }

  takeDamage(amount) {
    this.hp -= amount;
    return this.hp <= 0;
  }

  heal(amount) {
    this.hp = Math.min(this.hp + amount, this.maxHp);
  }

  addArmor(amount) {
    this.maxHp += amount;
    this.hp += amount;
  }
}

class Player {
  constructor(id, color, char) {
    this.id = id;
    this.color = color;
    this.char = char;
    this.money = 0;
    this.bots = [];
    this.selectedBotIndex = 0;
    this.buyMenuOpen = false;
  }

  addBot(bot) {
    if (this.bots.length < 5) {
      this.bots.push(bot);
      return true;
    }
    return false;
  }

  removeBot(bot) {
    const index = this.bots.indexOf(bot);
    if (index > -1) {
      this.bots.splice(index, 1);
      if (this.selectedBotIndex >= this.bots.length) {
        this.selectedBotIndex = Math.max(0, this.bots.length - 1);
      }
    }
  }

  getSelectedBot() {
    return this.bots[this.selectedBotIndex];
  }

  selectNextBot() {
    if (this.bots.length > 0) {
      this.selectedBotIndex = (this.selectedBotIndex + 1) % this.bots.length;
    }
  }

  selectPrevBot() {
    if (this.bots.length > 0) {
      this.selectedBotIndex = (this.selectedBotIndex - 1 + this.bots.length) % this.bots.length;
    }
  }

  selectBot(index) {
    if (index >= 0 && index < this.bots.length) {
      this.selectedBotIndex = index;
    }
  }
}

class Game {
  constructor() {
    this.width = 40;
    this.height = 20;
    this.players = new Map();
    this.bots = [];
    this.coins = [];
    this.effects = []; // visual effects for abilities
    this.botIdCounter = 0;
    this.colors = ['red', 'blue', 'green', 'yellow', 'magenta', 'cyan'];
    this.chars = ['█', '▓', '▒', '░', '■', '●'];
    this.usedColorIndices = [];
  }

  addPlayer(playerId, socket) {
    if (this.players.size >= 6) return null;

    const colorIndex = this.usedColorIndices.length;
    this.usedColorIndices.push(colorIndex);
    
    const player = new Player(
      playerId, 
      this.colors[colorIndex % this.colors.length],
      this.chars[colorIndex % this.chars.length]
    );
    
    this.players.set(playerId, player);

    // Create initial bot for player
    const spawnPos = this.getRandomSpawnPosition();
    const bot = new Bot(this.botIdCounter++, spawnPos.x, spawnPos.y, playerId);
    this.bots.push(bot);
    player.addBot(bot);

    return player;
  }

  removePlayer(playerId) {
    const player = this.players.get(playerId);
    if (player) {
      // Remove all bots belonging to this player
      this.bots = this.bots.filter(bot => bot.playerId !== playerId);
      this.players.delete(playerId);
    }
  }

  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  getRandomSpawnPosition() {
    let x, y;
    let attempts = 0;
    do {
      x = Math.floor(Math.random() * this.width);
      y = Math.floor(Math.random() * this.height);
      attempts++;
    } while (this.isTileOccupied(x, y) && attempts < 100);
    return { x, y };
  }

  isTileOccupied(x, y) {
    return this.bots.some(bot => bot.x === x && bot.y === y);
  }

  handlePlayerCommand(playerId, command) {
    console.log(`Handling command from ${playerId}: ${command}`);
    const player = this.players.get(playerId);
    if (!player) return;

    const cmd = command.toLowerCase();

    // Bot selection (1-5)
    if (cmd >= '1' && cmd <= '5') {
      const index = parseInt(cmd) - 1;
      player.selectBot(index);
      return;
    }

    // Tab to cycle through bots
    if (cmd === 'tab') {
      player.selectNextBot();
      return;
    }

    const selectedBot = player.getSelectedBot();
    if (!selectedBot) return;

    // Movement commands
    if (cmd === 'w' || cmd === 'a' || cmd === 's' || cmd === 'd') {
      selectedBot.addMove(cmd);
      return;
    }

    // Reset queue
    if (cmd === 'r') {
      selectedBot.clearQueue();
      return;
    }

    // Use ability
    if (cmd === 'q') {
      console.log(`Player ${playerId} attempting to use ability of bot ${selectedBot.id}`);
      if (selectedBot.ability) {
        console.log(`Player ${playerId} using ability ${selectedBot.ability} of bot ${selectedBot.id}`);
        this.useAbility(selectedBot, selectedBot.ability);
      }
      return;
    }

    // Toggle buy menu
    if (cmd === 'p') {
      player.buyMenuOpen = !player.buyMenuOpen;
      return;
    }

    // Buy menu commands
    if (player.buyMenuOpen) {
      this.handleBuyCommand(player, selectedBot, cmd);
    }
  }

  handleBuyCommand(player, bot, cmd) {
    if (!bot) return;

    switch (cmd) {
      case 'r': // repair 10 armor
        if (player.money >= 5) {
          player.money -= 5;
          bot.heal(10);
          player.buyMenuOpen = false;
        }
        break;
      case 'a': // buy 5 armor
        if (player.money >= 5) {
          player.money -= 5;
          bot.addArmor(5);
          player.buyMenuOpen = false;
        }
        break;
      case 'q': // explosion ability
        if (player.money >= 10 && !bot.ability) {
          player.money -= 10;
          bot.ability = 'explosion';
          player.buyMenuOpen = false;
        }
        break;
      case 'f': // shoot ability
        if (player.money >= 10 && !bot.ability) {
          player.money -= 10;
          bot.ability = 'shoot';
          player.buyMenuOpen = false;
        }
        break;
      case 'h': // H-shape shockwave
        if (player.money >= 20 && !bot.ability) {
          player.money -= 20;
          bot.ability = 'shockwave';
          player.buyMenuOpen = false;
        }
        break;
      case 'b': // buy new bot
        if (player.money >= 15 && player.bots.length < 5) {
          player.money -= 15;
          const spawnPos = this.getRandomSpawnPosition();
          const newBot = new Bot(this.botIdCounter++, spawnPos.x, spawnPos.y, player.id);
          this.bots.push(newBot);
          player.addBot(newBot);
          player.buyMenuOpen = false;
        }
        break;
    }
  }

  handleBuy(playerId, item) {
    const player = this.players.get(playerId);
    if (!player) return;
    
    const bot = player.getSelectedBot();
    this.handleBuyCommand(player, bot, item);
  }

  tick() {
    this.effects = []; // Clear effects from last tick

    // Collect all intended moves
    const moveIntents = [];
    
    this.bots.forEach(bot => {
      if (bot.hasQueuedMoves()) {
        const move = bot.getNextMove();
        const newPos = this.calculateNewPosition(bot, move);
        
        if (newPos) {
          moveIntents.push({
            bot,
            newX: newPos.x,
            newY: newPos.y,
            direction: move
          });
        }
      }
    });

    // Detect collisions
    const positionMap = new Map();
    moveIntents.forEach(intent => {
      const key = `${intent.newX},${intent.newY}`;
      if (!positionMap.has(key)) {
        positionMap.set(key, []);
      }
      positionMap.get(key).push(intent);
    });

    // Execute moves and apply collision damage
    moveIntents.forEach(intent => {
      const key = `${intent.newX},${intent.newY}`;
      const botsAtPosition = positionMap.get(key);
      
      if (botsAtPosition.length > 1) {
        // Collision! Multiple bots trying to move to same spot
        const enemyBots = botsAtPosition.filter(i => 
          i.bot.playerId !== intent.bot.playerId
        );
        
        if (enemyBots.length > 0) {
          // Only damage if it's an enemy collision
          intent.bot.takeDamage(10);
        }
        // Don't move the bot
      } else {
        // Move successful
        intent.bot.x = intent.newX;
        intent.bot.y = intent.newY;
        
        // Update last direction
        const dirMap = {
          'w': { dx: 0, dy: -1 },
          's': { dx: 0, dy: 1 },
          'a': { dx: -1, dy: 0 },
          'd': { dx: 1, dy: 0 }
        };
        if (dirMap[intent.direction]) {
          intent.bot.lastDirection = dirMap[intent.direction];
        }

        // Check for coin pickup
        this.checkCoinPickup(intent.bot);
      }
    });

    // Remove dead bots
    this.bots = this.bots.filter(bot => {
      if (bot.hp <= 0) {
        const player = this.players.get(bot.playerId);
        if (player) {
          player.removeBot(bot);
        }
        return false;
      }
      return true;
    });
  }

  calculateNewPosition(bot, move) {
    let newX = bot.x;
    let newY = bot.y;

    switch (move) {
      case 'w':
        newY = Math.max(0, bot.y - 1);
        break;
      case 's':
        newY = Math.min(this.height - 1, bot.y + 1);
        break;
      case 'a':
        newX = Math.max(0, bot.x - 1);
        break;
      case 'd':
        newX = Math.min(this.width - 1, bot.x + 1);
        break;
      default:
        return null;
    }

    return { x: newX, y: newY };
  }

  checkCoinPickup(bot) {
    const coinIndex = this.coins.findIndex(coin => 
      coin.x === bot.x && coin.y === bot.y
    );
    
    if (coinIndex !== -1) {
      this.coins.splice(coinIndex, 1);
      const player = this.players.get(bot.playerId);
      if (player) {
        player.money += 10;
      }
    }
  }

  spawnCoin() {
    if (this.coins.length < 10) {
      const pos = this.getRandomSpawnPosition();
      this.coins.push({ x: pos.x, y: pos.y });
    }
  }

  useAbility(bot, ability) {
    const player = this.players.get(bot.playerId);
    if (!player) return;

    switch (ability) {
      case 'explosion':
        this.explosionAbility(bot, player);
        break;
      case 'shoot':
        this.shootAbility(bot, player);
        break;
      case 'shockwave':
        this.shockwaveAbility(bot, player);
        break;
    }
  }

  explosionAbility(bot, player) {
    // Damage all adjacent tiles
    const adjacentOffsets = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0],           [1, 0],
      [-1, 1],  [0, 1],  [1, 1]
    ];

    adjacentOffsets.forEach(([dx, dy]) => {
      const x = bot.x + dx;
      const y = bot.y + dy;
      
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.effects.push({ x, y, char: '*', color: player.color });
        
        // Damage bots at this position
        this.bots.forEach(targetBot => {
          if (targetBot.x === x && targetBot.y === y && targetBot.playerId !== player.id) {
            targetBot.takeDamage(5);
          }
        });
      }
    });
  }

  shootAbility(bot, player) {
    const dx = bot.lastDirection.dx;
    const dy = bot.lastDirection.dy;

    // Shoot 3 tiles in the last moved direction
    for (let i = 1; i <= 3; i++) {
      const x = bot.x + dx * i;
      const y = bot.y + dy * i;

      if (x < 0 || x >= this.width || y < 0 || y >= this.height) break;

      this.effects.push({ x, y, char: '+', color: player.color });

      // Check if we hit a bot
      const hitBot = this.bots.find(targetBot => 
        targetBot.x === x && targetBot.y === y && targetBot.playerId !== player.id
      );

      if (hitBot) {
        hitBot.takeDamage(5);
        break; // Stop after hitting first target
      }
    }
  }

  shockwaveAbility(bot, player) {
    // H-shape: 2 tiles left and right, then 2 tiles up from each end
    const positions = [];
    
    // Horizontal parts (2 tiles each side)
    for (let i = 1; i <= 2; i++) {
      positions.push({ x: bot.x - i, y: bot.y }); // left
      positions.push({ x: bot.x + i, y: bot.y }); // right
    }
    
    // Vertical parts from the ends (2 tiles up)
    for (let i = 1; i <= 2; i++) {
      positions.push({ x: bot.x - 2, y: bot.y - i }); // left up
      positions.push({ x: bot.x + 2, y: bot.y - i }); // right up
    }

    positions.forEach(pos => {
      if (pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height) {
        this.effects.push({ x: pos.x, y: pos.y, char: '#', color: player.color });
        
        // Damage bots at this position
        this.bots.forEach(targetBot => {
          if (targetBot.x === pos.x && targetBot.y === pos.y && targetBot.playerId !== player.id) {
            targetBot.takeDamage(5);
          }
        });
      }
    });
  }

  getGameStateForPlayer(playerId) {
    const player = this.players.get(playerId);
    if (!player) return null;

    return {
      width: this.width,
      height: this.height,
      player: {
        id: player.id,
        money: player.money,
        color: player.color,
        char: player.char,
        botsCount: player.bots.length,
        selectedBotIndex: player.selectedBotIndex,
        buyMenuOpen: player.buyMenuOpen
      },
      bots: this.bots.map(bot => ({
        id: bot.id,
        x: bot.x,
        y: bot.y,
        hp: bot.hp,
        maxHp: bot.maxHp,
        playerId: bot.playerId,
        ability: bot.ability,
        queueLength: bot.moveQueue.length,
        isOwn: bot.playerId === playerId
      })),
      coins: this.coins,
      effects: this.effects,
      players: Array.from(this.players.values()).map(p => ({
        id: p.id,
        color: p.color,
        char: p.char,
        botsCount: p.bots.length
      }))
    };
  }
}

module.exports = { Game, Player, Bot };
