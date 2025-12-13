import { Dumbbell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBanner?: boolean;
}

const Header = ({ title, subtitle, showBanner = false }: HeaderProps) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Main header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-foreground">FitMate</span>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/dashboard")}
              className="text-sm"
            >
              Admin Dashboard
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="w-4 h-4" />
          </Button>
          <Avatar className="w-10 h-10 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(user?.name, user?.email)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Optional banner with title */}
      {showBanner && title && (
        <div className="header-gradient px-4 py-4">
          <div className="flex items-center gap-3">
            {subtitle && (
              <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">{title}</h1>
              {subtitle && (
                <p className="text-primary-foreground/80 text-sm">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
