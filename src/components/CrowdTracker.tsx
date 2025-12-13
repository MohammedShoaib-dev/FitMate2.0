import { useState } from "react";
import { Users, QrCode, Clock, TrendingUp, UserCheck, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QRScanner from "./QRScanner";
import SimpleQRDemo from "./SimpleQRDemo";
import { useCheckInSystem } from "@/hooks/useCheckInSystem";
import { useToast } from "@/hooks/use-toast";

interface CrowdTrackerProps {
  showQRScanner?: boolean;
  showRecentActivity?: boolean;
}

const CrowdTracker = ({ showQRScanner = true, showRecentActivity = true }: CrowdTrackerProps) => {
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const { crowdStats, processQRScan, getActiveUsers, getRecentActivity } = useCheckInSystem();
  const { toast } = useToast();

  const { status, percentage, currentCount, maxCapacity } = crowdStats;
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
  const activeUsers = getActiveUsers();
  const recentActivity = getRecentActivity();

  const handleQRScan = (qrData: string) => {
    console.log('CrowdTracker handleQRScan called with:', qrData);
    const result = processQRScan(qrData);
    console.log('QR scan result:', result);
    
    if (result.success) {
      toast({
        title: result.action === 'checkin' ? "Checked In!" : "Checked Out!",
        description: `${result.userName} has been ${result.action === 'checkin' ? 'checked in' : 'checked out'} successfully.`,
      });
      setIsQRScannerOpen(false);
    } else {
      toast({
        title: "Scan Failed",
        description: result.error || "Invalid QR code",
        variant: "destructive",
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStayDuration = (checkInTime: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - checkInTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins}m`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-4">
      {/* Main Crowd Tracker */}
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
          <div className="flex items-center gap-2">
            <div className={cn("px-3 py-1.5 rounded-full text-sm font-medium", config.bgColor, config.textColor)}>
              {config.label}
            </div>
            {showQRScanner && (
              <Button
                onClick={() => {
                  console.log('Scan QR button clicked');
                  setIsQRScannerOpen(true);
                }}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                size="sm"
              >
                <QrCode className="w-4 h-4" />
                Scan QR
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Avg Stay:</span>
              <span className="font-medium">{crowdStats.averageStayTime}m</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Peak:</span>
              <span className="font-medium">6-8 PM</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {status === "low" && "Great time to visit! Plenty of equipment available."}
            {status === "moderate" && "Getting busier. Some equipment may be in use."}
            {status === "high" && "Peak hours! Consider visiting later for less wait."}
          </p>
        </div>
      </div>

      {/* Currently Active Users */}
      {activeUsers.length > 0 && (
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Currently Active ({activeUsers.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {activeUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between text-sm">
                <span className="font-medium">{user.userName}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {getStayDuration(user.checkInTime)}
                  </Badge>
                  <span className="text-muted-foreground">
                    {formatTime(user.checkInTime)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {showRecentActivity && recentActivity.length > 0 && (
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Activity
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {activity.isActive ? (
                    <UserCheck className="w-3 h-3 text-green-500" />
                  ) : (
                    <UserX className="w-3 h-3 text-red-500" />
                  )}
                  <span className="font-medium">{activity.userName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={activity.isActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {activity.isActive ? "In" : "Out"}
                  </Badge>
                  <span className="text-muted-foreground">
                    {formatTime(activity.checkOutTime || activity.checkInTime)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      <SimpleQRDemo
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScan={handleQRScan}
      />
    </div>
  );
};

export default CrowdTracker;
