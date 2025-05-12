
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/AnimationProvider";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  
  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <PageTransition>
      <section className="container px-4 py-12 md:py-24 lg:py-32">
        <motion.div 
          className="flex flex-col items-center text-center space-y-8" 
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeIn} transition={{ duration: 0.5 }}>
            <div className="rounded-full w-20 h-20 budget-gradient flex items-center justify-center mx-auto mb-6">
              <span className="font-bold text-3xl text-white">BS</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Split expenses with <span className="text-gradient">friends & family</span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-[800px]"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            BudgetSplit makes it easy to track shared expenses, split bills, and settle debts.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isAuth ? (
              <Button onClick={() => navigate("/dashboard")} size="lg" className="budget-gradient">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate("/signup")} size="lg" className="budget-gradient">
                  Get Started
                </Button>
                <Button onClick={() => navigate("/login")} size="lg" variant="outline">
                  Sign In
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>
      
      <section className="container px-4 py-12 md:py-24">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="space-y-4 text-center">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-8-6h16" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Create groups</h3>
            <p className="text-muted-foreground">
              Create groups for roommates, trips, or events and start tracking expenses together.
            </p>
          </div>
          
          <div className="space-y-4 text-center">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Track expenses</h3>
            <p className="text-muted-foreground">
              Add expenses and split bills easily. See who paid what and who owes whom.
            </p>
          </div>
          
          <div className="space-y-4 text-center">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Settle up</h3>
            <p className="text-muted-foreground">
              See the simplest way to settle all debts with minimum transactions.
            </p>
          </div>
        </motion.div>
      </section>
      
      <section className="bg-card py-12 md:py-24">
        <div className="container px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              BudgetSplit makes expense sharing simple with just a few steps
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
            <motion.div 
              className="flex flex-col items-center text-center space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2">
                1
              </div>
              <h3 className="text-xl font-semibold">Create or join a group</h3>
              <p className="text-muted-foreground">
                Start by creating a new group or join an existing one using an invite code.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2">
                2
              </div>
              <h3 className="text-xl font-semibold">Add your expenses</h3>
              <p className="text-muted-foreground">
                Record who paid for what and how it should be split among group members.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2">
                3
              </div>
              <h3 className="text-xl font-semibold">Settle up easily</h3>
              <p className="text-muted-foreground">
                See who owes what and get simplified suggestions for settling debts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="container px-4 py-12 md:py-24">
        <motion.div 
          className="max-w-[800px] mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold">Ready to start tracking expenses?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of users who use BudgetSplit to manage shared expenses with friends, 
            family, and roommates.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            {isAuth ? (
              <Button onClick={() => navigate("/dashboard")} size="lg" className="budget-gradient">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate("/signup")} size="lg" className="budget-gradient">
                  Get Started
                </Button>
                <Button onClick={() => navigate("/login")} size="lg" variant="outline">
                  Sign In
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </section>
      
      <footer className="border-t py-12 mt-12">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">BudgetSplit</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/faqs">FAQs</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:support@budgetsplit.com">Contact Us</a></li>
                <li><Link to="/faqs">Help Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Connect</h3>
              <div className="flex gap-4 mt-2">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} BudgetSplit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </PageTransition>
  );
};

export default LandingPage;
