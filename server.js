const net = require('net');
const { Game } = require('./game');

const PORT = 3000;
const game = new Game();

class Server {
  constructor() {
    this.clients = new Map();
    this.server = net.createServer(this.handleConnection.bind(this));
  }

  handleConnection(socket) {
    console.log('New client connected');
    
    const playerId = this.generatePlayerId();
    const player = game.addPlayer(playerId, socket);
    
    if (!player) {
      socket.write(JSON.stringify({ type: 'error', message: 'Game is full' }) + '\n');
      socket.end();
      return;
    }

    this.clients.set(playerId, socket);
    
    socket.write(JSON.stringify({ 
      type: 'connected', 
      playerId,
      color: player.color,
      char: player.char
    }) + '\n');

    socket.on('data', (data) => {
      try {
        const commands = data.toString().trim().split('\n');
        commands.forEach(cmd => {
          if (cmd) {
            const message = JSON.parse(cmd);
            this.handleMessage(playerId, message);
          }
        });
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    });

    socket.on('close', () => {
      console.log('Client disconnected:', playerId);
      game.removePlayer(playerId);
      this.clients.delete(playerId);
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
    });

    this.broadcastGameState();
  }

  handleMessage(playerId, message) {
    const player = game.getPlayer(playerId);
    if (!player) return;

    switch (message.type) {
      case 'command':
        game.handlePlayerCommand(playerId, message.command);
        break;
      case 'buy':
        game.handleBuy(playerId, message.item);
        break;
    }
    
    this.broadcastGameState();
  }

  broadcastGameState() {
    this.clients.forEach((socket, playerId) => {
      const gameState = game.getGameStateForPlayer(playerId);
      try {
        socket.write(JSON.stringify({ type: 'gameState', state: gameState }) + '\n');
      } catch (err) {
        console.error('Error broadcasting to player:', playerId, err);
      }
    });
  }

  generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
  }

  start() {
    this.server.listen(PORT, () => {
      console.log(`Battle Bots server running on port ${PORT}`);
    });

    // Game tick every 2 seconds
    setInterval(() => {
      game.tick();
      this.broadcastGameState();
    }, 2000/4);

    // Spawn coins periodically
    setInterval(() => {
      game.spawnCoin();
      this.broadcastGameState();
    }, 5000);
  }
}

const server = new Server();
server.start();
