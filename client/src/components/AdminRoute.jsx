import { Navigate } from "react-router-dom"; 
import { toast } from "react-hot-toast";
 
function AdminRoute({ children }) {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  if (!user || user.role !== "admin") {
    toast.error("Access denied. Admin only.");
    return <Navigate to="/" />;
  }
 
  return children;
}

export default AdminRoute;
