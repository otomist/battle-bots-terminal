// Demo script to show what the game looks like
const { Game } = require('./game');

// ANSI color codes
const colors = {
  red: '\x1b[91m',
  blue: '\x1b[94m',
  green: '\x1b[92m',
  yellow: '\x1b[93m',
  magenta: '\x1b[95m',
  cyan: '\x1b[96m',
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
};

function colorize(text, color) {
  return (colors[color] || '') + text + colors.reset;
}

console.clear();
console.log(colorize('╔═══════════════════════════════════════════════════════════════╗', 'cyan'));
console.log(colorize('║                   BATTLE BOTS - DEMO                          ║', 'cyan'));
console.log(colorize('╚═══════════════════════════════════════════════════════════════╝', 'cyan'));
console.log('');

// Create a demo game
const game = new Game();

// Add two players
const player1 = game.addPlayer('demo_player_1', null);
const player2 = game.addPlayer('demo_player_2', null);

// Give them money and bots
player1.money = 45;
player2.money = 30;

// Position bots strategically
const bot1 = player1.getSelectedBot();
bot1.x = 10;
bot1.y = 5;
bot1.ability = 'explosion';

// Add more bots for player 1
const bot1b = new (require('./game').Bot)(game.botIdCounter++, 12, 7, player1.id);
bot1b.ability = 'shoot';
game.bots.push(bot1b);
player1.addBot(bot1b);

// Position player 2's bot
const bot2 = player2.getSelectedBot();
bot2.x = 30;
bot2.y = 10;
bot2.ability = 'shockwave';

// Add another bot for player 2
const bot2b = new (require('./game').Bot)(game.botIdCounter++, 28, 8, player2.id);
game.bots.push(bot2b);
player2.addBot(bot2b);

// Add some coins
game.coins = [
  { x: 15, y: 8 },
  { x: 25, y: 5 },
  { x: 5, y: 15 },
  { x: 35, y: 3 },
  { x: 20, y: 12 }
];

// Create some effects for demonstration
game.effects = [
  { x: 9, y: 4, char: '*', color: 'red' },
  { x: 10, y: 4, char: '*', color: 'red' },
  { x: 11, y: 4, char: '*', color: 'red' },
  { x: 31, y: 10, char: '+', color: 'blue' },
  { x: 32, y: 10, char: '+', color: 'blue' },
];

// Render the demo
const width = game.width;
const height = game.height;

// Create grid
const grid = Array(height).fill().map(() => Array(width).fill(' '));
const colorGrid = Array(height).fill().map(() => Array(width).fill(null));

// Place coins
game.coins.forEach(coin => {
  grid[coin.y][coin.x] = '$';
  colorGrid[coin.y][coin.x] = 'yellow';
});

// Place effects
game.effects.forEach(effect => {
  grid[effect.y][effect.x] = effect.char;
  colorGrid[effect.y][effect.x] = effect.color;
});

// Place player 1's bots (shown as numbers from their perspective)
grid[bot1.y][bot1.x] = '@';
colorGrid[bot1.y][bot1.x] = player1.color;
grid[bot1b.y][bot1b.x] = '2';
colorGrid[bot1b.y][bot1b.x] = player1.color;

// Place player 2's bots (shown as enemy symbols)
grid[bot2.y][bot2.x] = player2.char;
colorGrid[bot2.y][bot2.x] = player2.color;
grid[bot2b.y][bot2b.x] = player2.char;
colorGrid[bot2b.y][bot2b.x] = player2.color;

// Draw top border
console.log('┌' + '─'.repeat(width) + '┐');

// Draw grid
for (let y = 0; y < height; y++) {
  let line = '│';
  for (let x = 0; x < width; x++) {
    const char = grid[y][x];
    const color = colorGrid[y][x];
    if (color) {
      line += colorize(char, color);
    } else {
      line += colorize(char, 'gray');
    }
  }
  line += '│';
  console.log(line);
}

// Draw bottom border
console.log('└' + '─'.repeat(width) + '┘');

console.log('');
console.log(`Player: ${colorize(player1.char, player1.color)} | Money: ${colorize('$' + player1.money, 'yellow')} | Bots: ${player1.bots.length}/5`);
console.log(`Selected Bot: ${colorize('@', player1.color)} | HP: ${bot1.hp}/${bot1.maxHp} | Ability: ${bot1.ability || 'none'} | Queue: ${bot1.moveQueue.length}`);

console.log('');
console.log('Controls: WASD=Move | Q=Use Ability | R=Clear Queue | P=Buy Menu | 1-5=Select Bot');

console.log('');
console.log('Players in Game:');
console.log(`  ${colorize(player1.char, player1.color)} ${colorize('(You)', 'bold')} - ${player1.bots.length} bots - Has explosion & shoot abilities`);
console.log(`  ${colorize(player2.char, player2.color)} - ${player2.bots.length} bots - Has shockwave ability`);

console.log('');
console.log(colorize('Legend:', 'bold'));
console.log(`  ${colorize('@', player1.color)} = Your selected bot`);
console.log(`  ${colorize('1-5', player1.color)} = Your other bots`);
console.log(`  ${colorize(player2.char, player2.color)} = Enemy bots`);
console.log(`  ${colorize('$', 'yellow')} = Coins (worth $10 each)`);
console.log(`  ${colorize('*', 'red')} = Explosion ability effect`);
console.log(`  ${colorize('+', 'blue')} = Shoot ability effect`);
console.log(`  ${colorize('#', 'green')} = Shockwave ability effect`);

console.log('');
console.log(colorize('╔═══════════════════════════════════════════════════════════════╗', 'cyan'));
console.log(colorize('║  Game ticks every 2 seconds - Plan your moves carefully!     ║', 'cyan'));
console.log(colorize('║  Collision with enemy = 10 damage to both bots               ║', 'cyan'));
console.log(colorize('║  Collect coins to buy more bots and powerful abilities       ║', 'cyan'));
console.log(colorize('╚═══════════════════════════════════════════════════════════════╝', 'cyan'));

console.log('');
console.log(colorize('Ready to play? Run:', 'bold'));
console.log('  Terminal 1: ' + colorize('node server.js', 'green'));
console.log('  Terminal 2: ' + colorize('node client.js', 'green'));
console.log('  Terminal 3: ' + colorize('node client.js', 'green') + ' (for player 2)');
console.log('');
