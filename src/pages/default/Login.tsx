// LoginForm.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAlert } from "@/components/blocks/AlertProvider";

// Vite: use VITE_ prefix. Safe fallback to window.__BASE_URL__ if you inject it server-side.
const BASE_URL = import.meta.env?.VITE_BASE_URL;

export const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlert();

  const onChange = (e : React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
        showError("Please enter a valid email address.");
      return false;
    }
    if (!form.password || form.password.length < 6) {
      showError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {

      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data?.error || "Login failed");
      } else {
        showSuccess("Login successful!");
        if (data.token) {
          localStorage.setItem("auth_token", data.token);
        }
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Login error:", err);
      showError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md mx-4 z-10">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 animate-in zoom-in-95 duration-500">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-4 ring-1 ring-slate-200 dark:ring-white/10">
              <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium ml-1">
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="name@school.com"
                  type="email"
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium ml-1">
                  Password
                </Label>
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
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-4 w-4 inline-block" />
                </>
              )}
            </Button>

            <Button
              type="button"
              className="w-full h-12 bg-linear-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Link to="/" className="flex items-center justify-center w-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Continue with Homepage
              </Link>
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline transition-colors"
              to="/register"
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
