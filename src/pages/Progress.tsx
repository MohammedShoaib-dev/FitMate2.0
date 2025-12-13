import { Target, Zap, Calendar, TrendingDown } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/StatCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Progress = () => {
  const currentWeight = 75;
  const targetWeight = 70;
  const totalWorkouts = 156;
  const currentStreak = 5;

  const weightData = [
    { week: "Week 1", weight: 78 },
    { week: "Week 2", weight: 77.5 },
    { week: "Week 3", weight: 77 },
    { week: "Week 4", weight: 76.2 },
    { week: "Week 5", weight: 75.5 },
    { week: "Week 6", weight: 75 },
  ];

  const progressPercent = ((78 - currentWeight) / (78 - targetWeight)) * 100;

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Progress</h1>
          <p className="text-muted-foreground">Track your fitness journey with detailed analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Current Weight"
            value={`${currentWeight} kg`}
            variant="blue"
            icon={<Target className="w-6 h-6" />}
          />
          <StatCard
            label="Target Weight"
            value={`${targetWeight} kg`}
            variant="green"
            icon={<Target className="w-6 h-6" />}
          />
          <StatCard
            label="Total Workouts"
            value={totalWorkouts}
            variant="orange"
            icon={<Zap className="w-6 h-6" />}
          />
          <StatCard
            label="Current Streak"
            value={`${currentStreak} days`}
            variant="red"
            icon={<Calendar className="w-6 h-6" />}
          />
        </div>

        {/* Weight Goal Card */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Weight Goal</h2>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-muted-foreground">Current Weight</p>
              <p className="text-3xl font-bold text-foreground">
                {currentWeight} <span className="text-lg font-normal text-muted-foreground">kg</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Target</p>
              <p className="text-3xl font-bold text-foreground">
                {targetWeight} <span className="text-lg font-normal text-muted-foreground">kg</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-stat-green/10 text-stat-green">
              <TrendingDown className="w-3 h-3" />
              0.5 kg this week
            </span>
          </div>

          <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {currentWeight - targetWeight} kg to go
          </p>
        </div>

        {/* Weight Progression Chart */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-foreground mb-4">Weight Progression (Last 6 Weeks)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  domain={[68, 80]}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Progress;
