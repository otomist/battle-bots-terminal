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
console.log('Testing New Features:');
console.log('─────────────────────────────────────────────────────────────');

// Test 18: H-Ability proper H shape
test('H-Ability creates proper H shape (not just up, but up AND down)', () => {
  const attacker = player1.bots[2];
  attacker.x = 10;
  attacker.y = 10;
  attacker.ability = 'shockwave';
  
  game.effects = [];
  game.useAbility(attacker, 'shockwave');
  
  // H shape should have:
  // Horizontal bar: 2 left + 2 right = 4 tiles
  // Vertical legs: 2 up + 2 down on EACH side = 8 tiles
  // Total: 12 tiles
  assert(game.effects.length === 12, `Expected 12 effects for H shape, got ${game.effects.length}`);
  
  // Check horizontal bar
  assert(game.effects.some(e => e.x === 8 && e.y === 10), 'Missing horizontal left 2');
  assert(game.effects.some(e => e.x === 9 && e.y === 10), 'Missing horizontal left 1');
  assert(game.effects.some(e => e.x === 11 && e.y === 10), 'Missing horizontal right 1');
  assert(game.effects.some(e => e.x === 12 && e.y === 10), 'Missing horizontal right 2');
  
  // Check left vertical leg (up)
  assert(game.effects.some(e => e.x === 8 && e.y === 9), 'Missing left leg up 1');
  assert(game.effects.some(e => e.x === 8 && e.y === 8), 'Missing left leg up 2');
  
  // Check left vertical leg (down)
  assert(game.effects.some(e => e.x === 8 && e.y === 11), 'Missing left leg down 1');
  assert(game.effects.some(e => e.x === 8 && e.y === 12), 'Missing left leg down 2');
  
  // Check right vertical leg (up)
  assert(game.effects.some(e => e.x === 12 && e.y === 9), 'Missing right leg up 1');
  assert(game.effects.some(e => e.x === 12 && e.y === 8), 'Missing right leg up 2');
  
  // Check right vertical leg (down)
  assert(game.effects.some(e => e.x === 12 && e.y === 11), 'Missing right leg down 1');
  assert(game.effects.some(e => e.x === 12 && e.y === 12), 'Missing right leg down 2');
});

// Test 19: Abilities queue like movement
test('Abilities are queued and execute in order with movement', () => {
  const bot = player1.bots[0];
  bot.x = 5;
  bot.y = 5;
  bot.hp = 20;
  bot.ability = 'explosion';
  bot.clearQueue();
  
  // Place enemy near where bot will be
  const enemy = player2.bots[0];
  enemy.x = 6;
  enemy.y = 7; // Will be adjacent after bot moves down twice
  enemy.hp = 20;
  
  // Queue: move south twice, use ability, move east
  game.handlePlayerCommand(player1.id, 's');
  game.handlePlayerCommand(player1.id, 's');
  game.handlePlayerCommand(player1.id, 'q'); // Use ability
  game.handlePlayerCommand(player1.id, 'd');
  
  assert(bot.moveQueue.length === 4, `Expected 4 queued actions, got ${bot.moveQueue.length}`);
  assert(bot.moveQueue[0] === 's', 'First action should be s');
  assert(bot.moveQueue[1] === 's', 'Second action should be s');
  assert(bot.moveQueue[2] === 'q', 'Third action should be q (ability)');
  assert(bot.moveQueue[3] === 'd', 'Fourth action should be d');
  
  // Execute first tick - move south
  game.tick();
  assert(bot.y === 6, `Bot should be at y=6, got ${bot.y}`);
  assert(bot.moveQueue.length === 3, `Should have 3 actions left, got ${bot.moveQueue.length}`);
  
  // Execute second tick - move south again
  game.tick();
  assert(bot.y === 7, `Bot should be at y=7, got ${bot.y}`);
  assert(bot.moveQueue.length === 2, `Should have 2 actions left, got ${bot.moveQueue.length}`);
  
  // Execute third tick - use ability (should damage adjacent enemy)
  const enemyHpBefore = enemy.hp;
  game.tick();
  assert(bot.y === 7, `Bot should still be at y=7 after ability, got ${bot.y}`);
  assert(enemy.hp < enemyHpBefore, `Enemy should take damage from explosion`);
  assert(bot.moveQueue.length === 1, `Should have 1 action left, got ${bot.moveQueue.length}`);
  
  // Execute fourth tick - move east
  game.tick();
  assert(bot.x === 6, `Bot should be at x=6, got ${bot.x}`);
  assert(bot.moveQueue.length === 0, `Should have 0 actions left, got ${bot.moveQueue.length}`);
});

// Test 20: Multiple abilities in queue
test('Can queue multiple movements and abilities in sequence', () => {
  const bot = player1.bots[1];
  bot.x = 10;
  bot.y = 10;
  bot.ability = 'shoot';
  bot.clearQueue();
  
  // Queue: w, q, w, q, w
  game.handlePlayerCommand(player1.id, '2'); // Select bot 2
  game.handlePlayerCommand(player1.id, 'w');
  game.handlePlayerCommand(player1.id, 'q');
  game.handlePlayerCommand(player1.id, 'w');
  game.handlePlayerCommand(player1.id, 'q');
  game.handlePlayerCommand(player1.id, 'w');
  
  assert(bot.moveQueue.length === 5, `Expected 5 queued actions, got ${bot.moveQueue.length}`);
  assert(bot.moveQueue.join(',') === 'w,q,w,q,w', `Queue order wrong: ${bot.moveQueue.join(',')}`);
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
