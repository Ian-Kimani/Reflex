<div align="center">
  <h1>🚀 Reflex Logistics Platform</h1>
  <p><strong>A Next-Generation Real-Time Delivery & Dispatch System</strong></p>
</div>

---

## 🌟 The Vision

Traditional delivery apps are clunky, disconnected, and boring. **Reflex** changes the game. 

We set out to build a fully integrated, real-time logistics ecosystem that connects retailers, dispatchers, and riders into one seamless flow. But we didn't stop at just moving packages from Point A to Point B—we wanted to make the experience genuinely engaging. That's why we engineered a beautifully responsive, glassmorphism-inspired interface and integrated a core **Gamification Engine** that actually rewards riders for their hard work.

This isn't just a delivery app; it's a premium logistics experience.

---

## 🎯 The Three Core Experiences

Reflex operates through three distinct, beautifully crafted dashboards that synchronize flawlessly:

### 🏬 1. The Retailer (Request Generation)
The starting point of the ecosystem. Retailers experience a frictionless, premium form to log customer details, delivery addresses, and item descriptions. With a single click of "Dispatch", the package enters the Reflex network instantly—no page reloads required.

### 🗺️ 2. The Dispatcher (Command & Control)
Designed for maximum efficiency, the Dispatcher view is a powerful Kanban-style command center. Dispatchers get a real-time, birds-eye view of every package in the pipeline. They can monitor the exact status of an order (`Open` → `Assigned` → `Picked Up` → `Delivered`) and instantly assign available riders to new requests to keep the logistics flowing perfectly.

### 🏍️ 3. The Rider (Action & Rewards)
The Rider dashboard is built for the heroes on the ground. Riders receive their assigned deliveries instantly. They can mark items as picked up, and upon arrival, collect a digital **Proof of Delivery** signature from the customer to close out the job. 

#### 🏆 Gamification & The Rewards Engine
We believe in motivating our fleet. Reflex features a built-in gamification system designed to drive engagement:
- **Instant Gratification:** Every successful delivery instantly awards the rider **+50 Points**.
- **Real-Time Tracking:** A massive, glowing rewards counter tracks their accumulated points, turning a standard workday into a highly rewarding, game-like experience. 
- **Premium UI:** The entire rider experience is wrapped in a stunning dark-mode aesthetic to make earning points feel incredibly satisfying.

---

## 🏗️ Architecture & Technology Stack

Reflex is engineered as a modern, high-performance **Monorepo**, strictly separating concerns while ensuring lightning-fast communication.

- **Frontend (`/frontend`)**: Built with **React** & **Vite**. Styled with custom, pure CSS glassmorphism for a fluid, highly-responsive aesthetic across all devices.
- **Backend (`/backend`)**: Powered by **NestJS** and **TypeScript** for robust, enterprise-grade business logic.
- **Database**: **PostgreSQL** managed via **Prisma ORM** (hosted on Supabase), ensuring strict relational data integrity.

---

## 🚀 Running Reflex Locally

Want to experience Reflex yourself? Here is how to spin up the entire ecosystem on your local machine.

### 1. Initialize the Backend
Open your terminal and navigate to the backend:
```bash
cd backend
npm install
```
Create a `.env` file inside the `backend` folder and add your database connection:
```env
DATABASE_URL="postgres://your-database-url-here"
```
Sync the database and start the server:
```bash
npx prisma db push
npm run start:dev
```

### 2. Initialize the Frontend
Open a **new terminal window** and navigate to the frontend:
```bash
cd frontend
npm install
npm run dev
```

> **🎉 You're Live!** Open the localhost link provided by Vite in your browser. Try opening multiple windows to see the flawless real-time synchronization between the Retailer, Dispatcher, and Rider dashboards!
