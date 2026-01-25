import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <AppLayout hideNav>
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <AlertCircle className="h-16 w-16 text-primary" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Page Not Found</h1>
        <p className="mb-8 text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate("/")} size="lg" className="gap-2">
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    </AppLayout>
  );
};

export default NotFound;
