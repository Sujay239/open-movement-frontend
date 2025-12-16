// SettingsPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
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
  // Camera,
  Lock,
  // Bell,
  Shield,
  // CheckCircle2,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAlert } from "../blocks/AlertProvider";

const BASE_URL = import.meta.env?.VITE_BASE_URL ?? "";

type SchoolProfile = {
  id?: number;
  name?: string;
  contact_name?: string;
  email?: string;
  // password_hash not exposed from API — handled by change-password endpoint
  country?: string | null;
  region?: string | null;
  subscription_status?: string | null;
  subscription_plan?: string | null;
  subscription_started_at?: string | null;
  subscription_end_at?: string | null;
  // extras kept locally
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  about?: string | null;
  website? : string | null;
};

export const SettingsPage: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  // UI state
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savingPassword, setSavingPassword] = useState<boolean>(false);

  // fetched profile
  const [profile, setProfile] = useState<SchoolProfile>({
    name: "",
    contact_name: "",
    email: "",
    country: "",
    region: "",
    address: "",
    city: "",
    phone: "",
    about: "",
    website : ""
  });

  // local form state (separate so unsaved edits don't mutate fetched profile immediately)
  const [formData, setFormData] = useState({
    name: "",
    contact_name: "",
    email: "",
    description: "",
    address: "",
    city: "",
    country: "",
    region: "",
    phone: "",
    website: "",
    notifications: true,
    publicProfile: true,
  });

  // password fields (optional)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const {showError , showSuccess} = useAlert();

  // animation
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
          delay: 0.05,
        }
      );
    },
    { scope: container }
  );

  // load profile on mount
  useEffect(() => {
    let mounted = true;

    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Failed to fetch profile: ${res.status} ${text}`);
        }

        const data: SchoolProfile = await res.json();

        if (!mounted) return;

        // Map API fields into form fields (use null coalescing)
        const mapped = {
          name: data.name ?? "",
          contact_name: data.contact_name ?? "",
          email: data.email ?? "",
          description: data.about ?? "",
          address: data.address ?? "",
          city: data.city ?? "",
          country: data.country ?? "",
          region: data.region ?? "",
          phone: data.phone ?? "",
          website : data.website?? "",
          notifications: true, // default - you can extend API to hold preferences
          publicProfile: true,
        };

        setProfile(data);
        setFormData(mapped);
      } catch (err: any) {
        console.error(err);
        showError(err?.message ?? "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // form field change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // basic profile save (PATCH)
  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare payload - send only fields we allow to update
      const payload = {
        name: formData.name,
        contact_name: formData.contact_name,
        email: formData.email,
        country: formData.country,
        region: formData.region,
        // extras for later
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        description: formData.description,
        website : formData.website
      };

      const res = await fetch(`${BASE_URL}/school/update`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Save failed: ${res.status} ${text}`);
      }

      const data = await res.json().catch(() => ({}));

      if (data) {
        setProfile((p) => ({ ...p, ...data }));
      }

      // reflect saved values (in case server normalized)
      setFormData((prev) => ({ ...prev, ...payload }));
      showSuccess(data?.message ?? "Profile saved successfully");
    } catch (err: any) {
      console.error("Save error:", err);
      showError(err?.message ?? "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // password change
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      showError("Please fill current and new password fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showError("New password and confirm password do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      const payload = {
        currentPassword,
        newPassword,
      };

      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Change password failed: ${res.status} ${text}`);
      }

      const data = await res.json().catch(() => ({}));
      showSuccess(data?.message ?? "Password updated successfully");

      // clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      console.error("Password change error:", err);
      showError(err?.message ?? "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div ref={container} className="max-w-5xl mx-auto space-y-8 pb-20">
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
          disabled={saving}
          className={`min-w-40 transition-all duration-300 ${
            saving
              ? "bg-blue-500/80 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 cursor-pointer"
          }`}
        >
          {saving ? (
            "Saving..."
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-8">
        <Card className="settings-section border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl shadow-md rounded-2xl overflow-hidden">
          {/* Banner Section */}
          <div className="h-40 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          </div>

          {/* Header */}
          <CardHeader className="relative -mt-16 pb-6 px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              {/* Avatar Upload */}
              <div className="relative group">
                <Avatar className="w-28 h-28 rounded-2xl border-white dark:border-zinc-900 shadow-2xl">
                  <AvatarImage src={""} />
                  <AvatarFallback className="text-3xl font-semibold">
                    {formData.name?.charAt(0) ?? "S"}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Title + Meta Info */}
              <div className="flex flex-col gap-1 w-full">
                {/* Editable School Name */}
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-2xl max-md:text-[14px] font-bold shadow-none border-none p-2 h-auto
                     focus-visible:ring-0 focus-visible:border-transparent bg-transparent"
                />

                {/* Meta Info */}
                <CardDescription className="text-sm text-slate-500 dark:text-zinc-400">
                  School ID:{" "}
                  <span className="font-semibold">{profile.id ?? "—"}</span> •{" "}
                  {profile.subscription_plan ?? "No Subscription"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Body */}
          <CardContent className="space-y-8 px-8 pb-10">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Name */}
              <div className="space-y-2">
                <Label htmlFor="contact_name">Contact Name</Label>
                <div className="relative">
                  <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact_name"
                    value={formData.contact_name}
                    onChange={handleInputChange}
                    className="pl-10 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={formData.website ?? ""}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, website: e.target.value }))
                    }
                    placeholder="https://yourschool.com"
                    className="pl-10 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">About the School</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/50 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  This description will appear on job posts and teacher-facing
                  pages.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CONTACT INFORMATION */}
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

        {/* SECURITY & PREFERENCES */}
        <div className="grid  settings-section">
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
                    value={""}
                    onChange={(e) => setCurrentPassword(e.target.value)}
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-9 bg-slate-50 dark:bg-zinc-950/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-pass">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-new-pass"
                    type="password"
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="pl-9 bg-slate-50 dark:bg-zinc-950/50"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-2 cursor-pointer"
                onClick={handleChangePassword}
                disabled={savingPassword}
              >
                {savingPassword ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
