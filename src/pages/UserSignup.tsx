import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dumbbell, Mail, Lock, ArrowLeft, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/ui/Logo";

const UserSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Try Supabase signup first
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: 'user'
          }
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        throw error;
      }

      if (data.user) {
        // Check if email confirmation is required
        if (!data.session) {
          toast({
            title: "Check your email!",
            description: "We sent you a confirmation link. Please check your email and click the link to activate your account.",
          });
          navigate("/login/user");
          return;
        }

        // Try to insert user profile into users table (if table exists)
        try {
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: formData.email,
                name: formData.name,
                role: 'user'
              }
            ]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        } catch (profileError) {
          console.error('Users table might not exist:', profileError);
        }

        toast({
          title: "Account created successfully!",
          description: "Welcome to FitMate! Logging you in...",
        });

        // Auto-login after successful signup
        const loginSuccess = await login(formData.email, formData.password, "user");
        if (loginSuccess) {
          navigate("/");
        } else {
          navigate("/login/user");
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Fallback: Create a demo account in localStorage
      const newUser = {
        id: `USER_${Date.now()}`,
        email: formData.email,
        name: formData.name,
        role: 'user' as const
      };

      // Store in localStorage for demo mode
      localStorage.setItem("fitmate_demo_user", JSON.stringify(newUser));
      
      toast({
        title: "Account created! (Demo Mode)",
        description: "Your account has been created in demo mode. You can now log in.",
      });

      // Try to auto-login with demo credentials
      setTimeout(async () => {
        const loginSuccess = await login(formData.email, formData.password, "user");
        if (loginSuccess) {
          navigate("/");
        } else {
          navigate("/login/user");
        }
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo size="lg" showText={true} />
          </div>
          <div>
            <CardTitle className="text-2xl">Join FitMate</CardTitle>
            <CardDescription className="mt-2">
              Create your account and start your fitness journey!
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login/user" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to role selection
            </Link>
          </div>

          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm font-semibold text-foreground mb-2">Demo Note:</p>
            <p className="text-xs text-muted-foreground">
              You can also use existing demo accounts: user@fitmate.com / user123 or jane@fitmate.com / jane123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSignup;