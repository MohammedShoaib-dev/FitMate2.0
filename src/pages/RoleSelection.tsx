import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/ui/Logo";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="xl" showText={true} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome to FitMate</h1>
            <p className="text-muted-foreground">Please login to continue</p>
          </div>
        </div>

        <Card className="border-2">
          <CardContent className="p-6 space-y-4">
            <Button
              onClick={() => navigate("/login/user")}
              className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90"
            >
              User Login
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            <Button
              onClick={() => navigate("/login/admin")}
              variant="outline"
              className="w-full h-14 text-base font-semibold border-primary text-foreground hover:bg-muted"
            >
              Admin Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelection;

