const { Game, Bot } = require('./game');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║               BATTLE BOTS - PLAYTEST SUITE                    ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');
console.log('');

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

// Create game instance
const game = new Game();
const player1Id = 'test_player_1';
const player1 = game.addPlayer(player1Id, null);

console.log('Testing Buy Menu Functionality:');
console.log('═'.repeat(60));

// Give player money
player1.money = 100;

test('Player starts with correct money', () => {
  assert(player1.money === 100, 'Player should have $100');
});

test('Player starts with 1 bot', () => {
  assert(player1.bots.length === 1, 'Player should have 1 bot');
  assert(game.bots.length === 1, 'Game should have 1 bot');
});

// Test buying repair
const bot1 = player1.getSelectedBot();
bot1.hp = 5; // Damage the bot

test('Buy repair (R)', () => {
  const oldHp = bot1.hp;
  const oldMoney = player1.money;
  player1.buyMenuOpen = true;
  game.handlePlayerCommand(player1Id, 'r');
  const expectedHp = Math.min(oldHp + 10, bot1.maxHp);
  assert(bot1.hp === expectedHp, `Bot HP should be ${expectedHp} (was ${oldHp}, now ${bot1.hp})`);
  assert(player1.money === oldMoney - 5, `Money should decrease by 5 (was ${oldMoney}, now ${player1.money})`);
  assert(player1.buyMenuOpen === false, 'Menu should close after purchase');
});

// Test buying armor
test('Buy armor (A)', () => {
  const oldMaxHp = bot1.maxHp;
  const oldHp = bot1.hp;
  const oldMoney = player1.money;
  player1.buyMenuOpen = true;
  game.handlePlayerCommand(player1Id, 'a');
  assert(bot1.maxHp === oldMaxHp + 5, `Bot max HP should increase by 5 (was ${oldMaxHp}, now ${bot1.maxHp})`);
  assert(bot1.hp === oldHp + 5, `Bot HP should increase by 5 (was ${oldHp}, now ${bot1.hp})`);
  assert(player1.money === oldMoney - 5, `Money should decrease by 5 (was ${oldMoney}, now ${player1.money})`);
});

// Test buying explosion ability
test('Buy explosion ability (Q)', () => {
  const oldMoney = player1.money;
  player1.buyMenuOpen = true;
  game.handlePlayerCommand(player1Id, 'q');
  assert(bot1.ability === 'explosion', `Bot should have explosion ability (has ${bot1.ability})`);
  assert(player1.money === oldMoney - 10, `Money should decrease by 10 (was ${oldMoney}, now ${player1.money})`);
});

// Test buying second ability (should fail)
test('Cannot buy second ability', () => {
  const oldMoney = player1.money;
  player1.buyMenuOpen = true;
  game.handlePlayerCommand(player1Id, 'f'); // Try to buy shoot
  assert(bot1.ability === 'explosion', 'Bot should still have explosion ability');
  assert(player1.money === oldMoney, 'Money should not decrease');
});

// Test buying new bot - THIS IS THE KEY TEST!
test('Buy new bot (B) - costs $10', () => {
  const oldBotCount = player1.bots.length;
  const oldGameBotCount = game.bots.length;
  const oldMoney = player1.money;
  player1.buyMenuOpen = true;
  game.handlePlayerCommand(player1Id, 'b');
  assert(player1.bots.length === oldBotCount + 1, `Player should have ${oldBotCount + 1} bots (has ${player1.bots.length})`);
  assert(game.bots.length === oldGameBotCount + 1, `Game should have ${oldGameBotCount + 1} bots (has ${game.bots.length})`);
  assert(player1.money === oldMoney - 10, `Money should decrease by 10 (was ${oldMoney}, now ${player1.money})`);
  assert(player1.buyMenuOpen === false, 'Menu should close after purchase');
});

test('New bot spawned correctly', () => {
  assert(player1.bots.length === 2, 'Player should have 2 bots');
  const bot2 = player1.bots[1];
  assert(bot2.hp === 10, 'New bot should have 10 HP');
  assert(bot2.playerId === player1Id, 'New bot should belong to player');
  assert(bot2.ability === null, 'New bot should have no ability');
});

// Test buying more bots
test('Buy 3 more bots (total 5)', () => {
  player1.buyMenuOpen = true;
  game.handlePlayerCommand(player1Id, 'b'); // Bot 3
  player1.buyMenuOpen = true;
  game.handlePlayerCommand(player1Id, 'b'); // Bot 4
  player1.buyMenuOpen = true;
  game.handlePlayerCommand(player1Id, 'b'); // Bot 5
  assert(player1.bots.length === 5, `Player should have 5 bots (has ${player1.bots.length})`);
});

// Test cannot buy 6th bot
test('Cannot buy 6th bot (max is 5)', () => {
  const oldMoney = player1.money;
  const oldBotCount = player1.bots.length;
  player1.buyMenuOpen = true;
  game.handlePlayerCommand(player1Id, 'b');
  assert(player1.bots.length === oldBotCount, 'Should still have 5 bots');
  assert(player1.money === oldMoney, 'Money should not decrease');
});

