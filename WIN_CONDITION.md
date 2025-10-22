# Win Condition System - Battle Bots v3.0

## Overview

The game now includes a complete win detection and announcement system that manages game flow from waiting for players through to declaring a winner.

## Game States

The game operates in three distinct states:

### 1. Waiting State
**When:** Game first starts or has fewer than 2 players
**What happens:**
- Players see a waiting screen
- Shows "Waiting for players to join..."
- Lists connected players
- No gameplay occurs

**Transition:** Automatically moves to "Playing" when 2nd player joins

### 2. Playing State
**When:** 2 or more players have bots in the arena
**What happens:**
- Normal gameplay
- Bots move, attack, collect coins
- Players can buy upgrades and new bots
- Game ticks every 2 seconds

**Transition:** Moves to "Ended" when only 1 player has bots remaining

### 3. Ended State
**When:** Only 1 player has bots remaining (winner declared)
**What happens:**
- Game board disappears
- Winner announcement displayed in winner's color
- Final standings shown
- Game stops (no more ticks)

**Transition:** None - game is over

## Win Detection

### How Winner is Determined

A player wins when they are the **last player with bots remaining**.

**Conditions checked:**
1. Count players who still have at least 1 bot
2. If count == 1: That player wins!
3. If count > 1: Game continues

### When Win Check Occurs

Win condition is checked automatically:
- **After every game tick** (after removing dead bots)
- **When a player disconnects** (and their bots are removed)

### Implementation

```javascript
checkWinCondition() {
  // Only check if game is playing
  if (this.gameState !== 'playing') return;

  // Find players who still have bots
  const playersWithBots = [];
  this.players.forEach((player, playerId) => {
    if (player.bots.length > 0) {
      playersWithBots.push(playerId);
    }
  });

  // If only 1 player has bots remaining, they win!
  if (playersWithBots.length === 1) {
    this.gameState = 'ended';
    this.winner = playersWithBots[0];
  }
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
  Need at least 2 players to start

  Players connected: 1

  Current players:
    █ (You)
```

### Win Screen

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                      GAME OVER!                              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝


            PLAYER [warrior] WINS!


  Final Standings:
  ═══════════════════════════════════════════════════

  🏆 1st Place: █ [warrior] - 3 bots remaining
     2nd Place: ▓ [mage] - Eliminated
     3rd Place: ▒ [archer] - Eliminated

  ═══════════════════════════════════════════════════


  🎉 Congratulations! You are the champion! 🎉

  Press Ctrl+C to exit
```

**Features:**
- Winner name in their team color
- Trophy emoji for 1st place
- Shows remaining bot count for winner
- Shows final placement for all players
- Special message if you're the winner

## Gameplay Flow

### Starting a Game

1. Server starts (`node server.js`)
2. First player connects → **Waiting state**
3. Shows waiting screen
4. Second player connects → **Playing state** ✅
5. Game begins!

### During Gameplay

- Players move bots, use abilities, collect coins
- Every tick: Dead bots removed → Win check runs
- Multiple players can be eliminated over time
- Game continues as long as 2+ players have bots

### Ending a Game

**Scenario: 3 players, Player 1 eliminates others**

1. Player 2's last bot dies → Removed from game
   - Win check: Player 1 and 3 still have bots
   - Game continues ✅

2. Player 3's last bot dies → Only Player 1 remains!
   - Win check: Only 1 player with bots
   - Game state → "ended"
   - Winner declared: Player 1
   - Win screen displayed 🏆

## Examples

### Example 1: 2-Player Duel

```javascript
// Player 1 (Warrior) vs Player 2 (Mage)
warrior.bots[0].ability = 'explosion';
mage.bots[0].hp = 5; // Low HP

// Position mage next to warrior
warrior: (10, 10)
mage: (11, 10)

// Warrior uses explosion
warrior queues ability (Q)
tick executes...

// Explosion hits mage (5 damage)
mage HP: 5 - 5 = 0 (dies)

