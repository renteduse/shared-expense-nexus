
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinGroup } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { PageTransition } from "@/components/AnimationProvider";
import { motion } from "framer-motion";

const JoinGroup = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const group = await joinGroup(inviteCode.trim().toUpperCase());
      toast.success(`You've joined ${group.name}!`);
      navigate(`/groups/${group.id}`);
    } catch (error) {
      console.error("Failed to join group:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to join group. Please check the invite code and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="container py-8 px-4 md:py-12 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold">Join a Group</h1>
            <p className="text-muted-foreground mt-2">
              Enter an invite code to join an existing expense group
            </p>
          </div>

          <div className="glassmorphism p-6 rounded-xl shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="inviteCode">Invite Code</Label>
                <Input
                  id="inviteCode"
                  placeholder="ABCDEF"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  required
                  disabled={isLoading}
                  className="text-lg uppercase"
                  maxLength={10}
                />
                <p className="text-sm text-muted-foreground">
                  Ask the group creator for the code
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 budget-gradient"
                  disabled={isLoading || !inviteCode.trim()}
                >
                  {isLoading ? "Joining..." : "Join Group"}
                </Button>
              </div>
            </form>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground">
              Want to create your own group instead?
            </p>
            <Button
              variant="link"
              onClick={() => navigate("/groups/create")}
              className="mt-2"
            >
              Create a new group
            </Button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default JoinGroup;
