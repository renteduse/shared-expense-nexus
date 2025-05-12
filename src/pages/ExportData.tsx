
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGroup, exportGroupData, Group } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { PageTransition } from "@/components/AnimationProvider";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ExportData = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [csvData, setCsvData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const groupData = await getGroup(id);
        setGroup(groupData);
      } catch (error) {
        console.error("Failed to fetch group:", error);
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

    fetchGroup();
  }, [id, navigate]);

  const handleExport = async () => {
    if (!id) return;
    
    try {
      setIsExporting(true);
      const data = await exportGroupData(id);
      setCsvData(data);
      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Failed to export data:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to export group data");
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!csvData || !group) return;
    
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${group.name.replace(/\s+/g, '-').toLowerCase()}-expenses.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <h1 className="text-3xl font-bold">Export Data</h1>
            <p className="text-muted-foreground mt-2">
              Export expense data from {group.name}
            </p>
          </div>

          <Card className="glassmorphism shadow-md">
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-medium mb-1">CSV Export</h3>
                <p className="text-sm text-muted-foreground">
                  Export all expenses as a CSV file that can be opened in Excel, Google Sheets, or other spreadsheet software.
                </p>
              </div>
              
              {csvData && (
                <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                  <h3 className="font-medium text-green-700 mb-1">Export Ready!</h3>
                  <p className="text-sm text-green-600 mb-2">
                    Your data has been successfully exported. Click the button below to download.
                  </p>
                  <Button 
                    onClick={handleDownload}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Download CSV
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/groups/${id}`)}
                className="w-full sm:w-auto"
              >
                Back to Group
              </Button>
              {!csvData && (
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full sm:w-auto budget-gradient"
                >
                  {isExporting ? "Generating..." : "Generate Export"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ExportData;
