import  { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export const RegisterForm = () => {
  const [focusedField, setFocusedField] = useState("");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 dark:bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Form container */}
      <div className="relative w-full max-w-md mx-4 z-10">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-700">
          {/* Header */}
          <div className="space-y-2 text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white animate-in slide-in-from-top duration-500 delay-200">
              Create an account
            </h1>
            <p className="text-slate-600 dark:text-blue-200/70 animate-in fade-in duration-500 delay-300">
              Enter your details to get started with School Access
            </p>
          </div>

          {/* Form fields */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-left duration-500 delay-400">
              <div className="space-y-2">
                <Label
                  htmlFor="first-name"
                  className="text-slate-700 dark:text-blue-100 text-sm font-medium"
                >
                  First name
                </Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  onFocus={() => setFocusedField("first-name")}
                  onBlur={() => setFocusedField("")}
                  className={`h-12 bg-slate-50 dark:bg-white/5 border backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-blue-200/40 transition-all duration-300 ${
                    focusedField === "first-name"
                      ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 bg-white dark:bg-white/10"
                      : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="last-name"
                  className="text-slate-700 dark:text-blue-100 text-sm font-medium"
                >
                  Last name
                </Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  onFocus={() => setFocusedField("last-name")}
                  onBlur={() => setFocusedField("")}
                  className={`h-12 bg-slate-50 dark:bg-white/5 border backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-blue-200/40 transition-all duration-300 ${
                    focusedField === "last-name"
                      ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 bg-white dark:bg-white/10"
                      : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2 animate-in slide-in-from-left duration-500 delay-500">
              <Label
                htmlFor="school"
                className="text-slate-700 dark:text-blue-100 text-sm font-medium"
              >
                School Name
              </Label>
              <div className="relative group">
                <Building2
                  className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                    focusedField === "school"
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-slate-400 dark:text-blue-200/50"
                  }`}
                />
                <Input
                  id="school"
                  placeholder="Lincoln High School"
                  onFocus={() => setFocusedField("school")}
                  onBlur={() => setFocusedField("")}
                  className={`pl-12 h-12 bg-slate-50 dark:bg-white/5 border backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-blue-200/40 transition-all duration-300 ${
                    focusedField === "school"
                      ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 bg-white dark:bg-white/10"
                      : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2 animate-in slide-in-from-left duration-500 delay-600">
              <Label
                htmlFor="email"
                className="text-slate-700 dark:text-blue-100 text-sm font-medium"
              >
                Email
              </Label>
              <div className="relative">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                    focusedField === "email"
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-slate-400 dark:text-blue-200/50"
                  }`}
                />
                <Input
                  id="email"
                  placeholder="name@school.com"
                  type="email"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  className={`pl-12 h-12 bg-slate-50 dark:bg-white/5 border backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-blue-200/40 transition-all duration-300 ${
                    focusedField === "email"
                      ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 bg-white dark:bg-white/10"
                      : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2 animate-in slide-in-from-left duration-500 delay-700">
              <Label
                htmlFor="password"
                className="text-slate-700 dark:text-blue-100 text-sm font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                    focusedField === "password"
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-slate-400 dark:text-blue-200/50"
                  }`}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  className={`pl-12 h-12 bg-slate-50 dark:bg-white/5 border backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-blue-200/40 transition-all duration-300 ${
                    focusedField === "password"
                      ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 bg-white dark:bg-white/10"
                      : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                />
              </div>
            </div>

            <Button className="w-full h-12 text-base font-semibold bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white border-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110  transition-all duration-300 animate-in zoom-in  group cursor-pointer rounded-xl">
              Create Account
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-slate-600 dark:text-blue-200/70 mt-6 animate-in fade-in duration-500 delay-900">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Decorative glow effect */}
        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-600 rounded-3xl opacity-20 blur-2xl -z-10 animate-pulse" />
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default RegisterForm;
