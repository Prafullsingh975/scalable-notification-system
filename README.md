# 📡 Scalable Notification System

A real-time, microservices-based notification delivery system built using **Redis**, **WebSocket**, **TypeScript**, and **Docker Compose**.

This system allows you to push messages to connected clients reliably via a queue-worker-pub/sub mechanism, all containerized and ready for scalable deployment.

---

## 🧩 Features

- 🧱 Microservices architecture (`server`, `worker`, `web-socket-server`)
- 📥 Redis-based message queue using `brPop`
- 📡 Real-time push via WebSockets
- 🧠 Room-based broadcasting (target specific users or rooms)
- 🐳 Dockerized services with hot-reload for local development
- ⚙️ Centralized `.env` file for environment variables

---

## 🧭 Architecture

> 📌 Flow: `Client → Server → Redis Queue → Worker → Redis Pub/Sub → WebSocket Server → Client`

![Architecture](./docs/system-architecture.png)

---

## ⚙️ Setup and Run

