import { TrendingDown, TrendingUp, Target, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProgressSystem } from "@/hooks/useProgressSystem";
import { Link } from "react-router-dom";

interface ProgressWidgetProps {
  compact?: boolean;
}

const ProgressWidget = ({ compact = false }: ProgressWidgetProps) => {
  const { weightEntries, goals, getProgressStats, getWeightTrend } = useProgressSystem();
  
  const stats = getProgressStats();
  const currentWeight = weightEntries[0]?.weight || 0;
  const weightGoal = goals.find(g => g.type === 'weight');
  const weightTrend = getWeightTrend();
  const activeGoals = goals.filter(g => g.status === 'active');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      default:
        return <Target className="w-4 h-4 text-blue-500" />;
    }
  };

  if (compact) {
    return (
      <Link to="/progress">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Progress Summary</h3>
              <Badge variant="outline" className="text-xs">
                {activeGoals.length} active goals
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Weight</p>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{currentWeight}kg</span>
                  {getTrendIcon(weightTrend)}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Streak</p>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{stats.currentStreak}</span>
                  <Award className="w-4 h-4 text-orange-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Progress Overview
          </CardTitle>
          <Link to="/progress">
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              View Details
            </Badge>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-2xl font-bold">{currentWeight}</span>
              <span className="text-sm text-muted-foreground">kg</span>
              {getTrendIcon(weightTrend)}
            </div>
            <p className="text-xs text-muted-foreground">Current Weight</p>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-2xl font-bold">{stats.currentStreak}</span>
              <Award className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>

        {/* Weight Goal Progress */}
        {weightGoal && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{weightGoal.title}</span>
              <span className="text-xs text-muted-foreground">
                {Math.abs(currentWeight - weightGoal.targetValue).toFixed(1)}kg to go
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ 
                  width: `${Math.min(
                    ((weightGoal.currentValue - weightGoal.targetValue) / (78 - weightGoal.targetValue)) * 100, 
                    100
                  )}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Recent Achievements */}
        <div>
          <h4 className="text-sm font-medium mb-2">Recent Achievements</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Lost {stats.totalWeightLost.toFixed(1)}kg total</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{stats.totalWorkouts} workouts completed</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Best streak: {stats.longestStreak} days</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressWidget;