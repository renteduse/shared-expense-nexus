
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGroup, calculateSettlements, Group, Settlement } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { PageTransition } from "@/components/AnimationProvider";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Settle = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const groupData = await getGroup(id);
        setGroup(groupData);
        
        // Fetch settlements
        const settlementsData = await calculateSettlements(id);
        setSettlements(settlementsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to load settlement data");
        }
        navigate(`/groups/${id}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD", // Default to USD
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[70vh]">
        <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold">Group not found</h2>
        <p className="mt-2 text-muted-foreground">The group you're looking for doesn't exist or you don't have access.</p>
        <Button onClick={() => navigate("/dashboard")} className="mt-4">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container py-8 px-4 md:py-12 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold">Settle Up</h1>
            <p className="text-muted-foreground mt-2">
              Simplest way to settle all debts in {group.name}
            </p>
          </div>

          <Card className="glassmorphism shadow-md">
            <CardHeader>
              <CardTitle className="text-center">Suggested Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {settlements.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">All settled up!</h2>
                  <p className="text-muted-foreground mt-2">
                    There are no outstanding debts in this group
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {settlements.map((settlement, index) => (
                    <motion.div
                      key={`${settlement.from.id}-${settlement.to.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{getInitials(settlement.from.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{settlement.from.name}</p>
                          <p className="text-sm text-muted-foreground">pays</p>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 font-bold">
                        {formatCurrency(settlement.amount)}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">{settlement.to.name}</p>
                          <p className="text-sm text-muted-foreground">receives</p>
                        </div>
                        <Avatar>
                          <AvatarFallback>{getInitials(settlement.to.name)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-center mt-6">
                <Button onClick={() => navigate(`/groups/${id}`)} variant="outline">
                  Back to Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Settle;
