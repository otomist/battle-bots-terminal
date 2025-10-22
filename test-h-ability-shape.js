// Test to verify H ability creates proper H shape
const { Game } = require('./game');

console.log('Testing H-Ability Shape...\n');

const game = new Game();
const player1 = game.addPlayer('test1', null);
const bot = player1.getSelectedBot();

bot.x = 10;
bot.y = 10;
bot.ability = 'shockwave';

console.log('Bot position: (10, 10)');
console.log('Expected H pattern:');
console.log('');
console.log('  8 9 10 11 12  (Y coordinate)');
console.log('8 . . # . . #');
console.log('9 . . # . . #');
console.log('10 # # X # #');  // X is bot position
console.log('');

game.effects = [];
game.useAbility(bot, 'shockwave');

console.log('Actual effect positions:');
const sortedEffects = game.effects.sort((a, b) => {
  if (a.y === b.y) return a.x - b.x;
  return a.y - b.y;
});

sortedEffects.forEach(effect => {
  console.log(`  (${effect.x}, ${effect.y})`);
});

console.log('\nExpected positions for H shape:');
console.log('Horizontal bar (at y=10):');
console.log('  (8, 10) - 2 left');
console.log('  (9, 10) - 1 left');
console.log('  (11, 10) - 1 right');
console.log('  (12, 10) - 2 right');
console.log('Vertical legs (left side at x=8):');
console.log('  (8, 9) - up 1 from left end');
console.log('  (8, 8) - up 2 from left end');
console.log('Vertical legs (right side at x=12):');
console.log('  (12, 9) - up 1 from right end');
console.log('  (12, 8) - up 2 from right end');

const expected = [
  {x: 8, y: 10}, {x: 9, y: 10}, {x: 11, y: 10}, {x: 12, y: 10},  // horizontal
  {x: 8, y: 9}, {x: 8, y: 8},  // left vertical
  {x: 12, y: 9}, {x: 12, y: 8}  // right vertical
];

console.log('\nVerifying H shape...');
let correct = true;
if (game.effects.length !== 8) {
  console.log(`❌ Wrong number of effects: ${game.effects.length} (expected 8)`);
  correct = false;
}

expected.forEach(exp => {
  const found = game.effects.find(e => e.x === exp.x && e.y === exp.y);
  if (!found) {
    console.log(`❌ Missing effect at (${exp.x}, ${exp.y})`);
    correct = false;
  }
});

if (correct) {
  console.log('✅ H shape is correct!');
} else {
  console.log('❌ H shape is incorrect!');
}
