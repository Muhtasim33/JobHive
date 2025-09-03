import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiUrl } from "@/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSendReset = async () => {
    if (!email) return;

    setIsSending(true);
    try {
      const res = await fetch(apiUrl("/api/request-password-reset"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Reset Code Sent",
          description: data.message,
        });
        localStorage.setItem("resetEmail", email);
        navigate("/reset-code");
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Forgot Your Password?
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email to receive a reset code.
        </p>

        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />

        <Button
          onClick={handleSendReset}
          disabled={isSending || !email}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
        >
          {isSending ? "Sending..." : "Send Reset Code"}
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
