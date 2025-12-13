import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, TrendingUp, Star, AlertCircle, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Feedback {
  id: string;
  userId: string;
  userName: string;
  date: string;
  comment: string;
  rating: number;
  category: string;
  status: "pending" | "reviewed" | "resolved";
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: "1",
      userId: "USER001",
      userName: "John Doe",
      date: "11/18/2025",
      comment: "Love the new dumbbells! Great quality.",
      rating: 5,
      category: "Equipment",
      status: "reviewed",
    },
    {
      id: "2",
      userId: "USER002",
      userName: "Jane Smith",
      date: "11/18/2025",
      comment: "Bathroom could be cleaner. AC not working well.",
      rating: 3,
      category: "Facility",
      status: "pending",
    },
    {
      id: "3",
      userId: "USER003",
      userName: "Mike Johnson",
      date: "11/17/2025",
      comment: "Excellent trainers and facilities!",
      rating: 5,
      category: "Service",
      status: "reviewed",
    },
  ]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const handleMarkReviewed = (id: string) => {
    setFeedbacks((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, status: "reviewed" as const } : fb))
    );
    toast({
      title: "Feedback updated",
      description: "Feedback has been marked as reviewed.",
    });
  };

  const handleResolve = (id: string) => {
    setFeedbacks((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, status: "resolved" as const } : fb))
    );
    toast({
      title: "Feedback resolved",
      description: "Feedback has been marked as resolved.",
    });
  };

  const currentMembers = 12;
  const totalMembers = 285;
  const avgRating = 4.2;
  const pendingFeedback = feedbacks.filter((f) => f.status === "pending").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reviewed":
        return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">Reviewed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">Pending</Badge>;
      case "resolved":
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">Resolved</Badge>;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-primary-foreground/80">Welcome, {user?.name || "Admin"} ID: {user?.id}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Members
              </CardTitle>
              <Users className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMembers}/50</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Members
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating}/5</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Feedback
              </CardTitle>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingFeedback}</div>
            </CardContent>
          </Card>
        </div>

        {/* Member Feedback Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <CardTitle>Member Feedback</CardTitle>
              </div>
              <span className="text-sm text-muted-foreground">{feedbacks.length} total feedback</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="p-4 border rounded-lg space-y-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{feedback.userName}</h3>
                      <Badge variant="outline">{feedback.category}</Badge>
                      {getStatusBadge(feedback.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      ID: {feedback.userId} • {feedback.date}
                    </p>
                    <p className="text-sm">{feedback.comment}</p>
                  </div>
                  <div className="flex items-center gap-1">{renderStars(feedback.rating)}</div>
                </div>
                <div className="flex gap-2">
                  {feedback.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkReviewed(feedback.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark as Reviewed
                    </Button>
                  )}
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleResolve(feedback.id)}
                    disabled={feedback.status === "resolved"}
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

