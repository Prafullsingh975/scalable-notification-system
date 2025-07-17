# 📡 Scalable Notification System

A real-time, microservices-based notification delivery system built using **Redis**, **WebSocket**, **TypeScript**, and **Docker Compose**.

This system allows you to push messages to connected clients reliably via a queue-worker-pub/sub mechanism, all containerized and ready for scalable deployment.

---

## 🧩 Features

- 🧱 Microservices architecture (`server`, `worker`, `web-socket-server`)
- 📥 Redis-based message queue using `brPop`
- 📡 Real-time push via WebSockets (`implement pub/sub`)
- 🧠 Room-based broadcasting (target specific users or rooms or all)
- 🐳 Dockerized services with hot-reload for local development
- ⚙️ Centralized `.env` file for environment variables

---

## 🧭 Architecture

> 📌 Flow: `Client → Server → Redis Queue → Worker → Redis Pub/Sub → WebSocket Server → Client`

![Architecture](./docs/system-architecture.png)

---

## ⚙️ Setup and Run

1. Clone the repo
2. Create `.env` file at root and copy and past below code.

   ```env
   PORT=8080
   WS_PORT=8081
   REDIS_CLIENT=redis://default:password@redis:6379
   ```

3. Go to project directory b running below command

   ```bash
   cd scalable-notification-system
   ```

4. Run docker compose file (`Docker should present on your system`)
   ```bash
   docker-compose up --build
   ```

---

## 🧑‍💻 Testing

1.  we have only one end point in the application. i.e.

```bash
POST
http://localhost:8080/notify
body:{
 "userId":2,
 "message":"Private message for userId 1",
 "email":"abc@gmail.com",
 "target":1,
 "type":"private"
}
# or
body:{
 "userId":1,
 "message":"broadcast message for roomId 1",
 "email":"abc@gmail.com",
 "target":1,
 "type":"room"
}
# or
body:{
 "userId":1,
 "message":"broadcast message for all",
 "email":"abc@gmail.com",
 "type":"broadcast"
}
```

2.  In above body payload

```bash
userId => Id of user
message => Notification message
email => Email # not required at all
target => Is a id of user or room
type => Message type # you can understand types it is explained payload message.
```

3. Before hitting endpoint `http://localhost:8080/notify` we have to stablish web socket connection. For that we are using `postman` because we don't have client (Frontend).

4. For stablish socket connection we have to create a `websocket request` from postman we have to use below url and `connect`.

   ```bash
   ws://localhost:8081
   ```

5. Once the connection is stablish you have to send a json message to sever. message includes your `userId` and `roomId`. example:

   ```bash
   {
    "userId":1,
    "room":1 # this is optional needed in the case of room message.
   }
   ```

6. Once the connection and message is sent to web socket server. We are good to go. We can hit `POST http://localhost:8080/notify` endpoint with suitable payload.

7. Check the message response on web socket connection of postman.

---

## 🐞 Issues/ Upcoming Features

- Delivery Acknowledgment from `queue` and `pub/sub`.
- Client (Frontend).

  **============================ Open for suggestions ============================**
