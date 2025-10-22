// Comprehensive playtest for Battle Bots
const { Game, Bot } = require('./game');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║              BATTLE BOTS - PLAYTEST                           ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');
console.log('');

const game = new Game();
let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (err) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${err.message}`);
    testsFailed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Setup test players
const player1 = game.addPlayer('test_player_1', null);
const player2 = game.addPlayer('test_player_2', null);

console.log('Testing Buy Menu Features:');
console.log('─────────────────────────────────────────────────────────────');

// Test 1: Buy Repair
test('Buy Repair (R) - costs $5, heals 10 HP', () => {
  const bot = player1.getSelectedBot();
  bot.hp = 5; // Damage the bot
  player1.money = 10;
  player1.buyMenuOpen = true;
  
  game.handlePlayerCommand(player1.id, 'r');
  
  assert(bot.hp === 10, `Expected HP to be 10, got ${bot.hp}`);
  assert(player1.money === 5, `Expected money to be $5, got $${player1.money}`);
  assert(!player1.buyMenuOpen, 'Buy menu should close after purchase');
});

// Test 2: Buy Armor
test('Buy Armor (A) - costs $5, adds 5 max HP', () => {
  const bot = player1.getSelectedBot();
  const oldMaxHp = bot.maxHp;
  const oldHp = bot.hp;
  player1.money = 10;
  player1.buyMenuOpen = true;
  
  game.handlePlayerCommand(player1.id, 'a');
  
  assert(bot.maxHp === oldMaxHp + 5, `Expected max HP to be ${oldMaxHp + 5}, got ${bot.maxHp}`);
  assert(bot.hp === oldHp + 5, `Expected HP to increase by 5`);
  assert(player1.money === 5, `Expected money to be $5, got $${player1.money}`);
  assert(!player1.buyMenuOpen, 'Buy menu should close after purchase');
});

// Test 3: Buy Explosion Ability
test('Buy Explosion Ability (Q) - costs $10', () => {
  const bot = player1.getSelectedBot();
  player1.money = 15;
  player1.buyMenuOpen = true;
  
  game.handlePlayerCommand(player1.id, 'q');
  
  assert(bot.ability === 'explosion', `Expected ability to be 'explosion', got ${bot.ability}`);
  assert(player1.money === 5, `Expected money to be $5, got $${player1.money}`);
  assert(!player1.buyMenuOpen, 'Buy menu should close after purchase');
});

// Test 4: Buy Shoot Ability
test('Buy Shoot Ability (F) - costs $10', () => {
  player1.money = 20;
  
  // Add a new bot without ability
  const spawnPos = game.getRandomSpawnPosition();
  const newBot = new Bot(game.botIdCounter++, spawnPos.x, spawnPos.y, player1.id);
  game.bots.push(newBot);
  player1.addBot(newBot);
  player1.selectedBotIndex = player1.bots.length - 1; // Select the new bot
  
  const bot = player1.getSelectedBot();
  player1.buyMenuOpen = true;
  
  game.handlePlayerCommand(player1.id, 'f');
  
  assert(bot.ability === 'shoot', `Expected ability to be 'shoot', got ${bot.ability}`);
  assert(player1.money === 10, `Expected money to be $10, got $${player1.money}`);
  assert(!player1.buyMenuOpen, 'Buy menu should close after purchase');
});

// Test 5: Buy Shockwave Ability
test('Buy Shockwave Ability (H) - costs $20', () => {
  player1.money = 30;
  
  // Add another new bot without ability
  const spawnPos = game.getRandomSpawnPosition();
  const newBot = new Bot(game.botIdCounter++, spawnPos.x, spawnPos.y, player1.id);
  game.bots.push(newBot);
  player1.addBot(newBot);
  player1.selectedBotIndex = player1.bots.length - 1; // Select the new bot
  
  const bot = player1.getSelectedBot();
  player1.buyMenuOpen = true;
  
  game.handlePlayerCommand(player1.id, 'h');
  
  assert(bot.ability === 'shockwave', `Expected ability to be 'shockwave', got ${bot.ability}`);
  assert(player1.money === 10, `Expected money to be $10, got $${player1.money}`);
  assert(!player1.buyMenuOpen, 'Buy menu should close after purchase');
});

// Test 6: Buy New Bot (B) - MOST IMPORTANT TEST
test('Buy New Bot (B) - costs $10, creates new bot', () => {
  player2.money = 20;
  const initialBotCount = player2.bots.length;
  player2.buyMenuOpen = true;
  
  game.handlePlayerCommand(player2.id, 'b');
  
  assert(player2.bots.length === initialBotCount + 1, `Expected ${initialBotCount + 1} bots, got ${player2.bots.length}`);
  assert(player2.money === 10, `Expected money to be $10, got $${player2.money}`);
  assert(!player2.buyMenuOpen, 'Buy menu should close after purchase');
});

// Test 7: Buy another bot
test('Buy Second New Bot (B) - player can have multiple bots', () => {
  player2.money = 15;
  const initialBotCount = player2.bots.length;
  player2.buyMenuOpen = true;
  
  game.handlePlayerCommand(player2.id, 'b');
  
  assert(player2.bots.length === initialBotCount + 1, `Expected ${initialBotCount + 1} bots, got ${player2.bots.length}`);
  assert(player2.money === 5, `Expected money to be $5, got $${player2.money}`);
});

// Test 8: Cannot buy bot without enough money
test('Cannot buy bot with insufficient money', () => {
  player2.money = 5; // Not enough for bot ($10)
  const initialBotCount = player2.bots.length;
  player2.buyMenuOpen = true;
  
  game.handlePlayerCommand(player2.id, 'b');
  
  assert(player2.bots.length === initialBotCount, `Bot count should not change`);
  assert(player2.money === 5, `Money should not change`);
});

// Test 9: Cannot buy more than 5 bots
test('Cannot buy more than 5 bots per player', () => {
  player2.money = 100;
  
  // Buy bots until we have 5
  while (player2.bots.length < 5) {
    player2.buyMenuOpen = true;
    game.handlePlayerCommand(player2.id, 'b');
  }
  
  assert(player2.bots.length === 5, `Expected 5 bots, got ${player2.bots.length}`);
  
  const moneyBefore = player2.money;
  player2.buyMenuOpen = true;
  game.handlePlayerCommand(player2.id, 'b');
  
  assert(player2.bots.length === 5, `Should still have 5 bots`);
  assert(player2.money === moneyBefore, `Money should not change when at max bots`);
});

// Test 10: Cannot buy ability if already have one
test('Cannot buy second ability for same bot', () => {
  const bot = player1.bots[0];
  bot.ability = 'explosion'; // Already has ability
  player1.money = 20;
  player1.selectedBotIndex = 0;
  player1.buyMenuOpen = true;
  
  game.handlePlayerCommand(player1.id, 'f'); // Try to buy shoot
  
  assert(bot.ability === 'explosion', `Ability should still be 'explosion'`);
  assert(player1.money === 20, `Money should not change`);
});

console.log('');
console.log('Testing Ability Usage:');
console.log('─────────────────────────────────────────────────────────────');

// Test 11: Use Explosion Ability
test('Use Explosion Ability', () => {
  const attacker = player1.bots[0];
  attacker.ability = 'explosion';
  attacker.x = 10;
  attacker.y = 10;
  
  const victim = player2.bots[0];
  victim.x = 11;
  victim.y = 10; // Adjacent to attacker
  victim.hp = 10;
  
  game.useAbility(attacker, 'explosion');
  
  assert(victim.hp === 5, `Victim should have 5 HP after explosion, got ${victim.hp}`);
  assert(game.effects.length > 0, 'Should have visual effects');
});

// Test 12: Use Shoot Ability
test('Use Shoot Ability', () => {
  const attacker = player1.bots[1];
  attacker.ability = 'shoot';
  attacker.x = 5;
  attacker.y = 5;
  attacker.lastDirection = { dx: 1, dy: 0 }; // Shooting right
  
  const victim = player2.bots[1];
  victim.x = 7; // 2 tiles right
  victim.y = 5;
  victim.hp = 10;
  
  game.effects = []; // Clear effects
  game.useAbility(attacker, 'shoot');
  
  assert(victim.hp === 5, `Victim should have 5 HP after shoot, got ${victim.hp}`);
  assert(game.effects.length > 0, 'Should have visual effects');
});

// Test 13: Use Shockwave Ability
test('Use Shockwave Ability', () => {
  const attacker = player1.bots[2];
  attacker.ability = 'shockwave';
  attacker.x = 10;
  attacker.y = 10;
  
  const victim = player2.bots[2];
  victim.x = 12; // 2 tiles right (in H pattern)
  victim.y = 10;
  victim.hp = 10;
  
  game.effects = []; // Clear effects
  game.useAbility(attacker, 'shockwave');
  
  assert(victim.hp === 5, `Victim should have 5 HP after shockwave, got ${victim.hp}`);
  assert(game.effects.length > 0, 'Should have visual effects');
});

console.log('');
console.log('Testing Game Mechanics:');
console.log('─────────────────────────────────────────────────────────────');

// Test 14: Collision Damage
test('Collision between enemy bots deals 10 damage', () => {
  const bot1 = player1.bots[0];
  const bot2 = player2.bots[0];
  
  // Set them up to move to the same tile
  bot1.x = 5;
  bot1.y = 5;
  bot1.hp = 15;
  bot1.clearQueue();
  bot1.addMove('d'); // Move right to (6, 5)
  
  bot2.x = 7;
  bot2.y = 5;
  bot2.hp = 15;
  bot2.clearQueue();
  bot2.addMove('a'); // Move left to (6, 5) - same destination!
  
  const hp1Before = bot1.hp;
  const hp2Before = bot2.hp;
  
  game.tick();
  
  // They tried to move to same spot (6,5), should both take damage and not move
  assert(bot1.hp === hp1Before - 10, `Bot 1 should take 10 damage, HP: ${hp1Before} -> ${bot1.hp}`);
  assert(bot2.hp === hp2Before - 10, `Bot 2 should take 10 damage, HP: ${hp2Before} -> ${bot2.hp}`);
});

// Test 15: Coin Collection
test('Collecting coin gives $10', () => {
  const bot = player1.bots[0];
  bot.x = 15;
  bot.y = 15;
  player1.money = 0;
  
  game.coins = [{ x: 15, y: 15 }];
  
  game.checkCoinPickup(bot);
  
  assert(player1.money === 10, `Expected $10, got $${player1.money}`);
  assert(game.coins.length === 0, 'Coin should be removed after pickup');
});

// Test 16: Menu Toggle
test('P key toggles buy menu', () => {
  player1.buyMenuOpen = false;
  game.handlePlayerCommand(player1.id, 'p');
  assert(player1.buyMenuOpen === true, 'Menu should open');
  
  game.handlePlayerCommand(player1.id, 'p');
  assert(player1.buyMenuOpen === false, 'Menu should close');
});

// Test 17: Bot Selection
test('Number keys select bots', () => {
  player1.selectedBotIndex = 0;
  
  game.handlePlayerCommand(player1.id, '2');
  assert(player1.selectedBotIndex === 1, `Expected index 1, got ${player1.selectedBotIndex}`);
  
  game.handlePlayerCommand(player1.id, '1');
  assert(player1.selectedBotIndex === 0, `Expected index 0, got ${player1.selectedBotIndex}`);
});

console.log('');
console.log('Testing Ability Queuing:');
console.log('─────────────────────────────────────────────────────────────');

// Test 18: Abilities should be queued, not instant
test('Abilities are queued with movement commands', () => {
  const bot = player1.bots[0];
  bot.ability = 'explosion';
  bot.clearQueue();
  bot.x = 10;
  bot.y = 10;
  
  // Queue: move, move, ability, move
  game.handlePlayerCommand(player1.id, 's'); // down
  game.handlePlayerCommand(player1.id, 's'); // down
  game.handlePlayerCommand(player1.id, 'q'); // ability
  game.handlePlayerCommand(player1.id, 'a'); // left
  
  assert(bot.moveQueue.length === 4, `Expected 4 queued commands, got ${bot.moveQueue.length}`);
  
  // First tick: execute first command (move down)
  const startY = bot.y;
  game.tick();
  assert(bot.y === startY + 1, `Expected bot to move down to ${startY + 1}, got ${bot.y}`);
  assert(bot.moveQueue.length === 3, `Expected 3 commands remaining, got ${bot.moveQueue.length}`);
  
  // Second tick: execute second command (move down)
  game.tick();
  assert(bot.y === startY + 2, `Expected bot at ${startY + 2}, got ${bot.y}`);
  assert(bot.moveQueue.length === 2, `Expected 2 commands remaining, got ${bot.moveQueue.length}`);
  
  // Third tick: should execute ability
  game.effects = [];
  game.tick();
  assert(game.effects.length > 0, 'Ability should have been used, creating effects');
  assert(bot.moveQueue.length === 1, `Expected 1 command remaining, got ${bot.moveQueue.length}`);
  
  // Fourth tick: execute last move (left)
  const startX = bot.x;
  game.effects = [];
  game.tick();
  assert(bot.x === startX - 1, `Expected bot to move left to ${startX - 1}, got ${bot.x}`);
  assert(bot.moveQueue.length === 0, `Expected 0 commands remaining, got ${bot.moveQueue.length}`);
});

console.log('');
console.log('Testing H-Shape Shockwave Pattern:');
console.log('─────────────────────────────────────────────────────────────');

// Test 19: H ability should form proper H shape
test('Shockwave ability creates proper H shape', () => {
  const attacker = player1.bots[0];
  attacker.ability = 'shockwave';
  attacker.x = 10;
  attacker.y = 10;
  
  game.effects = [];
  game.useAbility(attacker, 'shockwave');
  
  // H shape should include:
  // Left vertical: x-2, y-2 to y+2
  // Right vertical: x+2, y-2 to y+2
  // Middle horizontal: x-2 to x+2, y
  
  const expectedPositions = [
    // Left vertical
    {x: 8, y: 8}, {x: 8, y: 9}, {x: 8, y: 10}, {x: 8, y: 11}, {x: 8, y: 12},
    // Middle horizontal (excluding center where bot is)
    {x: 9, y: 10}, {x: 11, y: 10},
    // Right vertical
    {x: 12, y: 8}, {x: 12, y: 9}, {x: 12, y: 10}, {x: 12, y: 11}, {x: 12, y: 12}
  ];
  
  assert(game.effects.length >= expectedPositions.length, 
    `Expected at least ${expectedPositions.length} effect positions for H shape, got ${game.effects.length}`);
  
  // Check that key H positions are present
  const hasLeftTop = game.effects.some(e => e.x === 8 && e.y === 8);
  const hasLeftBottom = game.effects.some(e => e.x === 8 && e.y === 12);
  const hasRightTop = game.effects.some(e => e.x === 12 && e.y === 8);
  const hasRightBottom = game.effects.some(e => e.x === 12 && e.y === 12);
  const hasMiddle = game.effects.some(e => e.x === 10 && e.y === 10);
  
  assert(hasLeftTop, 'H shape should have left top corner');
  assert(hasLeftBottom, 'H shape should have left bottom corner');
  assert(hasRightTop, 'H shape should have right top corner');
  assert(hasRightBottom, 'H shape should have right bottom corner');
  assert(hasMiddle, 'H shape should have middle horizontal bar');
});

// Test 20: H ability damages bots in H pattern
test('Shockwave damages bots in H pattern, not outside', () => {
  const attacker = player1.bots[0];
  attacker.ability = 'shockwave';
  attacker.x = 10;
  attacker.y = 10;
  
  // Place victim in H pattern (left vertical)
  const victim1 = player2.bots[0];
  victim1.x = 8; // 2 left
  victim1.y = 8; // 2 up
  victim1.hp = 10;
  
  // Place victim outside H pattern
  const victim2 = player2.bots[1];
  victim2.x = 9; // 1 left (between vertical bars)
  victim2.y = 9; // 1 up (between horizontal bar and top)
  victim2.hp = 10;
  
  game.useAbility(attacker, 'shockwave');
  
  assert(victim1.hp === 5, `Victim in H pattern should take 5 damage, HP: ${victim1.hp}`);
  assert(victim2.hp === 10, `Victim outside H pattern should not take damage, HP: ${victim2.hp}`);
});

console.log('');
console.log('Testing Win Conditions:');
console.log('─────────────────────────────────────────────────────────────');

// Test 21: Game should wait for 2 players
test('Game waits for at least 2 players to start', () => {
  const newGame = new (require('./game').Game)();
  
  assert(newGame.gameState === 'waiting', `Game should start in 'waiting' state, got ${newGame.gameState}`);
  
  newGame.addPlayer('solo_player', null);
  assert(newGame.gameState === 'waiting', `Game should still be waiting with 1 player, got ${newGame.gameState}`);
  
  newGame.addPlayer('second_player', null);
  assert(newGame.gameState === 'playing', `Game should be 'playing' with 2 players, got ${newGame.gameState}`);
});

// Test 22: Game detects winner when only 1 player has bots
test('Game detects winner when only 1 player remains', () => {
  const newGame = new (require('./game').Game)();
  const p1 = newGame.addPlayer('player1', null);
  const p2 = newGame.addPlayer('player2', null);
  
  assert(newGame.gameState === 'playing', 'Game should be playing');
  assert(newGame.winner === null, 'Should be no winner yet');
  
  // Kill all of player 2's bots
  p2.bots.forEach(bot => {
    const index = newGame.bots.indexOf(bot);
    if (index > -1) {
      newGame.bots.splice(index, 1);
    }
  });
  p2.bots = [];
  
  // Check win condition
  newGame.checkWinCondition();
  
  assert(newGame.gameState === 'finished', `Game should be 'finished', got ${newGame.gameState}`);
  assert(newGame.winner === p1.id, `Winner should be player1, got ${newGame.winner}`);
});

// Test 23: Game continues with multiple players alive
test('Game continues when multiple players have bots', () => {
  const newGame = new (require('./game').Game)();
  const p1 = newGame.addPlayer('player1', null);
  const p2 = newGame.addPlayer('player2', null);
  const p3 = newGame.addPlayer('player3', null);
  
  assert(newGame.gameState === 'playing', 'Game should be playing');
  
  // Kill all of player 2's bots
  p2.bots.forEach(bot => {
    const index = newGame.bots.indexOf(bot);
    if (index > -1) {
      newGame.bots.splice(index, 1);
    }
  });
  p2.bots = [];
  
  // Check win condition - should still be playing (p1 and p3 remain)
  newGame.checkWinCondition();
  
  assert(newGame.gameState === 'playing', `Game should still be 'playing', got ${newGame.gameState}`);
  assert(newGame.winner === null, `Should be no winner yet, got ${newGame.winner}`);
});

// Test 24: Win detection integrated into tick
test('Win condition checked after each tick', () => {
  const newGame = new (require('./game').Game)();
  const p1 = newGame.addPlayer('player1', null);
  const p2 = newGame.addPlayer('player2', null);
  
  // Easier test: just kill player 2's bot directly
  const p2bot = p2.bots[0];
  p2bot.hp = 5;
  
  // Damage it enough to die
  p2bot.takeDamage(10);
  
  assert(p2bot.hp <= 0, 'Bot should be dead');
  assert(newGame.gameState === 'playing', 'Game should still be playing before tick');
  
  // Tick should remove dead bots and check win condition
  newGame.tick();
  
  // After tick, p2's bot should be removed and game should be finished
  assert(p2.bots.length === 0, `Player 2 should have no bots, has ${p2.bots.length}`);
  assert(newGame.gameState === 'finished', `Game should be 'finished', got ${newGame.gameState}`);
  assert(newGame.winner === p1.id, `Winner should be player 1, got ${newGame.winner}`);
});

console.log('');
console.log('Testing Collision Fixes:');
console.log('─────────────────────────────────────────────────────────────');

// Test 25: Collision with stationary bot
test('Bot moving onto stationary bot causes collision', () => {
  const newGame = new (require('./game').Game)();
  const p1 = newGame.addPlayer('player1', null);
  const p2 = newGame.addPlayer('player2', null);
  
  const bot1 = p1.bots[0];
  const bot2 = p2.bots[0];
  
  // Bot 1 at (5,5) - stationary (no moves queued)
  bot1.x = 5;
  bot1.y = 5;
  bot1.clearQueue();
  bot1.hp = 15;
  
  // Bot 2 at (4,5) - will move right onto bot1
  bot2.x = 4;
  bot2.y = 5;
  bot2.clearQueue();
  bot2.addMove('d'); // Move right to (5,5) where bot1 is
  bot2.hp = 15;
  
  const bot1HpBefore = bot1.hp;
  const bot2HpBefore = bot2.hp;
  
  newGame.tick();
  
  // Both should take collision damage
  assert(bot1.hp === bot1HpBefore - 10, `Bot 1 should take 10 damage from collision, HP: ${bot1HpBefore} -> ${bot1.hp}`);
  assert(bot2.hp === bot2HpBefore - 10, `Bot 2 should take 10 damage from collision, HP: ${bot2HpBefore} -> ${bot2.hp}`);
  
  // Bot 2 should not have moved (collision blocked)
  assert(bot2.x === 4, `Bot 2 should not move, still at x=${bot2.x}`);
});

// Test 26: Multiple bots trying to move to same occupied tile
test('Multiple bots moving to occupied tile all take damage', () => {
  const newGame = new (require('./game').Game)();
  const p1 = newGame.addPlayer('player1', null);
  const p2 = newGame.addPlayer('player2', null);
  const p3 = newGame.addPlayer('player3', null);
  
  const bot1 = p1.bots[0];
  const bot2 = p2.bots[0];
  const bot3 = p3.bots[0];
  
  // Bot 1 stationary at (10,10)
  bot1.x = 10;
  bot1.y = 10;
  bot1.clearQueue();
  bot1.hp = 20;
  
  // Bot 2 moves from (9,10) to (10,10)
  bot2.x = 9;
  bot2.y = 10;
  bot2.clearQueue();
  bot2.addMove('d');
  bot2.hp = 20;
  
  // Bot 3 moves from (11,10) to (10,10)
  bot3.x = 11;
  bot3.y = 10;
  bot3.clearQueue();
  bot3.addMove('a');
  bot3.hp = 20;
  
  newGame.tick();
  
  // All three should take damage (each colliding with others)
  assert(bot1.hp === 10, `Bot 1 should take damage: ${bot1.hp}`);
  assert(bot2.hp === 10, `Bot 2 should take damage: ${bot2.hp}`);
  assert(bot3.hp === 10, `Bot 3 should take damage: ${bot3.hp}`);
});

console.log('');
console.log('Testing Movement Queue Visualization:');
console.log('─────────────────────────────────────────────────────────────');

// Test 27: Queue visualization shows movement path
test('Movement queue returns visual representation', () => {
  const newGame = new (require('./game').Game)();
  const p1 = newGame.addPlayer('player1', null);
  const bot = p1.bots[0];
  
  bot.clearQueue();
  bot.addMove('d');
  bot.addMove('d');
  bot.addMove('s');
  
  const visual = bot.getQueueVisualization();
  assert(visual === '###', `Expected '###' for 3 moves, got '${visual}'`);
});

// Test 28: Queue visualization shows ability as letter
test('Queue visualization shows ability with correct letter', () => {
  const newGame = new (require('./game').Game)();
  const p1 = newGame.addPlayer('player1', null);
  const bot = p1.bots[0];
  
  bot.clearQueue();
  bot.ability = 'shockwave';
  bot.addMove('d');
  bot.addMove('d');
  bot.addAbilityToQueue();
  bot.addMove('d');
  
  const visual = bot.getQueueVisualization();
  assert(visual === '##H#', `Expected '##H#' for moves+H ability, got '${visual}'`);
});

// Test 29: Different abilities show different letters
test('Queue visualization shows correct letters for each ability', () => {
  const newGame = new (require('./game').Game)();
  const p1 = newGame.addPlayer('player1', null);
  
  // Test explosion
  const bot1 = p1.bots[0];
  bot1.clearQueue();
  bot1.ability = 'explosion';
  bot1.addAbilityToQueue();
  assert(bot1.getQueueVisualization() === 'E', `Expected 'E' for explosion, got '${bot1.getQueueVisualization()}'`);
  
  // Add another bot for shoot test
  const spawnPos = newGame.getRandomSpawnPosition();
  const bot2 = new (require('./game').Bot)(newGame.botIdCounter++, spawnPos.x, spawnPos.y, p1.id);
  newGame.bots.push(bot2);
  p1.addBot(bot2);
  
  bot2.clearQueue();
  bot2.ability = 'shoot';
  bot2.addAbilityToQueue();
  assert(bot2.getQueueVisualization() === 'S', `Expected 'S' for shoot, got '${bot2.getQueueVisualization()}'`);
});

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsFailed}`);
console.log('═══════════════════════════════════════════════════════════════');

if (testsFailed === 0) {
  console.log('');
  console.log('🎉 ALL TESTS PASSED! Game is ready to play! 🎉');
  console.log('');
  console.log('Key Features Verified:');
  console.log('  ✅ Buy menu works for all items');
  console.log('  ✅ Buy new bot costs $10');
  console.log('  ✅ All abilities purchase correctly');
  console.log('  ✅ Armor and repair work');
  console.log('  ✅ Abilities deal damage');
  console.log('  ✅ Collision detection works');
  console.log('  ✅ Coin collection works');
  console.log('  ✅ Bot selection works');
  console.log('  ✅ Menu toggle works');
  console.log('');
} else {
  console.log('');
  console.log('⚠️  Some tests failed. Please review the issues above.');
  console.log('');
  process.exit(1);
}
