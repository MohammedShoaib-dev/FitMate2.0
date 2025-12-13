import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Workout {
  id: string;
  userId: string;
  name: string;
  date: string;
  duration: number;
  calories: number;
  notes?: string;
  exercises?: Exercise[];
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // for cardio exercises
  restTime?: number; // in seconds
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  duration: number;
  estimatedCalories: number;
  exercises: Exercise[];
  isAIPick?: boolean;
  description?: string;
}

const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'wt1',
    name: 'Upper Body Strength',
    level: 'Intermediate',
    category: 'Strength',
    duration: 45,
    estimatedCalories: 380,
    isAIPick: true,
    description: 'Build upper body strength with compound movements',
    exercises: [
      { id: 'e1', name: 'Push-ups', sets: 3, reps: 12, restTime: 60 },
      { id: 'e2', name: 'Pull-ups', sets: 3, reps: 8, restTime: 90 },
      { id: 'e3', name: 'Bench Press', sets: 4, reps: 10, weight: 135, restTime: 120 },
      { id: 'e4', name: 'Shoulder Press', sets: 3, reps: 12, weight: 65, restTime: 90 },
      { id: 'e5', name: 'Bicep Curls', sets: 3, reps: 15, weight: 25, restTime: 60 }
    ]
  },
  {
    id: 'wt2',
    name: 'HIIT Cardio Blast',
    level: 'Advanced',
    category: 'Cardio',
    duration: 30,
    estimatedCalories: 450,
    description: 'High-intensity interval training for maximum calorie burn',
    exercises: [
      { id: 'e6', name: 'Burpees', sets: 4, reps: 10, restTime: 30 },
      { id: 'e7', name: 'Mountain Climbers', sets: 4, duration: 30, restTime: 30 },
      { id: 'e8', name: 'Jump Squats', sets: 4, reps: 15, restTime: 30 },
      { id: 'e9', name: 'High Knees', sets: 4, duration: 30, restTime: 30 },
      { id: 'e10', name: 'Plank Jacks', sets: 4, reps: 12, restTime: 30 }
    ]
  },
  {
    id: 'wt3',
    name: 'Yoga Flow',
    level: 'Beginner',
    category: 'Flexibility',
    duration: 40,
    estimatedCalories: 180,
    description: 'Gentle yoga flow for flexibility and mindfulness',
    exercises: [
      { id: 'e11', name: 'Sun Salutation', sets: 3, reps: 5, restTime: 30 },
      { id: 'e12', name: 'Warrior Pose', sets: 2, duration: 60, restTime: 15 },
      { id: 'e13', name: 'Downward Dog', sets: 3, duration: 45, restTime: 15 },
      { id: 'e14', name: 'Child\'s Pose', sets: 2, duration: 90, restTime: 0 },
      { id: 'e15', name: 'Corpse Pose', sets: 1, duration: 300, restTime: 0 }
    ]
  },
  {
    id: 'wt4',
    name: 'Lower Body Power',
    level: 'Intermediate',
    category: 'Strength',
    duration: 50,
    estimatedCalories: 420,
    description: 'Build lower body strength and power',
    exercises: [
      { id: 'e16', name: 'Squats', sets: 4, reps: 12, weight: 185, restTime: 120 },
      { id: 'e17', name: 'Deadlifts', sets: 4, reps: 8, weight: 225, restTime: 150 },
      { id: 'e18', name: 'Lunges', sets: 3, reps: 10, weight: 25, restTime: 90 },
      { id: 'e19', name: 'Calf Raises', sets: 3, reps: 20, weight: 45, restTime: 60 },
      { id: 'e20', name: 'Leg Press', sets: 3, reps: 15, weight: 270, restTime: 120 }
    ]
  },
  {
    id: 'wt5',
    name: 'Core Crusher',
    level: 'Intermediate',
    category: 'Core',
    duration: 25,
    estimatedCalories: 200,
    description: 'Intense core workout for a strong midsection',
    exercises: [
      { id: 'e21', name: 'Plank', sets: 3, duration: 60, restTime: 30 },
      { id: 'e22', name: 'Russian Twists', sets: 3, reps: 20, restTime: 45 },
      { id: 'e23', name: 'Bicycle Crunches', sets: 3, reps: 15, restTime: 45 },
      { id: 'e24', name: 'Dead Bug', sets: 3, reps: 10, restTime: 30 },
      { id: 'e25', name: 'Mountain Climbers', sets: 3, duration: 30, restTime: 45 }
    ]
  }
];

