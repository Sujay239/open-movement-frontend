import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";

// Ensure "iso-3166-2.json" exists in your src directory or update path
import iso3166_2 from "iso-3166-2.json";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// --- NEW IMPORTS FOR POPUP ---
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
  Loader2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  School,
  User,
  Mail,
  Lock,
  MapPin,
  Globe,
  Home,
  LogIn,
} from "lucide-react";
import { useAlert } from "@/components/blocks/AlertProvider";

const BASE_URL = import.meta.env?.VITE_BASE_URL;

// Process Location Data (kept outside component to run once)
const LOCATION_DATA: { [key: string]: unknown[] } = {};

try {
  for (const countryCode in iso3166_2) {
    const country = iso3166_2[countryCode as keyof typeof iso3166_2];
    const regions = Object.values(country.divisions ?? {});
    LOCATION_DATA[country.name] = regions;
  }
} catch (e) {
  console.error("Error processing ISO data", e);
}

export default function SchoolRegistration() {
  const navigate = useNavigate();

  // --- STATE ---
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  // New State for Success Popup
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { showError, showSuccess } = useAlert();

  // Step 1 Data
  const [accessCode, setAccessCode] = useState("");

  // Step 2 Data
  const [formData, setFormData] = useState({
    school_name: "",
    contact_name: "",
    country: "",
    region: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // Cleanup
  useEffect(() => {
    return () => setIsLoading(false);
  }, []);

  // --- HANDLERS ---

  // STEP 1: Verify Access Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!accessCode.trim()) {
      showError("Please enter a valid access code.");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const url = `${BASE_URL?.replace(/\/$/, "")}/use-access-code`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: accessCode }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        showError("Server returned non-JSON response.");
        return;
      }

      if (!res.ok) {
        showError(data.error || "Invalid access code.");
        return;
      }
      showSuccess(data.message);
      setStep(2);
    } catch (err: any) {
      if (err.name === "AbortError") {
        showError("Request timed out.");
      } else {
        showError(err.message || "Failed to verify code.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Register Account
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.country || !formData.region) {
      showError("Please select both Country and Region.");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      showError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const payload = {
        name: formData.school_name,
        contact_name: formData.contact_name,
        country: formData.country,
        region: formData.region,
        email: formData.email,
        password: formData.password,
        access_code: accessCode,
      };

      const url = `${BASE_URL?.replace(/\/$/, "")}/auth/register/code`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        if (res.ok) {
          data = {};
        } else {
          showError("Registration failed (Invalid Server Response).");
          return;
        }
      }

      if (!res.ok) {
        showError(data.error || "Registration failed.");
        return;
      }

      // --- SUCCESS: TRIGGER POPUP ---
      setShowSuccessModal(true);
    } catch (err: any) {
      if (err.name === "AbortError") {
        showError("Request timed out.");
      } else {
        showError(err.message || "Failed to create account.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get regions based on selected country
  const availableRegions = useMemo(() => {
    if (!formData.country) return [];
    return LOCATION_DATA[formData.country] || [];
  }, [formData.country]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* SUCCESS POPUP MODAL */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent
            className="sm:max-w-md"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader className="flex flex-col items-center text-center space-y-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <DialogTitle className="text-xl">
                Registration Completed!
              </DialogTitle>
              <DialogDescription className="text-center space-y-2 pt-2">
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  Access code verified. Your 24h trial has started.
                </p>
                <p>
                  We have sent a verification link to your email (
                  {formData.email}). Please <strong>verify your email</strong>{" "}
                  first, then login to get full trial access.
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full sm:w-1/2 gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </Button>
              <Button
                onClick={() => navigate("/login")}
                className="w-full sm:w-1/2 gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Login Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MAIN CONTENT HEADER */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-600/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            School Portal Access
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            {step === 1
              ? "Enter your trial code to get started"
              : "Complete your profile to finish setup"}
          </p>
        </div>

        <Card className="border-slate-200 dark:border-white/10 shadow-xl">
          {step === 1 ? (
            <form onSubmit={handleVerifyCode}>
              <CardHeader>
                <CardTitle>Enter Access Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="code"
                    placeholder="OM-TRIAL-XXXX"
                    className="text-center font-mono text-lg uppercase tracking-widest mb-3 mt-2"
                    value={accessCode}
                    onChange={(e) =>
                      setAccessCode(e.target.value.toUpperCase())
                    }
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full cursor-pointer hover:bg-green-400 hover:scale-105 transition-transform"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  Verify Code
                </Button>
              </CardFooter>
            </form>
          ) : (
            // --- STEP 2 FORM ---
            <form onSubmit={handleRegister} autoComplete="off">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Create Account</CardTitle>
                  <span className="text-xs font-mono bg-green-100 text-green-700 px-2 py-1 rounded">
                    CODE VERIFIED
                  </span>
                </div>
                <CardDescription>
                  Set up your school administrator credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <div className="relative">
                    <School className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g. Brighton College"
                      className="pl-9"
                      value={formData.school_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school_name: e.target.value,
                        })
                      }
                      required
                      disabled={isLoading}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g. John Smith"
                      className="pl-9"
                      value={formData.contact_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_name: e.target.value,
                        })
                      }
                      required
                      disabled={isLoading}
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Country Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                      <Select
                        value={formData.country}
                        onValueChange={(val) =>
                          setFormData({ ...formData, country: val, region: "" })
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="pl-9">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(LOCATION_DATA)
                            .sort()
                            .map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Region Selection */}
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                      <Select
                        value={formData.region}
                        onValueChange={(val) =>
                          setFormData({ ...formData, region: val })
                        }
                        disabled={isLoading || !formData.country}
                      >
                        <SelectTrigger className="pl-9">
                          <SelectValue
                            placeholder={formData.country ? "Select" : "..."}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRegions.map((region: any) => (
                            <SelectItem
                              key={String(region)}
                              value={String(region)}
                            >
                              {String(region)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      name="school_admin_unique_email_field"
                      placeholder="admin@school.edu"
                      className="pl-9"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      disabled={isLoading}
                      autoComplete="off"
                      readOnly={true}
                      onFocus={(e) => e.target.removeAttribute("readonly")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        name="new_school_password_field"
                        className="pl-9"
                        placeholder="******"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                        disabled={isLoading}
                        autoComplete="new-password"
                        readOnly={true}
                        onFocus={(e) => e.target.removeAttribute("readonly")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm</Label>
                    <Input
                      type="password"
                      name="confirm_new_password_field"
                      placeholder="******"
                      value={formData.confirm_password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirm_password: e.target.value,
                        })
                      }
                      required
                      disabled={isLoading}
                      autoComplete="new-password"
                      readOnly={true}
                      onFocus={(e) => e.target.removeAttribute("readonly")}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button
                  className="w-full cursor-pointer hover:bg-green-300 hover:scale-105 transition-transform mt-4"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  Create Account
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-xs text-muted-foreground"
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back to Code Entry
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>

        <div className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
