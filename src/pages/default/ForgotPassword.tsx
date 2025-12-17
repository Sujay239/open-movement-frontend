import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Loader2, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import { useAlert } from "@/components/blocks/AlertProvider";

// Environment variable for base URL
const BASE_URL = import.meta.env?.VITE_BASE_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showError, showSuccess } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email.trim() || !email.includes("@")) {
      showError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      // Demo API Call
      const url = `${BASE_URL?.replace(/\/$/, "")}/forgot-password`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const contentType = res.headers.get("content-type");
      let data;

      // Handle JSON response if present
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset link.");
      }

      // On Success: Show success state
      setIsSuccess(true);
      showSuccess("Reset link sent successfully!");
    } catch (err: any) {
      showError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <Card className="border-slate-200 dark:border-white/10 shadow-xl overflow-hidden">
          {/* Header Icon - Changes based on state */}
          <div className="pt-8 flex justify-center">
            <div
              className={`p-4 rounded-full ${
                isSuccess
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              } transition-all duration-500`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-10 h-10" />
              ) : (
                <KeyRound className="w-10 h-10" />
              )}
            </div>
          </div>

          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {isSuccess ? "Check your inbox" : "Forgot password?"}
            </CardTitle>
            <CardDescription className="text-base mt-2 px-4">
              {isSuccess ? (
                <>
                  We sent a password reset link to{" "}
                  <span className="font-medium text-slate-900 dark:text-white">
                    {email}
                  </span>
                </>
              ) : (
                "No worries! Enter your email and we'll send you reset instructions."
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8">
            {isSuccess ? (
              // --- SUCCESS VIEW ---
              <div className="space-y-6 pt-2">
                <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-4 text-sm text-center text-slate-600 dark:text-slate-300">
                  <p>
                    Didn't receive the email? Check your spam folder or try
                    another email address.
                  </p>
                </div>

                <div className="grid gap-3">
                  <Button
                    onClick={() => window.open(`mailto:${email}`, "_blank")}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Open Email App
                  </Button>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Try another email
                  </Button>
                </div>
              </div>
            ) : (
              // --- FORM VIEW ---
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-9 h-11"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 transition-all font-medium cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t bg-slate-50/50 dark:bg-zinc-900/50 p-6 mt-4">
            <Link
              to="/login"
              className="flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
