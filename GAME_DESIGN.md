# Battle Bots - Game Design Document

## Overview
Battle Bots is a multiplayer terminal-based strategy game where players command a team of battle bots to eliminate enemy bots and be the last team standing.

## Core Mechanics

### Game Loop
- **Tick Rate**: Commands execute every 2 seconds
- **Async Commands**: Players queue commands between ticks
- **Simultaneous Execution**: All queued commands execute on tick

### Player Limits
- Maximum 6 players per server
- Each player can have 1-5 bots
- Each player starts with 1 bot

### Bot Statistics
- **Starting HP**: 10
- **Starting Max HP**: 10
- **Movement Speed**: 1 tile per tick
- **Ability Slots**: 1 per bot
- **Command Queue**: Unlimited length

### Arena
- **Size**: 40 tiles wide × 20 tiles high
- **Boundaries**: Solid walls (no wrapping)
- **Spawn**: Random valid position when joining

## Combat System

### Collision Damage
- When enemy bots move to same tile: **10 damage** to each
- Friendly bots: No damage (cancel move instead)
- Since default HP is 10, one collision = death
- Collision cancels the move for all involved bots

### Abilities

#### 1. Explosion (Cost: $10)
- **Pattern**: All 8 adjacent tiles
- **Damage**: 5 per tile
- **Activation**: Q key
- **Visual**: * symbols in player color
- **Range**: 1 tile radius

#### 2. Shoot (Cost: $10)
- **Pattern**: 3 tiles in last movement direction
- **Damage**: 5 to first target hit
- **Activation**: Q key
- **Visual**: + symbols in player color
- **Penetration**: Stops at first hit
- **Default Direction**: Up (if no movement yet)

#### 3. Shockwave (Cost: $20)
- **Pattern**: H-shape
  - 2 tiles left + 2 tiles right (horizontal bar)
  - 2 tiles up from each end (vertical bars)
- **Damage**: 5 per tile
- **Activation**: Q key
- **Visual**: # symbols in player color
- **Coverage**: 8 tiles total

### Damage Rules
- No friendly fire from abilities
- Abilities trigger instantly (not queued)
- Effects shown for one tick
- Bot dies at HP ≤ 0
- Dead bots removed immediately

## Economy System

### Coins
- **Spawn Rate**: Every 5 seconds (if < 10 coins exist)
- **Value**: $10 per coin
- **Collection**: Automatic on movement to coin tile
- **Visual**: $ symbol in yellow

### Shop Items

| Item | Hotkey | Cost | Description |
|------|--------|------|-------------|
| Repair | R | $5 | Heal 10 HP (capped at max HP) |
| Armor | A | $5 | Add 5 to max HP and current HP |
| Explosion | Q | $10 | Equip explosion ability |
| Shoot | F | $10 | Equip shoot ability |
| Shockwave | H | $20 | Equip shockwave ability |
| New Bot | B | $10 | Spawn additional bot (max 5 total) |

### Buying Rules
- Can only buy for selected bot
- One ability per bot (cannot replace)
- Buying closes menu automatically
- Can't buy bot if at 5 bot limit

## Controls

### Movement
- **W**: Queue move up
- **A**: Queue move left
- **S**: Queue move down
- **D**: Queue move right
- **R**: Clear movement queue

### Bot Management
- **1-5**: Select bot by number
- **TAB**: Cycle to next bot
- **@**: Visual indicator for selected bot

### Actions
- **Q**: Use selected bot's ability
- **P**: Toggle buy menu

### Menu Navigation
- **P**: Close buy menu
- **R/A/Q/F/H/B**: Buy items (when menu open)

## Visual System

### Player Representation
- Each player assigned unique color + character
- Colors: red, blue, green, yellow, magenta, cyan
- Characters: █, ▓, ▒, ░, ■, ●

### Own View
- Selected bot: **@**
- Other bots: **1**, **2**, **3**, **4**, **5**
- All in player's assigned color

### Enemy View
- All enemy bots show as that player's character
- In that player's color
- Cannot distinguish individual enemy bots

### Other Visuals
- Coins: **$** (yellow)
- Explosion: **\*** (player color)
- Shoot: **+** (player color)
- Shockwave: **#** (player color)
- Empty space: (gray dot)

## User Interface

