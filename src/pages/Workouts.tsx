import { useState } from "react";
import { Plus, Clock, Flame, Trash2, Dumbbell, Sparkles, CheckCircle, CalendarDays, User, Users } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number;
  calories: number;
  notes?: string;
}

interface AvailableWorkout {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  duration: number;
  calories: number;
  isAIPick?: boolean;
}

interface GymClass {
  id: string;
  name: string;
  instructor: string;
  time: string;
  duration: string;
  spotsLeft: number;
  totalSpots: number;
  category: string;
}

const Workouts = () => {
  const [completedWorkouts, setCompletedWorkouts] = useState<Workout[]>([
    {
      id: "1",
      name: "Morning Jog",
      date: "11/18/2025",
      duration: 30,
      calories: 350,
      notes: "Felt great!",
    },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const availableWorkouts: AvailableWorkout[] = [
    {
      id: "a1",
      name: "Upper Body Strength",
      level: "Intermediate",
      category: "Strength",
      duration: 45,
      calories: 380,
      isAIPick: true,
    },
    {
      id: "a2",
      name: "HIIT Cardio Blast",
      level: "Advanced",
      category: "Cardio",
      duration: 30,
      calories: 450,
    },
    {
      id: "a3",
      name: "Yoga Flow",
      level: "Beginner",
      category: "Flexibility",
      duration: 40,
      calories: 180,
    },
  ];

  const classes: GymClass[] = [
    {
      id: "1",
      name: "Morning Yoga",
      instructor: "Sarah Johnson",
      time: "7:00 AM",
      duration: "60 min",
      spotsLeft: 8,
      totalSpots: 15,
      category: "Yoga",
    },
    {
      id: "2",
      name: "HIIT Blast",
      instructor: "Mike Chen",
      time: "9:00 AM",
      duration: "45 min",
      spotsLeft: 3,
      totalSpots: 20,
      category: "Cardio",
    },
    {
      id: "3",
      name: "Zumba Dance",
      instructor: "Maria Garcia",
      time: "11:00 AM",
      duration: "50 min",
      spotsLeft: 12,
      totalSpots: 25,
      category: "Dance",
    },
    {
      id: "4",
      name: "Spin Class",
      instructor: "James Wilson",
      time: "5:00 PM",
      duration: "45 min",
      spotsLeft: 5,
      totalSpots: 18,
      category: "Cardio",
    },
  ];

  const totalWorkouts = completedWorkouts.length;
  const totalCalories = completedWorkouts.reduce((sum, w) => sum + w.calories, 0);
  const totalMinutes = completedWorkouts.reduce((sum, w) => sum + w.duration, 0);

  const handleDelete = (id: string) => {
    setCompletedWorkouts(completedWorkouts.filter((w) => w.id !== id));
  };

  const handleBook = (classItem: GymClass) => {
    toast({
      title: "Class Booked! 🎉",
      description: `You've successfully booked ${classItem.name} with ${classItem.instructor} at ${classItem.time}.`,
    });
  };

  const levelColors = {
    Beginner: "bg-stat-green/10 text-stat-green",
    Intermediate: "bg-stat-orange/10 text-stat-orange",
    Advanced: "bg-stat-red/10 text-stat-red",
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Yoga: "bg-stat-green/10 text-stat-green",
      Cardio: "bg-stat-orange/10 text-stat-orange",
      Dance: "bg-primary/10 text-primary",
      Strength: "bg-stat-blue/10 text-stat-blue",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Workouts</h1>
            <p className="text-muted-foreground">Choose a workout or log your own</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Log Workout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Total Workouts"
            value={totalWorkouts}
            variant="blue"
            icon={<Dumbbell className="w-6 h-6" />}
          />
          <StatCard
            label="Total Calories Burned"
            value={totalCalories}
            variant="orange"
            icon={<Flame className="w-6 h-6" />}
          />
          <StatCard
            label="Total Minutes"
            value={totalMinutes}
            variant="green"
            icon={<Clock className="w-6 h-6" />}
          />
        </div>

        {/* Book a Class Section */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Book a Class</h2>
          </div>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border-0 w-full mb-4"
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Available Classes</h3>
              <span className="text-xs text-muted-foreground">
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="space-y-3">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="bg-muted/50 rounded-xl p-3 border border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground text-sm">{classItem.name}</h4>
                        <Badge className={getCategoryColor(classItem.category)} variant="secondary">
                          {classItem.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>{classItem.instructor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {classItem.time} • {classItem.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {classItem.spotsLeft} spots
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleBook(classItem)}
                      disabled={classItem.spotsLeft === 0}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Completed Workouts */}
        <div>
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-stat-green" />
            Completed Workouts
          </h2>
          <div className="space-y-3">
            {completedWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-stat-green/5 border border-stat-green/20 rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground">{workout.date}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {workout.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        {workout.calories} cal
                      </span>
                    </div>
                    {workout.notes && (
                      <p className="text-sm text-stat-green italic mt-2">{workout.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(workout.id)}
                    className="text-stat-red hover:text-stat-red hover:bg-stat-red/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Workouts */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">Available Workouts</h2>
          <div className="space-y-3">
            {availableWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-card border border-border rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{workout.name}</h3>
                      {workout.isAIPick && (
                        <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary">
                          <Sparkles className="w-3 h-3" />
                          AI Pick
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={cn("font-medium", levelColors[workout.level])}>
                        {workout.level}
                      </Badge>
                      <Badge variant="secondary">{workout.category}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {workout.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        {workout.calories} cal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Workouts;
