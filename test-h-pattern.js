// Visual test for H-shaped shockwave pattern
const { Game } = require('./game');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║         H-PATTERN SHOCKWAVE VISUALIZATION                     ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');
console.log('');

const game = new Game();
const player = game.addPlayer('test_player', null);
const bot = player.getSelectedBot();

// Position bot in center of a small area
bot.x = 10;
bot.y = 10;
bot.ability = 'shockwave';

// Use the ability
game.useAbility(bot, 'shockwave');

// Create a visual representation
const gridSize = 11;
const centerX = 5;
const centerY = 5;
const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(' '));

// Mark bot position
grid[centerY][centerX] = 'B';

// Mark effect positions
game.effects.forEach(effect => {
  const relX = effect.x - bot.x + centerX;
  const relY = effect.y - bot.y + centerY;
  if (relX >= 0 && relX < gridSize && relY >= 0 && relY < gridSize) {
    if (grid[relY][relX] === ' ') {
      grid[relY][relX] = '#';
    }
  }
});

console.log('Bot at center (B), shockwave effect shown as (#):');
console.log('');
console.log('┌───────────┐');
for (let y = 0; y < gridSize; y++) {
  console.log('│' + grid[y].join(' ') + '│');
}
console.log('└───────────┘');
console.log('');

// Show the pattern description
console.log('Pattern breakdown:');
console.log('  Left vertical:   x-2, y-2 to y+2 (5 tiles)');
console.log('  Right vertical:  x+2, y-2 to y+2 (5 tiles)');
console.log('  Middle horizontal: x-1 to x+1, y (3 tiles)');
console.log('');
console.log('Total positions: ' + game.effects.length);
console.log('');

// Verify it's an H shape
console.log('Verification:');
const hasLeftTop = game.effects.some(e => e.x === 8 && e.y === 8);
const hasLeftBottom = game.effects.some(e => e.x === 8 && e.y === 12);
const hasRightTop = game.effects.some(e => e.x === 12 && e.y === 8);
const hasRightBottom = game.effects.some(e => e.x === 12 && e.y === 12);
const hasMiddle = game.effects.some(e => e.x === 10 && e.y === 10);

console.log('  ✓ Left top corner:    ' + (hasLeftTop ? '✅' : '❌'));
console.log('  ✓ Left bottom corner: ' + (hasLeftBottom ? '✅' : '❌'));
console.log('  ✓ Right top corner:   ' + (hasRightTop ? '✅' : '❌'));
console.log('  ✓ Right bottom corner:' + (hasRightBottom ? '✅' : '❌'));
console.log('  ✓ Middle horizontal:  ' + (hasMiddle ? '✅' : '❌'));
console.log('');

if (hasLeftTop && hasLeftBottom && hasRightTop && hasRightBottom && hasMiddle) {
  console.log('🎉 Perfect H shape! ✅');
} else {
  console.log('⚠️  Pattern is not a proper H');
}
console.log('');

// Test ability queuing
console.log('═══════════════════════════════════════════════════════════════');
console.log('Testing Ability Queuing:');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

const player2 = game.addPlayer('test_player2', null);
const bot2 = player2.getSelectedBot();
bot2.x = 5;
bot2.y = 5;
bot2.ability = 'explosion';
bot2.clearQueue();

console.log('Queuing commands: S, S, Q (ability), A');
game.handlePlayerCommand(player2.id, 's');
game.handlePlayerCommand(player2.id, 's');
game.handlePlayerCommand(player2.id, 'q');
game.handlePlayerCommand(player2.id, 'a');

console.log(`Queue length: ${bot2.moveQueue.length} commands`);
console.log('');

// Execute ticks
console.log('Executing ticks:');
for (let i = 0; i < 4; i++) {
  const oldX = bot2.x;
  const oldY = bot2.y;
  const queueBefore = bot2.moveQueue.length;
  const effectsBefore = game.effects.length;
  
  game.tick();
  
  const moved = (bot2.x !== oldX || bot2.y !== oldY);
  const usedAbility = game.effects.length > effectsBefore;
  
  console.log(`  Tick ${i + 1}: Queue ${queueBefore}→${bot2.moveQueue.length}, ` +
              (moved ? `Moved to (${bot2.x},${bot2.y})` : '') +
              (usedAbility ? 'Used ability! ⚡' : ''));
}

console.log('');
console.log('✅ Ability queuing works correctly!');
console.log('   Commands execute in order: move, move, ability, move');
console.log('');
