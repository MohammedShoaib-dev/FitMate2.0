import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, TrendingUp, Star, AlertCircle, MessageSquare, CheckCircle2, Key, Database, Bot, QrCode, UserCheck, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { checkEnvironmentVariables, testSupabaseConnection, testGeminiConnection } from "@/utils/testKeys";
import { useFeedback } from "@/contexts/FeedbackContext";
import { useMemberSystem } from "@/hooks/useMemberSystem";
import { useCheckInSystem } from "@/hooks/useCheckInSystem";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    feedbacks, 
    markAsReviewed, 
    markAsResolved, 
    getFeedbackStats 
  } = useFeedback();
  
  const { getMemberStats } = useMemberSystem();
  const { crowdStats } = useCheckInSystem();
  
  const [apiStatus, setApiStatus] = useState({
    supabase: { configured: false, connected: false, message: '' },
    gemini: { configured: false, connected: false, message: '' }
  });

  const feedbackStats = getFeedbackStats();
  const memberStats = getMemberStats();

  useEffect(() => {
    const checkAPIs = async () => {
      const envCheck = checkEnvironmentVariables();
      
      // Test Supabase
      const supabaseTest = await testSupabaseConnection();
      setApiStatus(prev => ({
        ...prev,
        supabase: {
          configured: envCheck.supabase,
          connected: supabaseTest.success,
          message: supabaseTest.message
        }
      }));
      
      // Test Gemini
      if (envCheck.gemini) {
        const geminiTest = await testGeminiConnection();
        setApiStatus(prev => ({
          ...prev,
          gemini: {
            configured: envCheck.gemini,
            connected: geminiTest.success,
            message: geminiTest.message
          }
        }));
      } else {
        setApiStatus(prev => ({
          ...prev,
          gemini: {
            configured: false,
            connected: false,
            message: 'API key not configured'
          }
        }));
      }
    };
    
    checkAPIs();
  }, []);



  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const handleMarkReviewed = (id: string) => {
    markAsReviewed(id);
    toast({
      title: "Feedback updated",
      description: "Feedback has been marked as reviewed.",
    });
  };

  const handleResolve = (id: string) => {
    markAsResolved(id);
    toast({
      title: "Feedback resolved",
      description: "Feedback has been marked as resolved.",
    });
  };

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
        {/* API Status Cards */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                <CardTitle>API Configuration Status</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Refresh Status
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Supabase Status */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span className="font-medium">Supabase</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {apiStatus.supabase.configured ? (
                      <Badge className="bg-green-500/10 text-green-700">Configured</Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-700">Not Configured</Badge>
                    )}
                    {apiStatus.supabase.connected ? (
                      <Badge className="bg-green-500/10 text-green-700">Connected</Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-700">Disconnected</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{apiStatus.supabase.message}</p>
              </div>

              {/* Gemini Status */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <span className="font-medium">Gemini AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {apiStatus.gemini.configured ? (
                      <Badge className="bg-green-500/10 text-green-700">Configured</Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-700">Not Configured</Badge>
                    )}
                    {apiStatus.gemini.connected ? (
                      <Badge className="bg-green-500/10 text-green-700">Connected</Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-700">Disconnected</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{apiStatus.gemini.message}</p>
              </div>
            </div>
            
            {(!apiStatus.supabase.configured || !apiStatus.gemini.configured) && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  ⚠️ Some APIs are not configured. Check your .env file and refer to SETUP.md for configuration instructions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/admin/checkins">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Check-In Management</h3>
                  <p className="text-sm text-muted-foreground">Monitor gym occupancy</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Member Management</h3>
                <p className="text-sm text-muted-foreground">{memberStats.totalMembers} total members</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground">View detailed reports</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">System Settings</h3>
                <p className="text-sm text-muted-foreground">Configure gym settings</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Occupancy
              </CardTitle>
              <Users className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{crowdStats.currentCount}/{crowdStats.maxCapacity}</div>
              <p className="text-xs text-muted-foreground">
                {crowdStats.percentage}% capacity
              </p>
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
              <div className="text-2xl font-bold">{memberStats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                {memberStats.newMembersThisMonth} new this month
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feedbackStats.averageRating}/5</div>
              <p className="text-xs text-muted-foreground">
                From {feedbackStats.totalFeedback} reviews
              </p>
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
              <div className="text-2xl font-bold">{feedbackStats.pendingFeedback}</div>
              <p className="text-xs text-muted-foreground">
                {feedbackStats.resolvedFeedback} resolved
              </p>
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