// Win check:
Players with bots: 1 (Warrior)
Winner: Warrior ✅
Game state: ended
```

### Example 2: 4-Player Battle Royale

```javascript
Initial: Players A, B, C, D (all have bots)
Game state: playing

Turn 5: Player D's bots eliminated
Players with bots: 3 (A, B, C)
Game state: playing ✅

Turn 12: Player B's bots eliminated  
Players with bots: 2 (A, C)
Game state: playing ✅

Turn 20: Player C's last bot dies
Players with bots: 1 (A)
Winner: Player A 🏆
Game state: ended
```

## Testing

### TDD Approach

All features were developed using Test-Driven Development:

1. **Write tests first** (4 new tests)
2. **Run tests** (they fail ❌)
3. **Implement features**
4. **Run tests again** (they pass ✅)

### Test Coverage

**Test #21: Game starts when 2 players connect**
- Verifies waiting → playing transition
- Checks 1 player = waiting, 2 players = playing

**Test #22: Game ends when only 1 player has bots**
- Simulates bot elimination
- Verifies winner detection
- Checks ended state

**Test #23: No winner while multiple players have bots**
- Tests that game continues with 2+ players
- Even if some players eliminated

**Test #24: Win condition checked during tick**
- Automatic detection during gameplay
- Combat scenario (ability kills last enemy)
- Verifies tick → win check integration

**Comprehensive Test (test-win-condition.js):**
- All game state transitions
- Multi-player scenarios
- Real combat simulation
- Client state verification

## Game State Data

The game state sent to clients now includes:

```javascript
{
  width: 40,
  height: 20,
  gameState: 'playing', // 'waiting', 'playing', or 'ended'
  winner: 'player_abc123', // null if no winner yet
  player: { ... },
  bots: [ ... ],
  coins: [ ... ],
  effects: [ ... ],
  players: [ ... ]
}
```

## User Experience

### For Winner
- Big announcement in their color
- Trophy emoji
- "Congratulations!" message
- Shows they're 1st place
- Shows how many bots they had left

### For Other Players
- See who won (in their color)
- See their final placement
- "Better luck next time" message
- Can see full standings

### Spectators (if implemented)
- Would see winner announcement
- Could watch replay
- See final stats

## Strategy Implications

### Early Game
- Survive and build economy
- Buy multiple bots
- Upgrade armor

### Mid Game
- Eliminate weaker players first
- Control coin spawns
- Coordinate multi-bot attacks

### Late Game (2 players left)
- All-out combat
- Use abilities strategically
- One elimination = instant win!

## Technical Details

### Server-Side
- `gameState` property on Game class
- `winner` property stores winner's player ID
- `checkWinCondition()` method
- Called after tick and player disconnect

### Client-Side
- `renderWaitingScreen()` for pre-game
- `renderWinScreen()` for post-game
- Color-coded winner announcement
- Ordinal placement (1st, 2nd, 3rd)

### Network
- Game state includes `gameState` and `winner`
- Clients receive updates every tick
- Automatic screen switching based on state

## Future Enhancements

Possible improvements:

1. **Victory Conditions**
   - Time limit (most bots wins)
   - Point system (kills, coins)
   - King of the hill (control area)

2. **Post-Game**
   - Detailed statistics
   - Replay system
   - Rematch option
   - Save game results

3. **Spectator Mode**
   - Watch ongoing games
   - See all players' perspectives
   - View game statistics live

4. **Tournaments**
   - Bracket system
   - Multiple rounds
   - Leaderboards

## Summary

✅ **Complete win detection system**
- Game waits for 2 players
- Automatically detects winner
- Beautiful win screen

✅ **Thoroughly tested**
- 24 unit tests passing
- TDD approach followed
- All scenarios covered

✅ **Great UX**
- Clear game states
- Color-coded announcements
- Final standings

The game now has a complete start-to-finish experience! 🎮

---

**Version:** 3.0  
**Status:** ✅ Complete and tested  
**Tests:** 24/24 passing
