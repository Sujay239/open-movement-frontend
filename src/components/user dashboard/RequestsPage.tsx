import React, { useEffect, useRef, useState } from "react";
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
  AlertTriangle,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAlert } from "../blocks/AlertProvider";

// --- DEMO DATA (fallback) ---
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

// type RequestItem = (typeof demoRequests)[number];
const BASE_URL = import.meta.env?.VITE_BASE_URL;

export const RequestsPage: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  // Fetchable state
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State for Details Modal
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // State for Archive Modal
  const [requestToArchive, setRequestToArchive] = useState<any | null>(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const {showError,showSuccess} = useAlert();

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

  // --- FETCH API ---
  const API_ENDPOINT = `${BASE_URL}/requests/teachers`;

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);

      try {
        const res = await fetch(API_ENDPOINT, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setRequests(data);
        } else if (data?.requests && Array.isArray(data.requests)) {
          setRequests(data.requests);
        } else {
          console.warn(
            "Unexpected response format, falling back to demo data."
          );
          setRequests(demoRequests);
          showError("Unexpected response format from server. Using demo data.");
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error(err);
        showError(err.message || "Failed to load requests. Using demo data.");
        setRequests(demoRequests);
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, []);

  const handleViewDetails = (req: any) => {
    setSelectedRequest(req);
    setIsDetailsOpen(true);
  };

  // --- CONTACT ADMIN HANDLER ---
const handleContactAdmin = () => {
  const email = import.meta.env?.ADMIN_EMAIL;
  const subject = "Inquiry regarding Teacher Request";
  const body =
    "Hello Admin,\n\nI have a question regarding a teacher request.\n\nThanks.";

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.open(gmailUrl, "_blank"); // open Gmail in new tab
};





  const confirmArchive = async () => {
    if (!requestToArchive) return;
    setIsArchiving(true);

    try {
      // TODO: Replace with your actual Archive API endpoint
      // const res = await fetch(`${BASE_URL}/requests/archive/${requestToArchive.id}`, { method: 'POST', credentials: 'include' });
      // if(!res.ok) throw new Error("Failed");

      // Simulating API delay for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Remove from local state
      setRequests((prev) => prev.filter((r) => r.id !== requestToArchive.id));

      showSuccess(
        `Request ${requestToArchive.teacher_code || "ID"} archived successfully.`
      );
      setIsArchiveOpen(false);
    } catch (error) {
      console.error(error);
      showError("Failed to archive request.");
    } finally {
      setIsArchiving(false);
      setRequestToArchive(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TEACHER_ACCEPTED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "PENDING":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "TEACHER_CONTACTED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "TEACHER_DECLINED":
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

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINT, { credentials: "include" });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      setRequests(
        Array.isArray(data) ? data : (data?.requests ?? demoRequests)
      );
    } catch (err: any) {
      console.error(err);
      showError(err.message || "Failed to refresh requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!requests || requests.length === 0) {
      showError("No data to download.");
      return;
    }

    const csvRows = [];
    const headers = [
      "Request ID",
      "Teacher Code",
      "Subject",
      "Status",
      "Admin Notes",
      "Date",
    ];

    csvRows.push(headers.join(","));

    requests.forEach((req) => {
      csvRows.push(
        [
          req.id,
          req.teacher_code ?? req.teacherId,
          req.subjects ?? req.subject,
          req.status,
          req.admin_notes,
          req.requested_at ?? req.date,
        ]
          .map((v) => `"${v ?? ""}"`)
          .join(",")
      );
    });

    const csvData = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(csvData);

    const link = document.createElement("a");
    link.href = url;
    link.download = "request_report.csv";
    link.click();

    window.URL.revokeObjectURL(url);
  };


  async function handleArchieve(req: any): Promise<void> {
    try{
      const res = await fetch(
        `${BASE_URL}/requests/teachers/${req.id}/${req.teacher_id}/${req.school_id}`, {
          method : "DELETE",
          credentials : "include"
        }
      );
      const data = await res.json();
      if(res.ok){
        showSuccess(data.message);
        refresh();
      }else{
        showError(data.error);
      }
    }catch(err){
      showError("Something went wrong");
      console.log(err);
    }
  }


  const formatLocalDate = (value?: string | null) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(); // local time, safe
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
                {loading ? (
                  "Loading requests..."
                ) : (
                  <>
                    {requests.filter((r) => r.status === "PENDING").length}{" "}
                    active requests in progress.
                  </>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={refresh}
                disabled={loading}
                className="cursor-pointer"
              >
                Refresh
              </Button>
              <Button onClick={handleDownloadReport} variant="outline" size="sm" className="cursor-pointer hidden sm:flex">
                <FileText className="w-4 h-4 mr-2" /> Download Report
              </Button>
            </div>
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

                <TableHead className="w-[100px] sm:w-auto">Date Sent</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req: any) => (
                <TableRow
                  key={req.id}
                  className="request-row border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 text-sm"
                >
                  <TableCell className="font-medium text-slate-900 dark:text-white hidden sm:table-cell">
                    REQ-0{req.id}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {req.teacher_code}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {req.subjects?.[0] || ""}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs sm:text-sm">
                    {formatLocalDate(req.requested_at)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(
                        req.status
                      )} whitespace-nowrap`}
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
                            className="h-8 w-8 cursor-pointer"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(req)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>

                          {/* Updated Contact Admin */}
                          <DropdownMenuItem
                            onClick={handleContactAdmin}
                            className="cursor-pointer"
                          >
                            <Mail className="mr-2 h-4 w-4" /> Contact Admin
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {/* Updated Archive Trigger */}
                          <DropdownMenuItem
                            onClick={() => handleArchieve(req)}
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                          >
                            <Archive className="mr-2 h-4 w-4" /> Archive Request
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {loading && requests.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="p-6 text-center text-sm text-muted-foreground"
                  >
                    Loading requests...
                  </TableCell>
                </TableRow>
              )}

              {!loading && requests.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="p-6 text-center text-sm text-muted-foreground"
                  >
                    No requests found.
                  </TableCell>
                </TableRow>
              )}
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
                  <p className="font-semibold">
                    {selectedRequest.teacher_code}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Date Sent
                  </p>
                  <p className="font-semibold">
                    {selectedRequest.requested_at}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Subject
                  </p>
                  <p className="font-semibold">{selectedRequest.subjects[0]}</p>
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
                  <StickyNote className="w-3 h-3" /> Your message
                </p>
                <p className="text-sm">
                  {selectedRequest.school_message || "No notes added."}
                </p>
              </div>

              <div className="space-y-1 bg-slate-50 dark:bg-zinc-900 p-3 rounded-md">
                <p className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
                  <StickyNote className="w-3 h-3" /> Admin Notes
                </p>
                <p className="text-sm">
                  {selectedRequest.admin_notes || "No notes added."}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setIsDetailsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- ARCHIVE CONFIRMATION MODAL --- */}
      <Dialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
              <AlertTriangle className="h-5 w-5" />
              Confirm Archive
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to archive the request for teacher{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {requestToArchive?.teacher_code}
              </span>
              ? This action will remove it from your active list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsArchiveOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmArchive}
              disabled={isArchiving}
              className="cursor-pointer"
            >
              {isArchiving ? "Archiving..." : "Yes, Archive Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestsPage;
