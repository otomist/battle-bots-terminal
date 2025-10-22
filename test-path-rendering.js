// Test to verify path rendering works correctly
const { Game } = require('./game');

console.log('Testing Path Rendering...\n');

const game = new Game();
const player1 = game.addPlayer('player1', null);
const player2 = game.addPlayer('player2', null);

const bot = player1.bots[0];
bot.x = 10;
bot.y = 10;
bot.ability = 'shockwave';
bot.clearQueue();

console.log('Bot at position:', bot.x, bot.y);
console.log('Bot ability:', bot.ability);
console.log('');

// Queue: d, d, d, q, d, d
console.log('Queuing: D, D, D, Q, D, D');
game.handlePlayerCommand('player1', 'd');
game.handlePlayerCommand('player1', 'd');
game.handlePlayerCommand('player1', 'd');
game.handlePlayerCommand('player1', 'q');
game.handlePlayerCommand('player1', 'd');
game.handlePlayerCommand('player1', 'd');

console.log('Queue length:', bot.moveQueue.length);
console.log('Queue contents:', bot.moveQueue);
console.log('');

const gameState = game.getGameStateForPlayer('player1');
const botState = gameState.bots.find(b => b.id === bot.id);

console.log('Bot state queuePath:');
botState.queuePath.forEach((item, idx) => {
  console.log(`  [${idx}] (${item.x}, ${item.y}) - type: ${item.type}${item.ability ? ', ability: ' + item.ability : ''}`);
});

console.log('');
console.log('Expected on grid:');
console.log('  Position (11, 10): · (move)');
console.log('  Position (12, 10): · (move)');
console.log('  Position (13, 10): · (move)');
console.log('  Position (13, 10): H (ability - SAME position as last move!)');
console.log('  Position (14, 10): · (move)');
console.log('  Position (15, 10): · (move)');
console.log('');

console.log('Issue found: Ability is at same position as the last move!');
console.log('This means the · will be drawn first, then H will overwrite it.');
console.log('');

// Test what gets rendered
const pathByPosition = new Map();
botState.queuePath.forEach(item => {
  const key = `${item.x},${item.y}`;
  if (!pathByPosition.has(key)) {
    pathByPosition.set(key, []);
  }
  pathByPosition.get(key).push(item);
});

console.log('Positions with multiple items:');
pathByPosition.forEach((items, pos) => {
  if (items.length > 1) {
    console.log(`  ${pos}:`, items.map(i => i.type + (i.ability ? `(${i.ability})` : '')).join(', '));
  }
});

console.log('');
console.log('✓ The ability markers should show up!');
console.log('  Last item at a position should be what displays');
console.log('  Since ability comes after move, H should show at (13,10)');
