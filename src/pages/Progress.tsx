import { useState } from "react";
import { Target, Zap, Calendar, TrendingDown, TrendingUp, Plus, Award, BarChart3, Activity, Weight, Dumbbell, Timer, Edit3 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useProgressSystem } from "@/hooks/useProgressSystem";
import { useToast } from "@/hooks/use-toast";

const Progress = () => {
  const { 
    weightEntries, 
    strengthProgress, 
    goals, 
    addWeightEntry, 
    addStrengthEntry, 
    addGoal, 
    updateGoal,
    getProgressStats, 
    getWeightTrend, 
    getStrengthTrend, 
    getGoalProgress 
  } = useProgressSystem();
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [weightForm, setWeightForm] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: '',
    notes: ''
  });
  const [goalForm, setGoalForm] = useState({
    type: 'weight' as const,
    title: '',
    description: '',
    targetValue: '',
    currentValue: '',
    unit: 'kg',
    targetDate: ''
  });

  const stats = getProgressStats();
  const currentWeight = weightEntries[0]?.weight || 0;
  const weightGoal = goals.find(g => g.type === 'weight');
  const targetWeight = weightGoal?.targetValue || 70;
  const weightTrend = getWeightTrend();

  // Prepare chart data
  const weightChartData = weightEntries.slice(0, 8).reverse().map((entry, index) => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: entry.weight,
    bodyFat: entry.bodyFat || 0,
    muscleMass: entry.muscleMass || 0
  }));

  const strengthChartData = ['Bench Press', 'Squat', 'Deadlift'].map(exercise => {
    const exerciseData = strengthProgress.filter(p => p.exerciseName === exercise);
    const latest = exerciseData[0];
    const earliest = exerciseData[exerciseData.length - 1];
    
    return {
      exercise: exercise.replace(' ', '\n'),
      current: latest?.oneRepMax || 0,
      start: earliest?.oneRepMax || 0,
      improvement: (latest?.oneRepMax || 0) - (earliest?.oneRepMax || 0)
    };
  });

  const handleAddWeight = () => {
    if (!weightForm.weight) {
      toast({
        title: "Error",
        description: "Please enter your weight",
        variant: "destructive"
      });
      return;
    }

    addWeightEntry({
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(weightForm.weight),
      bodyFat: weightForm.bodyFat ? parseFloat(weightForm.bodyFat) : undefined,
      muscleMass: weightForm.muscleMass ? parseFloat(weightForm.muscleMass) : undefined,
      notes: weightForm.notes || undefined
    });

    // Update weight goal if exists
    if (weightGoal) {
      updateGoal(weightGoal.id, { currentValue: parseFloat(weightForm.weight) });
    }

    setWeightForm({ weight: '', bodyFat: '', muscleMass: '', notes: '' });
    setIsAddingWeight(false);
    
    toast({
      title: "Weight Added",
      description: "Your weight entry has been recorded successfully"
    });
  };

  const handleAddGoal = () => {
    if (!goalForm.title || !goalForm.targetValue || !goalForm.currentValue) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addGoal({
      type: goalForm.type,
      title: goalForm.title,
      description: goalForm.description,
      targetValue: parseFloat(goalForm.targetValue),
      currentValue: parseFloat(goalForm.currentValue),
      unit: goalForm.unit,
      targetDate: goalForm.targetDate,
      status: 'active'
    });

    setGoalForm({
      type: 'weight',
      title: '',
      description: '',
      targetValue: '',
      currentValue: '',
      unit: 'kg',
      targetDate: ''
    });
    setIsAddingGoal(false);
    
    toast({
      title: "Goal Added",
      description: "Your new goal has been created successfully"
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getGoalStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-700">Completed</Badge>;
      case 'active':
        return <Badge className="bg-blue-500/10 text-blue-700">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-500/10 text-yellow-700">Paused</Badge>;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Progress Tracking</h1>
            <p className="text-muted-foreground">Monitor your fitness journey with detailed analytics</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddingWeight} onOpenChange={setIsAddingWeight}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Weight className="w-4 h-4 mr-2" />
                  Log Weight
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Weight Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={weightForm.weight}
                      onChange={(e) => setWeightForm(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="75.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bodyFat">Body Fat (%)</Label>
                    <Input
                      id="bodyFat"
                      type="number"
                      step="0.1"
                      value={weightForm.bodyFat}
                      onChange={(e) => setWeightForm(prev => ({ ...prev, bodyFat: e.target.value }))}
                      placeholder="16.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="muscleMass">Muscle Mass (kg)</Label>
                    <Input
                      id="muscleMass"
                      type="number"
                      step="0.1"
                      value={weightForm.muscleMass}
                      onChange={(e) => setWeightForm(prev => ({ ...prev, muscleMass: e.target.value }))}
                      placeholder="66.8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={weightForm.notes}
                      onChange={(e) => setWeightForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="How are you feeling today?"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddWeight} className="flex-1">Add Entry</Button>
                    <Button variant="outline" onClick={() => setIsAddingWeight(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goalType">Goal Type</Label>
                    <Select value={goalForm.type} onValueChange={(value: any) => setGoalForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight">Weight Loss/Gain</SelectItem>
                        <SelectItem value="strength">Strength</SelectItem>
                        <SelectItem value="endurance">Endurance</SelectItem>
                        <SelectItem value="body_composition">Body Composition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="goalTitle">Title *</Label>
                    <Input
                      id="goalTitle"
                      value={goalForm.title}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Reach 70kg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goalDescription">Description</Label>
                    <Textarea
                      id="goalDescription"
                      value={goalForm.description}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your goal..."
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currentValue">Current Value *</Label>
                      <Input
                        id="currentValue"
                        type="number"
                        step="0.1"
                        value={goalForm.currentValue}
                        onChange={(e) => setGoalForm(prev => ({ ...prev, currentValue: e.target.value }))}
                        placeholder="74.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetValue">Target Value *</Label>
                      <Input
                        id="targetValue"
                        type="number"
                        step="0.1"
                        value={goalForm.targetValue}
                        onChange={(e) => setGoalForm(prev => ({ ...prev, targetValue: e.target.value }))}
                        placeholder="70"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Input
                        id="unit"
                        value={goalForm.unit}
                        onChange={(e) => setGoalForm(prev => ({ ...prev, unit: e.target.value }))}
                        placeholder="kg, %, days, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetDate">Target Date</Label>
                      <Input
                        id="targetDate"
                        type="date"
                        value={goalForm.targetDate}
                        onChange={(e) => setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddGoal} className="flex-1">Create Goal</Button>
                    <Button variant="outline" onClick={() => setIsAddingGoal(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Current Weight"
            value={`${currentWeight} kg`}
            variant="blue"
            icon={<Weight className="w-6 h-6" />}
          />
          <StatCard
            label="Total Workouts"
            value={stats.totalWorkouts}
            variant="orange"
            icon={<Zap className="w-6 h-6" />}
          />
          <StatCard
            label="Current Streak"
            value={`${stats.currentStreak} days`}
            variant="red"
            icon={<Calendar className="w-6 h-6" />}
          />
          <StatCard
            label="Weight Lost"
            value={`${stats.totalWeightLost.toFixed(1)} kg`}
            variant="green"
            icon={<TrendingDown className="w-6 h-6" />}
          />
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="strength">Strength</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Weekly Average
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageWorkoutsPerWeek}</div>
                  <p className="text-xs text-muted-foreground">workouts per week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Best Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.longestStreak}</div>
                  <p className="text-xs text-muted-foreground">consecutive days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {getTrendIcon(weightTrend)}
                    Weight Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{weightTrend}</div>
                  <p className="text-xs text-muted-foreground">last 3 weeks</p>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="week"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <YAxis
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="workouts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weight" className="space-y-6">
            {/* Current Weight Status */}
            {weightGoal && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Weight Goal Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Weight</p>
                      <p className="text-3xl font-bold">
                        {currentWeight} <span className="text-lg font-normal text-muted-foreground">kg</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Target</p>
                      <p className="text-3xl font-bold">
                        {targetWeight} <span className="text-lg font-normal text-muted-foreground">kg</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-stat-green/10 text-stat-green">
                      {getTrendIcon(weightTrend)}
                      {weightTrend} trend
                    </span>
                  </div>

                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${getGoalProgress(weightGoal.id)}%` }}
                    />
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    {Math.abs(currentWeight - targetWeight).toFixed(1)} kg to go
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Weight Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weight Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <YAxis
                        domain={['dataMin - 2', 'dataMax + 2']}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      {weightChartData.some(d => d.bodyFat > 0) && (
                        <Line
                          type="monotone"
                          dataKey="bodyFat"
                          stroke="hsl(var(--stat-orange))"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: "hsl(var(--stat-orange))", strokeWidth: 2, r: 3 }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Weight Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weightEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{entry.weight} kg</p>
                        <p className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                        {entry.notes && <p className="text-xs text-muted-foreground mt-1">{entry.notes}</p>}
                      </div>
                      <div className="text-right text-sm">
                        {entry.bodyFat && <p>BF: {entry.bodyFat}%</p>}
                        {entry.muscleMass && <p>MM: {entry.muscleMass}kg</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strength" className="space-y-6">
            {/* Strength Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  Strength Progress (1RM)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={strengthChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="exercise"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <YAxis
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="current" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Strength Gains Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Strength Gains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.strengthGains.map((gain, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Dumbbell className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{gain.exercise}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            {getTrendIcon(getStrengthTrend(gain.exercise))}
                            {getStrengthTrend(gain.exercise)} trend
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+{gain.improvement} {gain.unit}</p>
                        <p className="text-sm text-muted-foreground">improvement</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            {/* Active Goals */}
            <div className="grid gap-4">
              {goals.map((goal) => (
                <Card key={goal.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      {getGoalStatusBadge(goal.status)}
                    </div>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                      </div>
                      
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${getGoalProgress(goal.id)}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                        <span>{Math.round(getGoalProgress(goal.id))}% complete</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Progress;
