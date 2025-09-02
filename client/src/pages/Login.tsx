import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useLocation } from 'wouter';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import loginImage from '@/assets/login.png';

/**
 * Login Page Component
 * 
 * Dedicated login page with form and statistics display
 * Follows the design from provided mockups
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { login, isAuthenticated } = useUser();
  const { toast } = useToast();
  const { user } = useUser();

  // Set page title
  useEffect(() => {
    document.title = "Sign In - JobHive";
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoginError(null);

  try {
    const success = await login(email, password);

    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome back to JobHive!",
        variant: "default",
      });

      // Retrieve user from localStorage after login
      const storedUser = localStorage.getItem("jobhive_user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (parsedUser?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setLoginError("Invalid email or password");
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    setLoginError("An error occurred during login");
    toast({
      title: "Error",
      description: "An error occurred during login. Please try again.",
      variant: "destructive",
    });
  }
};


  return (
    <div className="min-h-screen flex">
      {/* Left Section - Login Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col">
        <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
          <h1 className="text-2xl font-bold mb-6">Sign in</h1>
          
          <p className="text-gray-600 text-sm mb-6">
            Don't have account?{' '}
            <Link href="/register" className="text-[#F6C500] hover:underline">
              Create Account
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLoginError(null); // Clear error when email changes
                }}
                required
                className={`h-12 ${loginError ? 'border-red-500' : ''}`}
              />
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError(null); // Clear error when password changes
                  }}
                  required
                  className={`h-12 ${loginError ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </button>
              </div>
              {loginError && <div className="text-red-500 text-xs">{loginError}</div>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember Me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-[#F6C500] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-medium"
              style={{ backgroundColor: "#F6C500", color: "#000000" }}
            >
              GET STARTED <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </form>
        </div>
      </div>

      {/* Right Section - Statistics and Image */}
      <div className="hidden md:flex md:w-2/5 bg-[#F5F7FF] p-8 lg:p-12 flex-col">
        <div className="flex-grow flex flex-col justify-center items-center">
          <div className="max-w-sm">
            <h2 className="text-xl font-bold mb-8">
              Over 1,75,324 candidates waiting for good employees.
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-3 rounded-md flex flex-col items-center">
                <div className="w-8 h-8 bg-[#F5F7FF] rounded-md flex items-center justify-center mb-1">
                  <i className="fas fa-briefcase text-gray-600 text-sm"></i>
                </div>
                <div className="font-bold text-sm">1,75,324</div>
                <div className="text-xs text-gray-500">Live Jobs</div>
              </div>
              <div className="bg-white p-3 rounded-md flex flex-col items-center">
                <div className="w-8 h-8 bg-[#F5F7FF] rounded-md flex items-center justify-center mb-1">
                  <i className="fas fa-building text-gray-600 text-sm"></i>
                </div>
                <div className="font-bold text-sm">97,354</div>
                <div className="text-xs text-gray-500">Companies</div>
              </div>
              <div className="bg-white p-3 rounded-md flex flex-col items-center">
                <div className="w-8 h-8 bg-[#F5F7FF] rounded-md flex items-center justify-center mb-1">
                  <i className="fas fa-briefcase text-gray-600 text-sm"></i>
                </div>
                <div className="font-bold text-sm">7,532</div>
                <div className="text-xs text-gray-500">New Jobs</div>
              </div>
            </div>

            <div className="mt-6">
              <img
                src={loginImage}
                alt="People collaborating" 
                className="w-3/4 mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;