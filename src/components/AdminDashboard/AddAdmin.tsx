import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "lucide-react";
// import { toast } from "sonner";
import { useAlert } from "../blocks/AlertProvider";

const BASE_URL = import.meta.env?.VITE_BASE_URL;
export default function AddAdminForm({
  onAdminAdded,
}: {
  onAdminAdded?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {showError , showSuccess} = useAlert();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation
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
      // 2. API Call
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

      // 4. Reset Form
      setFormData({ full_name: "", email: "", password: "" });

      // 5. Trigger Callback (e.g. refresh list)
      if (onAdminAdded) onAdminAdded();
    } catch (error: any) {
      showSuccess("Registration Failed Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
    <Card className="w-full max-w-md mx-auto shadow-lg border-slate-200 dark:border-zinc-800 overflow-hidden">
      {/* Header with decorative background */}
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

      <form onSubmit={handleSubmit}>
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
