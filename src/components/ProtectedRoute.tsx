
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuth = isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default ProtectedRoute;
