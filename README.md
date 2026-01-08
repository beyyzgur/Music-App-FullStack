# 🎵 Music App – Full Stack Web Application

This project is a **full-stack music platform** developed as part of **CENG 307 – 2025/2026 Term Project**.

The application allows users to explore songs and albums, manage favorites, and enables artists/admins to manage music content through a role-based system.

---

## 🚀 Technologies Used

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- JWT Authentication
- Context API (Auth & Toast system)

### Backend
- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Role-Based Authorization (Admin / Artist / Listener)

---

## 👥 User Roles

The system supports multiple user roles:

### Admin
- Create, update, and delete artists
- Manage all albums and songs

### Artist
- Create and manage own albums and songs
- Access studio panel

### Listener
- Browse songs and albums
- Add and remove favorites

---


## 🖥️ Frontend (Client)

The frontend is built with **React + TypeScript** using **Vite** for fast development and build performance.

### Setup & Run
```bash
cd client
npm install
npm run dev
```

## 🛠️ Backend (Server)
The backend is implemented using NestJS following a modular architecture.
### Setup & Run
```bash
cd server
npm install
npm start run:dev
```
