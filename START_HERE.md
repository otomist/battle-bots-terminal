# 🤖 BATTLE BOTS - START HERE! ⚔️

```
 ____        _   _   _        ____        _       
|  _ \  __ _| |_| |_| | ___  | __ )  ___ | |_ ___ 
| |_) |/ _` | __| __| |/ _ \ |  _ \ / _ \| __/ __|
|  _ <| (_| | |_| |_| |  __/ | |_) | (_) | |_\__ \
|_| \_\\__,_|\__|\__|_|\___| |____/ \___/ \__|___/
                                                   
         Terminal Multiplayer Combat Game
```

## 🚀 Quick Start (30 seconds to play!)

### Step 1: Start the Server
Open a terminal and run:
```bash
node server.js
```
You should see: `Battle Bots server running on port 3000`

### Step 2: Join as Player 1
Open a NEW terminal and run:
```bash
node client.js
```
You'll see the game arena appear!

### Step 3: Join as Player 2 (Optional)
Open ANOTHER terminal and run:
```bash
node client.js
```
Now you have 2 players battling!

### Step 4: Play!
Use **WASD** to move, collect **$** coins, press **P** to buy stuff!

---

## 🎮 What is Battle Bots?

A real-time multiplayer game where you:
- Command a team of battle bots
- Collect coins to buy upgrades
- Battle other players
- Last team standing wins!

---

## 📖 Documentation Guide

### For Players
1. **START_HERE.md** ← You are here!
2. **QUICKSTART.md** - Controls and basics
3. **README.md** - Full game manual
4. **GAMEPLAY_EXAMPLE.txt** - See a full match

### For Developers
1. **GAME_DESIGN.md** - Complete mechanics
2. **PROJECT_SUMMARY.md** - Technical overview
3. **STRUCTURE.txt** - Code organization
4. **CHANGELOG.md** - Version history

### Try the Demo
```bash
node demo.js
```
Shows what the game looks like!

---

## 🎯 Basic Controls

| Key | Action |
|-----|--------|
| W/A/S/D | Move bot |
| Q | Use ability |
| P | Buy menu |
| R | Clear queue |
| 1-5 | Select bot |

---

## 💡 Quick Strategy

1. **Collect coins** early ($)
2. **Buy more bots** (P then B)
3. **Buy abilities** (P then Q/F/H)
4. **Avoid collisions** (10 damage!)
5. **Eliminate enemies!**

---

## 🎨 What You'll See

```
┌────────────────────────────────────────┐
│                                        │
│     @         $           ▓            │
│                                        │
│        2                               │
│                     $                  │
└────────────────────────────────────────┘

Player: █ | Money: $25 | Bots: 2/5
```

- **@** = Your selected bot
- **1-5** = Your other bots
- **▓** = Enemy bots
- **$** = Coins (worth $10)

---

## 📦 What's Included?

### Game Files
- `server.js` - Game server
- `game.js` - Game logic
- `client.js` - Player client

### Documentation (8 files!)
- Complete guides for players & developers
- Examples, tutorials, design docs

### Testing
- `test.js` - Unit tests
- `demo.js` - Visual demo

### No Dependencies!
Pure Node.js - no npm install needed!

---

## 🏆 Features

✅ Up to 6 players
✅ Control up to 5 bots each
✅ 3 unique abilities
✅ Economy system
✅ Real-time combat
✅ Beautiful terminal graphics
✅ Complete documentation

---

## 🎪 Try It Now!

### Solo (See how it works)
```bash
node demo.js
```

### Local Multiplayer
```bash
# Terminal 1
node server.js

# Terminal 2
node client.js

# Terminal 3
node client.js
```

### Network Play
```bash
# Host computer
node server.js

# Any computer on network
node client.js <host-ip>
```

---

## 🆘 Help!

### Server won't start?
- Make sure port 3000 is free
- Check if Node.js is installed: `node --version`

### Can't see colors?
- Use a modern terminal (iTerm2, Windows Terminal, etc.)

### Controls not working?
- Make sure terminal window is focused
- Try a different terminal emulator

### Still stuck?
Read **README.md** for detailed help!

---

## 📊 Game Info

- **Players**: 1-6
- **Arena**: 40×20 tiles
- **Tick Rate**: 2 seconds
- **Bot Limit**: 5 per player
- **Starting HP**: 10
- **Collision Damage**: 10
- **Ability Damage**: 5

---

## 🎓 Learn More

### Want to understand the code?
→ Read **PROJECT_SUMMARY.md**

### Want to know all the mechanics?
→ Read **GAME_DESIGN.md**

### Want to see a full game example?
→ Read **GAMEPLAY_EXAMPLE.txt**

### Want a quick reference?
→ Read **QUICKSTART.md**

---

## 🔥 Pro Tips

💡 **Buy bots early** - Numbers win!
💡 **Spread out** - Control the map!
💡 **Queue moves** - Plan ahead!
💡 **Use abilities** - Safe damage!
💡 **Upgrade armor** - Survive collisions!

---

## ✨ Why This Game Rocks

1. **No Installation** - Just run it!
2. **Pure Node.js** - No dependencies!
3. **Real Multiplayer** - Not just AI!
4. **Strategic Depth** - Not just button mashing!
5. **Beautiful Terminal** - Retro cool!
6. **Well Documented** - 8 doc files!
7. **Complete** - All features working!

---

## 🎯 Your Mission

**Eliminate all enemy bots and become the champion!**

Ready? Let's battle! 🤖⚔️

```bash
node server.js  # Start here!
```

---

## 📝 Quick File Reference

| File | Purpose |
|------|---------|
| **server.js** | Start the game server |
| **client.js** | Join as a player |
| **game.js** | Core game logic |
| **demo.js** | See what it looks like |
| **test.js** | Verify everything works |
| **README.md** | Full documentation |
| **QUICKSTART.md** | Fast start guide |
| **START_HERE.md** | This file! |

---

## 🌟 Have Fun!

This game was built with ❤️ using plain Node.js.

No frameworks, no libraries, just pure code.

Enjoy the battles and may the best commander win! 🏆

---

**Version**: 1.0.0  
**Status**: Ready to Play ✅  
**License**: MIT

```
     ⚔️  Good luck, Commander!  ⚔️
```
