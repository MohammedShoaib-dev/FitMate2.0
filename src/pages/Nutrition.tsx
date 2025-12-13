import { useState } from "react";
import { Sparkles, Dumbbell, Apple, Clock, Flame, Utensils } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: string[];
}

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  items: string[];
}

const Nutrition = () => {
  const [activeTab, setActiveTab] = useState("workout");

  const weeklyWorkout: WorkoutDay[] = [
    { day: "Monday", focus: "Chest & Triceps", exercises: ["Bench Press", "Incline Dumbbell Press", "Tricep Dips"] },
    { day: "Tuesday", focus: "Back & Biceps", exercises: ["Deadlifts", "Pull-ups", "Barbell Rows"] },
    { day: "Wednesday", focus: "Rest Day", exercises: ["Light stretching", "Walk"] },
    { day: "Thursday", focus: "Legs", exercises: ["Squats", "Leg Press", "Lunges"] },
    { day: "Friday", focus: "Shoulders & Core", exercises: ["Overhead Press", "Lateral Raises", "Planks"] },
    { day: "Saturday", focus: "Full Body HIIT", exercises: ["Burpees", "Mountain Climbers", "Jump Squats"] },
    { day: "Sunday", focus: "Active Recovery", exercises: ["Yoga", "Swimming"] },
  ];

  const dailyMeals: Meal[] = [
    {
      name: "Breakfast",
      calories: 450,
      protein: 30,
      carbs: 45,
      fats: 15,
      items: ["Oatmeal with berries", "Scrambled eggs (2)", "Protein shake"],
    },
    {
      name: "Lunch",
      calories: 550,
      protein: 40,
      carbs: 50,
      fats: 18,
      items: ["Grilled chicken breast", "Brown rice", "Mixed vegetables", "Olive oil dressing"],
    },
    {
      name: "Snack",
      calories: 200,
      protein: 15,
      carbs: 20,
      fats: 8,
      items: ["Greek yogurt", "Almonds", "Apple"],
    },
    {
      name: "Dinner",
      calories: 500,
      protein: 35,
      carbs: 40,
      fats: 20,
      items: ["Salmon fillet", "Quinoa", "Roasted broccoli", "Avocado"],
    },
  ];

  const totalNutrition = dailyMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <AppLayout title="AI Planner" subtitle="Personalized plans just for you" showBanner>
      <div className="p-4 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 bg-muted p-1 rounded-xl">
            <TabsTrigger
              value="workout"
              className={cn(
                "rounded-lg font-medium transition-all",
                activeTab === "workout" && "bg-primary text-primary-foreground"
              )}
            >
              <Dumbbell className="w-4 h-4 mr-2" />
              Workout
            </TabsTrigger>
            <TabsTrigger
              value="diet"
              className={cn(
                "rounded-lg font-medium transition-all",
                activeTab === "diet" && "bg-primary text-primary-foreground"
              )}
            >
              <Apple className="w-4 h-4 mr-2" />
              Diet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workout" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Weekly Workout Plan</h2>
              <Button size="sm" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Generate New Plan
              </Button>
            </div>

            <div className="space-y-3">
              {weeklyWorkout.map((day, index) => (
                <div
                  key={day.day}
                  className={cn(
                    "bg-card rounded-xl p-4 shadow-sm border-l-4 animate-slide-up",
                    day.focus === "Rest Day" || day.focus === "Active Recovery"
                      ? "border-l-stat-green"
                      : "border-l-primary"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{day.day}</p>
                      <h3 className="font-semibold text-foreground">{day.focus}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {day.exercises.map((exercise) => (
                          <span
                            key={exercise}
                            className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground"
                          >
                            {exercise}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="diet" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Daily Meal Plan</h2>
              <Button size="sm" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Generate New Plan
              </Button>
            </div>

            {/* Nutrition Summary */}
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <h3 className="font-medium text-foreground mb-3">Daily Totals</h3>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div>
                  <p className="text-xl font-bold text-foreground">{totalNutrition.calories}</p>
                  <p className="text-xs text-muted-foreground">Calories</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-stat-blue">{totalNutrition.protein}g</p>
                  <p className="text-xs text-muted-foreground">Protein</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-stat-orange">{totalNutrition.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-stat-green">{totalNutrition.fats}g</p>
                  <p className="text-xs text-muted-foreground">Fats</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {dailyMeals.map((meal, index) => (
                <div
                  key={meal.name}
                  className="bg-card rounded-xl p-4 shadow-sm border-l-4 border-l-stat-green animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-stat-green/10 flex items-center justify-center">
                        <Utensils className="w-4 h-4 text-stat-green" />
                      </div>
                      <h3 className="font-semibold text-foreground">{meal.name}</h3>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {meal.calories} cal
                    </span>
                  </div>
                  <div className="space-y-2">
                    {meal.items.map((item) => (
                      <p key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-stat-green" />
                        {item}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>P: {meal.protein}g</span>
                    <span>C: {meal.carbs}g</span>
                    <span>F: {meal.fats}g</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Nutrition;
