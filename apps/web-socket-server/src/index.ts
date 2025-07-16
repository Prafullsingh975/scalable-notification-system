import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { createClient } from "redis";

const redisUrl = process.env.REDIS_CLIENT || "redis://localhost:6379";
const pubChannel = "notification-updates";
const port = parseInt(process.env.WS_PORT || "4000");

const server = createServer();
const wss = new WebSocketServer({ server });

// Redis subscriber
const subscriber = createClient({ url: redisUrl });
subscriber
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Redis connection failed:", err);
    process.exit(1);
  });

// Maps for users and rooms
const userSockets = new Map<string, WebSocket>();
const roomSockets = new Map<string, Set<WebSocket>>();

// Initial handshake (user sends their ID + optional room)
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.once("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      const userId = data.userId;
      const roomId = data.roomId;

      console.log("SOCKET initial msg", data);

      if (!userId) {
        ws.close(1008, "Missing userId");
        return;
      }

      userSockets.set(userId, ws);
      console.log(`Registered user: ${userId}`);

      // Add to room if provided
      if (roomId) {
        if (!roomSockets.has(roomId)) roomSockets.set(roomId, new Set());
        roomSockets.get(roomId)!.add(ws);
        console.log(`Added user ${userId} to room ${roomId}`);
      }

      ws.on("close", () => {
        userSockets.delete(userId);
        if (roomId) {
          roomSockets.get(roomId)?.delete(ws);
        }
        console.log(`User ${userId} disconnected`);
      });
    } catch (err) {
      console.error("Invalid handshake:", err);
      ws.close(1008, "Invalid handshake");
    }
  });
});

// Redis subscription handler
const sub = async () => {
  await subscriber.subscribe(pubChannel, (message) => {
    try {
      const payload = JSON.parse(message);

      const type = payload.type;
      const target = payload.target;
      const data = payload.message;

      if (type === "broadcast") {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });
      } else if (type === "private" && target) {
        const ws = userSockets.get(target);
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      } else if (type === "room" && target) {
        const room = roomSockets.get(target);
        if (room) {
          room.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(data);
            }
          });
        }
      }
    } catch (err) {
      console.error("PubSub message error:", err);
    }
  });
};

sub();

server.listen(port, () => {
  console.log(`WebSocket server running at ws://localhost:${port}`);
});
