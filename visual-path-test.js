const { Game } = require('./game');

// ANSI colors
const colors = {
  red: '\x1b[91m',
  blue: '\x1b[94m',
  green: '\x1b[92m',
  yellow: '\x1b[93m',
  reset: '\x1b[0m'
};

function colorize(text, color) {
  return (colors[color] || '') + text + colors.reset;
}

console.clear();
console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║          ABILITY PATH VISUALIZATION TEST                      ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');
console.log('');

const game = new Game();
const player1 = game.addPlayer('player1', null);
game.addPlayer('player2', null);

// Test 1: Explosion ability
console.log('Test 1: Explosion Ability Path');
console.log('═══════════════════════════════════════════════════════════════');
const bot1 = player1.bots[0];
bot1.x = 5;
bot1.y = 5;
bot1.ability = 'explosion';
bot1.clearQueue();

console.log('Commands: D, D, Q, D, D');
game.handlePlayerCommand('player1', 'd');
game.handlePlayerCommand('player1', 'd');
game.handlePlayerCommand('player1', 'q');
game.handlePlayerCommand('player1', 'd');
game.handlePlayerCommand('player1', 'd');

let gameState = game.getGameStateForPlayer('player1');
let botState = gameState.bots.find(b => b.id === bot1.id);

// Create mini grid to visualize
const grid1 = Array(3).fill().map(() => Array(10).fill(' '));
botState.queuePath.forEach((item, i) => {
  const relX = item.x - 5;
  const relY = item.y - 5;
  if (relX >= 0 && relX < 10 && relY >= 0 && relY < 3) {
    if (item.type === 'ability') {
      grid1[relY][relX] = colorize('E', 'red');
    } else {
      grid1[relY][relX] = colorize('·', 'red');
    }
  }
});
grid1[0][0] = colorize('@', 'red');

console.log('\nVisualization:');
grid1.forEach(row => console.log('  ' + row.join('')));
console.log('\nExpected: @ · · E · ·');
console.log('');

// Test 2: Shoot ability
console.log('Test 2: Shoot Ability Path');
console.log('═══════════════════════════════════════════════════════════════');
bot1.x = 5;
bot1.y = 5;
bot1.ability = 'shoot';
bot1.clearQueue();

console.log('Commands: W, W, Q, W');
game.handlePlayerCommand('player1', 'w');
game.handlePlayerCommand('player1', 'w');
game.handlePlayerCommand('player1', 'q');
game.handlePlayerCommand('player1', 'w');

gameState = game.getGameStateForPlayer('player1');
botState = gameState.bots.find(b => b.id === bot1.id);

const grid2 = Array(5).fill().map(() => Array(3).fill(' '));
botState.queuePath.forEach((item) => {
  const relX = item.x - 4;
  const relY = item.y - 2;
  if (relX >= 0 && relX < 3 && relY >= 0 && relY < 5) {
    if (item.type === 'ability') {
      grid2[relY][relX] = colorize('S', 'red');
    } else {
      grid2[relY][relX] = colorize('·', 'red');
    }
  }
});
grid2[3][1] = colorize('@', 'red');

console.log('\nVisualization:');
grid2.forEach(row => console.log('  ' + row.join('')));
console.log('\nExpected (vertical):');
console.log('  ·');
console.log('  ·');
console.log('  S');
console.log('  @');
console.log('');

// Test 3: Shockwave ability
console.log('Test 3: Shockwave Ability Path');
console.log('═══════════════════════════════════════════════════════════════');
bot1.x = 5;
bot1.y = 5;
bot1.ability = 'shockwave';
bot1.clearQueue();

console.log('Commands: D, Q, D');
game.handlePlayerCommand('player1', 'd');
game.handlePlayerCommand('player1', 'q');
game.handlePlayerCommand('player1', 'd');

gameState = game.getGameStateForPlayer('player1');
botState = gameState.bots.find(b => b.id === bot1.id);

const grid3 = Array(3).fill().map(() => Array(5).fill(' '));
botState.queuePath.forEach((item) => {
  const relX = item.x - 5;
  const relY = item.y - 5;
  if (relX >= 0 && relX < 5 && relY >= 0 && relY < 3) {
    if (item.type === 'ability') {
      grid3[relY][relX] = colorize('H', 'red');
    } else {
      grid3[relY][relX] = colorize('·', 'red');
    }
  }
});
grid3[0][0] = colorize('@', 'red');

console.log('\nVisualization:');
grid3.forEach(row => console.log('  ' + row.join('')));
console.log('\nExpected: @ · H ·');
console.log('');

// Test 4: Multiple abilities in sequence
console.log('Test 4: Multiple Commands with Ability');
console.log('═══════════════════════════════════════════════════════════════');
bot1.x = 5;
bot1.y = 5;
bot1.ability = 'explosion';
bot1.clearQueue();

console.log('Commands: D, D, D, Q, D, D');
game.handlePlayerCommand('player1', 'd');
game.handlePlayerCommand('player1', 'd');
game.handlePlayerCommand('player1', 'd');
game.handlePlayerCommand('player1', 'q');
game.handlePlayerCommand('player1', 'd');
game.handlePlayerCommand('player1', 'd');

gameState = game.getGameStateForPlayer('player1');
botState = gameState.bots.find(b => b.id === bot1.id);

console.log('\nQueue contents:');
botState.queuePath.forEach((item, i) => {
  const symbol = item.type === 'ability' ? 'E' : '·';
  console.log(`  Step ${i+1}: ${symbol} at (${item.x}, ${item.y})`);
});

console.log('\nExpected sequence: · · · E · ·');
console.log('');

console.log('═══════════════════════════════════════════════════════════════');
console.log('✅ All ability markers should now be visible in the client!');
console.log('');
console.log('Legend:');
console.log('  @ = Current bot position');
console.log('  · = Movement step');
console.log('  E = Explosion ability');
console.log('  S = Shoot ability');
console.log('  H = sHockwave ability');
console.log('');
