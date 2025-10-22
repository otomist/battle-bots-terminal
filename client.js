const net = require('net');
const readline = require('readline');

const HOST = process.argv[2] || 'localhost';
const PORT = 3000;

class Client {
  constructor() {
    this.gameState = null;
    this.playerId = null;
    this.playerColor = null;
    this.playerChar = null;
    this.socket = null;
    this.connected = false;
    
    // ANSI color codes
    this.colors = {
      red: '\x1b[91m',
      blue: '\x1b[94m',
      green: '\x1b[92m',
      yellow: '\x1b[93m',
      magenta: '\x1b[95m',
      cyan: '\x1b[96m',
      reset: '\x1b[0m',
      gray: '\x1b[90m'
    };
  }

  connect() {
    this.socket = net.createConnection({ host: HOST, port: PORT }, () => {
      this.connected = true;
      console.log('Connected to Battle Bots server!');
      this.setupInput();
    });

    this.socket.on('data', (data) => {
      const messages = data.toString().split('\n').filter(msg => msg.trim());
      messages.forEach(msg => {
        try {
          const message = JSON.parse(msg);
          this.handleMessage(message);
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      });
    });

    this.socket.on('close', () => {
      console.log('Disconnected from server');
      process.exit(0);
    });

    this.socket.on('error', (err) => {
      console.error('Connection error:', err.message);
      process.exit(1);
    });
  }

  handleMessage(message) {
    switch (message.type) {
      case 'connected':
        this.playerId = message.playerId;
        this.playerColor = message.color;
        this.playerChar = message.char;
        console.log(`You are ${this.colorize(this.playerChar, this.playerColor)}`);
        break;
      case 'gameState':
        this.gameState = message.state;
        this.render();
        break;
      case 'error':
        console.log('Error:', message.message);
        break;
    }
  }

  setupInput() {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit();
      }

      if (!this.connected || !this.gameState) return;

      let command = null;

      if (key.name === 'w' || key.name === 'a' || key.name === 's' || key.name === 'd') {
        command = key.name;
      } else if (key.name === 'q' || key.name === 'r' || key.name === 'p') {
        command = key.name;
      } else if (key.name === 'tab') {
        command = 'tab';
      } else if (str >= '1' && str <= '5') {
        command = str;
      } else if (this.gameState.player.buyMenuOpen) {
        // Buy menu commands
        if ('raqfhb'.includes(str)) {
          command = str;
        }
      }

      if (command) {
        this.sendCommand(command);
      }
    });
  }

  sendCommand(command) {
    if (this.socket) {
      this.socket.write(JSON.stringify({ type: 'command', command }) + '\n');
    }
  }

  colorize(text, color) {
    return (this.colors[color] || '') + text + this.colors.reset;
  }

  renderWaitingScreen(players) {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                                                              ║');
    console.log('║                    BATTLE BOTS                               ║');
    console.log('║                                                              ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('  Waiting for players to join...');
    console.log('  Need at least 2 players to start');
    console.log('');
    console.log('  Players connected: ' + players.length);
    console.log('');
    if (players.length > 0) {
      console.log('  Current players:');
      players.forEach(p => {
        console.log(`    ${this.colorize(p.char, p.color)} ${p.id === this.playerId ? '(You)' : ''}`);
      });
    }
    console.log('');
  }

  renderWinScreen(winnerId, players) {
    const winnerPlayer = players.find(p => p.id === winnerId);
    if (!winnerPlayer) return;

    console.log('');
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                                                              ║');
    console.log('║                      GAME OVER!                              ║');
    console.log('║                                                              ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('');
    
    // Winner announcement in their color
    const winnerText = `PLAYER [${winnerId}] WINS!`;
    const padding = Math.floor((60 - winnerText.length) / 2);
    console.log(' '.repeat(padding) + this.colorize(winnerText, winnerPlayer.color));
    console.log('');
    console.log('');
    
    // Show final standings
    console.log('  Final Standings:');
    console.log('  ═══════════════════════════════════════════════════');
    console.log('');
    
    // Winner first
    console.log(`  🏆 1st Place: ${this.colorize(winnerPlayer.char, winnerPlayer.color)} [${winnerId}] - ${winnerPlayer.botsCount} bot${winnerPlayer.botsCount !== 1 ? 's' : ''} remaining`);
    
    // Other players
    let place = 2;
    players.forEach(p => {
      if (p.id !== winnerId) {
        console.log(`     ${place}${this.getOrdinalSuffix(place)} Place: ${this.colorize(p.char, p.color)} [${p.id}] - Eliminated`);
        place++;
      }
    });
    
    console.log('');
    console.log('  ═══════════════════════════════════════════════════');
    console.log('');
    console.log('');
    
    if (winnerId === this.playerId) {
      console.log('  🎉 Congratulations! You are the champion! 🎉');
    } else {
      console.log('  Better luck next time!');
    }
    
    console.log('');
    console.log('  Press Ctrl+C to exit');
    console.log('');
  }

  getOrdinalSuffix(num) {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  }

  render() {
    if (!this.gameState) return;

    // Clear screen
    console.clear();
    
    const { width, height, player, bots, coins, effects, players, gameState, winner } = this.gameState;

    // Check if game ended - show winner screen
    if (gameState === 'ended' && winner) {
      this.renderWinScreen(winner, players);
      return;
    }

    // Check if waiting for players
    if (gameState === 'waiting') {
      this.renderWaitingScreen(players);
      return;
    }

    // Create grid
    const grid = Array(height).fill().map(() => Array(width).fill(' '));
    const colorGrid = Array(height).fill().map(() => Array(width).fill(null));

    // Place coins
    coins.forEach(coin => {
      grid[coin.y][coin.x] = '$';
      colorGrid[coin.y][coin.x] = 'yellow';
    });

    // Place effects
    effects.forEach(effect => {
      if (effect.y >= 0 && effect.y < height && effect.x >= 0 && effect.x < width) {
        grid[effect.y][effect.x] = effect.char;
        colorGrid[effect.y][effect.x] = effect.color;
      }
    });

    // Get player's bots for numbering
    const playerBots = bots.filter(bot => bot.playerId === player.id);

    // Place bots
    bots.forEach(bot => {
      if (bot.playerId === player.id) {
        // Own bots
        const botIndex = playerBots.findIndex(b => b.id === bot.id);
        if (botIndex === player.selectedBotIndex) {
          grid[bot.y][bot.x] = '@';
        } else {
          grid[bot.y][bot.x] = (botIndex + 1).toString();
        }
        colorGrid[bot.y][bot.x] = player.color;
      } else {
        // Enemy bots
        const enemyPlayer = players.find(p => p.id === bot.playerId);
        if (enemyPlayer) {
          grid[bot.y][bot.x] = enemyPlayer.char;
          colorGrid[bot.y][bot.x] = enemyPlayer.color;
        }
      }
    });

    // Draw top border
    console.log('┌' + '─'.repeat(width) + '┐');

    // Draw grid
    for (let y = 0; y < height; y++) {
      let line = '│';
      for (let x = 0; x < width; x++) {
        const char = grid[y][x];
        const color = colorGrid[y][x];
        if (color) {
          line += this.colorize(char, color);
        } else {
          line += this.colorize(char, 'gray');
        }
      }
      line += '│';
      console.log(line);
    }

    // Draw bottom border
    console.log('└' + '─'.repeat(width) + '┘');

    // Draw player info
    console.log('');
    console.log(`Player: ${this.colorize(player.char, player.color)} | Money: ${this.colorize('$' + player.money, 'yellow')} | Bots: ${player.botsCount}/5`);
    
    // Draw bot info
    if (player.botsCount > 0) {
      const selectedBot = playerBots[player.selectedBotIndex];
      if (selectedBot) {
        const abilityName = selectedBot.ability || 'none';
        console.log(`Selected Bot: ${this.colorize('@', player.color)} | HP: ${selectedBot.hp}/${selectedBot.maxHp} | Ability: ${abilityName} | Queue: ${selectedBot.queueLength}`);
      }
    }

    // Draw controls
    console.log('');
    console.log('Controls: WASD=Move | Q=Use Ability | R=Clear Queue | P=Buy Menu | 1-5=Select Bot | Ctrl+C=Quit');

    // Draw players list
    if (players.length > 1) {
      console.log('');
      console.log('Players:');
      players.forEach(p => {
        const marker = p.id === player.id ? '(You)' : '';
        console.log(`  ${this.colorize(p.char, p.color)} ${marker} - ${p.botsCount} bots`);
      });
    }

    // Draw buy menu if open
    if (player.buyMenuOpen) {
      console.log('');
      console.log('╔═══════════════════════════════════════╗');
      console.log('║           BUY MENU                    ║');
      console.log('╠═══════════════════════════════════════╣');
      console.log('║ R - Repair 10 HP ............ $5      ║');
      console.log('║ A - Add 5 Armor ............. $5      ║');
      console.log('║ Q - Explosion Ability ....... $10     ║');
      console.log('║ F - Shoot Ability ........... $10     ║');
      console.log('║ H - Shockwave Ability ....... $20     ║');
      console.log('║ B - Buy New Bot ............. $10     ║');
      console.log('╠═══════════════════════════════════════╣');
      console.log('║ P - Close Menu                        ║');
      console.log('╚═══════════════════════════════════════╝');
    }
  }
}

const client = new Client();
client.connect();
