import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  Trash2,
  Shield,
  UserCog,
  RefreshCw,
  ShieldAlert,
  KeyRound,
} from "lucide-react";
import { useAlert } from "@/components/blocks/AlertProvider";
import { Link, useNavigate } from "react-router"; // Added useNavigate

const BASE_URL = import.meta.env?.VITE_BASE_URL;
// Get Master PIN from env, default to "1234" if not set
const MASTER_PIN = import.meta.env?.VITE_MASTER_PIN || "1234";

// Interface for Admin Data
interface Admin {
  id: string | number;
  full_name: string;
  email: string;
  role?: string;
  created_at?: string;
}

export default function ManageAdmins() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { showError, showSuccess } = useAlert();

  // --- SECURITY STATE ---
  const [isVerified, setIsVerified] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  // --- FETCH ADMINS ---
  const fetchAdmins = async () => {
    // Prevent fetching if not verified
    if (!isVerified) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/adminAuth/all`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch admins");

      const adminList = Array.isArray(data) ? data : data.admins || [];
      setAdmins(adminList);
    } catch (err: any) {
      showError(err.message || "Could not load admin list");
    } finally {
      setIsLoading(false);
    }
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

  // --- DELETE ADMIN ---
  const handleDelete = async (id: string | number) => {
    try {
      const res = await fetch(`${BASE_URL}/adminAuth/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete admin");

      showSuccess("Admin removed successfully");
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    } catch (err: any) {
      showError(err.message || "Deletion failed");
    }
  };

  // Load admins ONLY when isVerified becomes true
  useEffect(() => {
    if (isVerified) {
      fetchAdmins();
    }
  }, [isVerified]);

  return (
    <div className="w-full h-full relative">
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
            <DialogTitle className="text-lg">Confidential Data</DialogTitle>
            <DialogDescription>
              This area contains sensitive admin details. Enter Master PIN to
              access.
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

      {/* --- MAIN CONTENT (Blurred until verified) --- */}
      <div
        className={`space-y-6 w-full max-w-5xl mx-auto p-4 transition-all duration-500 ${
          !isVerified
            ? "blur-lg opacity-40 pointer-events-none select-none"
            : "blur-0 opacity-100"
        }`}
      >
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <UserCog className="h-8 w-8 text-blue-600" />
              Admin Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              View and manage administrators who have access to this dashboard.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchAdmins}
              title="Refresh List"
              disabled={isLoading}
              className="cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4  ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>

            {/* --- ADD ADMIN MODAL --- */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  <Link to="/admin/new"> Add New Admin </Link>
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {/* --- ADMIN LIST CARD --- */}
        <Card className="shadow-md border-slate-200 dark:border-zinc-800">
          <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-white/5 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                Authorized Personnel
                <Badge variant="secondary" className="ml-3">
                  {admins.length} Total
                </Badge>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[250px] pl-6">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading admins...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : admins.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No administrators found. Click "Add New Admin" to create
                      one.
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow
                      key={admin.id}
                      className="group transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                      <TableCell className="font-medium pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xs">
                            {admin.full_name.substring(0, 2).toUpperCase()}
                          </div>
                          {admin.full_name}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {admin.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-normal gap-1 pl-1 pr-2"
                        >
                          <Shield className="h-3 w-3 fill-slate-500 text-slate-500" />
                          Admin
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        {/* --- DELETE CONFIRMATION --- */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 opacity-70 hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Admin?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove{" "}
                                <strong>{admin.full_name}</strong>? They will
                                immediately lose access to the dashboard. This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(admin.id)}
                                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                              >
                                Delete User
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
