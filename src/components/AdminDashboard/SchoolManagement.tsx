import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Search,
  School as SchoolIcon, // Renamed to avoid conflict with interface
  Eye,
  Mail,
  Phone,
  Globe,
  MapPin,
  CreditCard,
  Building2,
  // Lock,
  X,
  Loader2, // Added for loading state
} from "lucide-react";
import { useAlert } from "../blocks/AlertProvider";
// import { toast } from "sonner";

// --- 1. TYPES ---
type SubscriptionStatus = "NO_SUBSCRIPTION" | "ACTIVE" | "EXPIRED" | "TRIAL";
type SubscriptionPlan = "MONTHLY" | "YEARLY" | "TRIAL_ACCESS" | null;

// Matches your DB schema / API response
interface School {
  id: string; // or number, depending on your DB. usually string/number safe in TS
  name: string;
  contact_name: string;
  email: string;
  website?: string | null;
  country?: string | null;
  region?: string | null;
  about?: string | null;
  phone?: string | null;
  address?: string | null;
  subscription_status: SubscriptionStatus;
  subscription_plan: SubscriptionPlan;
  subscription_started_at?: string | null;
  subscription_end_at?: string | null;
  created_at: string;
}

const openGmail = (email: string) => {
  const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email
  )}`;
  window.open(url, "_blank");
};

const BASE_URL = import.meta.env?.VITE_BASE_URL;

export default function SchoolManagement() {
  // --- STATE ---
  const [schools, setSchools] = useState<School[]>([]); // Data from API
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const {showError } = useAlert();

  // --- 1. FETCH DATA ---
  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      // Adjust URL if needed
      const res = await fetch(`${BASE_URL}/admin/schools`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch schools");

      const data = await res.json();
      setSchools(data);
    } catch (error) {
      console.error(error);
     showError("Failed to load schools data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // --- Filter Logic ---
  const filteredSchools = schools.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      (s.name?.toLowerCase() || "").includes(query) ||
      (s.email?.toLowerCase() || "").includes(query) ||
      (s.country?.toLowerCase() || "").includes(query) ||
      (s.region?.toLowerCase() || "").includes(query)
    );
  });

  // --- Handlers ---
  const handleView = (school: School) => {
    setSelectedSchool(school);
    setIsViewModalOpen(true);
  };



  // --- Helpers ---
  const getStatusBadge = (status: string) => {
    // Normalize status just in case
    const s = status?.toUpperCase();
    switch (s) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
            Active
          </Badge>
        );
      case "TRIAL":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200">
            Trial
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
            Expired
          </Badge>
        );
      case "NO_SUBSCRIPTION":
        return <Badge variant="secondary">No Plan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6  flex flex-col">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Schools</h2>
          <p className="text-muted-foreground">View registered schools.</p>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, location..."
            className="pl-8 pr-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 border rounded-md bg-muted/10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* --- MOBILE VIEW (Cards) --- */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredSchools.length === 0 ? (
              <div className="text-center p-8 border rounded-lg bg-muted/20 text-muted-foreground">
                No schools found matching "{searchQuery}".
              </div>
            ) : (
              filteredSchools.map((school) => (
                <div
                  key={school.id}
                  className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{school.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {school.email}
                      </p>
                    </div>
                    {getStatusBadge(school.subscription_status)}
                  </div>

                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>
                        {school.country}{" "}
                        {school.region ? `(${school.region})` : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Plan: {school.subscription_plan || "None"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(school)}
                    >
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(school)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            (window.location.href = `mailto:${school.email}`)
                          }
                        >
                          <Mail className="mr-2 h-4 w-4" /> Email School
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* --- DESKTOP VIEW (Table) --- */}
          <div className="hidden md:block rounded-md border bg-card flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Contact
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No schools found matching "{searchQuery}".
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{school.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {school.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {school.contact_name}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {school.country}{" "}
                        {school.region ? `(${school.region})` : ""}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="font-mono text-xs">
                          {school.subscription_plan || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(school.subscription_status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0   cursor-pointer">
                              <MoreHorizontal className="h-4 w-4 " />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleView(school)}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4 " />{" "}
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => openGmail(school.email)}
                              className="cursor-pointer"
                            >
                              <Mail className="mr-2 h-4 w-4 " /> Email School
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* --- VIEW DETAILS MODAL --- */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="w-[95vw] sm:w-full sm:max-w-[700px] max-h-[85vh] p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              {selectedSchool?.name}
            </DialogTitle>
            <DialogDescription>
              Registered on {formatDate(selectedSchool?.created_at)}
            </DialogDescription>
          </DialogHeader>

          {selectedSchool && (
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-8">
                {/* 1. SUBSCRIPTION CARD */}
                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm flex items-center text-slate-900 dark:text-slate-100">
                      <CreditCard className="w-4 h-4 mr-2 text-blue-600" />{" "}
                      Subscription Status
                    </h4>
                    {getStatusBadge(selectedSchool.subscription_status)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Current Plan
                      </Label>
                      <p className="font-medium">
                        {selectedSchool.subscription_plan || "None"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Auto-Renews?
                      </Label>
                      <p className="font-medium">
                        {selectedSchool.subscription_plan === "TRIAL_ACCESS"
                          ? "No (Trial)"
                          : "Yes"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Start Date
                      </Label>
                      <p className="font-medium">
                        {formatDate(selectedSchool.subscription_started_at)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Expiry Date
                      </Label>
                      <p
                        className={`font-medium ${
                          selectedSchool.subscription_status === "EXPIRED"
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {formatDate(selectedSchool.subscription_end_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. SCHOOL PROFILE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm uppercase text-muted-foreground border-b pb-2">
                      Contact Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground flex items-center">
                          <SchoolIcon className="w-3.5 h-3.5 mr-2" /> Contact
                          Person
                        </span>
                        <span className="font-medium">
                          {selectedSchool.contact_name}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground flex items-center">
                          <Mail className="w-3.5 h-3.5 mr-2" /> Email
                        </span>
                        <span className="font-medium break-all">
                          {selectedSchool.email}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground flex items-center">
                          <Phone className="w-3.5 h-3.5 mr-2" /> Phone
                        </span>
                        <span className="font-medium">
                          {selectedSchool.phone || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground flex items-center">
                          <Globe className="w-3.5 h-3.5 mr-2" /> Website
                        </span>
                        {selectedSchool.website ? (
                          <a
                            href={
                              selectedSchool.website.startsWith("http")
                                ? selectedSchool.website
                                : `https://${selectedSchool.website}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {selectedSchool.website}
                          </a>
                        ) : (
                          <span>N/A</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location & About */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm uppercase text-muted-foreground border-b pb-2">
                      Location & Info
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-2" /> Country /
                          Region
                        </span>
                        <span className="font-medium">
                          {selectedSchool.country || "N/A"}{" "}
                          {selectedSchool.region
                            ? `• ${selectedSchool.region}`
                            : ""}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Address</span>
                        <span className="font-medium text-muted-foreground/80">
                          {selectedSchool.address || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">About</span>
                        <p className="text-xs text-muted-foreground/80 leading-relaxed border p-2 rounded bg-muted/20">
                          {selectedSchool.about || "No description provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="px-6 py-4 border-t bg-muted/20 shrink-0">
            <Button variant="outline" className="cursor-pointer" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
