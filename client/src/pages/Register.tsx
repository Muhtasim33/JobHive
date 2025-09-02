import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useLocation } from 'wouter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';

/**
 * Register Page Component
 * 
 * Initial registration page with account type selection
 * Follows the design from provided mockups
 */
const Register = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { sendVerificationCode, isAuthenticated } = useUser();

  
  // Password validation rules
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    symbol: false
  });

  // Set page title
  useEffect(() => {
    document.title = "Create Account - JobHive";
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Validate password as user types
  useEffect(() => {
    // Check minimum length
    const hasMinLength = password.length >= 8;
    
    // Check for lowercase letter
    const hasLowercase = /[a-z]/.test(password);
    
    // Check for uppercase letter
    const hasUppercase = /[A-Z]/.test(password);
    
    // Check for symbol
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    
    // Update validation state
    setPasswordValidation({
      length: hasMinLength,
      lowercase: hasLowercase,
      uppercase: hasUppercase,
      symbol: hasSymbol
    });
    
    // Reset error when password changes
    setPasswordError(null);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (!agreeTerms) {
      alert('You must agree to the Terms of Service');
      return;
    }
    
    // Check password requirements
    const allRequirementsMet = 
      passwordValidation.length && 
      passwordValidation.lowercase && 
      passwordValidation.uppercase && 
      passwordValidation.symbol;
    
    if (!allRequirementsMet) {
      setPasswordError('Password does not meet all requirements');
      return;
    }
    
    // If form is valid and just registering (not proceeding to next step)
    // then try to register the user
    try {
      const success = await sendVerificationCode(
      fullName,
      email,
      password,
      accountType

    );

      if (success) {
        // Store email and account type for verification flow 
        localStorage.setItem('pendingVerificationEmail', email);
        localStorage.setItem('registrationAccountType', accountType);
        localStorage.setItem('registrationFullName', fullName);

        // Redirect to verification screen
        navigate(`/verify-email?email=${email}`);
    }
 else {
        alert('Registration failed. This email might already be registered.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section - Registration Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col mt-16">
        <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
          <h1 className="text-2xl font-bold mb-4">Create account</h1>
          
          <p className="text-gray-600 text-sm mb-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#F6C500] hover:underline">
              Log in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Select 
                value={accountType} 
                onValueChange={setAccountType}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student/Job Seeker</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Input
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-12 w-full"
              />
            </div>


            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`h-12 ${passwordError ? 'border-red-500' : ''}`}
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
              
              {/* Password Requirements */}
              <div className="mt-2 text-xs space-y-1">
                <div className="text-gray-500 mb-1">Password requirements:</div>
                <div className={`flex items-center ${passwordValidation.length ? 'text-green-500' : 'text-gray-400'}`}>
                  <i className={`fas fa-${passwordValidation.length ? 'check' : 'times'} mr-2`}></i>
                  At least 8 characters
                </div>
                <div className={`flex items-center ${passwordValidation.lowercase ? 'text-green-500' : 'text-gray-400'}`}>
                  <i className={`fas fa-${passwordValidation.lowercase ? 'check' : 'times'} mr-2`}></i>
                  One lowercase letter
                </div>
                <div className={`flex items-center ${passwordValidation.uppercase ? 'text-green-500' : 'text-gray-400'}`}>
                  <i className={`fas fa-${passwordValidation.uppercase ? 'check' : 'times'} mr-2`}></i>
                  One uppercase letter
                </div>
                <div className={`flex items-center ${passwordValidation.symbol ? 'text-green-500' : 'text-gray-400'}`}>
                  <i className={`fas fa-${passwordValidation.symbol ? 'check' : 'times'} mr-2`}></i>
                  One symbol
                </div>
                {passwordError && <div className="text-red-500 mt-1">{passwordError}</div>}
              </div>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`h-12 ${password !== confirmPassword && confirmPassword.length > 0 ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </button>
              {password !== confirmPassword && confirmPassword.length > 0 && (
                <div className="text-red-500 text-xs mt-1">Passwords do not match</div>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="mt-1"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-500 leading-tight"
              >
                I've read and agree with your{' '}
                <Link href="/terms" className="text-[#F6C500] hover:underline">
                  Terms of Services
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-medium"
              style={{ backgroundColor: "#F6C500", color: "#000000" }}
              disabled={
                !agreeTerms || 
                !passwordValidation.length || 
                !passwordValidation.lowercase || 
                !passwordValidation.uppercase || 
                !passwordValidation.symbol || 
                password !== confirmPassword || 
                !password
              }
            >
              Create Account <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </form>
        </div>
      </div>

      {/* Right Section - Statistics and Image */}
      <div className="hidden md:flex md:w-1/2 bg-[#F5F7FF] p-12 lg:p-16 flex-col">
        <div className="flex-grow flex flex-col justify-center items-center">
          <div className="max-w-md">
            <div className="mb-12">
              <img 
                src="https://cdn.pixabay.com/photo/2019/10/09/07/28/development-4536630_1280.png" 
                alt="People searching for jobs" 
                className="w-full"
              />
            </div>

            <h2 className="text-2xl font-bold mb-10">
              Over 1,75,324 candidates waiting for good employees.
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0A0F23] p-4 rounded-md flex flex-col items-center text-white">
                <div className="w-10 h-10 flex items-center justify-center mb-2">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div className="font-bold"></div>
                <div className="text-xs"></div>
              </div>
              <div className="bg-[#0A0F23] p-4 rounded-md flex flex-col items-center text-white">
                <div className="w-10 h-10 flex items-center justify-center mb-2">
                  <i className="fas fa-building"></i>
                </div>
                <div className="font-bold"></div>
                <div className="text-xs"></div>
              </div>
              <div className="bg-[#0A0F23] p-4 rounded-md flex flex-col items-center text-white">
                <div className="w-10 h-10 flex items-center justify-center mb-2">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div className="font-bold"></div>
                <div className="text-xs"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;