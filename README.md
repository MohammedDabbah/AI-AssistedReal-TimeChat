# Real-Time Chat Backend with AI Summaries

A production-oriented backend for a real-time chat application, designed with a strong focus on **security, scalability, and clean architecture**.

The system supports real-time messaging, room-based communication, AI-generated summaries for late-joining users, and a robust authentication flow using modern backend best practices.

---

## 🚀 Features

### 🔐 Authentication & Security
- JWT access tokens with refresh token rotation
- Refresh tokens stored in **MongoDB** with TTL-based automatic cleanup
- IP-based login rate limiting using **Redis**
- Message spam protection
- Authorization enforced at the **service layer**

### 💬 Real-Time Communication
- Real-time messaging using **Socket.IO**
- Room-based messaging and presence tracking
- Authenticated WebSocket connections
- Designed to scale across multiple Node.js instances

### ⚙️ Scalability & Performance
- **PostgreSQL (Prisma)** as the source of truth for users, rooms, and messages
- **MongoDB** for session and token storage
- **Redis** for WebSocket presence and rate limiting
- Cursor-based pagination for chat messages
- Proper database indexing for chat workloads

### 🤖 AI-Powered Features
- AI-generated summaries for late-joining users
- OpenAI API integration via Axios
- Redis caching with invalidation to control cost and latency
- Summaries generated from recent conversation context

---

## 🧠 Architecture Overview

- **Controllers**: Thin HTTP layer (request/response only)
- **Services**: Business logic, authorization, Redis, AI, and database access
- **PostgreSQL**: Core relational data (users, rooms, messages)
- **MongoDB**: Token and session storage (TTL-based)
- **Redis**: Real-time presence, rate limiting, caching
- **Socket.IO**: Real-time events and room communication

---

## 🛠 Tech Stack

- **Node.js**
- **TypeScript**
- **Express**
- **Prisma ORM**
- **PostgreSQL**
- **MongoDB**
- **Redis**
- **Socket.IO**
- **OpenAI API**
- **Axios**

---

## 📡 API Highlights

```http
POST   /api/auth/login
POST   /api/auth/register

POST   /api/rooms
GET    /api/rooms
GET    /api/rooms/:id
DELETE /api/rooms/:id

GET    /api/rooms/:id/messages
POST   /api/rooms/:id/messages

GET    /api/rooms/:id/summary

POST   /api/rooms/:id/join
DELETE /api/rooms/:id/leave
GET    /api/rooms/:id/users
