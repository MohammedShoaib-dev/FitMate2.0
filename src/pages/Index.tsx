import { Link } from "react-router-dom";
import { Sparkles, QrCode } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import CrowdTracker from "@/components/CrowdTracker";
import TodayPlan from "@/components/TodayPlan";
import ProgressWidget from "@/components/ProgressWidget";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        {/* Welcome Section */}
        <div className="animate-slide-up">
          <h1 className="text-2xl font-bold text-foreground">Welcome back! 👋</h1>
          <p className="text-muted-foreground">Ready to crush your goals today?</p>
        </div>

        {/* Crowd Tracker */}
        <CrowdTracker showQRScanner={true} showRecentActivity={true} />

        {/* QR Check-In Card */}
        <div className="bg-card rounded-xl p-5 shadow-sm animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Quick Check-In</h3>
              <p className="text-sm text-muted-foreground">Scan to enter the gym</p>
            </div>
            <div className="w-24 h-24 bg-foreground rounded-xl p-2 flex items-center justify-center">
              <div className="w-full h-full bg-card rounded-lg flex items-center justify-center relative">
                {/* Simple QR Code Pattern */}
                <div className="grid grid-cols-5 gap-0.5 p-1">
                  {[
                    [1,1,1,0,1],
                    [1,0,1,1,1],
                    [1,1,1,0,0],
                    [0,1,0,1,1],
                    [1,1,1,0,1],
                  ].map((row, i) => (
                    row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className={`w-3 h-3 rounded-sm ${cell ? 'bg-foreground' : 'bg-card'}`}
                      />
                    ))
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Member ID</span>
              <span className="font-mono font-medium text-foreground">FIT-2024-0847</span>
            </div>
          </div>
        </div>

        {/* Today's Plan */}
        <TodayPlan
          workout={{
            name: "Upper Body Strength",
            duration: "45 min",
            calories: 380,
          }}
          meals={{
            breakfast: "Oatmeal with berries & protein shake",
            lunch: "Grilled chicken salad",
            dinner: "Salmon with quinoa & vegetables",
          }}
        />

        {/* Progress Widget */}
        <ProgressWidget compact />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          <Link to="/workouts">
            <Button variant="stat" className="w-full h-auto py-4 flex-col gap-2">
              <QrCode className="w-6 h-6 text-primary" />
              <span className="font-medium">Book a Class</span>
            </Button>
          </Link>
          <Link to="/nutrition">
            <Button variant="stat" className="w-full h-auto py-4 flex-col gap-2">
              <Sparkles className="w-6 h-6 text-stat-orange" />
              <span className="font-medium">AI Planner</span>
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
