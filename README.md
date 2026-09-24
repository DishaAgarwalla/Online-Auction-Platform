<div align="center">

# 🏷️ BidSphere – Online Auction Platform

### 🚀 A Full-Stack Real-Time Online Auction Platform

**Buy • Sell • Bid • Win**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit-success?style=for-the-badge)](https://online-auction-platform-ten.vercel.app/)

</div>

---

# 📖 Overview

**BidSphere** is a full-stack real-time online auction platform that allows users to create auctions, place bids, track auction activity, receive notifications, and complete payments securely.

The application combines a **React frontend**, **Node.js and Express backend**, **MySQL database**, **Prisma ORM**, **Socket.IO for real-time communication**, and **Razorpay for online payments**.

The platform also includes automatic auction expiry, winner selection, user dashboards, watchlists, notifications, authentication, authorization, and administrative functionality.

---

# ✨ Features

## 🔐 Authentication & Authorization

- User Registration
- Secure Login
- JWT-based Authentication
- Password Hashing using bcryptjs
- Protected Routes
- Role-Based Authorization
- User Profile
- Admin Access

---

## 🏷️ Auction Management

- Create Auctions
- Upload Auction Images
- Edit Auctions
- Delete Auctions
- View Auction Details
- Set Auction Start and End Time
- Automatic Auction Expiry
- Automatic Winner Selection
- Active / Closed Auction Status
- Seller and Winner Information

---

## 💰 Real-Time Bidding

- Place Live Bids
- Highest Bid Validation
- Minimum Bid Validation
- Bid History
- Real-Time Bid Updates
- Socket.IO Integration
- Live Auction Room Updates
- Automatic Highest-Bid Tracking

---

## ❤️ Watchlist

- Add Auctions to Watchlist
- Remove Auctions from Watchlist
- View Saved Auctions
- Quickly Access Favourite Auctions

---

## 🔔 Notifications

Users receive notifications related to important auction activities such as:

- Auction Closed
- Auction Won
- New Auction Activity
- Seller Updates
- Bid-Related Events

Notifications are updated in real time using **Socket.IO**.

---

## 💳 Online Payments

BidSphere integrates **Razorpay** for payment processing.

- Razorpay Payment Gateway
- Payment Order Creation
- Payment Verification
- Payment Status Tracking
- Winner Payment Flow
- Test Mode Payment Support

---

## 📧 Email Service

The backend includes email functionality for auction-related communication.

Emails can be sent for events such as:

- Auction Won
- Auction Closed
- Seller Notifications
- Auction Updates

---

## 🏆 Won Auctions

Users can view auctions they have won.

The won-auction section provides:

- Auction Information
- Winning Bid
- Winner Status
- Payment Status
- Payment Option

---

## ⏱️ Automatic Auction Expiry

BidSphere uses scheduled background jobs to automatically check auctions.

When an auction reaches its end time:

1. The auction is automatically closed.
2. The highest bidder is selected as the winner.
3. Winner information is stored.
4. Relevant notifications are created.
5. Real-time updates are sent using Socket.IO.

---

# 🔁 Auction Workflow

1. User registers or logs in.
2. User creates an auction.
3. Other users browse available auctions.
4. Users place bids.
5. Bid information is updated in real time.
6. The highest bid is tracked.
7. The auction reaches its end time.
8. The auction is automatically closed.
9. The highest bidder becomes the winner.
10. The winner receives a notification.
11. The winner completes payment through Razorpay.
12. Payment status is updated.

---

# 🏗️ System Architecture

    React Frontend
          │
          │ HTTP / REST API
          ▼
    Node.js + Express
          │
          ├──────────────► Socket.IO
          │                    │
          │                    ▼
          │              Real-Time Updates
          │
          ▼
      Prisma ORM
          │
          ▼
       MySQL
          │
          ▼
      Aiven Cloud

    Razorpay
          │
          ▼
    Payment Processing

---

# ⚡ Tech Stack

## Frontend

- React.js
- Vite
- React Router
- Axios
- Socket.IO Client
- Framer Motion
- React Hot Toast
- Lucide React
- CSS

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
- Aiven Cloud

---

## Deployment

### Frontend

**Vercel**

Live Application:

https://online-auction-platform-ten.vercel.app/

### Backend

**Render**

Backend API:

https://online-auction-platform-vdbb.onrender.com/

### Database

**Aiven MySQL**

### Payments

**Razorpay**

---

# 📂 Project Structure

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

---

# 🗄️ Database

BidSphere uses **MySQL** with **Prisma ORM**.

The database contains models for major application entities such as:

- User
- Auction
- Bid
- Watchlist
- Notification

Prisma is used to manage database access and maintain the application's database schema.

---

# 🔌 API & Backend

The backend is built using **Node.js and Express.js**.

It provides REST APIs for:

- Authentication
- Users
- Auctions
- Bids
- Watchlists
- Notifications
- Payments
- Admin Operations
- Dashboard Data

The backend also provides a Socket.IO server for real-time application events.

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing using bcryptjs
- Protected Routes
- Role-Based Authorization
- Authentication Middleware
- Secure Payment Verification
- Environment Variables for Sensitive Configuration
- CORS Configuration
- Input Validation

Sensitive credentials such as database passwords, JWT secrets, Razorpay secrets, and email credentials are stored using environment variables and are not committed to the repository.

---

# 🚀 Installation

## Clone Repository

    git clone https://github.com/DishaAgarwalla/Online-Auction-Platform.git

    cd Online-Auction-Platform

---

# 📦 Install Dependencies

## Frontend

    cd client

    npm install

---

## Backend

    cd ../server

    npm install

---

# ▶️ Run Locally

## Start Backend

    cd server

    npm run dev

The backend runs locally on:

http://localhost:5000

---

## Start Frontend

Open another terminal:

    cd client

    npm run dev

The frontend runs locally on:

http://localhost:5173

---

# 🧪 Testing

BidSphere can be tested locally using the development environment.

The main functionality to test includes:

- User Registration
- User Login
- Creating Auctions
- Viewing Auctions
- Placing Bids
- Real-Time Bid Updates
- Watchlist
- Notifications
- Auction Expiry
- Winner Selection
- Won Auctions
- Razorpay Test Payments
- Dashboard Statistics
- Admin Functionality

For payment testing, use **Razorpay Test Mode** and Razorpay's official test credentials rather than real payment details.

---

# 🌐 Production Deployment

The current production architecture uses:

    Vercel
       │
       ▼
    React Frontend
       │
       ▼
    Render
       │
       ▼
    Node.js + Express Backend
       │
       ▼
    Prisma ORM
       │
       ▼
    Aiven MySQL

Additional services:

    Socket.IO
        │
        ▼
    Real-Time Communication

    Razorpay
        │
        ▼
    Payment Processing

---

# 🔗 Live Links

### 🌐 Frontend

https://online-auction-platform-ten.vercel.app/

### ⚡ Backend API

https://online-auction-platform-vdbb.onrender.com/

### 📂 GitHub Repository

https://github.com/DishaAgarwalla/Online-Auction-Platform

---

# 🛠️ Future Improvements

Possible future enhancements include:

- Advanced Search and Filtering
- Category-Based Auctions
- Improved Auction Analytics
- Advanced Admin Analytics
- Image Optimization
- Cloud File Storage
- Enhanced Notification System
- Improved Mobile Experience
- Auction Recommendation System
- More Payment Options
- Enhanced Security
- Automated Testing
- CI/CD Pipeline

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.

2. Create a new feature branch.

    git checkout -b feature/NewFeature

3. Make your changes.

4. Commit your changes.

    git commit -m "Add New Feature"

5. Push the branch.

    git push origin feature/NewFeature

6. Open a Pull Request.

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👩‍💻 Author

## Disha Agarwalla

Full-Stack Developer

### GitHub

https://github.com/DishaAgarwalla

### LinkedIn

https://www.linkedin.com/in/disha-agarwalla

---

<div align="center">

### ⭐ If you found BidSphere useful, consider giving the repository a Star ⭐

**Made with ❤️ by Disha Agarwalla**

</div>
