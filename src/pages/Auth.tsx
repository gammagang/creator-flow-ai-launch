import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, Sparkles, Heart, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);
  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  // Don't render auth form if user is already authenticated
  if (user) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleAuth = async () => {
    try {
      setSubmitLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error("An error occurred during Google authentication");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        if (data.user) {
          toast.success("Logged in successfully!");
          navigate("/dashboard");
        }
      } else {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        if (data.user) {
          toast.success(
            "Account created successfully! Please check your email to verify your account."
          );
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Decorative sparkles */}
      <Sparkles className="w-6 h-6 text-yellow-400 absolute top-20 left-1/4 animate-pulse" />
      <Sparkles className="w-4 h-4 text-pink-400 absolute top-32 right-1/3 animate-pulse delay-150" />
      <Sparkles className="w-5 h-5 text-orange-400 absolute bottom-20 left-1/3 animate-pulse delay-300" />
      <Heart className="w-6 h-6 text-pink-400 absolute top-16 right-1/4 animate-bounce" />      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md">
          {/* Back to Home Button */}
          <div className="text-center mb-6">
            <Link to="/">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-orange-600 hover:bg-white/50 rounded-xl px-4 py-2 transition-colors duration-200 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-300 to-pink-300 rounded-2xl flex items-center justify-center relative">
                <Bot className="w-7 h-7 text-white" />
                <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-gray-800">
                  <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    Flow
                  </span>
                </h1>
                <p className="text-sm text-gray-600 font-medium">AI Platform</p>
              </div>
            </div>
          </div>{" "}
          <Card className="border-2 border-gray-200 rounded-3xl bg-white/90 backdrop-blur-sm shadow-[8px_8px_0px_0px_#000]">
            <CardHeader className="text-center p-8">
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                {isLogin ? "Welcome Back ✨" : "Get Started 🚀"}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 font-medium">
                {isLogin
                  ? "Sign in to your brand account and continue your journey"
                  : "Create your brand account to start discovering amazing creators"}
              </CardDescription>
            </CardHeader>{" "}
            <CardContent className="p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-base font-semibold text-gray-700"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="brand@company.com"
                    required
                    disabled={submitLoading}
                    className="h-12 text-base rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-0 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {/* Password */}
                <div className="space-y-3">
                  <Label
                    htmlFor="password"
                    className="text-base font-semibold text-gray-700"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    disabled={submitLoading}
                    className="h-12 text-base rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-0 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {/* Signup Additional Fields */}
                {!isLogin && (
                  <div className="space-y-3">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-base font-semibold text-gray-700"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                      disabled={submitLoading}
                      className="h-12 text-base rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-0 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white text-lg font-semibold rounded-xl shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    "Please wait..."
                  ) : (
                    <div className="flex items-center justify-center">
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Toggle between login/signup */}
              <div className="mt-8 text-center">
                <p className="text-base text-gray-600 font-medium">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-orange-600 hover:text-pink-600 font-bold transition-colors duration-200"
                    disabled={submitLoading}
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>

              {/* Additional text */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 font-medium">
                  Made with <Heart className="w-4 h-4 inline text-pink-400" />{" "}
                  for creators
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
