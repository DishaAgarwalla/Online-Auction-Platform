# 🏷️ Online Auction Platform 

A full-stack web application that enables users to create, participate in, and manage online auctions in real time. Users can list items for auction, place bids, track auction status, and determine winners automatically when the auction ends.
 
---

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login
- Secure JWT-based authentication
- Protected routes for authorized users
- User profile management

### 🏷️ Auction Management
- Create new auctions with title, description, image, starting price, and end date
- View active and completed auctions
- Edit and manage auction listings
- Automatic auction closure based on end time

### 💰 Bidding System
- Place bids on active auctions
- Real-time highest bid tracking
- Bid validation to prevent lower bids
- Auction winner determination

### 📊 Dashboard
- View all created auctions
- Track bidding activity
- Monitor auction status and results

### 🎨 Modern User Interface
- Responsive design for desktop and mobile
- Intuitive navigation
- Clean and user-friendly auction experience

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Context API
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js

---

## 📂 Project Structure

```bash
Online-Auction-Platform/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/DishaAgarwalla/Online-Auction-Platform.git
cd Online-Auction-Platform
```

### Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## ▶️ Run the Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👩‍💻 Author

**Disha Agarwalla**

- GitHub: https://github.com/DishaAgarwalla
- LinkedIn: https://www.linkedin.com/in/disha-agarwalla

⭐ If you found this project useful, consider giving it a star!
