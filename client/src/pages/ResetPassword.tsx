import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiUrl } from "@/config";

const ResetPassword = () => {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem("resetEmail") || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async () => {
    if (!code || !newPassword || !email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(apiUrl("/api/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, new_password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Password Updated",
          description: "You can now log in with your new password.",
        });
        localStorage.removeItem("resetEmail");
        navigate("/login");
      } else {
        toast({
          title: "Reset Failed",
          description: data.message || "Invalid code or error occurred.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-2">Reset Your Password</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the code sent to your email and set a new password.
        </p>

        <Input
          placeholder="Enter 6-digit reset code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mb-3"
        />

        <div className="relative mb-4">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pr-10"
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

        <Button
          onClick={handleReset}
          disabled={isSubmitting}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
