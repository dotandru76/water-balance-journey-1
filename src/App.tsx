
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import ProfileComplete from "./pages/ProfileComplete";
import { checkForUpdates } from "./services/UpdateService";
import UpdateNotification from "./components/UpdateNotification";
import { ProgramProvider } from "./contexts/ProgramContext";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component rendering");
  const location = useLocation();
  console.log("Current location:", location.pathname);
  
  const userDataExists = () => {
    try {
      return !!localStorage.getItem("userData");
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return false;
    }
  };
  
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  useEffect(() => {
    const checkUpdates = async () => {
      try {
        const { hasUpdate, updateInfo } = await checkForUpdates();
        
        if (hasUpdate && updateInfo) {
          setUpdateInfo(updateInfo);
          setShowUpdateDialog(true);
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    };
    
    checkUpdates();
    
    const intervalId = setInterval(checkUpdates, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleUpdateComplete = () => {
    setShowUpdateDialog(false);
    window.location.reload();
  };

  console.log("User data exists:", userDataExists());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ProgramProvider>
          <Routes>
            <Route 
              path="/" 
              element={
                userDataExists() ? 
                  <Index /> : 
                  <Navigate to="/register" replace />
              } 
            />
            <Route path="/register" element={<Register />} />
            <Route path="/profile-complete" element={<ProfileComplete />} />
            <Route path="/week/:weekNumber" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
          {updateInfo && (
            <UpdateNotification
              open={showUpdateDialog}
              updateInfo={updateInfo}
              onClose={() => setShowUpdateDialog(false)}
              onUpdate={handleUpdateComplete}
            />
          )}
        </ProgramProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
