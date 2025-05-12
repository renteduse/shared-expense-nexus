
import { PageTransition } from "@/components/AnimationProvider";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      description: "Perfect for small groups and simple expense tracking",
      price: "$0",
      period: "forever",
      features: [
        "Up to 5 groups",
        "Up to 5 members per group",
        "Basic expense tracking",
        "Simple balance calculations",
        "Single currency support",
        "Email support"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline",
      popular: false
    },
    {
      name: "Premium",
      description: "Ideal for frequent travelers and larger groups",
      price: "$5.99",
      period: "per month",
      features: [
        "Unlimited groups",
        "Unlimited members per group",
        "Advanced expense tracking",
        "Detailed balance reports",
        "Multi-currency support",
        "Export data to CSV",
        "Receipt scanning",
        "Priority email support"
      ],
      buttonText: "Subscribe Now",
      buttonVariant: "gradient",
      popular: true
    },
    {
      name: "Team",
      description: "For businesses and professional teams",
      price: "$12.99",
      period: "per month",
      features: [
        "Everything in Premium",
        "Team management tools",
        "Role-based permissions",
        "Budget planning features",
        "Custom expense categories",
        "Financial reporting",
        "API access",
        "Dedicated support"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      popular: false
    }
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className="container py-12 px-4">
        <div className="text-center mb-16">
          <motion.h1
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Choose the plan that's right for you
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className={`h-full flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground py-1 px-4 text-center text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate('/signup')}
                    className={`w-full ${plan.buttonVariant === 'gradient' ? 'budget-gradient' : ''}`} 
                    variant={plan.buttonVariant === 'gradient' ? 'default' : 'outline'}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-16 p-8 rounded-lg bg-card shadow-sm border text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Need something special?</h2>
          <p className="text-muted-foreground mb-6">
            Contact us for custom plans or enterprise pricing. We can tailor BudgetSplit to your specific needs.
          </p>
          <Button variant="outline">Contact Sales</Button>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Pricing;
