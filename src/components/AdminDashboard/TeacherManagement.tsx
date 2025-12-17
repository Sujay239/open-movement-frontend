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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Eye,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  FileText,
  Calendar,
  Globe,
  School,
  Search,
  X,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useAlert } from "../blocks/AlertProvider";

// --- 1. TYPES & INTERFACES ---
type TeacherStatus = "ACTIVE" | "PLACED" | "INACTIVE";

interface Teacher {
  id: string;
  teacher_code: string;
  full_name: string;
  email: string;
  phone: string;
  cv_link: string;
  current_job_title: string;
  subjects: string;
  highest_qualification: string;
  current_school_name: string;
  current_country: string;
  current_region: string;
  visa_status: string;
  notice_period: string;
  will_move_sem1: boolean;
  will_move_sem2: boolean;
  years_experience: number;
  preferred_regions: string;
  profile_status: TeacherStatus;
  is_visible_in_school_portal: boolean;
  bio: string;
}

const initialFormState: Partial<Teacher> = {
  teacher_code: "",
  full_name: "",
  email: "",
  phone: "",
  cv_link: "",
  current_job_title: "",
  subjects: "",
  highest_qualification: "",
  current_school_name: "",
  current_country: "",
  current_region: "",
  visa_status: "",
  notice_period: "",
  will_move_sem1: false,
  will_move_sem2: false,
  years_experience: 0,
  preferred_regions: "",
  profile_status: "ACTIVE",
  is_visible_in_school_portal: true,
  bio: "",
};

