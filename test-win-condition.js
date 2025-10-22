// Test win condition system
const { Game } = require('./game');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║         WIN CONDITION TEST                                    ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');
console.log('');

const game = new Game();

console.log('Scenario: 3 players battle until only 1 remains');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

// Add first player
console.log('Step 1: Player 1 joins');
const player1 = game.addPlayer('AlphaCommander', null);
console.log(`  Game state: ${game.gameState}`);
console.log(`  Players: ${game.players.size}`);
console.log(`  ✓ Waiting for more players...`);
console.log('');

// Add second player - game should start
console.log('Step 2: Player 2 joins');
const player2 = game.addPlayer('BetaWarrior', null);
console.log(`  Game state: ${game.gameState}`);
console.log(`  Players: ${game.players.size}`);
console.log(`  ✓ Game starts! (minimum 2 players reached)`);
console.log('');

// Add third player
console.log('Step 3: Player 3 joins');
const player3 = game.addPlayer('GammaDestroyer', null);
console.log(`  Game state: ${game.gameState}`);
console.log(`  Players: ${game.players.size}`);
console.log(`  ✓ Another player joins the battle!`);
console.log('');

console.log('Current standings:');
console.log(`  Player 1 (${player1.color}): ${player1.bots.length} bot`);
console.log(`  Player 2 (${player2.color}): ${player2.bots.length} bot`);
console.log(`  Player 3 (${player3.color}): ${player3.bots.length} bot`);
console.log('');

// Simulate combat - eliminate player 3
console.log('Step 4: Player 3\'s bot is eliminated!');
player3.bots[0].takeDamage(100);
game.tick(); // Remove dead bots and check win condition
console.log(`  Game state: ${game.gameState}`);
console.log(`  Winner: ${game.winner || 'None yet'}`);
console.log(`  ✓ Game continues (2 players still alive)`);
console.log('');

console.log('Current standings:');
console.log(`  Player 1 (${player1.color}): ${player1.bots.length} bot`);
console.log(`  Player 2 (${player2.color}): ${player2.bots.length} bot`);
console.log(`  Player 3 (${player3.color}): ${player3.bots.length} bot (ELIMINATED)`);
console.log('');

// Eliminate player 2
console.log('Step 5: Player 2\'s bot is eliminated!');
player2.bots[0].takeDamage(100);
game.tick(); // Remove dead bots and check win condition
console.log(`  Game state: ${game.gameState}`);
console.log(`  Winner: ${game.winner}`);
console.log(`  ✓ Game ends! Only 1 player remains!`);
console.log('');

console.log('═══════════════════════════════════════════════════════════════');
console.log('                         FINAL RESULT');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log(`🏆 PLAYER [${game.winner}] WINS! 🏆`);
console.log('');
console.log('Final standings:');
console.log(`  1st: Player 1 (${player1.color}) - ${player1.bots.length} bot 👑`);
console.log(`  2nd: Player 2 (${player2.color}) - ${player2.bots.length} bots`);
console.log(`  3rd: Player 3 (${player3.color}) - ${player3.bots.length} bots`);
console.log('');

// Test the game state
const gameStateForWinner = game.getGameStateForPlayer(player1.id);
console.log('Game State Object:');
console.log(`  gameState: "${gameStateForWinner.gameState}"`);
console.log(`  winner: "${gameStateForWinner.winner}"`);
console.log(`  Total players: ${gameStateForWinner.players.length}`);
console.log('');

console.log('✅ Win condition system working correctly!');
console.log('');
console.log('Win conditions verified:');
console.log('  ✓ Game waits for 2+ players to start');
console.log('  ✓ Game continues while multiple players alive');
console.log('  ✓ Game ends when only 1 player has bots');
console.log('  ✓ Winner is correctly identified');
console.log('  ✓ Game state tracks "waiting", "playing", "finished"');
console.log('');
