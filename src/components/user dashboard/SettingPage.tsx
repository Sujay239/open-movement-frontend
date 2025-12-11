import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  School,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  Camera,
  Lock,
  Bell,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export const SettingsPage = () => {
  const container = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // 1. PRE-FILLED DATA STATE
  const [formData, setFormData] = useState({
    schoolName: "Springfield High School",
    website: "https://www.springfieldhigh.edu",
    description:
      "A leading secondary school focused on STEM education and holistic student development.",
    email: "admin@springfield.edu",
    phone: "+1 (555) 123-4567",
    address: "742 Evergreen Terrace",
    city: "Springfield",
    country: "USA",
    notifications: true,
    publicProfile: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000); // Reset success message
    }, 1500);
  };

  useGSAP(
    () => {
      gsap.fromTo(
        ".settings-section",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.1,
        }
      );
    },
    { scope: container }
  );

  return (
    <div ref={container} className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 settings-section">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            School Settings
          </h1>
          <p className="text-slate-500 dark:text-zinc-400">
            Manage your school profile, contact details, and account
            preferences.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isLoading}
          className={`min-w-[140px] transition-all duration-300 ${
            isSaved
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
          }`}
        >
          {isLoading ? (
            "Saving..."
          ) : isSaved ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* 1. SCHOOL PROFILE CARD */}
        <Card className="settings-section border-slate-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm overflow-hidden">
          {/* Banner Image */}
          <div className="h-32 bg-linear-to-r from-blue-600 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <CardHeader className="relative pt-0 pb-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 px-2">
              {/* Avatar Upload */}
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-white dark:border-zinc-900 shadow-xl">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>SH</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-transparent">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <CardTitle className="text-2xl">
                  {formData.schoolName}
                </CardTitle>
                <CardDescription>
                  School ID: SCH-88210 • Premium Plan
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <div className="relative">
                  <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    className="pl-9 bg-slate-50 dark:bg-zinc-950/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="pl-9 bg-slate-50 dark:bg-zinc-950/50"
                  />
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">About the School</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-slate-50 dark:bg-zinc-950/50 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  This description will be visible to teachers when they view
                  your job posts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. CONTACT INFORMATION */}
        <Card className="settings-section border-slate-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Contact Information
            </CardTitle>
            <CardDescription>
              How candidates can reach your administration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-9 bg-slate-50 dark:bg-zinc-950/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-9 bg-slate-50 dark:bg-zinc-950/50"
                  />
                </div>
              </div>

              <div className="col-span-2 grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="bg-slate-50 dark:bg-zinc-950/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="bg-slate-50 dark:bg-zinc-950/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="bg-slate-50 dark:bg-zinc-950/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. SECURITY & PREFERENCES */}
        <div className="grid md:grid-cols-2 gap-8 settings-section">
          {/* Change Password */}
          <Card className="border-slate-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                Security
              </CardTitle>
              <CardDescription>
                Update your password and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-pass">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="current-pass"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 bg-slate-50 dark:bg-zinc-950/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-pass">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-pass"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 bg-slate-50 dark:bg-zinc-950/50"
                  />
                </div>
              </div>
              <Button variant="outline" className="w-full mt-2">
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-slate-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                Preferences
              </CardTitle>
              <CardDescription>
                Manage your email notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive updates when a teacher accepts a request.
                  </p>
                </div>
                <Switch
                  checked={formData.notifications}
                  onCheckedChange={(c :any) =>
                    setFormData((p) => ({ ...p, notifications: c }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Public Profile</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow teachers to find your school profile.
                  </p>
                </div>
                <Switch
                  checked={formData.publicProfile}
                  onCheckedChange={(c : any ) =>
                    setFormData((p) => ({ ...p, publicProfile: c }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
