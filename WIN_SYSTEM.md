# Win Condition System - Battle Bots

## Overview

The game now features a complete win condition system that tracks game state from waiting room to victory announcement.

## Game States

### 1. Waiting (`waiting`)
- **When**: Game starts, waiting for players
- **Condition**: Less than 2 players connected
- **Display**: Waiting screen showing connected players
- **Actions**: Players can join, but no gameplay yet

### 2. Playing (`playing`)
- **When**: 2 or more players connected
- **Condition**: Multiple players have bots alive
- **Display**: Normal game board with all features
- **Actions**: Full gameplay - move, attack, buy, etc.

### 3. Finished (`finished`)
- **When**: Only 1 player has bots remaining
- **Condition**: Win condition detected
- **Display**: Victory screen with winner announcement
- **Actions**: Game over, press Ctrl+C to exit

## Win Conditions

### Victory
```
When: Only 1 player has bots alive
Result: That player is declared winner
Display: "PLAYER [playerId] WINS!" in player's color
```

### Draw (Edge Case)
```
When: All bots die simultaneously (very rare)
Result: Game ends in draw
Display: "IT'S A DRAW!"
```

## Implementation Details

### Game Initialization
```javascript
constructor() {
  // ...
  this.gameState = 'waiting';  // Initial state
  this.winner = null;          // No winner yet
}
```

### Starting the Game
```javascript
addPlayer(playerId, socket) {
  // ...
  // Start game when we have at least 2 players
  if (this.players.size >= 2 && this.gameState === 'waiting') {
    this.gameState = 'playing';
  }
  // ...
}
```

### Checking Win Condition
```javascript
checkWinCondition() {
  // Only check if game is playing
  if (this.gameState !== 'playing') return;

  // Find all players with bots remaining
  const playersWithBots = Array.from(this.players.values())
    .filter(player => player.bots.length > 0);

  // If only 1 player has bots, they win!
  if (playersWithBots.length === 1) {
    this.gameState = 'finished';
    this.winner = playersWithBots[0].id;
  }
  // If no players have bots (all died simultaneously), it's a draw
  else if (playersWithBots.length === 0) {
    this.gameState = 'finished';
    this.winner = 'draw';
  }
}
```

### Integration with Game Tick
```javascript
tick() {
  // ... movement, combat, abilities ...
  
  // Remove dead bots
  this.bots = this.bots.filter(bot => {
    if (bot.hp <= 0) {
      const player = this.players.get(bot.playerId);
      if (player) {
        player.removeBot(bot);
      }
      return false;
    }
    return true;
  });

  // Check win condition after tick
  this.checkWinCondition();
}
```

## Client Display

### Waiting Screen
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                    BATTLE BOTS                               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

              Waiting for players to join...

              Players: 1/2 (minimum)

              Connected players:
                █ (You)

              Game starts when 2+ players connect!
```

### Victory Screen
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                      GAME OVER                               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝


                    🎉 VICTORY! 🎉


              PLAYER [AlphaCommander] WINS!


              ⭐ You are the champion! ⭐


              Final Standings:
              ─────────────────
              1. █ - 3 bots 👑 (You)
              2. ▓ - 0 bots
              3. ▒ - 0 bots


              Press Ctrl+C to exit
```

### Draw Screen
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                      GAME OVER                               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝


                    🤝 IT'S A DRAW! 🤝

              All bots destroyed simultaneously!
```

## Testing

### TDD Approach
Following Test-Driven Development, tests were written first:

#### Test 21: Game waits for 2 players
```javascript
✅ Game starts in 'waiting' state
✅ Stays waiting with 1 player
✅ Changes to 'playing' with 2 players
```

#### Test 22: Winner detection
```javascript
✅ Detects winner when only 1 player has bots
✅ Sets gameState to 'finished'
✅ Correctly identifies winner
```

#### Test 23: Multiple players
```javascript
✅ Game continues with multiple players alive
✅ Eliminating one player doesn't end game
✅ Winner only declared when 1 remains
```

#### Test 24: Integrated with tick
```javascript
✅ Win condition checked after each tick
✅ Dead bots removed automatically
✅ Game ends correctly after elimination
```

### Test Results
```
playtest.js:           24/24 tests PASSED ✅
integration-test.js:   All scenarios PASSED ✅
test.js:               Original tests PASSED ✅
test-win-condition.js: Win system PASSED ✅
```

## Game Flow Example

```
1. Server starts
   └─> gameState = 'waiting'

2. Player 1 connects
   └─> gameState = 'waiting' (need 1 more)
   └─> Show: "Waiting for players..."

3. Player 2 connects
   └─> gameState = 'playing' (minimum met!)
   └─> Show: Normal game board

4. Player 3 connects
   └─> gameState = 'playing' (still playing)
   └─> 3 players battling

5. Player 3 eliminated
   └─> gameState = 'playing' (2 players remain)
   └─> Game continues

6. Player 2 eliminated
   └─> gameState = 'finished' (only 1 left!)
   └─> winner = Player 1's ID
   └─> Show: Victory screen

7. Game ends
   └─> Display winner
   └─> Show final standings
   └─> Wait for exit
```

## Edge Cases Handled

### 1. Player Disconnects
- If player disconnects, their bots remain until destroyed
- Win condition based on bots, not connections
- Game continues as normal

### 2. Simultaneous Elimination
- If last 2 players' bots die in same tick
- Game detects draw condition
- Display: "IT'S A DRAW!"

### 3. Single Player
- Game stays in 'waiting' state
- Cannot start until 2nd player joins
- Shows waiting screen

### 4. Player Joins During Game
- New players can join while game is 'playing'
- They enter the ongoing battle
- No restart required

## Benefits

### For Players
- **Clear Start**: Know when game begins
- **Win Recognition**: Clear victory announcement
- **Fair Play**: Game only starts with 2+ players
- **Visible Progress**: Can see player standings

### For Gameplay
- **Strategic**: Know when you're close to winning
- **Tension**: Increases as players are eliminated
- **Fair**: Equal starting conditions (2+ players)
- **Clear End**: No ambiguity about victory

### For Code
- **Testable**: All conditions have tests
- **Maintainable**: Clear state transitions
- **Extensible**: Easy to add new game modes
- **Robust**: Handles edge cases

## Future Enhancements

Possible additions:
- **Rematch Option**: Start new game with same players
- **Tournament Mode**: Best of 3/5 matches
- **Team Mode**: 2v2 or 3v3 battles
- **Spectator Mode**: Watch after elimination
- **Leaderboard**: Track wins across games
- **Time Limit**: Optional time-based victories

---

**Status**: ✅ Complete and Tested  
**Version**: 3.0  
**Tests**: 24/24 passing  
**TDD**: Followed throughout
