import { useState } from "react";
import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Eye, Edit, CheckCircle, XCircle, UserPlus, Filter, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface Report {
  id: string;
  location: string;
  issueType: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Pending" | "Verified" | "Rejected";
  volunteer: string;
  dateTime: string;
}

const mockReports: Report[] = [
  {
    id: "RPT-2024-001",
    location: "Mumbai, Maharashtra",
    issueType: "Food Shortage",
    severity: "Critical",
    status: "Pending",
    volunteer: "Rajesh Kumar",
    dateTime: "2026-04-26 09:30"
  },
  {
    id: "RPT-2024-002",
    location: "Delhi, NCR",
    issueType: "Medical Emergency",
    severity: "High",
    status: "Verified",
    volunteer: "Priya Sharma",
    dateTime: "2026-04-26 08:15"
  },
  {
    id: "RPT-2024-003",
    location: "Bangalore, Karnataka",
    issueType: "Shelter Need",
    severity: "Medium",
    status: "Verified",
    volunteer: "Amit Patel",
    dateTime: "2026-04-25 18:45"
  },
  {
    id: "RPT-2024-004",
    location: "Chennai, Tamil Nadu",
    issueType: "Education Issue",
    severity: "Low",
    status: "Pending",
    volunteer: "Lakshmi Iyer",
    dateTime: "2026-04-25 16:20"
  },
  {
    id: "RPT-2024-005",
    location: "Kolkata, West Bengal",
    issueType: "Medical Emergency",
    severity: "Critical",
    status: "Verified",
    volunteer: "Suresh Ghosh",
    dateTime: "2026-04-25 14:10"
  },
  {
    id: "RPT-2024-006",
    location: "Pune, Maharashtra",
    issueType: "Water & Sanitation",
    severity: "High",
    status: "Rejected",
    volunteer: "Neha Desai",
    dateTime: "2026-04-25 12:05"
  },
  {
    id: "RPT-2024-007",
    location: "Hyderabad, Telangana",
    issueType: "Food Shortage",
    severity: "Medium",
    status: "Pending",
    volunteer: "Vijay Reddy",
    dateTime: "2026-04-24 20:30"
  },
  {
    id: "RPT-2024-008",
    location: "Ahmedabad, Gujarat",
    issueType: "Shelter Need",
    severity: "High",
    status: "Verified",
    volunteer: "Kavita Shah",
    dateTime: "2026-04-24 17:50"
  },
];

const severityColors = {
  Low: "bg-green-500/20 text-green-800 border-green-300",
  Medium: "bg-yellow-500/20 text-yellow-800 border-yellow-300",
  High: "bg-orange-500/20 text-orange-800 border-orange-300",
  Critical: "bg-red-500/20 text-red-800 border-red-300",
};

const statusColors = {
  Pending: "bg-yellow-500/20 text-yellow-800 border-yellow-300",
  Verified: "bg-green-500/20 text-green-800 border-green-300",
  Rejected: "bg-red-500/20 text-red-800 border-red-300",
};

export default function RecentSubmissionsTable() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.volunteer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || report.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl">Recent Submissions</h2>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-64"
            />
          </div>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report ID</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Issue Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Volunteer</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.location}</TableCell>
                <TableCell>{report.issueType}</TableCell>
                <TableCell>
                  <Badge className={severityColors[report.severity]} variant="outline">
                    {report.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[report.status]} variant="outline">
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>{report.volunteer}</TableCell>
                <TableCell className="whitespace-nowrap">{report.dateTime}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Report Details - {report.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Location</p>
                              <p>{report.location}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Issue Type</p>
                              <p>{report.issueType}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Severity</p>
                              <Badge className={severityColors[report.severity]} variant="outline">
                                {report.severity}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Status</p>
                              <Badge className={statusColors[report.status]} variant="outline">
                                {report.status}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Volunteer</p>
                              <p>{report.volunteer}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Submitted</p>
                              <p>{report.dateTime}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Description</p>
                            <p className="text-sm bg-muted p-3 rounded">
                              Detailed report information would appear here including the full description,
                              affected population details, evidence attachments, and verification status.
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button variant="ghost" size="sm" title="Edit">
                      <Edit className="w-4 h-4" />
                    </Button>

                    {report.status === "Pending" && (
                      <>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-600 dark:text-green-400" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-600 dark:text-red-400" title="Reject">
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary" title="Assign">
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No reports found matching your filters.
        </div>
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        Showing {filteredReports.length} of {reports.length} reports
      </div>
    </Card>
  );
}
