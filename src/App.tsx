import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { FeedbackProvider } from "./contexts/FeedbackContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleSelection from "./pages/RoleSelection";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CheckInManagement from "./pages/CheckInManagement";
import Index from "./pages/Index";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress";
import Feedback from "./pages/Feedback";
import AICoach from "./pages/AICoach";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FeedbackProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<RoleSelection />} />
            <Route path="/login/user" element={<UserLogin />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route path="/login/admin" element={<AdminLogin />} />

            {/* Protected user routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts"
              element={
                <ProtectedRoute>
                  <Workouts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition"
              element={
                <ProtectedRoute>
                  <Nutrition />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <Navigate to="/" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-coach"
              element={
                <ProtectedRoute>
                  <AICoach />
                </ProtectedRoute>
              }
            />

            {/* Protected admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/checkins"
              element={
                <ProtectedRoute requireAdmin>
                  <CheckInManagement />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </FeedbackProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
