import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAlert } from "@/components/blocks/AlertProvider";
// Ensure you have this JSON file or remove this import if mocking data
import iso3166_2 from "iso-3166-2.json";
import {
  Mail,
  Lock,
  Building2,
  ArrowRight,
  Globe,
  MapPin,
  Loader2,
} from "lucide-react";
import { Link } from "react-router";

// FIX 1: Remove dotenv.
// Access env vars based on your framework (Vite example below):
const BASE_URL = import.meta.env?.VITE_BASE_URL;


// Process Location Data (kept outside component to run once)
const LOCATION_DATA: { [key: string]: unknown[] } = {};

try {
  // Added safety check in case json is missing or malformed
  for (const countryCode in iso3166_2) {
    const country = iso3166_2[countryCode as keyof typeof iso3166_2];
    const regions = Object.values(country.divisions ?? {});
    LOCATION_DATA[country.name] = regions;
  }
} catch (e) {
  console.error("Error processing ISO data", e);
}

export const RegisterForm = () => {
  const [focusedField, setFocusedField] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useAlert();

  // FIX 2: Added confirmPassword to state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    school: "",
    email: "",
    password: "",
    confirmPassword: "", // Added this
    country: "",
    region: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      if (id === "country") {
        return { ...prev, country: value, region: "" };
      }
      return { ...prev, [id]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // FIX 3: Basic Validation
    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.school,
        contact_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        country: formData.country,
        region: formData.region,
      };

      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess(`${data.successMsg || "Registration successful!"} Please log in.`);
        window.location.href = "/login";
      } else {
        showError(`${data.error || "Registration failed. Please try again."}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showError("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 relative overflow-hidden">
      {/* ... Background Elements remain unchanged ... */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative w-full max-w-md mx-4 z-10 my-10">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-700">
          <div className="space-y-2 text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white animate-in slide-in-from-top duration-500 delay-200">
              Create an account
            </h1>
            <p className="text-slate-600 dark:text-blue-200/70 animate-in fade-in duration-500 delay-300">
              Enter your details to get started with School Access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-left duration-500 delay-400">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("firstName")}
                  onBlur={() => setFocusedField("")}
                  className={
                    focusedField === "firstName" ? "border-blue-500" : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("lastName")}
                  onBlur={() => setFocusedField("")}
                  className={
                    focusedField === "lastName" ? "border-blue-500" : ""
                  }
                />
              </div>
            </div>

            {/* School */}
            <div className="space-y-2 animate-in slide-in-from-left duration-500 delay-500">
              <Label htmlFor="school">School Name</Label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="school"
                  placeholder="Lincoln High School"
                  value={formData.school}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("school")}
                  onBlur={() => setFocusedField("")}
                  className="pl-12"
                />
              </div>
            </div>

            {/* Country & Region */}
            {/* Country & Region Dropdowns */}
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-left duration-500 delay-550">
              {/* Country Dropdown */}
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-slate-700 dark:text-blue-100 text-sm font-medium"
                >
                  Country
                </Label>
                <div className="relative">
                  <Globe
                    className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                      focusedField === "country"
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-slate-400 dark:text-blue-200/50"
                    }`}
                  />
                  <select
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("country")}
                    onBlur={() => setFocusedField("")}
                    className={`appearance-none w-full pl-12 pr-4 h-12 rounded-md text-sm border backdrop-blur-sm transition-all duration-300 outline-none cursor-pointer
                      ${/* Base styles for the INPUT box (Closed state) */ ""}
                      bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white
                      ${
                        focusedField === "country"
                          ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 bg-white dark:bg-white/10"
                          : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                      }`}
                  >
                    <option
                      value=""
                      disabled
                      // FIX: Force text to be dark in the dropdown list to ensure visibility on all browsers
                      className="text-slate-900 bg-white"
                    >
                      Select Country
                    </option>
                    {Object.keys(LOCATION_DATA).map((country) => (
                      <option
                        key={country}
                        value={country}
                        // FIX: Force text to be dark in the dropdown list
                        className="text-slate-900 bg-white"
                      >
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Region Dropdown */}
              <div className="space-y-2">
                <Label
                  htmlFor="region"
                  className="text-slate-700 dark:text-blue-100 text-sm font-medium"
                >
                  Region
                </Label>
                <div className="relative">
                  <MapPin
                    className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
                      focusedField === "region"
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-slate-400 dark:text-blue-200/50"
                    }`}
                  />
                  <select
                    id="region"
                    value={formData.region}
                    onChange={handleChange}
                    disabled={!formData.country}
                    onFocus={() => setFocusedField("region")}
                    onBlur={() => setFocusedField("")}
                    className={`appearance-none w-full pl-12 pr-4 h-12 rounded-md text-sm border backdrop-blur-sm transition-all duration-300 outline-none cursor-pointer
                      ${/* Base styles for the INPUT box (Closed state) */ ""}
                      bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white
                      ${
                        focusedField === "region"
                          ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 bg-white dark:bg-white/10"
                          : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                      } ${
                        !formData.country ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    <option
                      value=""
                      disabled
                      // FIX: Force text to be dark
                      className="text-slate-900 bg-white"
                    >
                      Select Region
                    </option>
                    {formData.country &&
                      LOCATION_DATA[
                        formData.country as keyof typeof LOCATION_DATA
                      ]?.map((region) => (
                        <option
                          key={String(region)}
                          value={String(region)}
                          // FIX: Force text to be dark
                          className="text-slate-900 bg-white"
                        >
                          {region as string}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2 animate-in slide-in-from-left duration-500 delay-600">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@school.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-12"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2 animate-in slide-in-from-left duration-500 delay-700">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  className="pl-12"
                />
              </div>

              {/* FIX 4: Corrected Confirm Password Field */}
              <div className="relative mt-2">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300 ${focusedField === "confirmPassword" ? "text-blue-500" : "text-slate-400"}`}
                />
                <Input
                  id="confirmPassword" // Corrected ID
                  type="password" // Corrected Type
                  placeholder="Confirm Password"
                  value={formData.confirmPassword} // Connected to state
                  onChange={handleChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField("")}
                  className={`pl-12 h-12 bg-slate-50 dark:bg-white/5 border backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-blue-200/40 transition-all duration-300 ${
                    focusedField === "confirmPassword"
                      ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 bg-white dark:bg-white/10"
                      : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-green-500 text-white rounded-xl hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">

                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create Account
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        .animate-float { animation: float linear infinite; }
        .delay-1000 { animation-delay: 1s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
};

export default RegisterForm;


