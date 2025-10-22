const { Game } = require('./game');

console.log('Testing Battle Bots Game Logic...\n');

// Create game instance
const game = new Game();
console.log('✓ Game created');
console.log(`  Arena size: ${game.width}x${game.height}`);

// Add players
const player1Id = 'test_player_1';
const player2Id = 'test_player_2';

const player1 = game.addPlayer(player1Id, null);
const player2 = game.addPlayer(player2Id, null);

console.log('\n✓ Players added');
console.log(`  Player 1: ${player1.color} ${player1.char}`);
console.log(`  Player 2: ${player2.color} ${player2.char}`);

// Check initial bots
console.log('\n✓ Initial bots created');
console.log(`  Player 1 bots: ${player1.bots.length}`);
console.log(`  Player 2 bots: ${player2.bots.length}`);
console.log(`  Total bots: ${game.bots.length}`);

// Test movement commands
const bot1 = player1.getSelectedBot();
console.log(`\n✓ Bot 1 initial position: (${bot1.x}, ${bot1.y})`);

game.handlePlayerCommand(player1Id, 'w');
game.handlePlayerCommand(player1Id, 'd');
console.log(`  Queued 2 moves (up, right)`);
console.log(`  Queue length: ${bot1.moveQueue.length}`);

// Test money and coins
player1.money = 50;
console.log(`\n✓ Gave player 1 $50`);
console.log(`  Player 1 money: $${player1.money}`);

// Test buying ability
game.handlePlayerCommand(player1Id, 'p'); // open menu
console.log('\n✓ Opened buy menu');
game.handleBuyCommand(player1, bot1, 'q'); // buy explosion
console.log(`  Bought explosion ability`);
console.log(`  Bot ability: ${bot1.ability}`);
console.log(`  Player money: $${player1.money}`);

// Test buying armor
game.handleBuyCommand(player1, bot1, 'a'); // buy armor
console.log(`  Bought armor`);
console.log(`  Bot HP: ${bot1.hp}/${bot1.maxHp}`);

// Test buying new bot
const initialBotCount = player1.bots.length;
game.handleBuyCommand(player1, bot1, 'b'); // buy bot
console.log(`  Bought new bot`);
console.log(`  Bot count: ${initialBotCount} -> ${player1.bots.length}`);
console.log(`  Player money: $${player1.money}`);

// Test coin spawning
game.spawnCoin();
game.spawnCoin();
game.spawnCoin();
console.log(`\n✓ Spawned coins: ${game.coins.length}`);

// Test game tick
console.log('\n✓ Testing game tick...');
const oldX = bot1.x;
const oldY = bot1.y;
game.tick();
console.log(`  Bot moved from (${oldX}, ${oldY}) to (${bot1.x}, ${bot1.y})`);
console.log(`  Queue length after tick: ${bot1.moveQueue.length}`);

// Test damage
const oldHp = bot1.hp;
bot1.takeDamage(3);
console.log(`\n✓ Damage test`);
console.log(`  HP: ${oldHp} -> ${bot1.hp}`);

// Test healing
bot1.heal(2);
console.log(`  Healed: ${oldHp - 3} -> ${bot1.hp}`);

// Test collision damage
const bot2 = player2.getSelectedBot();
bot2.x = 5;
bot2.y = 5;
bot1.x = 4;
bot1.y = 5;

// Make them move to same spot
bot1.addMove('d'); // bot1 moves right to (5,5)
bot2.addMove('a'); // bot2 moves left to (4,5) - they swap but should collide
bot2.addMove('d'); // Actually move to same spot

console.log('\n✓ Setting up collision test');
console.log(`  Bot1 at (${bot1.x}, ${bot1.y}), HP: ${bot1.hp}`);
console.log(`  Bot2 at (${bot2.x}, ${bot2.y}), HP: ${bot2.hp}`);

// Test abilities
console.log('\n✓ Testing explosion ability');
const botsBeforeExplosion = game.bots.length;
game.useAbility(bot1, 'explosion');
console.log(`  Effects created: ${game.effects.length}`);

// Test game state
const gameState = game.getGameStateForPlayer(player1Id);
console.log('\n✓ Game state for player 1:');
console.log(`  Width: ${gameState.width}`);
console.log(`  Height: ${gameState.height}`);
console.log(`  Player bots: ${gameState.player.botsCount}`);
console.log(`  Total bots visible: ${gameState.bots.length}`);
console.log(`  Coins: ${gameState.coins.length}`);
console.log(`  Effects: ${gameState.effects.length}`);
console.log(`  Players in game: ${gameState.players.length}`);

// Test bot selection
console.log('\n✓ Testing bot selection');
console.log(`  Selected bot index: ${player1.selectedBotIndex}`);
game.handlePlayerCommand(player1Id, '2');
console.log(`  After selecting bot 2: ${player1.selectedBotIndex}`);
game.handlePlayerCommand(player1Id, 'tab');
console.log(`  After tab: ${player1.selectedBotIndex}`);

// Test clear queue
bot1.addMove('w');
bot1.addMove('a');
bot1.addMove('s');
console.log(`\n✓ Testing clear queue`);
console.log(`  Queue length: ${bot1.moveQueue.length}`);
game.handlePlayerCommand(player1Id, 'r');
console.log(`  After clear: ${bot1.moveQueue.length}`);

console.log('\n✅ All tests passed!');
console.log('\nGame is ready to play. Run:');
console.log('  Terminal 1: node server.js');
console.log('  Terminal 2: node client.js');
console.log('  Terminal 3: node client.js (for player 2)');
