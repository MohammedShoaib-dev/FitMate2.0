import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  notes?: string;
}

export interface WorkoutProgress {
  id: string;
  date: string;
  exerciseName: string;
  weight: number;
  reps: number;
  sets: number;
  oneRepMax: number;
}

export interface Goal {
  id: string;
  type: 'weight' | 'strength' | 'endurance' | 'body_composition';
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface ProgressStats {
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  totalWeightLost: number;
  averageWorkoutsPerWeek: number;
  strengthGains: {
    exercise: string;
    improvement: number;
    unit: string;
  }[];
  weeklyProgress: {
    week: string;
    workouts: number;
    avgWeight: number;
    totalCalories: number;
  }[];
}

const DEMO_WEIGHT_DATA: WeightEntry[] = [
  {
    id: '1',
    date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 weeks ago
    weight: 78.0,
    bodyFat: 18.5,
    muscleMass: 65.2,
    notes: 'Starting weight'
  },
  {
    id: '2',
    date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 weeks ago
    weight: 77.5,
    bodyFat: 18.2,
    muscleMass: 65.4,
    notes: 'Good progress this week'
  },
  {
    id: '3',
    date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 weeks ago
    weight: 77.0,
    bodyFat: 17.8,
    muscleMass: 65.8,
    notes: 'Consistent training paying off'
  },
  {
    id: '4',
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 weeks ago
    weight: 76.2,
    bodyFat: 17.5,
    muscleMass: 66.0,
    notes: 'Plateau week, adjusted diet'
  },
  {
    id: '5',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks ago
    weight: 75.5,
    bodyFat: 17.0,
    muscleMass: 66.3,
    notes: 'Breaking through plateau'
  },
  {
    id: '6',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week ago
    weight: 75.0,
    bodyFat: 16.8,
    muscleMass: 66.5,
    notes: 'Great week, feeling strong'
  },
  {
    id: '7',
    date: new Date().toISOString().split('T')[0], // Today
    weight: 74.5,
    bodyFat: 16.5,
    muscleMass: 66.8,
    notes: 'New personal best!'
  }
];

const DEMO_STRENGTH_DATA: WorkoutProgress[] = [
  // Bench Press progression
  { id: '1', date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Bench Press', weight: 80, reps: 8, sets: 3, oneRepMax: 100 },
  { id: '2', date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Bench Press', weight: 82.5, reps: 8, sets: 3, oneRepMax: 103 },
  { id: '3', date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Bench Press', weight: 85, reps: 8, sets: 3, oneRepMax: 106 },
  { id: '4', date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Bench Press', weight: 87.5, reps: 8, sets: 3, oneRepMax: 109 },
  { id: '5', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Bench Press', weight: 90, reps: 8, sets: 3, oneRepMax: 112 },
  { id: '6', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Bench Press', weight: 92.5, reps: 8, sets: 3, oneRepMax: 115 },
  
  // Squat progression
  { id: '7', date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Squat', weight: 100, reps: 8, sets: 3, oneRepMax: 125 },
  { id: '8', date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Squat', weight: 105, reps: 8, sets: 3, oneRepMax: 131 },
  { id: '9', date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Squat', weight: 110, reps: 8, sets: 3, oneRepMax: 137 },
  { id: '10', date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Squat', weight: 115, reps: 8, sets: 3, oneRepMax: 144 },
  { id: '11', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Squat', weight: 120, reps: 8, sets: 3, oneRepMax: 150 },
  { id: '12', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Squat', weight: 125, reps: 8, sets: 3, oneRepMax: 156 },
  
  // Deadlift progression
  { id: '13', date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Deadlift', weight: 120, reps: 5, sets: 3, oneRepMax: 135 },
  { id: '14', date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Deadlift', weight: 125, reps: 5, sets: 3, oneRepMax: 141 },
  { id: '15', date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Deadlift', weight: 130, reps: 5, sets: 3, oneRepMax: 146 },
  { id: '16', date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Deadlift', weight: 135, reps: 5, sets: 3, oneRepMax: 152 },
  { id: '17', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Deadlift', weight: 140, reps: 5, sets: 3, oneRepMax: 158 },
  { id: '18', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], exerciseName: 'Deadlift', weight: 145, reps: 5, sets: 3, oneRepMax: 163 }
];

const DEMO_GOALS: Goal[] = [
  {
    id: '1',
    type: 'weight',
    title: 'Reach Target Weight',
    description: 'Lose weight to reach my ideal body composition',
    targetValue: 70,
    currentValue: 74.5,
    unit: 'kg',
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 months from now
    status: 'active',
    createdAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: '2',
    type: 'strength',
    title: 'Bench Press 120kg',
    description: 'Increase bench press 1RM to 120kg',
    targetValue: 120,
    currentValue: 115,
    unit: 'kg',
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 months from now
    status: 'active',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: '3',
    type: 'body_composition',
    title: 'Body Fat Under 15%',
    description: 'Reduce body fat percentage to under 15%',
    targetValue: 15,
    currentValue: 16.5,
    unit: '%',
    targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1.5 months from now
    status: 'active',
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: '4',
    type: 'endurance',
    title: '30-Day Workout Streak',
    description: 'Complete 30 consecutive days of workouts',
    targetValue: 30,
    currentValue: 5,
    unit: 'days',
    targetDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 25 days from now
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
];

export const useProgressSystem = () => {
  const { user } = useAuth();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(DEMO_WEIGHT_DATA);
  const [strengthProgress, setStrengthProgress] = useState<WorkoutProgress[]>(DEMO_STRENGTH_DATA);
  const [goals, setGoals] = useState<Goal[]>(DEMO_GOALS);

  const addWeightEntry = useCallback((entry: Omit<WeightEntry, 'id'>) => {
    const newEntry: WeightEntry = {
      ...entry,
      id: Date.now().toString()
    };
    setWeightEntries(prev => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    return newEntry;
  }, []);

  const addStrengthEntry = useCallback((entry: Omit<WorkoutProgress, 'id' | 'oneRepMax'>) => {
    // Calculate 1RM using Epley formula: 1RM = weight * (1 + reps/30)
    const oneRepMax = Math.round(entry.weight * (1 + entry.reps / 30) * 10) / 10;
    
    const newEntry: WorkoutProgress = {
      ...entry,
      id: Date.now().toString(),
      oneRepMax
    };
    setStrengthProgress(prev => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    return newEntry;
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGoals(prev => [newGoal, ...prev]);
    return newGoal;
  }, []);

  const updateGoal = useCallback((goalId: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
  }, []);

  const getProgressStats = useCallback((): ProgressStats => {
    // Calculate workout streak
    const today = new Date();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Simulate workout dates (in real app, this would come from workout logs)
    const workoutDates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      if (Math.random() > 0.3) { // 70% chance of workout each day
        workoutDates.push(date.toISOString().split('T')[0]);
      }
    }
    
    // Calculate current streak
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (workoutDates.includes(dateStr)) {
        currentStreak++;
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (i === 0) break; // If no workout today, streak is 0
        tempStreak = 0;
      }
    }

    // Calculate weight loss
    const firstWeight = weightEntries[weightEntries.length - 1]?.weight || 78;
    const currentWeight = weightEntries[0]?.weight || 74.5;
    const totalWeightLost = firstWeight - currentWeight;

    // Calculate strength gains
    const strengthGains = ['Bench Press', 'Squat', 'Deadlift'].map(exercise => {
      const exerciseData = strengthProgress.filter(p => p.exerciseName === exercise);
      if (exerciseData.length < 2) return { exercise, improvement: 0, unit: 'kg' };
      
      const latest = exerciseData[0];
      const earliest = exerciseData[exerciseData.length - 1];
      const improvement = latest.oneRepMax - earliest.oneRepMax;
      
      return { exercise, improvement, unit: 'kg' };
    });

    // Calculate weekly progress
    const weeklyProgress = [];
    for (let i = 0; i < 6; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() - 6);
      
      const weekWorkouts = workoutDates.filter(date => {
        const workoutDate = new Date(date);
        return workoutDate >= weekEnd && workoutDate <= weekStart;
      }).length;
      
      const weekWeights = weightEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= weekEnd && entryDate <= weekStart;
      });
      
      const avgWeight = weekWeights.length > 0 
        ? Math.round(weekWeights.reduce((sum, entry) => sum + entry.weight, 0) / weekWeights.length * 10) / 10
        : 0;
      
      weeklyProgress.unshift({
        week: `Week ${6 - i}`,
        workouts: weekWorkouts,
        avgWeight,
        totalCalories: weekWorkouts * 350 // Estimate 350 calories per workout
      });
    }

    return {
      totalWorkouts: workoutDates.length,
      currentStreak,
      longestStreak,
      totalWeightLost,
      averageWorkoutsPerWeek: Math.round(workoutDates.length / 4.3), // Last 30 days / ~4.3 weeks
      strengthGains,
      weeklyProgress
    };
  }, [weightEntries, strengthProgress]);

  const getWeightTrend = useCallback(() => {
    if (weightEntries.length < 2) return 'stable';
    
    const recent = weightEntries.slice(0, 3);
    const avgRecent = recent.reduce((sum, entry) => sum + entry.weight, 0) / recent.length;
    
    const older = weightEntries.slice(3, 6);
    if (older.length === 0) return 'stable';
    
    const avgOlder = older.reduce((sum, entry) => sum + entry.weight, 0) / older.length;
    
    const difference = avgOlder - avgRecent;
    
    if (difference > 0.5) return 'decreasing';
    if (difference < -0.5) return 'increasing';
    return 'stable';
  }, [weightEntries]);

  const getStrengthTrend = useCallback((exercise: string) => {
    const exerciseData = strengthProgress
      .filter(p => p.exerciseName === exercise)
      .slice(0, 4); // Last 4 entries
    
    if (exerciseData.length < 2) return 'stable';
    
    const recent = exerciseData.slice(0, 2);
    const older = exerciseData.slice(2, 4);
    
    const avgRecentMax = recent.reduce((sum, entry) => sum + entry.oneRepMax, 0) / recent.length;
    const avgOlderMax = older.reduce((sum, entry) => sum + entry.oneRepMax, 0) / older.length;
    
    const difference = avgRecentMax - avgOlderMax;
    
    if (difference > 2) return 'increasing';
    if (difference < -2) return 'decreasing';
    return 'stable';
  }, [strengthProgress]);

  const getGoalProgress = useCallback((goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return 0;
    
    const progress = (goal.currentValue / goal.targetValue) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }, [goals]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update current values for active goals
      setGoals(prev => prev.map(goal => {
        if (goal.status !== 'active') return goal;
        
        let newValue = goal.currentValue;
        
        switch (goal.type) {
          case 'weight':
            // Gradual weight loss
            if (Math.random() < 0.1) {
              newValue = Math.max(goal.targetValue, goal.currentValue - 0.1);
            }
            break;
          case 'strength':
            // Gradual strength increase
            if (Math.random() < 0.05) {
              newValue = Math.min(goal.targetValue, goal.currentValue + 0.5);
            }
            break;
          case 'body_composition':
            // Gradual body fat reduction
            if (Math.random() < 0.08) {
              newValue = Math.max(goal.targetValue, goal.currentValue - 0.1);
            }
            break;
          case 'endurance':
            // Streak can only increase by completing workouts
            // This would be updated by actual workout completion
            break;
        }
        
        // Check if goal is completed
        const isCompleted = goal.type === 'weight' || goal.type === 'body_composition' 
          ? newValue <= goal.targetValue 
          : newValue >= goal.targetValue;
        
        return {
          ...goal,
          currentValue: newValue,
          status: isCompleted ? 'completed' as const : goal.status
        };
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
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
  };
};