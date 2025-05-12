
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getGroup, getExpenses, calculateBalances, Group, Expense, Balance } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { PageTransition, MotionDiv, MotionListItem, listVariants, itemVariants } from "@/components/AnimationProvider";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const GroupDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("expenses");

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const groupData = await getGroup(id);
        setGroup(groupData);
        
        // Fetch expenses
        const expensesData = await getExpenses(id);
        setExpenses(expensesData);
        
        // Fetch balances
        const balancesData = await calculateBalances(id);
        setBalances(balancesData);
      } catch (error) {
        console.error("Failed to fetch group data:", error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to load group data");
        }
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupData();
  }, [id, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getMemberName = (userId: string): string => {
    if (!group) return "Unknown";
    const member = group.members.find((m) => m.id === userId);
    return member ? member.name : "Unknown";
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
      <div className="container py-8 px-4 md:py-12 space-y-8">
        {/* Group Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{group.name}</h1>
              <Badge variant="outline" className="ml-2">
                {group.members.length} members
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              Invite Code: <span className="font-mono bg-muted px-2 py-0.5 rounded">{group.inviteCode}</span>
              <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => {
                navigator.clipboard.writeText(group.inviteCode);
                toast.success("Invite code copied to clipboard");
              }}>
                Copy
              </Button>
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate(`/groups/${id}/settle`)}
            >
              Settle Up
            </Button>
            <Button 
              className="budget-gradient"
              onClick={() => navigate(`/groups/${id}/add-expense`)}
            >
              Add Expense
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Open menu</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                  >
                    <path
                      d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/groups/${id}/members`)}>
                  Manage Members
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/groups/${id}/export`)}>
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Leave Group
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Group Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:w-[400px] mx-auto">
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="balances">Balances</TabsTrigger>
          </TabsList>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            {expenses.length === 0 ? (
              <motion.div 
                className="flex flex-col items-center justify-center py-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-10 h-10 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold">No expenses yet</h2>
                <p className="text-muted-foreground max-w-md mt-2 mb-6">
                  Start adding expenses to track shared costs in this group
                </p>
                <Button onClick={() => navigate(`/groups/${id}/add-expense`)} className="budget-gradient">
                  Add First Expense
                </Button>
              </motion.div>
            ) : (
              <MotionDiv 
                className="space-y-4"
                variants={listVariants}
                initial="hidden"
                animate="visible"
              >
                {expenses.map((expense) => (
                  <MotionListItem key={expense.id} variants={itemVariants}>
                    <Card className="hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{expense.description}</CardTitle>
                            <CardDescription>
                              {formatDate(expense.date)} • Paid by {getMemberName(expense.paidBy)}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">
                              {formatCurrency(expense.amount, expense.currency)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {expense.participants.length} participant{expense.participants.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex flex-wrap gap-2">
                          {expense.participants.map((participant) => {
                            const memberName = getMemberName(participant.userId);
                            return (
                              <div key={participant.userId} className="flex items-center gap-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{getInitials(memberName)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">
                                  {memberName} ({formatCurrency(participant.share, expense.currency)})
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </MotionListItem>
                ))}
              </MotionDiv>
            )}
          </TabsContent>

          {/* Balances Tab */}
          <TabsContent value="balances" className="space-y-6">
            {balances.length === 0 ? (
              <div className="text-center py-8">
                <p>No balance information available.</p>
              </div>
            ) : (
              <MotionDiv 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={listVariants}
                initial="hidden"
                animate="visible"
              >
                {balances.map((balance) => (
                  <MotionListItem key={balance.userId} variants={itemVariants}>
                    <Card className="hover:shadow-md transition-shadow duration-200">
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{getInitials(balance.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle>{balance.name}</CardTitle>
                            <CardDescription>
                              {balance.amount === 0 
                                ? "Settled up" 
                                : balance.amount > 0 
                                  ? `Gets back ${formatCurrency(balance.amount)}`
                                  : `Owes ${formatCurrency(Math.abs(balance.amount))}`
                              }
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div 
                          className={`text-2xl font-bold ${
                            balance.amount === 0 
                              ? "text-muted-foreground" 
                              : balance.amount > 0 
                                ? "receive-money" 
                                : "owe-money"
                          }`}
                        >
                          {balance.amount === 0 
                            ? formatCurrency(0) 
                            : balance.amount > 0 
                              ? `+${formatCurrency(balance.amount)}` 
                              : `-${formatCurrency(Math.abs(balance.amount))}`
                          }
                        </div>
                      </CardContent>
                    </Card>
                  </MotionListItem>
                ))}
              </MotionDiv>
            )}
            
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => navigate(`/groups/${id}/settle`)}
                variant="outline"
                className="gap-2"
              >
                Settle Up
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default GroupDetail;