// Test buying abilities for other bots
test('Buy shoot ability for bot 2', () => {
  player1.selectBot(1); // Select bot 2
  const bot2 = player1.getSelectedBot();
  player1.buyMenuOpen = true;
  game.handlePlayerCommand(player1Id, 'f');
  assert(bot2.ability === 'shoot', `Bot 2 should have shoot ability (has ${bot2.ability})`);
});

test('Buy shockwave ability for bot 3', () => {
  player1.selectBot(2); // Select bot 3
  const bot3 = player1.getSelectedBot();
  player1.buyMenuOpen = true;
  game.handlePlayerCommand(player1Id, 'h');
  assert(bot3.ability === 'shockwave', `Bot 3 should have shockwave ability (has ${bot3.ability})`);
});

// Test insufficient funds
test('Cannot buy when insufficient funds', () => {
  player1.money = 3; // Not enough for anything
  const oldMoney = player1.money;
  player1.buyMenuOpen = true;
  game.handlePlayerCommand(player1Id, 'r');
  assert(player1.money === oldMoney, 'Money should not change');
});

// Test menu toggle
test('Menu toggles correctly', () => {
  player1.buyMenuOpen = false;
  game.handlePlayerCommand(player1Id, 'p');
  assert(player1.buyMenuOpen === true, 'Menu should open');
  game.handlePlayerCommand(player1Id, 'p');
  assert(player1.buyMenuOpen === false, 'Menu should close');
});

// Test abilities work
console.log('');
console.log('Testing Ability Usage:');
console.log('═'.repeat(60));

const player2Id = 'test_player_2';
const player2 = game.addPlayer(player2Id, null);
player2.money = 100;

test('Explosion ability damages enemies', () => {
  const attackBot = player1.bots[0];
  const victimBot = player2.bots[0];
  
  // Position victim next to attacker
  attackBot.x = 10;
  attackBot.y = 10;
  victimBot.x = 11;
  victimBot.y = 10;
  
  const oldHp = victimBot.hp;
  game.useAbility(attackBot, 'explosion');
  
  assert(victimBot.hp < oldHp, `Victim HP should decrease (was ${oldHp}, now ${victimBot.hp})`);
  assert(victimBot.hp === oldHp - 5, 'Victim should take 5 damage');
  assert(game.effects.length > 0, 'Effects should be created');
});

test('Shoot ability damages in line', () => {
  const attackBot = player1.bots[1];
  const victimBot = player2.bots[0];
  
  attackBot.x = 5;
  attackBot.y = 5;
  attackBot.lastDirection = { dx: 1, dy: 0 }; // Facing right
  victimBot.x = 7;
  victimBot.y = 5; // 2 tiles to the right
  victimBot.hp = 10;
  
  const oldHp = victimBot.hp;
  game.useAbility(attackBot, 'shoot');
  
  assert(victimBot.hp === oldHp - 5, `Victim should take 5 damage (was ${oldHp}, now ${victimBot.hp})`);
});

test('Shockwave ability works', () => {
  const attackBot = player1.bots[2];
  attackBot.x = 20;
  attackBot.y = 10;
  
  game.useAbility(attackBot, 'shockwave');
  
  assert(game.effects.length > 0, 'Shockwave should create effects');
});

// Test movement and collision
console.log('');
console.log('Testing Movement and Collision:');
console.log('═'.repeat(60));

test('Bot queues moves correctly', () => {
  const bot = player1.bots[0];
  bot.clearQueue();
  bot.addMove('w');
  bot.addMove('a');
  bot.addMove('s');
  assert(bot.moveQueue.length === 3, `Queue should have 3 moves (has ${bot.moveQueue.length})`);
});

test('Clear queue works', () => {
  const bot = player1.bots[0];
  bot.clearQueue();
  assert(bot.moveQueue.length === 0, 'Queue should be empty');
});

test('Collision damages both bots', () => {
  const bot1 = player1.bots[0];
  const bot2 = player2.bots[0];
  
  // Position them to collide
  bot1.x = 15;
  bot1.y = 15;
  bot1.hp = 10;
  bot1.clearQueue();
  bot1.addMove('d'); // Move right to (16, 15)
  
  bot2.x = 17;
  bot2.y = 15;
  bot2.hp = 10;
  bot2.clearQueue();
  bot2.addMove('a'); // Move left to (16, 15)
  
  game.tick();
  
  // Both should have taken damage
  assert(bot1.hp === 0, `Bot1 should be dead from collision (HP: ${bot1.hp})`);
  assert(bot2.hp === 0, `Bot2 should be dead from collision (HP: ${bot2.hp})`);
});

// Summary
console.log('');
console.log('═'.repeat(60));
console.log('PLAYTEST SUMMARY:');
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsFailed}`);
console.log('═'.repeat(60));

if (testsFailed === 0) {
  console.log('');
  console.log('🎉 ALL TESTS PASSED! 🎉');
  console.log('');
  console.log('The game is ready to play with all features working:');
  console.log('  ✅ Buy menu hotkeys work correctly');
  console.log('  ✅ Buy new bot (B) works for $10');
  console.log('  ✅ All abilities can be purchased');
  console.log('  ✅ Abilities work correctly');
  console.log('  ✅ Movement and collision work');
  console.log('  ✅ Menu toggle works');
  console.log('');
  process.exit(0);
} else {
  console.log('');
  console.log('⚠️  SOME TESTS FAILED - Please review above');
  console.log('');
  process.exit(1);
}
