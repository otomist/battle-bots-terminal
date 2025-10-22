# Quick Start Guide

## Installation

No installation needed! Just Node.js (v12+).

## Running the Game

### Option 1: Local Multiplayer (Same Computer)

1. Open Terminal 1 - Start the server:
   ```bash
   node server.js
   ```

2. Open Terminal 2 - Join as Player 1:
   ```bash
   node client.js
   ```

3. Open Terminal 3 - Join as Player 2:
   ```bash
   node client.js
   ```

4. Play! Up to 6 players can join.

### Option 2: Network Multiplayer

1. On the host computer:
   ```bash
   node server.js
   ```

2. On any computer on the network:
   ```bash
   node client.js <host-ip-address>
   ```

## First 30 Seconds

1. **You spawn** with 1 bot marked as `@` in your color
2. **Move around** with WASD keys to collect `$` coins
3. **Each coin** = $10
4. **Press P** to open the buy menu
5. **Press B** to buy more bots ($15 each, max 5)
6. **Press Q/F/H** to buy abilities
7. **Find enemies** and attack!

## Combat Basics

- Commands execute every 2 seconds (watch the game tick)
- Queue multiple moves with WASD
- If you collide with an enemy = both take 10 damage
- Bots have 10 HP by default = 1 collision = death!
- Use abilities (Q key) to damage from range

## Win Condition

**Eliminate all enemy bots to win!**

## Pro Tips

1. **First priority**: Collect coins fast
2. **Buy more bots early**: Numbers win
3. **Spread out**: Control more territory
4. **Upgrade armor**: Survive collisions
5. **Queue smartly**: Predict enemy moves

## Troubleshooting

**Can't connect?**
- Make sure server is running first
- Check firewall settings for network play
- Default port is 3000

**Display issues?**
- Use a modern terminal with ANSI color support
- Try iTerm2 (Mac), Windows Terminal (Windows), or any modern Linux terminal

**Keyboard not responding?**
- Make sure the terminal window is focused
- On some systems, raw mode may not work perfectly

## Have Fun!

Battle it out and may the best bot commander win! 🤖⚔️
