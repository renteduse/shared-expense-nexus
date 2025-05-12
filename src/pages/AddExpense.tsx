
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGroup, addExpense, getExchangeRates } from "@/lib/api";
import { getCurrentUserSync } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { PageTransition } from "@/components/AnimationProvider";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check } from "lucide-react";

const AddExpense = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [participants, setParticipants] = useState<{ userId: string; share: number; selected: boolean }[]>([]);

  const currentUser = getCurrentUserSync();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const groupData = await getGroup(id);
        setGroup(groupData);
        
        // Initialize form data
        if (currentUser) {
          setPaidBy(currentUser.id);
        }
        
        // Initialize participants
        const initialParticipants = groupData.members.map((member: any) => ({
          userId: member.id,
          share: 0,
          selected: true
        }));
        setParticipants(initialParticipants);
        
        // Fetch exchange rates
        try {
          const rates = await getExchangeRates();
          setExchangeRates(rates);
        } catch (error) {
          console.error("Could not fetch exchange rates:", error);
          // Use basic exchange rates
          setExchangeRates({
            USD: 1,
            EUR: 0.85,
            GBP: 0.75,
            CAD: 1.25
          });
        }
      } catch (error) {
        console.error("Failed to fetch group data:", error);
        toast.error("Failed to load group data");
        navigate("/groups");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, currentUser]);

  useEffect(() => {
    // Update shares when amount, participants, or split type changes
    if (splitType === "equal") {
      const activeParticipants = participants.filter(p => p.selected);
      if (activeParticipants.length > 0 && amount) {
        const amountPerPerson = parseFloat(amount) / activeParticipants.length;
        const roundedAmount = parseFloat(amountPerPerson.toFixed(2));
        
        const updatedParticipants = participants.map(p => ({
          ...p,
          share: p.selected ? roundedAmount : 0
        }));
        
        setParticipants(updatedParticipants);
      }
    }
  }, [amount, participants.filter(p => p.selected).length, splitType]);

  const handleParticipantToggle = (userId: string) => {
    const updatedParticipants = participants.map(p => 
      p.userId === userId ? { ...p, selected: !p.selected } : p
    );
    setParticipants(updatedParticipants);
  };

  const handleShareChange = (userId: string, value: string) => {
    const updatedParticipants = participants.map(p => 
      p.userId === userId ? { ...p, share: parseFloat(value) || 0 } : p
    );
    setParticipants(updatedParticipants);
  };

  const getTotalShares = () => {
    return participants.reduce((sum, p) => sum + (p.selected ? p.share : 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !paidBy || !description || !amount) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    const activeParticipants = participants.filter(p => p.selected);
    if (activeParticipants.length === 0) {
      toast.error("Please select at least one participant");
      return;
    }
    
    // Validate total shares
    const totalShares = getTotalShares();
    const amountNum = parseFloat(amount);
    
    if (Math.abs(totalShares - amountNum) > 0.01) {
      toast.error(`The sum of shares (${totalShares.toFixed(2)}) does not match the total amount (${amountNum.toFixed(2)})`);
      return;
    }
    
    try {
      setIsSaving(true);
      
      await addExpense(
        id,
        description,
        amountNum,
        currency,
        paidBy,
        activeParticipants.map(p => ({ userId: p.userId, share: p.share })),
        date
      );
      
      toast.success("Expense added successfully");
      navigate(`/groups/${id}`);
    } catch (error) {
      console.error("Failed to save expense:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save expense");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getMemberName = (userId: string): string => {
    if (!group) return "";
    const member = group.members.find((m: any) => m.id === userId);
    return member ? member.name : "";
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
        <Button onClick={() => navigate("/groups")} className="mt-4">
          Return to Groups
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
            <h1 className="text-3xl font-bold">Add Expense</h1>
            <p className="text-muted-foreground mt-2">
              Add a new expense to {group.name}
            </p>
          </div>

          <Card className="glassmorphism shadow-md">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Expense Details</CardTitle>
                <CardDescription>
                  Enter the expense information below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="e.g., Dinner at Restaurant"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-2 col-span-1 md:col-span-1">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-1">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency} disabled={isSaving}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(exchangeRates).map((code) => (
                          <SelectItem key={code} value={code}>
                            {code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label htmlFor="paidBy">Paid by</Label>
                    <Select value={paidBy} onValueChange={setPaidBy} disabled={isSaving}>
                      <SelectTrigger id="paidBy">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {group.members.map((member: any) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Split Type</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={splitType === "equal" ? "default" : "outline"}
                      className={splitType === "equal" ? "budget-gradient" : ""}
                      onClick={() => setSplitType("equal")}
                      disabled={isSaving}
                    >
                      Split Equally
                    </Button>
                    <Button
                      type="button"
                      variant={splitType === "custom" ? "default" : "outline"}
                      className={splitType === "custom" ? "budget-gradient" : ""}
                      onClick={() => setSplitType("custom")}
                      disabled={isSaving}
                    >
                      Custom Amounts
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Participants</Label>
                    <div className="text-sm text-muted-foreground">
                      Total: {getTotalShares().toFixed(2)} {currency}
                      {splitType === "equal" ? (
                        <span className="ml-2">
                          ({(parseFloat(amount) || 0).toFixed(2)} {currency})
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {group.members.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer ${
                            participants.find(p => p.userId === member.id)?.selected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                          onClick={() => handleParticipantToggle(member.id)}
                        >
                          {participants.find(p => p.userId === member.id)?.selected && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                        </div>
                      </div>
                      {splitType === "custom" && (
                        <div className="w-24">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={participants.find(p => p.userId === member.id)?.share || 0}
                            onChange={(e) => handleShareChange(member.id, e.target.value)}
                            disabled={!participants.find(p => p.userId === member.id)?.selected || isSaving}
                            className="text-right"
                          />
                        </div>
                      )}
                      {splitType === "equal" && (
                        <div className="text-right w-24">
                          <span>
                            {participants.find(p => p.userId === member.id)?.selected
                              ? `${participants.find(p => p.userId === member.id)?.share.toFixed(2) || "0.00"}`
                              : "0.00"}{" "}
                            {currency}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate(`/groups/${id}`)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto budget-gradient"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Expense"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default AddExpense;
