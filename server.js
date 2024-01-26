const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

const rooms = new Map();

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('message: ', message.toString())
    try {
      const data = JSON.parse(message);

      if (data.action === 'subscribe') {
        const roomId = data.channel;
        joinRoom(ws, roomId);
      } else if (data.action === 'sendMessage') {
        const roomId = data.channel ;
        const content = data.content;
        sendMessage(ws, roomId, content);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    leaveRooms(ws);
  });
});

function joinRoom(ws, roomId) {
  // Create the room if it doesn't exist
  if (!rooms.has(roomId)) {
    console.log('subscribe to channel_id: ', roomId)
    rooms.set(roomId, new Set());
  }

  // Add the client to the room
  rooms.get(roomId).add(ws);
}

function sendMessage(ws, roomId, content) {
  // Broadcast the message to all clients in the room
  contentText = JSON.stringify(content)
  if (rooms.has(roomId)) {
    rooms.get(roomId).forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(contentText);
      }
    });
  }
}

function leaveRooms(ws) {
  // Remove the client from all rooms
  rooms.forEach((clients, roomId) => {
    clients.delete(ws);
    if (clients.size === 0) {
      rooms.delete(roomId);
    }
  });
}

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(3000, () => {
  console.log('WebSocket server running on port 3000');
});