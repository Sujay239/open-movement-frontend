import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import { useAlert } from "../blocks/AlertProvider";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env?.VITE_BASE_URL;
// Get Master PIN from env, default to "1234" if not set
const MASTER_PIN = import.meta.env?.VITE_MASTER_PIN || "1234";

export default function AddAdminForm({
  onAdminAdded,
}: {
  onAdminAdded?: () => void;
}) {
  const navigate = useNavigate();
  const { showError, showSuccess } = useAlert();

  // --- FORM STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  // --- SECURITY PIN STATE ---
  const [isVerified, setIsVerified] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- PIN VERIFICATION HANDLER ---
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingPin(true);
    setPinError("");

    setTimeout(() => {
      if (pinInput === MASTER_PIN) {
        setIsVerified(true);
        showSuccess("Access Granted");
      } else {
        setPinError("Invalid Security PIN");
        setPinInput("");
        showError("Access Denied: Invalid PIN");
      }
      setIsVerifyingPin(false);
    }, 500);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isVerified) {
      showError("Security verification required.");
      return;
    }

    if (!formData.full_name || !formData.email || !formData.password) {
      showError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/adminAuth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || data.error || "Failed to register admin"
        );
      }

      showSuccess("Admin registered successfully!");
      setFormData({ full_name: "", email: "", password: "" });
      if (onAdminAdded) onAdminAdded();
    } catch (error: any) {
      showError(error.message || "Registration Failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* --- SECURITY CHECK MODAL --- */}
      <Dialog open={!isVerified} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-xs"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="flex flex-col items-center text-center space-y-3">
            <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
              <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            {/* RESTORED TEXT HERE */}
            <DialogTitle className="text-lg">Security Verification</DialogTitle>
            <DialogDescription>
              This is a restricted area. Please enter the 4-digit Master PIN to
              continue.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVerifyPin} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="pin-input" className="sr-only">
                Master PIN
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pin-input"
                  type="password"
                  placeholder="PIN"
                  className={`pl-9 text-center tracking-[0.5em] font-bold ${
                    pinError ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  autoFocus
                  autoComplete="off"
                />
              </div>
              {pinError && (
                <p className="text-xs text-red-500 text-center font-medium">
                  {pinError}
                </p>
              )}
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                type="submit"
                className="w-full bg-slate-900 dark:bg-slate-100 cursor-pointer"
                disabled={isVerifyingPin || pinInput.length < 4}
              >
                {isVerifyingPin ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Verify Access"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-xs text-muted-foreground cursor-pointer"
                onClick={() => navigate(-1)}
              >
                Cancel & Go Back
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- MAIN CARD --- */}
      <Card
        className={`w-full max-w-md mx-auto shadow-lg border-slate-200 dark:border-zinc-800 overflow-hidden transition-all duration-500 ${
          !isVerified
            ? "blur-md opacity-40 pointer-events-none select-none"
            : "blur-0 opacity-100"
        }`}
      >
        <div className="bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-white/5 p-6 pb-8">
          <CardHeader className="p-0 flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center shadow-inner">
              <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">
                Register New Admin
              </CardTitle>
              <CardDescription className="mt-2 text-sm max-w-[280px] mx-auto">
                Add a new administrator to manage the dashboard and school
                requests.
              </CardDescription>
            </div>
          </CardHeader>
        </div>

        <form onSubmit={handleRegisterSubmit}>
          <CardContent className="space-y-5 p-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="Ex. Jane Doe"
                  className="pl-10"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                Must be at least 6 characters
              </p>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0 bg-slate-50/50 dark:bg-zinc-900/20">
            <Button
              type="submit"
              className="w-full h-11 text-base font-medium shadow-md bg-blue-600 hover:bg-blue-700 transition-all hover:scale-[1.01] cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                  Account...
                </>
              ) : (
                "Create Admin Account"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
