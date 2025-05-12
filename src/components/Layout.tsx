
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AnimationProvider } from "./AnimationProvider";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AnimationProvider>
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </AnimationProvider>
    </div>
  );
};

export default Layout;
