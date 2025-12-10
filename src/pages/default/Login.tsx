import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight,  ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";



export const LoginForm = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">

      {/* 1. ANIMATED BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* 2. CENTERED FORM CARD */}
      <div className="w-full max-w-md mx-4 z-10">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 animate-in zoom-in-95 duration-500">

          {/* Header Section */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-linear-to-tr from-blue-500/10 to-purple-500/10 rounded-2xl mb-4 ring-1 ring-slate-200 dark:ring-white/10">
               <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium ml-1">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="email"
                  placeholder="name@school.com"
                  type="email"
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium ml-1">Password</Label>
                <a
                  href="#"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button className="w-full h-12 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button className="w-full h-12 bg-linear-to-r from-green-600 to-blue-600 hover:from-red-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer">
              <ArrowLeft className="ml-2 h-4 w-4" />
             <Link to="/">
                Continue with Homepage
             </Link>
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline transition-colors"
              to="/register" // Removed hash router syntax #/ unless strictly needed
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
