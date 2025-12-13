import { useState } from "react";
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
  X, // Added for the clear search button
} from "lucide-react";

// --- Types based on your Data Model ---
type RequestStatus =
  | "Pending"
  | "Teacher Contacted"
  | "Teacher Accepted"
  | "Teacher Declined"
  | "Closed";

interface Request {
  id: string;
  schoolName: string;
  schoolEmail: string;
  teacherId: string;
  teacherName: string; // Internal admin view only
  status: RequestStatus;
  requestedAt: string;
  schoolMessage?: string;
  adminNotes?: string;
}

// --- Mock Data ---
const initialRequests: Request[] = [
  {
    id: "REQ-001",
    schoolName: "Riyadh International School",
    schoolEmail: "hr@riyadh-intl.com",
    teacherId: "OM-T0123",
    teacherName: "Sarah Jenkins (Math)",
    status: "Pending",
    requestedAt: "2024-02-12",
    schoolMessage:
      "We are looking for a HOD Math. Does this candidate have leadership experience?",
    adminNotes: "",
  },
  {
    id: "REQ-002",
    schoolName: "Bangkok Prep",
    schoolEmail: "recruit@bkkprep.ac.th",
    teacherId: "OM-T9942",
    teacherName: "David Chen (Physics)",
    status: "Teacher Contacted",
    requestedAt: "2024-02-10",
    schoolMessage: "Urgent vacancy for start of term.",
    adminNotes: "Emailed David on Feb 11th. Waiting for reply.",
  },
  {
    id: "REQ-003",
    schoolName: "Dubai British School",
    schoolEmail: "principal@dbs.ae",
    teacherId: "OM-T1255",
    teacherName: "Emily White (Primary)",
    status: "Teacher Accepted",
    requestedAt: "2024-02-08",
    schoolMessage: "",
    adminNotes: "Introduction email sent to both parties.",
  },
];

export default function RequestsManagement() {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // --- UPDATED FILTER LOGIC ---
  const filteredRequests = requests.filter((req) => {
    const query = searchQuery.toLowerCase();
    return (
      req.schoolName.toLowerCase().includes(query) ||
      req.schoolEmail.toLowerCase().includes(query) ||
      req.teacherName.toLowerCase().includes(query) ||
      req.teacherId.toLowerCase().includes(query) ||
      req.id.toLowerCase().includes(query) ||
      req.status.toLowerCase().includes(query)
    );
  });

  // Status Change Handler
  const updateStatus = (id: string, newStatus: RequestStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
    if (newStatus === "Teacher Contacted") {
      console.log("Trigger email to Teacher...");
    }
  };

  // Helper to get Badge Color
  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-600 bg-yellow-50"
          >
            Pending
          </Badge>
        );
      case "Teacher Contacted":
        return (
          <Badge
            variant="outline"
            className="border-blue-500 text-blue-600 bg-blue-50"
          >
            Contacted
          </Badge>
        );
      case "Teacher Accepted":
        return (
          <Badge
            variant="outline"
            className="border-green-500 text-green-600 bg-green-50"
          >
            Accepted
          </Badge>
        );
      case "Teacher Declined":
        return (
          <Badge
            variant="outline"
            className="border-red-500 text-red-600 bg-red-50"
          >
            Declined
          </Badge>
        );
      case "Closed":
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Reusable Action Menu Component
  const ActionMenu = ({ request }: { request: Request }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            setSelectedRequest(request);
            setIsDetailsOpen(true);
          }}
        >
          <User className="mr-2 h-4 w-4" /> View Details & Notes
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            (window.location.href = `mailto:${request.schoolEmail}`)
          }
        >
          <Mail className="mr-2 h-4 w-4" /> Email School
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => updateStatus(request.id, "Teacher Contacted")}
        >
          <Send className="mr-2 h-4 w-4 text-blue-500" /> Mark Contacted
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateStatus(request.id, "Teacher Accepted")}
        >
          <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Mark Accepted
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateStatus(request.id, "Teacher Declined")}
        >
          <XCircle className="mr-2 h-4 w-4 text-red-500" /> Mark Declined
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6">
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Requests</h2>
          <p className="text-muted-foreground">
            Manage full profile requests from schools.
          </p>
        </div>

        {/* --- UPDATED SEARCH BAR --- */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search school, teacher, email..."
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

      {/* --- MOBILE VIEW (Cards) --- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted/20 text-muted-foreground">
            No requests found.
          </div>
        ) : (
          filteredRequests.map((request) => (
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
                  <span>{request.requestedAt}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(request);
                    setIsDetailsOpen(true);
                  }}
                >
                  View Details
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Actions</span>
                  <ActionMenu request={request} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- DESKTOP VIEW (Table) --- */}
      <div className="hidden md:block rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School Name</TableHead>
              <TableHead>Teacher Candidate</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No requests found matching "{searchQuery}".
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  {/* School Column */}
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{request.schoolName}</span>
                      <span className="text-xs text-muted-foreground">
                        {request.schoolEmail}
                      </span>
                    </div>
                  </TableCell>

                  {/* Teacher Column */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded w-fit">
                        {request.teacherId}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {request.teacherName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Date Column */}
                  <TableCell>{request.requestedAt}</TableCell>

                  {/* Status Column */}
                  <TableCell>{getStatusBadge(request.status)}</TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-right">
                    <ActionMenu request={request} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Detail View Modal (Dialog) --- */}
      {selectedRequest && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>
                Full details for request{" "}
                <span className="font-mono">{selectedRequest.id}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Teacher Info Block */}
              <div className="p-3 bg-muted rounded-md space-y-1">
                <h4 className="text-sm font-semibold">Requested Candidate</h4>
                <div className="flex justify-between text-sm">
                  <span>ID: {selectedRequest.teacherId}</span>
                  <span>{selectedRequest.teacherName}</span>
                </div>
              </div>

              {/* School Message Block */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Message from School</h4>
                <div className="p-3 border rounded-md bg-background text-sm text-muted-foreground">
                  {selectedRequest.schoolMessage || "No message provided."}
                </div>
              </div>

              {/* Admin Notes Block (Editable) */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Admin Internal Notes</h4>
                <Textarea
                  placeholder="Add notes about your conversation with the teacher..."
                  defaultValue={selectedRequest.adminNotes}
                />
              </div>
            </div>

            <DialogFooter>
              {selectedRequest.status === "Pending" && (
                <Button
                  onClick={() => {
                    updateStatus(selectedRequest.id, "Teacher Contacted");
                    setIsDetailsOpen(false);
                  }}
                >
                  Submit
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
