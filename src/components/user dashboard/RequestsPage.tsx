import React, { useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Eye,
  Archive,
  Mail,
  StickyNote,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// --- DEMO DATA RESTORED ---
const demoRequests = [
  {
    id: "REQ-001",
    teacherId: "OM-T0123",
    subject: "Mathematics",
    date: "Oct 24, 2025",
    status: "Teacher Accepted",
    adminNotes: "Interview scheduled for Monday.",
  },
  {
    id: "REQ-002",
    teacherId: "OM-T0127",
    subject: "Biology",
    date: "Oct 22, 2025",
    status: "Pending",
    adminNotes: "Waiting for response.",
  },
  {
    id: "REQ-003",
    teacherId: "OM-T0126",
    subject: "English ESL",
    date: "Oct 20, 2025",
    status: "Teacher Contacted",
    adminNotes: "Sent follow-up email.",
  },
  {
    id: "REQ-004",
    teacherId: "OM-T0129",
    subject: "History",
    date: "Oct 18, 2025",
    status: "Teacher Declined",
    adminNotes: "Not interested in location.",
  },
  {
    id: "REQ-005",
    teacherId: "OM-T0110",
    subject: "Primary Art",
    date: "Sep 30, 2025",
    status: "Closed",
    adminNotes: "Role filled internally.",
  },
];

export const RequestsPage = () => {
  const container = useRef<HTMLDivElement>(null);

  // Initialize state with DEMO DATA directly
  const [requests, setRequests] = useState(demoRequests);

  // State for Modal
  const [selectedRequest, setSelectedRequest] = useState<
    (typeof demoRequests)[0] | null
  >(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Animation
  useGSAP(
    () => {
      gsap.fromTo(
        ".request-row",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.1,
        }
      );
    },
    { scope: container }
  );

  const handleViewDetails = (req: (typeof demoRequests)[0]) => {
    setSelectedRequest(req);
    setIsDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Teacher Accepted":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "Pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "Teacher Contacted":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "Teacher Declined":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-400 border-slate-200 dark:border-zinc-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Teacher Accepted":
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      case "Pending":
        return <Clock className="w-3.5 h-3.5 mr-1" />;
      case "Teacher Declined":
        return <XCircle className="w-3.5 h-3.5 mr-1" />;
      case "Teacher Contacted":
        return <MessageCircle className="w-3.5 h-3.5 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div ref={container} className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          My Requests
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Track the status of your full profile requests.
        </p>
      </div>

      <Card className="border-slate-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Request History</CardTitle>
              <CardDescription>
                You have {requests.filter((r) => r.status === "Pending").length}{" "}
                active requests in progress.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <FileText className="w-4 h-4 mr-2" /> Download Report
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                <TableHead className="w-[100px] hidden sm:table-cell">
                  Request ID
                </TableHead>
                <TableHead className="w-[120px]">Teacher Code</TableHead>
                <TableHead className="hidden md:table-cell">Subject</TableHead>
                <TableHead className="hidden lg:table-cell w-[200px]">
                  Admin Notes
                </TableHead>
                <TableHead className="w-[100px] sm:w-auto">Date Sent</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow
                  key={req.id}
                  className="request-row border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 text-sm"
                >
                  <TableCell className="font-medium text-slate-900 dark:text-white hidden sm:table-cell">
                    {req.id}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {req.teacherId}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {req.subject}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground truncate max-w-[200px]">
                    {req.adminNotes || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs sm:text-sm">
                    {req.date}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(req.status)} whitespace-nowrap`}
                    >
                      {getStatusIcon(req.status)}
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Mobile-only View Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs px-2 sm:hidden"
                        onClick={() => handleViewDetails(req)}
                      >
                        View
                      </Button>

                      {/* Dropdown Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(req)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" /> Contact Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <StickyNote className="mr-2 h-4 w-4" /> Edit Notes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            <Archive className="mr-2 h-4 w-4" /> Archive Request
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- DETAIL MODAL --- */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Complete information for request{" "}
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {selectedRequest?.id}
              </span>
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Teacher Code
                  </p>
                  <p className="font-semibold">{selectedRequest.teacherId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Date Sent
                  </p>
                  <p className="font-semibold">{selectedRequest.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Subject
                  </p>
                  <p className="font-semibold">{selectedRequest.subject}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </p>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(selectedRequest.status)} w-fit`}
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 dark:bg-zinc-900 p-3 rounded-md">
                <p className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
                  <StickyNote className="w-3 h-3" /> Admin Notes
                </p>
                <p className="text-sm">
                  {selectedRequest.adminNotes || "No notes added."}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestsPage;
