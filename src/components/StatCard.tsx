import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  variant?: "blue" | "green" | "orange" | "red" | "teal";
  className?: string;
}

const StatCard = ({ label, value, icon, variant = "blue", className }: StatCardProps) => {
  const borderColors = {
    blue: "border-l-stat-blue",
    green: "border-l-stat-green",
    orange: "border-l-stat-orange",
    red: "border-l-stat-red",
    teal: "border-l-primary",
  };

  const iconColors = {
    blue: "text-stat-blue",
    green: "text-stat-green",
    orange: "text-stat-orange",
    red: "text-stat-red",
    teal: "text-primary",
  };

  return (
    <div
      className={cn(
        "bg-card rounded-xl p-4 shadow-sm border-l-4 transition-all duration-200 hover:shadow-md",
        borderColors[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        {icon && (
          <div className={cn("opacity-60", iconColors[variant])}>{icon}</div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
