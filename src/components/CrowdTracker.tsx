import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface CrowdTrackerProps {
  status: "low" | "moderate" | "high";
  percentage: number;
  currentCount: number;
  maxCapacity: number;
}

const CrowdTracker = ({ status, percentage, currentCount, maxCapacity }: CrowdTrackerProps) => {
  const statusConfig = {
    low: {
      label: "Not Crowded",
      color: "bg-stat-green",
      textColor: "text-stat-green",
      bgColor: "bg-stat-green/10",
    },
    moderate: {
      label: "Moderately Busy",
      color: "bg-stat-orange",
      textColor: "text-stat-orange",
      bgColor: "bg-stat-orange/10",
    },
    high: {
      label: "Crowded",
      color: "bg-stat-red",
      textColor: "text-stat-red",
      bgColor: "bg-stat-red/10",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="bg-card rounded-xl p-5 shadow-sm animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config.bgColor)}>
            <Users className={cn("w-5 h-5", config.textColor)} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Real-Time Crowd Tracker</h3>
            <p className="text-sm text-muted-foreground">Live gym occupancy</p>
          </div>
        </div>
        <div className={cn("px-3 py-1.5 rounded-full text-sm font-medium", config.bgColor, config.textColor)}>
          {config.label}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Current Occupancy</span>
          <span className="font-semibold text-foreground">{currentCount}/{maxCapacity}</span>
        </div>
        
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", config.color)}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {status === "low" && "Great time to visit! Plenty of equipment available."}
          {status === "moderate" && "Getting busier. Some equipment may be in use."}
          {status === "high" && "Peak hours! Consider visiting later for less wait."}
        </p>
      </div>
    </div>
  );
};

export default CrowdTracker;
