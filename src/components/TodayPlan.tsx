import { Dumbbell, Apple, Clock, Flame } from "lucide-react";

interface TodayPlanProps {
  workout: {
    name: string;
    duration: string;
    calories: number;
  };
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

const TodayPlan = ({ workout, meals }: TodayPlanProps) => {
  return (
    <div className="bg-card rounded-xl p-5 shadow-sm animate-slide-up">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
        My Plan for Today
      </h3>

      <div className="space-y-4">
        {/* Workout Section */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{workout.name}</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {workout.duration}
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                {workout.calories} cal
              </span>
            </div>
          </div>
        </div>

        {/* Meals Section */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-stat-green/5 border border-stat-green/10">
          <div className="w-10 h-10 rounded-lg bg-stat-green/10 flex items-center justify-center flex-shrink-0">
            <Apple className="w-5 h-5 text-stat-green" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground mb-2">Today's Meals</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-medium text-foreground">Breakfast:</span> {meals.breakfast}</p>
              <p><span className="font-medium text-foreground">Lunch:</span> {meals.lunch}</p>
              <p><span className="font-medium text-foreground">Dinner:</span> {meals.dinner}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayPlan;
