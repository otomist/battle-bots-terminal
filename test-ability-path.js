const { Game } = require('./game');

console.log('Testing Ability Path Visualization...\n');

const game = new Game();
const player1 = game.addPlayer('player1', null);
game.addPlayer('player2', null);

const bot = player1.bots[0];
bot.x = 10;
bot.y = 10;
bot.ability = 'explosion';
bot.clearQueue();

console.log(`Bot at (${bot.x}, ${bot.y})`);
console.log('Bot has explosion ability\n');

// Queue: D, D, Q, D
console.log('Queueing: D, D, Q, D');
game.handlePlayerCommand('player1', 'd');
game.handlePlayerCommand('player1', 'd');
game.handlePlayerCommand('player1', 'q');
game.handlePlayerCommand('player1', 'd');

console.log(`Queue length: ${bot.moveQueue.length}\n`);

const gameState = game.getGameStateForPlayer('player1');
const botState = gameState.bots.find(b => b.id === bot.id);

console.log('Queue path:');
botState.queuePath.forEach((item, i) => {
  console.log(`  ${i+1}. Type: ${item.type}, Position: (${item.x},${item.y})${item.ability ? ', Ability: ' + item.ability : ''}`);
});

console.log('\nExpected to see:');
console.log('  1. move to (11,10)');
console.log('  2. move to (12,10)');
console.log('  3. ability at (12,10) - EXPLOSION');
console.log('  4. move to (13,10)');

