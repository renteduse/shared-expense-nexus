
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div 
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <motion.div
            className="w-20 h-20 budget-gradient rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          >
            404
          </motion.div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-2">
          <Button onClick={() => navigate("/")} className="w-full budget-gradient">
            Go Home
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