export const useWorkoutSystem = () => {
  const { user } = useAuth();
  const [completedWorkouts, setCompletedWorkouts] = useState<Workout[]>([]);
  const [isLogging, setIsLogging] = useState(false);

  // Initialize with demo data
  useEffect(() => {
    if (user) {
      const demoWorkouts: Workout[] = [
        {
          id: '1',
          userId: user.id,
          name: 'Morning Jog',
          date: new Date().toLocaleDateString(),
          duration: 30,
          calories: 350,
          notes: 'Felt great! Perfect weather.',
          category: 'Cardio',
          level: 'Beginner',
          exercises: [
            { id: 'demo1', name: 'Jogging', sets: 1, duration: 1800, reps: 0 }
          ]
        },
        {
          id: '2',
          userId: user.id,
          name: 'Upper Body Strength',
          date: new Date(Date.now() - 86400000).toLocaleDateString(), // Yesterday
          duration: 45,
          calories: 380,
          notes: 'Great pump! Increased weight on bench press.',
          category: 'Strength',
          level: 'Intermediate',
          exercises: [
            { id: 'demo2', name: 'Bench Press', sets: 4, reps: 10, weight: 135 },
            { id: 'demo3', name: 'Pull-ups', sets: 3, reps: 8 }
          ]
        }
      ];
      setCompletedWorkouts(demoWorkouts);
    }
  }, [user]);

  const logWorkout = useCallback(async (workoutData: {
    name: string;
    duration: number;
    calories: number;
    notes?: string;
    exercises?: Exercise[];
    category: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    templateId?: string;
  }) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    setIsLogging(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newWorkout: Workout = {
        id: Date.now().toString(),
        userId: user.id,
        name: workoutData.name,
        date: new Date().toLocaleDateString(),
        duration: workoutData.duration,
        calories: workoutData.calories,
        notes: workoutData.notes,
        exercises: workoutData.exercises || [],
        category: workoutData.category,
        level: workoutData.level
      };

      setCompletedWorkouts(prev => [newWorkout, ...prev]);
      
      return { success: true, workout: newWorkout };
    } catch (error) {
      return { success: false, error: 'Failed to log workout' };
    } finally {
      setIsLogging(false);
    }
  }, [user]);

  const logWorkoutFromTemplate = useCallback(async (templateId: string, customNotes?: string) => {
    const template = WORKOUT_TEMPLATES.find(t => t.id === templateId);
    if (!template) return { success: false, error: 'Template not found' };

    return await logWorkout({
      name: template.name,
      duration: template.duration,
      calories: template.estimatedCalories,
      notes: customNotes || `Completed ${template.name} workout`,
      exercises: template.exercises,
      category: template.category,
      level: template.level,
      templateId
    });
  }, [logWorkout]);

  const deleteWorkout = useCallback((workoutId: string) => {
    setCompletedWorkouts(prev => prev.filter(w => w.id !== workoutId));
  }, []);

  const getWorkoutStats = useCallback(() => {
    const totalWorkouts = completedWorkouts.length;
    const totalCalories = completedWorkouts.reduce((sum, w) => sum + w.calories, 0);
    const totalMinutes = completedWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10;

    // Calculate this week's stats
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const thisWeekWorkouts = completedWorkouts.filter(w => 
      new Date(w.date) >= oneWeekAgo
    );
    
    const weeklyCalories = thisWeekWorkouts.reduce((sum, w) => sum + w.calories, 0);
    const weeklyMinutes = thisWeekWorkouts.reduce((sum, w) => sum + w.duration, 0);

    // Most popular category
    const categoryCount: Record<string, number> = {};
    completedWorkouts.forEach(w => {
      categoryCount[w.category] = (categoryCount[w.category] || 0) + 1;
    });
    
    const favoriteCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

    return {
      totalWorkouts,
      totalCalories,
      totalMinutes,
      totalHours,
      weeklyWorkouts: thisWeekWorkouts.length,
      weeklyCalories,
      weeklyMinutes,
      favoriteCategory,
      averageCaloriesPerWorkout: totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0,
      averageDurationPerWorkout: totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0
    };
  }, [completedWorkouts]);

  const getWorkoutTemplates = useCallback(() => {
    return WORKOUT_TEMPLATES;
  }, []);

  const getRecentWorkouts = useCallback((limit: number = 5) => {
    return completedWorkouts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [completedWorkouts]);

  return {
    completedWorkouts,
    isLogging,
    logWorkout,
    logWorkoutFromTemplate,
    deleteWorkout,
    getWorkoutStats,
    getWorkoutTemplates,
    getRecentWorkouts
  };
};