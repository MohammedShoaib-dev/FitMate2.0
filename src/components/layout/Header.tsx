import { Dumbbell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBanner?: boolean;
}

const Header = ({ title, subtitle, showBanner = false }: HeaderProps) => {
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
        <Avatar className="w-10 h-10 bg-primary">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            MO
          </AvatarFallback>
        </Avatar>
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
