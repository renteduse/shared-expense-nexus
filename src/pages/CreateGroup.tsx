
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGroup } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { PageTransition } from "@/components/AnimationProvider";
import { motion } from "framer-motion";

const CreateGroup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const group = await createGroup(name);
      toast.success(`Group "${name}" created successfully!`);
      navigate(`/groups/${group.id}`);
    } catch (error) {
      console.error("Failed to create group:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create group. Please try again.");
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
            <h1 className="text-3xl font-bold">Create a Group</h1>
            <p className="text-muted-foreground mt-2">
              Start a new expense group and invite others to join
            </p>
          </div>

          <div className="glassmorphism p-6 rounded-xl shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  placeholder="Weekend Trip, Roommates, Family Budget, etc."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Choose a descriptive name for your group
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
                  disabled={isLoading || !name.trim()}
                >
                  {isLoading ? "Creating..." : "Create Group"}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default CreateGroup;
