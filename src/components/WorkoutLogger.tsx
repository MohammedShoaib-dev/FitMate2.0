import { useState } from 'react';
import { Plus, X, Clock, Flame, Dumbbell, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWorkoutSystem, Exercise } from '@/hooks/useWorkoutSystem';
import { useToast } from '@/hooks/use-toast';

interface WorkoutLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  templateId?: string;
}

const WorkoutLogger = ({ isOpen, onClose, templateId }: WorkoutLoggerProps) => {
  const { logWorkout, logWorkoutFromTemplate, getWorkoutTemplates, isLogging } = useWorkoutSystem();
  const { toast } = useToast();
  
  const [workoutData, setWorkoutData] = useState({
    name: '',
    duration: 0,
    calories: 0,
    notes: '',
    category: 'Strength',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced'
  });
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(!templateId);

  const templates = getWorkoutTemplates();
  const selectedTemplate = templateId ? templates.find(t => t.id === templateId) : null;

  const handleTemplateLog = async (notes?: string) => {
    if (!templateId) return;
    
    const result = await logWorkoutFromTemplate(templateId, notes);
    
    if (result.success) {
      toast({
        title: "Workout Logged! 🎉",
        description: `Great job completing ${selectedTemplate?.name}!`,
      });
      onClose();
    } else {
      toast({
        title: "Failed to Log Workout",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleCustomLog = async () => {
    if (!workoutData.name || workoutData.duration <= 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in workout name and duration.",
        variant: "destructive",
      });
      return;
    }

    const result = await logWorkout({
      ...workoutData,
      exercises
    });

    if (result.success) {
      toast({
        title: "Workout Logged! 🎉",
        description: `${workoutData.name} has been added to your workout history.`,
      });
      onClose();
      resetForm();
    } else {
      toast({
        title: "Failed to Log Workout",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setWorkoutData({
      name: '',
      duration: 0,
      calories: 0,
      notes: '',
      category: 'Strength',
      level: 'Beginner'
    });
    setExercises([]);
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      sets: 1,
      reps: 1,
      weight: 0,
      restTime: 60
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5" />
              {selectedTemplate ? `Log ${selectedTemplate.name}` : 'Log Workout'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {selectedTemplate && !showCustomForm ? (
            // Template-based logging
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{selectedTemplate.name}</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline">{selectedTemplate.level}</Badge>
                    <Badge variant="secondary">{selectedTemplate.category}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedTemplate.description}
                </p>
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedTemplate.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    ~{selectedTemplate.estimatedCalories} cal
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="template-notes">Workout Notes (Optional)</Label>
                <Textarea
                  id="template-notes"
                  placeholder="How did the workout go? Any modifications or achievements?"
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Exercises</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedTemplate.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="font-medium">{exercise.name}</span>
                      <div className="text-sm text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps > 0 ? `${exercise.reps} reps` : `${exercise.duration}s`}
                        {exercise.weight && ` @ ${exercise.weight}lbs`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleTemplateLog(
                    (document.getElementById('template-notes') as HTMLTextAreaElement)?.value
                  )}
                  disabled={isLogging}
                  className="flex-1"
                >
                  {isLogging ? "Logging..." : "Log Workout"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCustomForm(true)}
                >
                  Customize
                </Button>
              </div>
            </div>
          ) : (
            // Custom workout logging
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workout-name">Workout Name</Label>
                  <Input
                    id="workout-name"
                    value={workoutData.name}
                    onChange={(e) => setWorkoutData({...workoutData, name: e.target.value})}
                    placeholder="e.g., Morning Run"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={workoutData.category} onValueChange={(value) => 
                    setWorkoutData({...workoutData, category: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Cardio">Cardio</SelectItem>
                      <SelectItem value="Flexibility">Flexibility</SelectItem>
                      <SelectItem value="Core">Core</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={workoutData.duration || ''}
                    onChange={(e) => setWorkoutData({...workoutData, duration: parseInt(e.target.value) || 0})}
                    placeholder="45"
                  />
                </div>
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={workoutData.calories || ''}
                    onChange={(e) => setWorkoutData({...workoutData, calories: parseInt(e.target.value) || 0})}
                    placeholder="300"
                  />
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select value={workoutData.level} onValueChange={(value: any) => 
                    setWorkoutData({...workoutData, level: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Exercises (Optional)</Label>
                  <Button variant="outline" size="sm" onClick={addExercise}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Exercise
                  </Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {exercises.map((exercise) => (
                    <div key={exercise.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <Input
                          placeholder="Exercise name"
                          value={exercise.name}
                          onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                          className="flex-1 mr-2"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExercise(exercise.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <Input
                          type="number"
                          placeholder="Sets"
                          value={exercise.sets || ''}
                          onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value) || 0)}
                        />
                        <Input
                          type="number"
                          placeholder="Reps"
                          value={exercise.reps || ''}
                          onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value) || 0)}
                        />
                        <Input
                          type="number"
                          placeholder="Weight"
                          value={exercise.weight || ''}
                          onChange={(e) => updateExercise(exercise.id, 'weight', parseInt(e.target.value) || 0)}
                        />
                        <Input
                          type="number"
                          placeholder="Rest (s)"
                          value={exercise.restTime || ''}
                          onChange={(e) => updateExercise(exercise.id, 'restTime', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={workoutData.notes}
                  onChange={(e) => setWorkoutData({...workoutData, notes: e.target.value})}
                  placeholder="How did the workout feel? Any achievements or modifications?"
                />
              </div>

              <Button 
                onClick={handleCustomLog}
                disabled={isLogging}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLogging ? "Logging..." : "Log Workout"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutLogger;