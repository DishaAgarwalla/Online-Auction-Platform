import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import socket from "./services/socket";

// Socket notification handler
socket.on("notification", (data) => {
  // You can also show toast here if needed
  console.log("New notification:", data);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);