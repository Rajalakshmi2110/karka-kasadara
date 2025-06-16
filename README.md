# 📚 Karka Kasadara - Virtual Study Platform
## Overview

**Karka Kasadara** is a full-stack web application that functions as a virtual study platform designed for students and tutors. It supports interactive learning via real-time chat, document sharing, study rooms, Pomodoro timers, alarms, and even video calls — making it an ideal online tutoring and productivity environment.

---

## 🔧 Quick Start Guide

### ✅ Prerequisites

Make sure the following are installed:

- Node.js (with npm)
- MongoDB (local or cloud)
- (Optional) Socket.io

---

### 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Rajalakshmi2110/karka-kasadara.git

2. **Navigate to the project directory**:
cd karka-kasadara

3. **Install dependencies**:
npm install

4. **Start the application**:
node app.js

5. **Open in browser**:
Go to: http://localhost:3000

---

## ✨ Features

### 🧑‍🏫 Learning & Collaboration Tools

📁 Upload Documents: Tutors and students can upload PDFs, notes, and files.

💬 Live Chat: Real-time messaging in study rooms.

📹 Video Calls: Join class discussions or 1-on-1 tutoring via WebRTC or integration.

🕒 Pomodoro Timer: Boost focus with built-in Pomodoro cycles.

⏰ Custom Alarms: Set alarms for breaks, sessions, or reminders.

🏠 Create Study Rooms: Users can create or join virtual rooms by subject or class.

📆 Schedule Class Times: Tutors can set class timings with reminders.

🧾 Interactive Dashboard: User-friendly layout for accessing notes, timers, and tools.

🔐 Login System: Role-based access (Student / guest access)

---

### 🗃 MongoDB Configuration
Karka Kasadara uses MongoDB to store learning content and user progress.

mongoose.connect('mongodb://localhost:27017/karka_kasadara', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
To connect to a remote MongoDB instance, replace localhost:27017/karka_kasadara with your database URI.

---

### 📦 Dependencies

The app uses:

express – Web framework

mongoose – MongoDB ORM

socket.io – Real-time messaging

body-parser, method-override, etc.

 simple-peer / webrtc – For video calling

moment.js, alarm-clock, or custom logic – For Pomodoro/alarm

---

### 📡 API Endpoints 
Method	Route	Description
| Method | Route            | Purpose          |
| ------ | ---------------- | ---------------- |
| GET    | `/`              | Home / dashboard |
| GET    | `/upload`        | File upload form |
| POST   | `/upload`        | Save documents   |
| GET    | `/chat/:room`    | Join chat room   |
| POST   | `/message`       | Send message     |
| GET    | `/video/:roomId` | Join video room  |
| GET    | `/timer`         | Pomodoro tool    |

---

### 👩‍💻 Author
Rajalakshmi R

GitHub: @Rajalakshmi2110
