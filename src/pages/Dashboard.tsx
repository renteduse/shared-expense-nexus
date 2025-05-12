
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGroups, Group } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { PageTransition, MotionDiv, itemVariants, stagger } from "@/components/AnimationProvider";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getGroups();
        setGroups(data);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        toast.error("Failed to load your groups");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <PageTransition>
      <div className="container py-8 px-4 md:py-12 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your expense groups and track shared costs</p>
          </div>
          <div className="flex space-x-4">
            <Button 
              variant="outline"
              onClick={() => navigate("/groups/join")}
              className="flex items-center gap-2"
            >
              Join Group
            </Button>
            <Button 
              onClick={() => navigate("/groups/create")}
              className="budget-gradient flex items-center gap-2"
            >
              Create Group
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {groups.length === 0 ? (
              <motion.div 
                className="flex flex-col items-center justify-center py-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold">No groups yet</h2>
                <p className="text-muted-foreground max-w-md mt-2 mb-6">
                  Start by creating a new expense group or join an existing one with an invite code
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => navigate("/groups/create")} className="budget-gradient">
                    Create a group
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/groups/join")}>
                    Join with invite code
                  </Button>
                </div>
              </motion.div>
            ) : (
              <MotionDiv 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                {groups.map((group) => (
                  <motion.div key={group.id} variants={itemVariants}>
                    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
                      <CardHeader>
                        <CardTitle>{group.name}</CardTitle>
                        <CardDescription>
                          {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                          {group.createdAt && ` • Created ${formatDate(group.createdAt)}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="flex flex-wrap gap-2">
                          {group.members.slice(0, 3).map((member, index) => (
                            <div 
                              key={member.id}
                              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm"
                            >
                              {member.name.charAt(0)}
                            </div>
                          ))}
                          {group.members.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                              +{group.members.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground">
                            {group.expenses.length} expense{group.expenses.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full"
                          variant="outline"
                          onClick={() => navigate(`/groups/${group.id}`)}
                        >
                          View Group
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </MotionDiv>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default Dashboard;
