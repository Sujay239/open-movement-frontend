// LoginForm.jsx
import  { useState,  } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  UserCog,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAlert } from "@/components/blocks/AlertProvider";

// Vite: use VITE_ prefix. Safe fallback to window.__BASE_URL__ if you inject it server-side.
const BASE_URL = import.meta.env?.VITE_BASE_URL;
const PIN = import.meta.env?.VITE_LOGIN_PIN;
export const LoginForm = () => {
  // view can be: 'user' | 'code' | 'admin'
  const [view, setView] = useState("user");

  // Login Form State
  const [form, setForm] = useState({ email: "", password: "" });

  // Access Code State
  const [accessCode, setAccessCode] = useState("");

  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlert();

  // Handle inputs for login form
  const onChange = (e : any) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  // Handle input for access code
  const onCodeChange = (e : any) => {
    setAccessCode(e.target.value);
  };

  const validate = () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      showError("Please enter a valid email address.");
      return false;
    }
    // Relaxed password validation for admin if needed, currently keeping same
    if (!form.password || form.password.length < 6) {
      showError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  // 1. Verify Access Code
  const handleCodeSubmit = (e : any) => {
    e.preventDefault();
    setLoading(true);

    // Simulate a short delay for effect
    setTimeout(() => {
      if (accessCode === PIN) {
        showSuccess("Access Granted");
        setView("admin");
        setAccessCode(""); // clear code
        setForm({ email: "", password: "" }); // clear login form for fresh start
      } else {
        showError("Invalid Access Code");
      }
      setLoading(false);
    }, 500);
  };

  // 2. Handle Login (Works for both User and Admin)
  const handleSubmit = async (e : any) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      // Determine Endpoint based on View
      const endpoint =
        view === "admin" ? `${BASE_URL}/adminAuth/login` : `${BASE_URL}/auth/login`;

      // Note: If your backend uses the same endpoint for both but looks up roles,
      // just keep using `${BASE_URL}/auth/login` for both.

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data?.error || "Login failed");
      } else {
        showSuccess(
          view === "admin" ? "Admin Login Successful!" : "Login successful!"
        );
        if (data.token) {
          localStorage.setItem("auth_token", data.token);
        }
        // Redirect logic
        window.location.href =
          view === "admin" ? "/admin" : "/school/dashboard";
      }
    } catch (err) {
      console.error("Login error:", err);
      showError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to reset view to normal user
  const handleBackToUser = () => {
    setView("user");
    setAccessCode("");
    setForm({ email: "", password: "" });
  };



  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] ${view === "admin" ? "bg-red-500/10" : "bg-purple-500/10"} rounded-full blur-[100px] animate-pulse transition-colors duration-1000`}
        />
        <div
          className={`absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] ${view === "admin" ? "bg-orange-500/10" : "bg-blue-500/10"} rounded-full blur-[100px] animate-pulse delay-1000 transition-colors duration-1000`}
        />
      </div>

      <div className="w-full max-w-md mx-4 z-10">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 animate-in zoom-in-95 duration-500">
          {/* ============================== */}
          {/* VIEW: ACCESS CODE CHECK        */}
          {/* ============================== */}
          {view === "code" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-2 mb-8">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-4 ring-1 ring-slate-200 dark:ring-white/10">
                  <KeyRound className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Admin Access
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Enter the security code to proceed
                </p>
              </div>

              <form onSubmit={handleCodeSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="accessCode"
                    className="text-sm font-medium ml-1"
                  >
                    Access Code
                  </Label>
                  <Input
                    autoFocus
                    type="password"
                    value={accessCode}
                    onChange={onCodeChange}
                    placeholder="Enter 4-digit code"
                    className="h-12 text-center text-lg tracking-[0.5em] font-bold bg-slate-50 dark:bg-slate-950/50"
                    maxLength={4}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setView("user")}
                  className="w-full"
                >
                  Cancel
                </Button>
              </form>
            </div>
          )}

          {/* ============================== */}
          {/* VIEW: USER & ADMIN LOGIN       */}
          {/* ============================== */}
          {(view === "user" || view === "admin") && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="text-center space-y-2 mb-8">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-4 ring-1 ring-slate-200 dark:ring-white/10">
                  {view === "admin" ? (
                    <UserCog className="w-8 h-8 text-red-600 dark:text-red-400" />
                  ) : (
                    <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {view === "admin" ? "Admin Portal" : "Welcome Back"}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {view === "admin"
                    ? "Restricted access for administrators only"
                    : "Enter your credentials to access your account"}
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
                      placeholder={
                        view === "admin"
                          ? "admin@school.com"
                          : "name@school.com"
                      }
                      type="email"
                      className="pl-10 h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium ml-1"
                    >
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline"
                    >
                      Forgot password?
                    </Link>
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

                  className={`w-full h-12 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                    view === "admin"
                      ? "bg-linear-to-r from-red-600 to-orange-600"
                      : "bg-linear-to-r from-blue-600 to-purple-600"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign in{" "}
                      <ArrowRight className="ml-2 h-4 w-4 inline-block" />
                    </>
                  )}
                </Button>

                {/* ONLY Show Homepage Button on User Login */}
                {view === "user" && (
                  <Button
                    type="button"
                    className="w-full h-12 bg-linear-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Link
                      to="/"
                      className="flex items-center justify-center w-full"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Continue with
                      Homepage
                    </Link>
                  </Button>
                )}

                {/* ONLY Show Back Button on Admin Login */}
                {view === "admin" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToUser}
                    className="w-full h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to User Login
                  </Button>
                )}
              </form>

              <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 flex flex-col gap-2">
                {/* Only show Register link if NOT admin */}
                {view !== "admin" && (
                  <div>
                    Don&apos;t have an account?{" "}
                    <Link
                      className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline transition-colors"
                      to="/register"
                    >
                      Create an account
                    </Link>
                  </div>
                )}

                {/* Admin Switcher Link */}
                {view === "user" && (
                  <button
                    onClick={() => setView("code")}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline mt-4 cursor-pointer hover:scale-105 transition-all duration-200"
                  >
                    Admin Login
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
