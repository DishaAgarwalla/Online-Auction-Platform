<div align="center">

# 🏷️ BidSphere – Online Auction Platform

### 🚀 A Full-Stack Real-Time Online Auction Platform

Buy • Sell • Bid • Win

🌐 **Live Demo:** https://online-auction-platform-ten.vercel.app/

💻 **Backend API:** https://online-auction-platform-production.up.railway.app/

</div>

---

# 📖 Overview

**BidSphere** is a modern full-stack online auction platform where users can securely create auctions, place live bids, receive instant updates, and complete payments through Razorpay.

The platform supports real-time bidding using **Socket.IO**, secure authentication with **JWT**, automatic auction closing using scheduled background jobs, and online payments.

---

# ✨ Features

## 🔐 Authentication & Authorization

- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
- Role-Based Access (User/Admin)
- User Profile

---

## 🏷️ Auction Management

- Create Auctions
- Upload Auction Images
- Edit Auctions
- Delete Auctions
- Automatic Auction Expiry
- Automatic Winner Selection
- Auction Status (Active / Closed)

---

## 💰 Real-Time Bidding

- Live Bid Placement
- Highest Bid Validation
- Prevent Invalid Bids
- Live Bid Updates using Socket.IO
- Bid History

---

## ❤️ Watchlist

- Add Auctions to Watchlist
- Remove from Watchlist
- View Saved Auctions

---

## 🔔 Notifications

- Real-Time Notifications
- Auction Closed Notifications
- Winner Notifications
- Seller Notifications
- Watchlist Notifications

---

## 💳 Online Payments

- Razorpay Payment Gateway
- Secure Payment Verification
- Payment Status Tracking
- Winner Payment Flow

---

## 📧 Email Service

Automatic emails are sent for:

- Auction Won
- Auction Closed
- Seller Notifications

---

## 📊 Dashboard

### User Dashboard

- Profile Information
- Total Auctions
- Total Bids
- Won Auctions
- My Auctions

### Admin Dashboard

- Total Users
- Total Auctions
- Active Auctions
- Closed Auctions
- Total Bids
- Manage Users
- Manage Auctions

---

## 🎨 Modern UI

- Responsive Design
- Beautiful Landing Page
- Mobile Friendly
- Smooth Animations
- Modern Cards
- Toast Notifications

---

# ⚡ Tech Stack

## Frontend

- React.js
- Vite
- React Router
- Axios
- Framer Motion
- React Hot Toast
- Lucide React
- Socket.IO Client
- CSS / Tailwind CSS

---

## Backend

- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT
- bcryptjs
- Multer
- Socket.IO
- Node Cron
- Nodemailer
- Razorpay

---

## Database

- MySQL
- Prisma ORM

---

## Deployment

### Frontend

- Vercel

### Backend

- Railway

### Database

- Railway MySQL

---

# 📂 Project Structure

```text
BidSphere/
│
├── client/
│   ├── public/
│   ├── src/
│   │
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── assets/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── jobs/
│   ├── socket/
│   ├── services/
│   ├── uploads/
│   ├── prisma/
│   └── package.json
│
└── README.md
```

---

# 🔥 Architecture

```text
React (Vercel)
        │
        ▼
Express API (Railway)
        │
        ▼
Prisma ORM
        │
        ▼
MySQL Database (Railway)

        │
        ▼
Socket.IO
        │
Real-Time Bidding
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/DishaAgarwalla/Online-Auction-Platform.git

cd Online-Auction-Platform
```

---

## Install Dependencies

### Frontend

```bash
cd client

npm install
```

### Backend

```bash
cd ../server

npm install
```

---

# ▶️ Run Locally

## Backend

```bash
cd server

npm run dev
```

---

## Frontend

```bash
cd client

npm run dev
```

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing (bcryptjs)
- Protected Routes
- Input Validation
- Secure Payment Verification
- Role-Based Authorization

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/NewFeature
```

3. Commit your changes

```bash
git commit -m "Add New Feature"
```

4. Push to GitHub

```bash
git push origin feature/NewFeature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👩‍💻 Author

## Disha Agarwalla


### GitHub

https://github.com/DishaAgarwalla

### LinkedIn

https://www.linkedin.com/in/disha-agarwalla

---

<div align="center">

### ⭐ If you like this project, don't forget to give it a Star ⭐

Made with ❤️ by **Disha Agarwalla**

</div>
