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
4. Go to project directory b running below command
   
   ```bash
   cd scalable-notification-system
   ```
6. Run docker compose file (`Docker should present on your system`)
   ```bash
   docker-compose up --build
   ```

