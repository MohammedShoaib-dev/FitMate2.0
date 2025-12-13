import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFeedback } from "@/contexts/FeedbackContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { addFeedback } = useFeedback();
  const { user } = useAuth();

  const categories = [
    { value: "Equipment", label: "Equipment" },
    { value: "Facility", label: "Facility" },
    { value: "Service", label: "Service" },
    { value: "Classes", label: "Classes" },
    { value: "Amenities", label: "Amenities" },
    { value: "Other", label: "Other" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Your rating helps us improve our services.",
        variant: "destructive",
      });
      return;
    }

    if (!category) {
      toast({
        title: "Please select a category",
        description: "This helps us route your feedback to the right team.",
        variant: "destructive",
      });
      return;
    }

    if (message.length < 10) {
      toast({
        title: "Please provide more details",
        description: "Your feedback should be at least 10 characters.",
        variant: "destructive",
      });
      return;
    }

    // Add feedback to the system
    const newFeedback = {
      userId: user?.id || "GUEST",
      userName: user?.name || "Guest User",
      date: new Date().toLocaleDateString(),
      comment: message,
      rating: rating,
      category: category,
      status: "pending" as const
    };

    addFeedback(newFeedback);

    toast({
      title: "Feedback Submitted! 🙏",
      description: "Thank you for helping us improve. We'll review your feedback shortly.",
    });

    // Reset form
    setRating(0);
    setCategory("");
    setMessage("");
  };

  return (
    <AppLayout title="Send Us Your Feedback" showBanner>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 shadow-sm space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block font-medium text-foreground mb-3">
              How satisfied are you?
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-10 h-10 transition-colors",
                      (hoveredRating || rating) >= star
                        ? "fill-stat-orange text-stat-orange"
                        : "text-border"
                    )}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              {rating === 0
                ? "Select a rating"
                : rating === 1
                ? "Poor"
                : rating === 2
                ? "Fair"
                : rating === 3
                ? "Good"
                : rating === 4
                ? "Very Good"
                : "Excellent!"}
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium text-foreground mb-2">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div>
            <label className="block font-medium text-foreground mb-2">Your Feedback</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think... (minimum 10 characters)"
              rows={5}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Characters: {message.length}
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            <MessageSquare className="w-5 h-5 mr-2" />
            Submit Feedback
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Feedback;
