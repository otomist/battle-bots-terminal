// Test with the fix
const gameState = {
  width: 40,
  height: 20,
  player: {
    id: 'p1',
    color: 'red',
    selectedBotIndex: 0
  },
  bots: [
    {
      id: 1,
      x: 10,
      y: 10,
      playerId: 'p1',
      isOwn: true,
      queuePath: [
        { x: 11, y: 10, type: 'move' },
        { x: 12, y: 10, type: 'move' },
        { x: 13, y: 10, type: 'move' },
        { x: 13, y: 10, type: 'ability', ability: 'shockwave' },
        { x: 14, y: 10, type: 'move' },
        { x: 15, y: 10, type: 'move' }
      ]
    }
  ]
};

const { player, bots } = gameState;
const playerBots = bots.filter(b => b.isOwn);
const selectedBot = playerBots[player.selectedBotIndex];
const width = gameState.width;
const height = gameState.height;

// Create grid
const grid = Array(height).fill().map(() => Array(width).fill(' '));

console.log('Testing FIXED rendering logic:\n');

// Apply the FIXED logic
if (selectedBot && selectedBot.queuePath && selectedBot.queuePath.length > 0) {
  selectedBot.queuePath.forEach((pathItem, idx) => {
    if (pathItem.x >= 0 && pathItem.x < width && pathItem.y >= 0 && pathItem.y < height) {
      const currentChar = grid[pathItem.y][pathItem.x];
      
      if (pathItem.type === 'ability') {
        // Ability markers can overwrite empty space or movement dots
        if (currentChar === ' ' || currentChar === '·') {
          const abilityChar = {
            'explosion': 'E',
            'shoot': 'S',
            'shockwave': 'H'
          }[pathItem.ability] || 'A';
          grid[pathItem.y][pathItem.x] = abilityChar;
          console.log(`  [${idx}] (${pathItem.x},${pathItem.y}): ${abilityChar} (ability - ${currentChar === '·' ? 'overwrote dot' : 'placed'})`);
        } else {
          console.log(`  [${idx}] (${pathItem.x},${pathItem.y}): SKIPPED (has: ${currentChar})`);
        }
      } else {
        // Movement dots only on empty spaces
        if (currentChar === ' ') {
          grid[pathItem.y][pathItem.x] = '·';
          console.log(`  [${idx}] (${pathItem.x},${pathItem.y}): · (move)`);
        } else {
          console.log(`  [${idx}] (${pathItem.x},${pathItem.y}): SKIPPED (has: ${currentChar})`);
        }
      }
    }
  });
}

console.log('\nFinal path visualization:');
console.log('@ ' + grid[10].slice(11, 16).join(' '));
console.log('  ^ bot at (10,10)');
console.log('');
console.log('Expected: @ · · H · ·');
console.log('Actual:   @ ' + grid[10].slice(11, 16).join(' '));

if (grid[10][13] === 'H') {
  console.log('\n✓ SUCCESS! Ability marker H is showing!');
} else {
  console.log('\n✗ FAILED! Expected H at position (13,10), got:', grid[10][13]);
}
