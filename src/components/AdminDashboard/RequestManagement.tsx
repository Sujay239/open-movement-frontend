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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreHorizontal,
  Search,
  Mail,
  CheckCircle2,
  XCircle,
  Send,
  User,
  Calendar,
  X,
  Loader2,
  School,
  MessageSquare,
  Clock,
} from "lucide-react";
import { useAlert } from "../blocks/AlertProvider";
// import { toast } from "sonner";

// --- Types based on your API Response ---
interface RequestItem {
  id: string | number;
  schoolName: string;
  schoolEmail: string;
  teacherId: string;
  teacherName: string;
  status: string;
  requestedAt: string;
  schoolMessage?: string;
  adminNotes?: string;
}

const BASE_URL = import.meta.env?.VITE_BASE_URL;

export default function RequestsManagement() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [adminNoteInput, setAdminNoteInput] = useState("");
    const {showError , showSuccess} = useAlert();

  // --- 1. FETCH DATA ---
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(
        `${BASE_URL}/admin/requests?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error(error);
      showError("Could not load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  // --- 2. UPDATE STATUS ---
  const handleUpdateStatus = async (id: string | number, newStatus: string) => {
    const oldRequests = [...requests];
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );

    try {
      const res = await fetch(
        `${BASE_URL}/admin/requests/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            status: newStatus,
            admin_notes: adminNoteInput || undefined,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed update");
      showSuccess(`Updated Sucesssfully`);
      fetchRequests();
    } catch (error) {
      showError("Update failed");
      setRequests(oldRequests);
    }
  };

  // --- Helpers ---
  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase().replace(" ", "_");
    switch (s) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-600 bg-yellow-50"
          >
            Pending
          </Badge>
        );
      case "TEACHER_CONTACTED":
        return (
          <Badge
            variant="outline"
            className="border-blue-500 text-blue-600 bg-blue-50"
          >
            Contacted
          </Badge>
        );
      case "TEACHER_ACCEPTED":
        return <Badge className="bg-green-600">Accepted</Badge>;
      case "TEACHER_DECLINED":
        return <Badge variant="destructive">Declined</Badge>;
      case "CLOSED":
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const openDetails = (request: RequestItem) => {
    setSelectedRequest(request);
    setAdminNoteInput(request.adminNotes || "");
    setIsDetailsOpen(true);
  };

  // --- Action Menu ---
  const ActionMenu = ({ request }: { request: RequestItem }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => openDetails(request)}
        >
          <User className="mr-2 h-4 w-4 cursor-pointer" /> View Details & Notes
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            window.open(
              `https://mail.google.com/mail/?view=cm&fs=1&to=${request.schoolEmail}`,
              "_blank"
            );
          }}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email School
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="cursor-pointer">
          Update Status
        </DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleUpdateStatus(request.id, "TEACHER_CONTACTED")}
        >
          <Send className="mr-2 h-4 w-4 text-blue-500" /> Mark Contacted
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleUpdateStatus(request.id, "TEACHER_ACCEPTED")}
        >
          <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Mark Accepted
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleUpdateStatus(request.id, "TEACHER_DECLINED")}
        >
          <XCircle className="mr-2 h-4 w-4 text-red-500" /> Mark Declined
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleUpdateStatus(request.id, "CLOSED")}
        >
          <X className="mr-2 h-4 w-4 font-bold" /> Mark Closed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6  flex flex-col p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Requests</h2>
          <p className="text-muted-foreground">
            Manage full profile access requests.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="TEACHER_CONTACTED">Contacted</SelectItem>
              <SelectItem value="TEACHER_ACCEPTED">Accepted</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2.5 text-muted-foreground hover:text-black cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64 border rounded-md bg-muted/10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* --- MOBILE VIEW (Cards) - Restored! --- */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {requests.length === 0 ? (
              <div className="text-center p-8 border rounded-lg bg-muted/20 text-muted-foreground">
                No requests found.
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{request.schoolName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {request.schoolEmail}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
                      <span className="font-medium text-foreground">
                        {request.teacherName}
                      </span>
                      <span className="text-xs bg-muted px-1 rounded">
                        {request.teacherId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t mt-1">
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      size="sm"
                      onClick={() => openDetails(request)}
                    >
                      View Details
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Actions
                      </span>
                      <ActionMenu request={request} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* --- DESKTOP VIEW (Table) - Restored! --- */}
          <div className="hidden md:block rounded-md border bg-card flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div className="font-medium">{req.schoolName}</div>
                        <div className="text-xs text-muted-foreground">
                          {req.schoolEmail}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{req.teacherName}</div>
                        <div className="text-xs font-mono text-muted-foreground bg-slate-100 dark:bg-slate-800 px-1 rounded w-fit">
                          {req.teacherId}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(req.requestedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                      <TableCell className="text-right">
                        <ActionMenu request={req} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* --- DETAIL MODAL (With All Data) --- */}
      {selectedRequest && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Request Details
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground font-normal">
                  ID: {selectedRequest.id}
                </span>
              </DialogTitle>
              <DialogDescription>
                Review complete details below.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-2">
              {/* Header Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                    <School className="h-4 w-4" /> School Information
                  </div>
                  <div>
                    <p className="font-medium">{selectedRequest.schoolName}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedRequest.schoolEmail}
                    </p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                    <User className="h-4 w-4" /> Teacher Candidate
                  </div>
                  <div>
                    <p className="font-medium">{selectedRequest.teacherName}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {selectedRequest.teacherId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      Requested On
                    </span>
                    <span className="text-sm font-medium">
                      {new Date(selectedRequest.requestedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>{getStatusBadge(selectedRequest.status)}</div>
              </div>

              {/* Messages & Notes */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <MessageSquare className="h-4 w-4" /> Message from School
                  </div>
                  <div className="p-3 border rounded-md bg-muted/20 text-sm leading-relaxed">
                    {selectedRequest.schoolMessage ? (
                      selectedRequest.schoolMessage
                    ) : (
                      <span className="text-muted-foreground italic">
                        No message provided.
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    Admin Notes (Internal)
                  </div>
                  <Textarea
                    placeholder="Write internal notes here (e.g. 'Emailed teacher on Feb 12')..."
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => setIsDetailsOpen(false)}
              >
                Close
              </Button>
              <Button
                className="cursor-pointer"
                onClick={() => {
                  handleUpdateStatus(
                    selectedRequest.id,
                    selectedRequest.status
                  );
                  setIsDetailsOpen(false);
                }}
              >
                Save Notes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
