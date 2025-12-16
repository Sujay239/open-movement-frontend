import  { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Search,
  Plus,
  Copy,
  Trash2,
  Key,
  Timer,
  CheckCircle2,
  Calendar,
  X,
  Hash,
  School,
  Loader2, // For loading spinner
  AlertTriangle, // For delete warning
} from "lucide-react";
import { useAlert } from "../blocks/AlertProvider";
// import { toast } from "sonner";

// --- 1. TYPES ---
type CodeStatus = "UNUSED" | "ACTIVE" | "EXPIRED";

interface AccessCode {
  id: string; // UUID from DB
  code: string;
  status: CodeStatus;
  school_name?: string; // Derived from joined school table
  created_at: string;
  first_used_at?: string;
  expires_at?: string;
}

export default function AccessCodes() {
  // --- STATE ---
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
    const {showError , showSuccess} = useAlert();

  // Generation Modal State
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [newlyGeneratedCode, setNewlyGeneratedCode] = useState("");

  // Delete Confirmation State
  const [codeToDelete, setCodeToDelete] = useState<string | null>(null);
  const BASE_URL = import.meta.env?.VITE_BASE_URL;
  // --- API URL ---
  const API_URL = `${BASE_URL}/admin/access-codes`;

  // --- 1. FETCH DATA ---
  const fetchCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch codes");
      const data = await res.json();
      setCodes(data);
    } catch (error) {
      console.error(error);
      showError("Failed to load access codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  // --- 2. GENERATE HANDLER ---
  const handleGenerate = () => {
    // 1. Generate code locally first
    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    const newCodeString = `OM-TRIAL-${randomSuffix}`;
    setNewlyGeneratedCode(newCodeString);
    setIsGenerateOpen(true);
  };

  // Called when user clicks "Done" in the modal
  const confirmGeneration = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: newlyGeneratedCode }),
      });

      if (!res.ok) throw new Error("Failed to save code");

     showSuccess("New access code saved!");
      setIsGenerateOpen(false);
      fetchCodes(); // Refresh list
    } catch (error) {
      console.error(error);
      showError("Error saving code");
    }
  };

  // --- 3. DELETE HANDLER ---
  const confirmDelete = async () => {
    if (!codeToDelete) return;

    try {
      const res = await fetch(`${API_URL}/${codeToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setCodes((prev) => prev.filter((c) => c.id !== codeToDelete)); // Optimistic UI update
      showSuccess("Code revoked successfully");
      setCodeToDelete(null); // Close modal
    } catch (error) {
      console.error(error);
      showError("Error revoking code");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
   showSuccess("Code copied to clipboard");
  };

  // --- HELPERS ---
  const getStatusBadge = (status: string) => {
    // Normalize status
    const s = status?.toUpperCase();
    switch (s) {
      case "UNUSED":
        return (
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            Unused
          </Badge>
        );
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
            Active (24h)
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
            Expired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- FILTER ---
  const filteredCodes = codes.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.code.toLowerCase().includes(query) ||
      (c.school_name?.toLowerCase() || "").includes(query) ||
      (c.status?.toLowerCase() || "").includes(query)
    );
  });

  // Stats
  const activeCount = codes.filter((c) => c.status === "ACTIVE").length;
  const unusedCount = codes.filter((c) => c.status === "UNUSED").length;

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Access Codes</h2>
          <p className="text-muted-foreground">
            Generate and manage 24-hour trial codes for schools.
          </p>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search code, school..."
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
          <Button
            onClick={handleGenerate}
            className="w-full sm:w-auto cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" /> Generate
          </Button>
        </div>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unused Codes</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unusedCount}</div>
            <p className="text-xs text-muted-foreground">Ready to be sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trials</CardTitle>
            <Timer className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">Currently browsing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Generated
            </CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{codes.length}</div>
            <p className="text-xs text-muted-foreground">Lifetime codes</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 border rounded-md bg-muted/10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* --- MOBILE VIEW (Cards) --- */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredCodes.length === 0 ? (
              <div className="text-center p-8 border rounded-lg bg-muted/20 text-muted-foreground">
                No codes found. Generate one to get started.
              </div>
            ) : (
              filteredCodes.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-lg bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded select-all">
                      {item.code}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4" />
                      <span className="font-medium text-foreground">
                        {item.school_name || "Not used yet"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Generated
                        </p>
                        <div className="flex items-center gap-1.5 text-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Expires
                        </p>
                        <div className="flex items-center gap-1.5 text-foreground">
                          <Timer className="h-3.5 w-3.5" />
                          <span>
                            {item.expires_at
                              ? formatDate(item.expires_at)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(item.code)}
                    >
                      <Copy className="mr-2 h-3.5 w-3.5" /> Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setCodeToDelete(item.id)}
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" /> Revoke
                    </Button>
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
                  <TableHead>Access Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Used By</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCodes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No codes found matching "{searchQuery}".
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCodes.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded select-all">
                            {item.code}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => copyToClipboard(item.code)}
                            title="Copy to clipboard"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {item.school_name ? (
                          <div className="flex items-center">
                            <School className="mr-2 h-3 w-3 text-muted-foreground" />
                            {item.school_name}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(item.created_at)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.expires_at ? formatDate(item.expires_at) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 cursor-pointer"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => copyToClipboard(item.code)}
                            >
                              <Copy className="mr-2 h-4 w-4" /> Copy Code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onClick={() => setCodeToDelete(item.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Revoke /
                              Delete
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

      {/* --- GENERATION SUCCESS DIALOG --- */}
      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500 h-5 w-5" />
              Code Generated
            </DialogTitle>
            <DialogDescription>
              Confirm to save this code to the database.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2 my-4">
            <div className="grid flex-1 gap-2">
              <Input
                readOnly
                value={newlyGeneratedCode}
                className="font-mono text-center text-lg font-bold tracking-widest bg-muted"
              />
            </div>
            <Button
              size="icon"
              onClick={() => copyToClipboard(newlyGeneratedCode)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <DialogFooter className="sm:justify-start">
            <Button
              className="cursor-pointer"
              type="button"
              onClick={confirmGeneration} // Calls POST API
            >
              Done & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <Dialog open={!!codeToDelete} onOpenChange={() => setCodeToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> Revoke Code?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this code? If a school is
              currently using it, they will lose access immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCodeToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Revoke Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
