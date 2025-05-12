
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const featureItems = [
    {
      title: "Create Groups",
      description: "Organize expenses with roommates, trips, or projects",
      icon: "💼"
    },
    {
      title: "Track Expenses",
      description: "Log costs with flexible splitting options",
      icon: "📝"
    },
    {
      title: "Settle Balances",
      description: "See who owes what with minimal transactions",
      icon: "💸"
    },
    {
      title: "Multi-Currency",
      description: "Handle expenses in different currencies",
      icon: "🌍"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter">
                  Split Expenses with Friends,<br /> 
                  <span className="bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">Effortlessly</span>
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Track shared expenses, settle debts, and maintain friendships with our intuitive expense splitting app.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="budget-gradient" size="lg" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto w-full max-w-md glassmorphism rounded-xl p-4"
            >
              <img
                src="/placeholder.svg"
                alt="BudgetSplit App Screenshot"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Key Features</h2>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
              Everything you need to manage shared expenses without the headache
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featureItems.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow duration-200 glassmorphism"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">How It Works</h2>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
              Three simple steps to start splitting expenses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create a Group</h3>
              <p className="text-muted-foreground">Create a new expense group and invite your friends</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Expenses</h3>
              <p className="text-muted-foreground">Log expenses and specify who paid and who should share the cost</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Settle Up</h3>
              <p className="text-muted-foreground">See who owes what and settle debts with minimal transactions</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="max-w-3xl mx-auto text-center glassmorphism p-8 md:p-12 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to split expenses without the drama?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of users who make sharing expenses easy with BudgetSplit
            </p>
            <Button className="budget-gradient" size="lg" asChild>
              <Link to="/signup">Get Started For Free</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
