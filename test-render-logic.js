// Simulate the rendering logic
const { Game } = require('./game');

const game = new Game();
const p1 = game.addPlayer('p1', null);
game.addPlayer('p2', null);

const bot = p1.bots[0];
bot.x = 10;
bot.y = 10;
bot.ability = 'shockwave';
bot.clearQueue();

// Queue: d, d, d, q, d, d
game.handlePlayerCommand('p1', 'd');
game.handlePlayerCommand('p1', 'd');
game.handlePlayerCommand('p1', 'd');
game.handlePlayerCommand('p1', 'q');
game.handlePlayerCommand('p1', 'd');
game.handlePlayerCommand('p1', 'd');

const gameState = game.getGameStateForPlayer('p1');
const playerBots = gameState.bots.filter(b => b.isOwn);
const selectedBot = playerBots[gameState.player.selectedBotIndex];

console.log('Selected bot queuePath:', selectedBot.queuePath);
console.log('');

// Simulate grid rendering
const grid = {};
const colorGrid = {};

console.log('Rendering path:');
if (selectedBot && selectedBot.queuePath && selectedBot.queuePath.length > 0) {
  selectedBot.queuePath.forEach((pathItem, idx) => {
    const key = `${pathItem.x},${pathItem.y}`;
    
    // Simulate: only place if empty
    if (!grid[key]) {
      if (pathItem.type === 'ability') {
        const abilityChar = {
          'explosion': 'E',
          'shoot': 'S',
          'shockwave': 'H'
        }[pathItem.ability] || 'A';
        grid[key] = abilityChar;
        console.log(`  [${idx}] ${key}: ${abilityChar} (ability)`);
      } else {
        grid[key] = '·';
        console.log(`  [${idx}] ${key}: · (move)`);
      }
    } else {
      console.log(`  [${idx}] ${key}: SKIPPED (already has: ${grid[key]})`);
    }
  });
}

console.log('');
console.log('Final grid state:');
Object.entries(grid).sort().forEach(([pos, char]) => {
  console.log(`  ${pos}: ${char}`);
});
