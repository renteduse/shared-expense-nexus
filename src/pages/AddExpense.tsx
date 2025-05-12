
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGroup, addExpense, getExchangeRates, Group, Member } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { PageTransition } from "@/components/AnimationProvider";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

// Currency options
const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "INR", name: "Indian Rupee" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CNY", name: "Chinese Yuan" },
];

interface ParticipantShare {
  userId: string;
  share: number;
  isIncluded: boolean;
  customShare: number | null;
}

const AddExpense = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [currency, setCurrency] = useState("USD");
  const [date, setDate] = useState<Date>(new Date());
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [participants, setParticipants] = useState<Record<string, ParticipantShare>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const groupData = await getGroup(id);
        setGroup(groupData);
        
        // Initialize participants with all group members
        const initialParticipants: Record<string, ParticipantShare> = {};
        groupData.members.forEach((member) => {
          initialParticipants[member.id] = {
            userId: member.id,
            share: 0, // Will be calculated when needed
            isIncluded: true, // Include all members by default
            customShare: null,
          };
        });
        setParticipants(initialParticipants);
        
        // Set current user as default payer
        const currentUser = getCurrentUser();
        if (currentUser) {
          setPaidBy(currentUser.id);
        } else if (groupData.members.length > 0) {
          setPaidBy(groupData.members[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch group data:", error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to load group data");
        }
        navigate(`/groups/${id}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupData();
  }, [id, navigate]);

  // Calculate shares whenever relevant data changes
  useEffect(() => {
    if (splitType === "equal") {
      calculateEqualShares();
    }
  }, [amount, participants, splitType]);

  // Calculate equal shares among included participants
  const calculateEqualShares = () => {
    if (amount === "") return;
    
    // Count included participants
    const includedParticipants = Object.values(participants).filter(
      (p) => p.isIncluded
    );
    
    if (includedParticipants.length === 0) return;
    
    // Calculate share per person
    const sharePerPerson = Number(amount) / includedParticipants.length;
    
    // Update shares
    const updatedParticipants = { ...participants };
    Object.keys(updatedParticipants).forEach((userId) => {
      updatedParticipants[userId].share = updatedParticipants[userId].isIncluded
        ? parseFloat(sharePerPerson.toFixed(2))
        : 0;
    });
    
    setParticipants(updatedParticipants);
  };

  // Update custom shares
  const updateCustomShare = (userId: string, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    
    const updatedParticipants = { ...participants };
    updatedParticipants[userId].customShare = numValue;
    updatedParticipants[userId].share = numValue;
    
    setParticipants(updatedParticipants);
  };

  // Toggle participant inclusion
  const toggleParticipant = (userId: string, isIncluded: boolean) => {
    const updatedParticipants = { ...participants };
    updatedParticipants[userId].isIncluded = isIncluded;
    
    // Reset custom share when excluded
    if (!isIncluded) {
      updatedParticipants[userId].customShare = null;
      updatedParticipants[userId].share = 0;
    }
    
    setParticipants(updatedParticipants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !group) return;
    
    // Validate inputs
    if (description.trim() === "") {
      toast.error("Please enter a description");
      return;
    }
    
    if (amount === "" || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (!paidBy) {
      toast.error("Please select who paid");
      return;
    }
    
    // Check if at least one participant is included
    const includedParticipants = Object.values(participants).filter(
      (p) => p.isIncluded
    );
    
    if (includedParticipants.length === 0) {
      toast.error("Please include at least one participant");
      return;
    }
    
    // For custom split, validate that shares sum up to total
    if (splitType === "custom") {
      const totalShares = includedParticipants.reduce(
        (sum, p) => sum + (p.share || 0),
        0
      );
      
      const diff = Math.abs(Number(amount) - totalShares);
      if (diff > 0.01) {
        toast.error(`The sum of shares (${totalShares.toFixed(2)}) doesn't match the total amount (${Number(amount).toFixed(2)})`);
        return;
      }
    }
    
    // Prepare participants data
    const participantData = Object.values(participants)
      .filter((p) => p.isIncluded)
      .map((p) => ({
        userId: p.userId,
        share: p.share,
      }));
    
    try {
      setIsSubmitting(true);
      await addExpense(
        id,
        description,
        Number(amount),
        currency,
        paidBy,
        participantData,
        date.toISOString()
      );
      
      toast.success("Expense added successfully!");
      navigate(`/groups/${id}`);
    } catch (error) {
      console.error("Failed to add expense:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add expense. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
            <h1 className="text-3xl font-bold">Add Expense</h1>
            <p className="text-muted-foreground mt-2">
              Add a new expense to {group.name}
            </p>
          </div>

          <div className="glassmorphism p-6 rounded-xl shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Dinner, Movie tickets, Groceries, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={currency} 
                    onValueChange={(value) => setCurrency(value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code}>
                          {curr.code} - {curr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                        disabled={isSubmitting}
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Paid By */}
                <div className="space-y-2">
                  <Label htmlFor="paidBy">Paid by</Label>
                  <Select 
                    value={paidBy} 
                    onValueChange={(value) => setPaidBy(value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="paidBy">
                      <SelectValue placeholder="Select who paid" />
                    </SelectTrigger>
                    <SelectContent>
                      {group.members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Split Type */}
              <div className="space-y-2">
                <Label>Split Type</Label>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={splitType === "equal" ? "default" : "outline"}
                    className={cn(
                      "flex-1",
                      splitType === "equal" && "budget-gradient"
                    )}
                    onClick={() => setSplitType("equal")}
                    disabled={isSubmitting}
                  >
                    Equal Split
                  </Button>
                  <Button
                    type="button"
                    variant={splitType === "custom" ? "default" : "outline"}
                    className={cn(
                      "flex-1",
                      splitType === "custom" && "budget-gradient"
                    )}
                    onClick={() => setSplitType("custom")}
                    disabled={isSubmitting}
                  >
                    Custom Amounts
                  </Button>
                </div>
              </div>

              {/* Participants */}
              <div className="space-y-3">
                <Label>Participants</Label>
                {group.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg border">
                    <Checkbox
                      id={`participant-${member.id}`}
                      checked={participants[member.id]?.isIncluded}
                      onCheckedChange={(checked) => toggleParticipant(member.id, !!checked)}
                      disabled={isSubmitting}
                    />
                    <Label
                      htmlFor={`participant-${member.id}`}
                      className="flex-grow font-normal cursor-pointer"
                    >
                      {member.name}
                    </Label>
                    {splitType === "custom" && participants[member.id]?.isIncluded && (
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-24"
                        value={participants[member.id]?.customShare || ""}
                        onChange={(e) => updateCustomShare(member.id, e.target.value)}
                        disabled={isSubmitting}
                      />
                    )}
                    {splitType === "equal" && participants[member.id]?.isIncluded && (
                      <div className="text-sm">
                        {participants[member.id]?.share ? `${participants[member.id]?.share.toFixed(2)} ${currency}` : "-"}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/groups/${id}`)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 budget-gradient"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Expense"}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default AddExpense;
