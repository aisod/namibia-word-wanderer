import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldX } from "lucide-react";

export default function AdminAccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pattern-tribal flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center glass-card">
        <ShieldX className="w-16 h-16 mx-auto mb-4 text-destructive" />
        <h1 className="font-display text-2xl text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You do not have permission to access the admin panel. Please contact an administrator
          to request access.
        </p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </Card>
    </div>
  );
}
