
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AnimationProvider } from "./AnimationProvider";
import { motion } from "framer-motion";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AnimationProvider>
        <Navbar />
        <motion.main 
          className="flex-grow"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
        <Footer />
      </AnimationProvider>
    </div>
  );
};

export default Layout;