### Main Screen
```
┌────────────────────────────────────────┐
│                 Arena                  │
│            (40 × 20 tiles)             │
└────────────────────────────────────────┘

Player: █ | Money: $45 | Bots: 2/5
Selected Bot: @ | HP: 10/15 | Ability: explosion | Queue: 3

Controls: [...]

Players:
  █ (You) - 2 bots
  ▓ - 3 bots
```

### Buy Menu
```
╔═══════════════════════════════════════╗
║           BUY MENU                    ║
╠═══════════════════════════════════════╣
║ R - Repair 10 HP ............ $5      ║
║ A - Add 5 Armor ............. $5      ║
║ Q - Explosion Ability ....... $10     ║
║ F - Shoot Ability ........... $10     ║
║ H - Shockwave Ability ....... $20     ║
║ B - Buy New Bot ............. $10     ║
╠═══════════════════════════════════════╣
║ P - Close Menu                        ║
╚═══════════════════════════════════════╝
```

## Network Protocol

### Server → Client Messages

#### Connected
```json
{
  "type": "connected",
  "playerId": "player_abc123",
  "color": "red",
  "char": "█"
}
```

#### Game State
```json
{
  "type": "gameState",
  "state": {
    "width": 40,
    "height": 20,
    "player": { ... },
    "bots": [ ... ],
    "coins": [ ... ],
    "effects": [ ... ],
    "players": [ ... ]
  }
}
```

#### Error
```json
{
  "type": "error",
  "message": "Game is full"
}
```

### Client → Server Messages

#### Command
```json
{
  "type": "command",
  "command": "w"
}
```

#### Buy
```json
{
  "type": "buy",
  "item": "q"
}
```

## Strategy Guide

### Early Game (0-60 seconds)
1. **Priority**: Collect coins
2. Buy second bot at $10
3. Spread out to cover more ground
4. Avoid enemy contact until stronger

### Mid Game (60-180 seconds)
1. **Economy**: Maintain 3-4 bots
2. Buy abilities for main bots
3. Upgrade armor on key bots
4. Start pressuring enemies

### Late Game (180+ seconds)
1. **Aggression**: Hunt remaining enemies
2. Use abilities to zone enemies
3. Coordinate multi-bot attacks
4. Control coin spawns

### Advanced Tactics
- **Pincer Movement**: Attack from multiple angles
- **Bait and Punish**: Use weak bot to lure, kill with ability
- **Zone Control**: Park bots on coin spawn areas
- **Queue Prediction**: Guess enemy moves, intercept
- **Armor Priority**: One tanky bot (20+ HP) can win fights
- **Economic Denial**: Collect coins before enemies

## Winning Strategies

### Aggressive Play
- Rush 5 bots early
- Swarm enemies with numbers
- Accept trades (your bot for theirs)
- Fast-paced, high-risk

### Economic Play
- Farm coins safely
- Max out abilities
- Upgrade armor heavily
- Slow-paced, low-risk

### Balanced Play
- 3-4 bots with abilities
- Mix of armor and damage
- Flexible positioning
- Adapts to situation

## Technical Architecture

### Server (server.js)
- TCP socket server on port 3000
- Manages connections
- Broadcasts game state
- Handles player disconnect

### Game Logic (game.js)
- Game state management
- Collision detection
- Ability system
- Economy system

### Client (client.js)
- TCP socket client
- ANSI terminal rendering
- Keyboard input handling
- Game state visualization

## Future Enhancement Ideas

### Gameplay
- Power-ups (speed, shield, etc.)
- Terrain types (walls, water, lava)
- Team mode (2v2, 3v3)
- Ranked matchmaking
- Bot upgrades (speed, damage)

### Technical
- Replay system
- Spectator mode
- Web-based client
- AI bots
- Tournament bracket

### Quality of Life
- Minimap
- Damage numbers
- Kill feed
- Statistics tracking
- Custom bot names

## Balancing Notes

### Current Balance
- **Collision damage**: Very high (instant kill)
  - Encourages careful movement
  - Rewards positioning
  
- **Ability costs**: Moderate
  - Explosion/Shoot: Accessible early
  - Shockwave: Premium option
  
- **Bot cost**: $10 (1 coin)
  - Not too expensive
  - Not too cheap
  
- **Armor cost**: Cheap ($5)
  - Encourages tankiness
  - Makes bots survive collisions

### Potential Adjustments
- Reduce collision damage to 8 (survive one hit)
- Increase coin value to $15
- Add cooldown to abilities
- Make shockwave cost $15 (more accessible)

## Credits
Built with vanilla Node.js - no external dependencies!