export default function TeacherManagement() {
  // --- STATE ---
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { showError, showSuccess } = useAlert();

  // Form/Edit States
  const [formData, setFormData] = useState<Partial<Teacher>>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const BASE_URL = import.meta.env?.VITE_BASE_URL;
  // --- API URL ---
  const API_URL = `${BASE_URL}/admin/teachers`;

  // --- 2. FETCH DATA ---
  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch teachers");
      const data = await res.json();
      setTeachers(data);
    } catch (error) {
      console.error(error);
      showError("Failed to load teachers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // --- 3. FILTER LOGIC ---
  const filteredTeachers = teachers.filter((t) => {
    const query = searchQuery.toLowerCase();
    return (
      (t.full_name?.toLowerCase() || "").includes(query) ||
      (t.email?.toLowerCase() || "").includes(query) ||
      (t.teacher_code?.toLowerCase() || "").includes(query) ||
      (t.subjects?.toLowerCase() || "").includes(query) ||
      (t.current_country?.toLowerCase() || "").includes(query)
    );
  });

  // --- 4. HELPERS & HANDLERS ---

  // Random code generator for the form (Client side helper)
  const generateCode = () => `OM-T${Math.floor(10000 + Math.random() * 90000)}`;

  useEffect(() => {
    if (isAddModalOpen && !editingId && !formData.teacher_code) {
      setFormData((prev) => ({ ...prev, teacher_code: generateCode() }));
    }
  }, [isAddModalOpen, editingId]);

  const handleEdit = (teacher: Teacher) => {
    setFormData(teacher);
    setEditingId(teacher.id);
    setIsAddModalOpen(true);
  };

  const handleView = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsViewModalOpen(true);
  };

  // --- DELETE API ---
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to delete");

        setTeachers((prev) => prev.filter((t) => t.id !== id));
        showSuccess("Profile deleted");
      } catch (error) {
        showError("Error deleting profile");
      }
    }
  };

  // --- TOGGLE VISIBILITY API ---
  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, is_visible_in_school_portal: !currentStatus } : t
      )
    );

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_visible_in_school_portal: !currentStatus }),
      });

      if (!res.ok) throw new Error("Failed to update visibility");
    } catch (error) {
      console.error(error);
      showError("Failed to update visibility");
      // Revert change if API fails
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, is_visible_in_school_portal: currentStatus } : t
        )
      );
    }
  };

  // --- CREATE / UPDATE API ---
  const handleSaveTeacher = async () => {
    if (!formData.full_name || !formData.email) {
      showError("Fill all required fields");
      return;
    }

    try {
      let res;
      if (editingId) {
        // UPDATE EXISTING
        res = await fetch(`${API_URL}/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
      } else {
        // CREATE NEW
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) throw new Error("Failed to save teacher");

      showSuccess(
        editingId
          ? "Teacher updated successfully"
          : "Teacher created successfully"
      );
      fetchTeachers(); // Refresh list from DB
      handleCloseModal();
    } catch (error) {
      console.error(error);
      showError("Error saving teacher profile");
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  // --- 5. RENDER ---
  return (
    <div className="space-y-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teachers</h2>
          <p className="text-muted-foreground">Manage teacher profiles.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          {/* Enhanced Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, code, subject..."
              className="pl-8 pr-8"
              // Fix: Ensure value is never undefined
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
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
            {filteredTeachers.length === 0 ? (
              <div className="text-center p-8 border rounded-lg bg-muted/20 text-muted-foreground">
                No teachers found.
              </div>
            ) : (
              filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{teacher.full_name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                          {teacher.teacher_code}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {teacher.current_job_title}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        teacher.profile_status === "ACTIVE"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {teacher.profile_status}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span className="text-foreground">
                        {teacher.subjects}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{teacher.current_country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>{teacher.years_experience} Years Exp.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground">
                        Visible?
                      </Label>
                      {/* Updated Mobile Switch */}
                      <Switch
                        checked={teacher.is_visible_in_school_portal}
                        onCheckedChange={() =>
                          handleToggleVisibility(
                            teacher.id,
                            teacher.is_visible_in_school_portal
                          )
                        }
                        className="scale-75 origin-left cursor-pointer"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(teacher)}
                      >
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 cursor-pointer"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(teacher)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(teacher.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
                  <TableHead className="w-[100px]">Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Subjects
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="hidden xl:table-cell">Exp</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Visible
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No teachers found matching "{searchQuery}"
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {teacher.teacher_code}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {teacher.full_name}
                          </span>
                          <span className="text-xs text-muted-foreground md:hidden truncate max-w-[120px]">
                            {teacher.current_job_title}
                          </span>
                        </div>
                      </TableCell>

                      {/* --- FIX START: ROBUST SUBJECTS CAPSULES --- */}
                      <TableCell className="hidden md:table-cell max-w-[300px]">
                        <div className="flex flex-wrap gap-1.5">
                          {(() => {
                            let subList: string[] = [];
                            const rawSubjects = teacher.subjects;

                            if (rawSubjects) {
                              // 1. Remove Postgres braces {}
                              let clean = rawSubjects.replace(/^\{|\}$/g, "");

                              // 2. Fix smashed quotes {"Physics""Math"} -> "Physics","Math"
                              clean = clean.replace(/"\s*"/g, '","');

                              // 3. Split, trim, remove quotes
                              subList = clean
                                .split(",")
                                .map((s) =>
                                  s.trim().replace(/^["']|["']$/g, "")
                                )
                                .filter((s) => s.length > 0);
                            }

                            if (subList.length === 0) {
                              return (
                                <span className="text-muted-foreground text-xs italic">
                                  --
                                </span>
                              );
                            }

                            return (
                              <>
                                {/* Show first 3 items as Badges */}
                                {subList.slice(0, 3).map((sub, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="px-2 py-0 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-0"
                                  >
                                    {sub}
                                  </Badge>
                                ))}
                                {/* Show counter if more than 3 */}
                                {subList.length > 3 && (
                                  <span className="text-[11px] text-muted-foreground font-medium self-center px-1">
                                    +{subList.length - 3}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </TableCell>
                      {/* --- FIX END --- */}

                      <TableCell className="hidden lg:table-cell">
                        {teacher.current_country}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {teacher.years_experience} Yrs
                      </TableCell>

                      {/* --- Updated Desktop Switch --- */}
                      <TableCell className="hidden md:table-cell">
                        <Switch
                          checked={teacher.is_visible_in_school_portal}
                          onCheckedChange={() =>
                            handleToggleVisibility(
                              teacher.id,
                              teacher.is_visible_in_school_portal
                            )
                          }
                          className="cursor-pointer"
                        />
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            teacher.profile_status === "ACTIVE"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {teacher.profile_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 cursor-pointer"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="cursor-pointer"
                          >
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleView(teacher)}
                            >
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleEdit(teacher)}
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onClick={() => handleDelete(teacher.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
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

      {/* --- ADD / EDIT MODAL --- */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={(open) => !open && handleCloseModal()}
      >
        <DialogContent className="sm:max-w-[800px] w-full max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 shrink-0">
            <DialogTitle>
              {editingId ? "Edit Teacher" : "Add New Teacher"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update existing teacher details."
                : "Create a comprehensive profile."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="grid gap-8">
              {/* SECTION 1: ADMIN FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 p-6 rounded-lg border">
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">
                    Teacher Code
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      // FIX: Use || "" to prevent null
                      value={formData.teacher_code || ""}
                      readOnly
                      className="bg-muted font-mono font-bold"
                    />
                    {!editingId && (
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            teacher_code: generateCode(),
                          })
                        }
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-end space-y-3">
                  <div className="flex items-center space-x-3 border p-3 rounded-md bg-background">
                    <Switch
                      checked={formData.is_visible_in_school_portal}
                      onCheckedChange={(c) =>
                        setFormData({
                          ...formData,
                          is_visible_in_school_portal: c,
                        })
                      }
                    />
                    <Label>Visible to Schools?</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* SECTION 2: PERSONAL INFO */}
              <div className="space-y-6">
                <h4 className="font-medium text-sm flex items-center text-blue-600">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Personal Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      // FIX: Use || "" to prevent null
                      value={formData.full_name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      // FIX: Use || "" to prevent null
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      // FIX: Use || "" to prevent null
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CV / Resume Link</Label>
                    <Input
                      // FIX: Use || "" to prevent null
                      value={formData.cv_link || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, cv_link: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* SECTION 3: PROFESSIONAL INFO */}
              <div className="space-y-6">
                <h4 className="font-medium text-sm flex items-center text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                  Professional Info
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Current Job Title</Label>
                    <Input
                      // FIX: Use || "" to prevent null
                      value={formData.current_job_title || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          current_job_title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Subjects <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      // FIX: Use || "" to prevent null
                      value={formData.subjects || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, subjects: e.target.value })
                      }
                      placeholder="e.g. physics,chemistry,biology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Highest Qualification <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      // FIX: Use || "" to prevent null
                      value={formData.highest_qualification || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, highest_qualification: e.target.value })
                      }
                      placeholder="e.g. M.Tech software engineering"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current School Name (Admin Only)</Label>
                    <Input
                      // FIX: Use || "" to prevent null
                      value={formData.current_school_name || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          current_school_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Input
                      type="number"
                      // FIX: Use || 0 to prevent null for numbers
                      value={formData.years_experience || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          years_experience: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* SECTION 4: LOCATION & STATUS */}
              <div className="space-y-6">
                <h4 className="font-medium text-sm flex items-center text-orange-600">
                  <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2"></span>
                  Location & Status
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Current Country</Label>
                    <Input
                      // FIX: Use || "" to prevent null
                      value={formData.current_country || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          current_country: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Region</Label>
                    <Input
                      // FIX: Use || "" to prevent null
                      value={formData.current_region || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          current_region: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Visa Status</Label>
                    <Input
                      // FIX: Use || "" to prevent null
                      value={formData.visa_status || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visa_status: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <Label>Notice Period</Label>
                    <Input
                      // FIX: Use || "" to prevent null
                      value={formData.notice_period || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notice_period: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* SECTION 5: AVAILABILITY */}
              <div className="space-y-6">
                <h4 className="font-medium text-sm flex items-center text-purple-600">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                  Availability
                </h4>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-8">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="sem1"
                        checked={formData.will_move_sem1}
                        onCheckedChange={(c) =>
                          setFormData({
                            ...formData,
                            will_move_sem1: c as boolean,
                          })
                        }
                      />
                      <Label htmlFor="sem1">Will move Semester 1</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="sem2"
                        checked={formData.will_move_sem2}
                        onCheckedChange={(c) =>
                          setFormData({
                            ...formData,
                            will_move_sem2: c as boolean,
                          })
                        }
                      />
                      <Label htmlFor="sem2">Will move Semester 2</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Regions</Label>
                    <Input
                      // FIX: Use || "" to prevent null
                      value={formData.preferred_regions || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferred_regions: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* FIXED BIO FIELD: Now using textarea classes for better multi-line input */}
                  <div className="space-y-2">
                    <Label>Teacher Bio</Label>
                    <textarea
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.bio || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bio: e.target.value,
                        })
                      }
                      placeholder="Enter a professional biography..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-8 py-6 border-t bg-muted/20 shrink-0">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-between">
              <Select
                value={formData.profile_status}
                onValueChange={(val) =>
                  setFormData({
                    ...formData,
                    profile_status: val as TeacherStatus,
                  })
                }
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PLACED">Placed</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none cursor-pointer"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 sm:flex-none cursor-pointer"
                  onClick={handleSaveTeacher}
                >
                  {editingId ? "Update Profile" : "Create Profile"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- VIEW DETAILS MODAL (ALL FIELDS) --- */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[800px] w-full max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              Teacher Profile
              <Badge variant="outline" className="font-mono">
                {selectedTeacher?.teacher_code}
              </Badge>
            </DialogTitle>
            <DialogDescription>Full details (Admin View)</DialogDescription>
          </DialogHeader>

          {selectedTeacher && (
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-8">
                {/* 1. HEADER CARD */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 border rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-2xl shrink-0">
                    {selectedTeacher.full_name.substring(0, 1)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="font-bold text-xl">
                      {selectedTeacher.full_name}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="inline-flex items-center text-muted-foreground">
                        <Briefcase className="w-3.5 h-3.5 mr-1" />{" "}
                        {selectedTeacher.current_job_title}
                      </span>
                      <span className="hidden md:inline text-muted-foreground">
                        •
                      </span>
                      <span className="inline-flex items-center text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 mr-1" />{" "}
                        {selectedTeacher.current_country}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className="px-3 py-1 text-sm"
                    variant={
                      selectedTeacher.profile_status === "ACTIVE"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedTeacher.profile_status}
                  </Badge>
                </div>

                {/* 2. CONTACT & ADMIN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider border-b pb-2">
                      Contact Info
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-dashed pb-2">
                        <span className="text-muted-foreground flex items-center">
                          <Mail className="w-4 h-4 mr-2" /> Email
                        </span>
                        <span className="font-medium">
                          {selectedTeacher.email}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-dashed pb-2">
                        <span className="text-muted-foreground flex items-center">
                          <Phone className="w-4 h-4 mr-2" /> Phone
                        </span>
                        <span className="font-medium">
                          {selectedTeacher.phone || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-muted-foreground flex items-center">
                          <FileText className="w-4 h-4 mr-2" /> Resume
                        </span>
                        {selectedTeacher.cv_link ? (
                          <a
                            href={selectedTeacher.cv_link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline text-xs font-semibold"
                          >
                            Open Link ↗
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            Not Uploaded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider border-b pb-2">
                      Logistics
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-dashed pb-2">
                        <span className="text-muted-foreground flex items-center">
                          <Globe className="w-4 h-4 mr-2" /> Visa Status
                        </span>
                        <span className="font-medium">
                          {selectedTeacher.visa_status || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-dashed pb-2">
                        <span className="text-muted-foreground flex items-center">
                          <Calendar className="w-4 h-4 mr-2" /> Notice Period
                        </span>
                        <span className="font-medium">
                          {selectedTeacher.notice_period || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-muted-foreground flex items-center">
                          <Eye className="w-4 h-4 mr-2" /> Visibility
                        </span>
                        <span
                          className={
                            selectedTeacher.is_visible_in_school_portal
                              ? "text-green-600 font-bold text-xs"
                              : "text-red-500 font-bold text-xs"
                          }
                        >
                          {selectedTeacher.is_visible_in_school_portal
                            ? "Visible"
                            : "Hidden"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. PROFESSIONAL DETAILS */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider border-b pb-2">
                    Professional Background
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">
                        Current School (Admin Only)
                      </label>
                      <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded flex items-center text-yellow-800 dark:text-yellow-200 font-medium">
                        <School className="w-4 h-4 mr-2" />{" "}
                        {selectedTeacher.current_school_name}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">
                        Highest Qualification
                      </label>
                      <div className="p-2 bg-muted rounded font-medium">
                        {selectedTeacher.highest_qualification}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">
                        Subjects
                      </label>
                      <div className="p-2 bg-muted rounded font-medium">
                        {selectedTeacher.subjects}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">
                        Experience
                      </label>
                      <div className="p-2 bg-muted rounded font-medium">
                        {selectedTeacher.years_experience} Years
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. PREFERENCES */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider border-b pb-2">
                    Placement Preferences
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-2">
                        Availability
                      </label>
                      <div className="flex gap-2">
                        {selectedTeacher.will_move_sem1 && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Semester 1
                          </Badge>
                        )}
                        {selectedTeacher.will_move_sem2 && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Semester 2
                          </Badge>
                        )}
                        {!selectedTeacher.will_move_sem1 &&
                          !selectedTeacher.will_move_sem2 && (
                            <span className="text-muted-foreground italic">
                              No availability set
                            </span>
                          )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">
                        Preferred Regions
                      </label>
                      <p className="font-medium">
                        {selectedTeacher.preferred_regions ||
                          "Open to anywhere"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. BIO SECTION (ADDED) */}
                <div className="space-y-4 pt-4">
                  <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider border-b pb-2">
                    About Teacher
                  </h4>
                  <div className="p-4 bg-muted/50 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedTeacher.bio || "No biography provided."}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="px-6 py-4 border-t bg-muted/20 shrink-0">
            <Button variant="outline" className="cursor-pointer" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => {
                handleEdit(selectedTeacher!);
                setIsViewModalOpen(false);
              }}
            >
              Edit This Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
