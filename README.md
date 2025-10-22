# Battle Bots - Terminal Multiplayer Game

A real-time multiplayer terminal game where players control battle bots in an arena. Be the last player standing!

## Features

- **Multiplayer**: Up to 6 players can join
- **Real-time Combat**: Commands execute every 2 seconds
- **Multiple Bots**: Control up to 5 bots per player
- **Economy System**: Collect coins to buy upgrades and abilities
- **Abilities**: Explosion, Shoot, and Shockwave attacks
- **Collision System**: Bots colliding deal damage to each other
- **No Friendly Fire**: Your bots won't hurt each other

## How to Play

### Starting the Game

1. **Start the server:**
   ```bash
   node server.js
   ```

2. **Connect clients (in separate terminals):**
   ```bash
   node client.js
   ```
   
   Or connect to a remote server:
   ```bash
   node client.js <hostname>
   ```

### Controls

- **WASD** - Queue movement commands for selected bot
  - W: Move up
  - A: Move left  
  - S: Move down
  - D: Move right
- **Q** - Use selected bot's ability
- **R** - Clear selected bot's movement queue
- **P** - Open/close buy menu
- **1-5** - Select bot by number
- **TAB** - Cycle through your bots
- **Ctrl+C** - Quit

### Game Mechanics

#### Bots
- Each player starts with 1 bot
- Bots start with 10 HP
- Maximum 5 bots per player
- Your bots are shown as numbers (1-5), with selected bot as @
- Enemy bots are shown as their team symbol

#### Movement
- Queue up movement commands with WASD
- Commands execute every 2 seconds
- If multiple enemy bots move to the same tile, they collide and each takes 10 damage
- No friendly fire from collisions

#### Economy
- $ symbols spawn randomly on the map
- Each coin is worth $10
- Use money to buy bots, abilities, and upgrades

#### Abilities
Each bot can equip ONE ability:

1. **Explosion** (Q in menu, $10)
   - Damages all 8 adjacent tiles
   - 5 damage per tile
   - Visual: * symbols

2. **Shoot** (F in menu, $10)
   - Fires 3 tiles in the last moved direction
   - 5 damage to first target hit
   - Visual: + symbols

3. **Shockwave** (H in menu, $20)
   - Creates an H-shaped shockwave
   - 2 tiles horizontal each side, 2 tiles up from ends
   - 5 damage per tile
   - Visual: # symbols

### Buy Menu (Press P)

- **R** - Repair 10 HP ................. $5
- **A** - Add 5 Armor (max HP) ......... $5
- **Q** - Explosion Ability ............ $10
- **F** - Shoot Ability ................ $10
- **H** - Shockwave Ability ............ $20
- **B** - Buy New Bot .................. $10

### Strategy Tips

1. **Queue wisely**: Plan your moves since they execute every 2 seconds
2. **Collect coins**: You need money for upgrades and more bots
3. **Spread out**: Multiple bots give you map control
4. **Avoid collisions**: They deal heavy damage (10 HP = instant death for basic bots)
5. **Use abilities**: They can turn the tide of battle
6. **Upgrade armor**: More HP means surviving collisions

### Winning

- Eliminate all enemy bots to win
- Last player with bots standing wins!

## Technical Details

- Built with plain Node.js (no external dependencies)
- Server runs on port 3000
- Game tick rate: 2 seconds
- Coin spawn rate: 5 seconds
- Default arena size: 40x20

## File Structure

```
battle-bots-terminal/
├── server.js    - Game server
├── game.js      - Game logic and state management
├── client.js    - Terminal client with rendering
└── README.md    - This file
```

## Requirements

- Node.js (v12 or higher recommended)
- Terminal with ANSI color support
- Multiple terminals for multiplayer

Enjoy the battle! 🤖⚔️
