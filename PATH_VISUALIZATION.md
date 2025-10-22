# Path Visualization & Collision Fixes

## Version 3.1 Updates

### New Feature: Queue Path Visualization

When a bot is selected, the client now displays the queued path on the board, making it easy to see what actions the bot will perform.

#### Visual Indicators

- **Movement Steps**: `·` (dot) - Shows where bot will move
- **Explosion**: `E` - Shows where explosion ability will trigger
- **Shoot**: `S` - Shows where shoot ability will trigger  
- **Shockwave**: `H` - Shows where shockwave ability will trigger

All indicators appear in the player's color.

#### Example

```
Queue commands: D, D, D, Q, D, D
(right, right, right, use shockwave, right, right)

Display:
  @ · · · H · ·
  
Legend:
  @ = Your selected bot (current position)
  · = Future movement positions
  H = Shockwave ability will trigger here
```

#### Benefits

1. **Track Multiple Bots**: See what each bot will do without memorizing
2. **Plan Strategy**: Visualize attack sequences before execution
3. **Avoid Mistakes**: See if you're moving into danger
4. **Coordinate**: Plan multi-bot attacks visually

### Bug Fix: Stationary Bot Collisions

**Problem**: Collisions only occurred when both bots tried to move to the same tile. If one bot was stationary and another moved onto it, no collision happened.

**Fix**: Now detects when a moving bot enters a tile occupied by a stationary bot.

#### Behavior

**Enemy Collision:**
- Moving bot → Stationary enemy bot
- Result: Both take 10 damage, move cancelled
- Same as two bots moving to same spot

**Friendly Collision:**
- Moving bot → Stationary friendly bot  
- Result: No damage, move cancelled
- Prevents accidental friendly fire

#### Examples

**Before Fix:**
```
Bot A at (5,5) - moves right
Bot B at (6,5) - stationary
Result: Bot A passes through, no collision ❌
```

**After Fix:**
```
Bot A at (5,5) - moves right
Bot B at (6,5) - stationary
Result: Collision! Both take 10 damage ✅
```

## Implementation Details

### Queue Path Calculation

```javascript
calculateQueuePath(bot) {
  const path = [];
  let x = bot.x;
  let y = bot.y;
  
  bot.moveQueue.forEach(command => {
    if (command === 'ability') {
      path.push({ x, y, type: 'ability', ability: bot.ability });
    } else {
      // Calculate next position based on command
      switch (command) {
        case 'w': y = Math.max(0, y - 1); break;
        case 's': y = Math.min(height - 1, y + 1); break;
        case 'a': x = Math.max(0, x - 1); break;
        case 'd': x = Math.min(width - 1, x + 1); break;
      }
      path.push({ x, y, type: 'move' });
    }
  });
  
  return path;
}
```

### Collision Detection

```javascript
// Check for stationary bots at target position
const stationaryBots = this.bots.filter(bot => 
  !moveIntents.some(intent => intent.bot.id === bot.id)
);

moveIntents.forEach(intent => {
  const stationaryAtTarget = stationaryBots.find(
    bot => bot.x === intent.newX && bot.y === intent.newY
  );
  
  if (stationaryAtTarget) {
    if (stationaryAtTarget.playerId !== intent.bot.playerId) {
      // Enemy - collision damage
      intent.bot.takeDamage(10);
      stationaryAtTarget.takeDamage(10);
    }
    // Don't move (friendly or enemy)
  } else {
    // Move successful
    intent.bot.x = intent.newX;
    intent.bot.y = intent.newY;
  }
});
```

## Testing

### TDD Approach

**Step 1: Write Tests First** ✅
- Test #25: Moving onto stationary enemy
- Test #26: Moving onto stationary friendly
- Test #27: Queue path in game state
- Test #28: Queue path calculations

**Step 2: Tests Failed** ✅ (as expected)

**Step 3: Implement Features** ✅
- Added calculateQueuePath() method
- Modified collision detection
- Updated client rendering
- Added queuePath to game state

**Step 4: Tests Pass** ✅
- 28/28 tests passing!

### Test Results

```
playtest.js:             28/28 PASSED ✅ (+4 new)
test-path-visualization: All demos PASSED ✅
integration-test.js:     Full scenario PASSED ✅
test.js:                 Original tests PASSED ✅
```

## Usage

### Viewing Queue Path

1. **Select a bot** (press 1-5 or @ appears)
2. **Queue commands** (WASD for moves, Q for ability)
3. **See the path** appear on screen automatically
4. **Execute** by waiting for ticks

### Reading the Path

```
Current position: @
Next 3 moves: · · ·
Then ability: H
Then 2 moves: · ·

On screen: @ · · · H · ·
```

### Path Colors

- Your selected bot's path: Your player color
- Other bots: No path shown (only you see your plan)
- Coins, effects: Original colors

## Game Balance Impact

### Advantages of Path Visualization

1. **Reduces Mistakes**: See errors before they happen
2. **Better Planning**: Visualize complex sequences
3. **Learning**: New players understand queuing better
4. **Spectating**: Easier to follow action (for future spectator mode)

### Collision Fix Impact

1. **More Realistic**: Can't phase through enemies
2. **Strategic Blocking**: Can use bots as obstacles
3. **Defensive Play**: Stationary positions matter
4. **Fair Damage**: All collisions deal damage

## Edge Cases Handled

### Path Visualization

1. **Off-screen moves**: Path stops at board edges
2. **Long queues**: All positions shown
3. **Ability at start**: Shows at current position
4. **Empty queue**: No path shown

### Collisions

1. **Multiple stationary bots**: Each checked separately
2. **Friendly fire**: Prevented, move cancelled
3. **Dead bots**: Removed before collision check
4. **Simultaneous moves**: Original collision logic preserved

## Examples in Gameplay

### Example 1: Attack Sequence

```
Commands: W, W, Q, S, S
Display:  @ · · E · ·

Plan: Move up 2, explode, move down 2
Visual: See exactly where explosion happens
```

### Example 2: Flanking Maneuver

```
Bot 1: D, D, D (right 3)
Bot 2: A, A, A (left 3)
Display shows both paths
Result: Coordinate pincer attack
```

### Example 3: Avoiding Collision

```
See enemy bot in path: · · · [Enemy] · ·
Change plan before executing
Result: Avoid unnecessary damage
```

## Future Enhancements

Possible improvements:
- Show paths for all your bots (not just selected)
- Different colors for different bots
- Show predicted enemy paths (if visible)
- Path preview when typing commands
- Path conflict warnings

---

**Status**: ✅ Complete and Tested  
**Version**: 3.1  
**Tests**: 28/28 passing  
**TDD**: Followed throughout  
**Compatibility**: Full backward compatibility
