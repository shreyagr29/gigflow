# GigFlow - Advanced Freelance Marketplace

GigFlow is a modern, production-ready freelance marketplace built with the MERN stack. It empowers users to seamlessly switch between hiring talent and finding work, backed by robust real-time features and a premium, responsive design.

## 🚀 Key Features

### 🌟 Core Functionality
- **Fluid User Roles**: A single account allows users to both **Post Gigs** (Client) and **Bid on Projects** (Freelancer).
- **Atomic Hiring System**: Utilizes MongoDB Transactions to ensure the hiring process is race-condition free and data-consistent.

### ⚡ Real-Time & Interactive
- **Instant Notifications**: Powered by **Socket.io**, freelancers receive critical updates (Hired/Rejected) instantly without refreshing.
- **Persistent Alerts**: Notifications are stored in the database, ensuring users never miss an update even if they are offline.
- **Toast Messaging**: sleek, auto-dismissing toast notifications for immediate feedback.

### 🎨 UI/UX Excellence
- **Premium Design**: Built with **Tailwind CSS**, featuring a clean, modern aesthetic.
- **Dark Mode**: Fully supported system-wide dark mode with persistence.
- **Mobile-First Responsive**: Optimized mobile experience with a dedicated bottom-sheet style notification center and hamburger navigation.

## 🛠️ Tech Stack

**Frontend:**
- **React** (Vite)
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Socket.io-client** for real-time hygiene
- **Lucide React** for beautiful icons

**Backend:**
- **Node.js & Express**
- **MongoDB** (Mongoose) with Transaction support
- **Socket.io** for WebSockets
- **JWT** (JSON Web Tokens) with HttpOnly cookies for security

## 📦 Installation & Setup

### prerequisites
- Node.js (v18+)
- MongoDB Atlas or Local Replica Set (Required for Transactions)

### 1. Clone the Repository
```bash
git clone https://github.com/shreyagr29/gigflow.git
cd gigflow
```

### 2. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd ../client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 4. Run the Application

You need to run the backend and frontend in separate terminals.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

Access the app at `http://localhost:5173`.

## 📂 Project Structure

```bash
gigflow/
├── client/                 # React Frontend application
│   ├── src/
│   │   ├── components/     # UI Components (Navbar, NotificationDropdown, etc.)
│   │   ├── hooks/          # Custom hooks (useSocket)
│   │   ├── pages/          # Full page components (Home, Dashboard, GigDetails)
│   │   ├── slices/         # Redux state logic
│   │   └── ...
├── server/                 # Node.js Express Backend
│   ├── controllers/        # Business logic (Bid, Gig, Notification controllers)
│   ├── models/             # Mongoose Schemas (Gig, Bid, Notification)
│   ├── routes/             # API Endpoints
│   ├── socket/             # Socket.io logic
│   └── ...
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👤 Author

**Shrey Agrawal**
- GitHub: [@shreyagr29](https://github.com/shreyagr29)
