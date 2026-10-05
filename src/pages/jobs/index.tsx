import { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  Search,
  Download,
  Eye,
  FileText,
  Video,
  Mail,
  Phone,
  Calendar,
  MapPin,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import makeApiRequest from "@/services/axios";
import { notify } from "@/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Type definitions
interface JobApplication {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  position: string;
  experience: string;
  availability: string;
  video_path: string;
  resume_path: string;
  message: string | null;
  created_at: string;
  updated_at: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

interface JobApplicationsResponse {
  current_page: number;
  data: JobApplication[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface ApiResponse {
  success: boolean;
  data: JobApplicationsResponse;
}

const AllJobs = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(20);

  // Stats
  const [statsData, setStatsData] = useState([
    {
      title: "Total Applications",
      value: "0",
      change: "All submissions",
      icon: Users,
      trend: "up" as const,
    },
    {
      title: "Unique Positions",
      value: "0",
      change: "Different roles",
      icon: Briefcase,
      trend: "up" as const,
    },
    {
      title: "Full Time",
      value: "0",
      change: "Full-time applicants",
      icon: Clock,
      trend: "up" as const,
    },
    {
      title: "Remote",
      value: "0",
      change: "Remote applicants",
      icon: MapPin,
      trend: "up" as const,
    },
  ]);

  const fetchApplications = async (page: number = 1) => {
    try {
      setLoading(true);

      const response = await makeApiRequest<ApiResponse>(
        `admin/job-applications?page=${page}`,
        {
          method: "GET",
        }
      );

      if (response?.success && response.data) {
        setApplications(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
        setTotalRecords(response.data.total);
        setPerPage(response.data.per_page);

        // Calculate stats
        calculateStats(response.data.data, response.data.total);
      }
    } catch (error: any) {
      console.error("❌ Error fetching applications:", error);
      notify({
        message: error?.response?.data?.message || "Failed to fetch applications",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: JobApplication[], total: number) => {
    const uniquePositions = new Set(data.map((app) => app.position.toLowerCase())).size;
    const fullTimeCount = data.filter((app) =>
      app.availability.toLowerCase().includes("full")
    ).length;
    const remoteCount = data.filter((app) =>
      app.availability.toLowerCase().includes("remote")
    ).length;

    setStatsData([
      {
        title: "Total Applications",
        value: total.toString(),
        change: "All submissions",
        icon: Users,
        trend: "up" as const,
      },
      {
        title: "Unique Positions",
        value: uniquePositions.toString(),
        change: "Different roles",
        icon: Briefcase,
        trend: "up" as const,
      },
      {
        title: "Full Time",
        value: fullTimeCount.toString(),
        change: "Full-time applicants",
        icon: Clock,
        trend: "up" as const,
      },
      {
        title: "Remote",
        value: remoteCount.toString(),
        change: "Remote applicants",
        icon: MapPin,
        trend: "up" as const,
      },
    ]);
  };

  useEffect(() => {
    fetchApplications(currentPage);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchApplications(page);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getFullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAvailabilityBadge = (availability: string) => {
    const lower = availability.toLowerCase();
    if (lower.includes("full")) {
      return { className: "bg-green-100 text-green-800", label: availability };
    } else if (lower.includes("remote")) {
      return { className: "bg-blue-100 text-blue-800", label: availability };
    } else if (lower.includes("part")) {
      return { className: "bg-yellow-100 text-yellow-800", label: availability };
    }
    return { className: "bg-gray-100 text-gray-800", label: availability };
  };

  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsDetailOpen(true);
  };

  const handleDownloadResume = (resumePath: string, applicantName: string) => {
    window.open(`https://care-storage-app.s3.us-east-1.amazonaws.com/${resumePath}`, "_blank");
    notify({
      message: `Downloading resume for ${applicantName}`,
      type: "success",
    });
  };

  const handleViewVideo = (videoPath: string) => {
    window.open(`https://care-storage-app.s3.us-east-1.amazonaws.com/${videoPath}`, "_blank");
  };

  const filteredApplications = applications.filter((app) => {
    const fullName = getFullName(app.first_name, app.last_name).toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone_number.includes(searchQuery);

    const matchesPosition =
      positionFilter === "all" || app.position.toLowerCase() === positionFilter.toLowerCase();

    const matchesAvailability =
      availabilityFilter === "all" ||
      app.availability.toLowerCase().includes(availabilityFilter.toLowerCase());

    return matchesSearch && matchesPosition && matchesAvailability;
  });

  // Get unique positions for filter
  const uniquePositions = Array.from(new Set(applications.map((app) => app.position)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
          <p className="text-muted-foreground">
            Manage and review all job applications
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-lg" />
          ))
        ) : (
          statsData.map((stat, index) => <StatsCard key={index} {...stat} />)
        )}
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">All Applications</CardTitle>
              <CardDescription>
                View and manage submitted job applications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, email, position, or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {uniquePositions.map((position) => (
                  <SelectItem key={position} value={position.toLowerCase()}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="full">Full Time</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="part">Part Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => {
                    const availabilityBadge = getAvailabilityBadge(app.availability);

                    return (
                      <TableRow key={app.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {getInitials(app.first_name, app.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {getFullName(app.first_name, app.last_name)}
                              </p>
                              <p className="text-xs text-gray-500">{app.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-medium">
                            {app.position}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {app.experience}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={availabilityBadge.className}>
                            {availabilityBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Mail className="w-3 h-3" />
                              <span className="truncate max-w-[150px]">
                                {app.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{app.phone_number}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDateTime(app.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(app)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDownloadResume(
                                  app.resume_path,
                                  getFullName(app.first_name, app.last_name)
                                )
                              }
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewVideo(app.video_path)}
                            >
                              <Video className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No applications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && filteredApplications.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <p>
                Showing {((currentPage - 1) * perPage) + 1} to{" "}
                {Math.min(currentPage * perPage, totalRecords)} of {totalRecords}{" "}
                applications
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="px-3 py-1 bg-gray-100 rounded">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Application Details</DialogTitle>
            <DialogDescription>
              Complete information about this job application
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Applicant Header */}
              <div className="flex items-start justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
                      {getInitials(
                        selectedApplication.first_name,
                        selectedApplication.last_name
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">
                      {getFullName(
                        selectedApplication.first_name,
                        selectedApplication.last_name
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedApplication.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedApplication.phone_number}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-lg px-4 py-2 font-semibold"
                >
                  {selectedApplication.position}
                </Badge>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Experience</p>
                  <p className="font-semibold text-blue-600">
                    {selectedApplication.experience}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Availability</p>
                  <Badge className={getAvailabilityBadge(selectedApplication.availability).className}>
                    {selectedApplication.availability}
                  </Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Applied</p>
                  <p className="font-medium text-sm">
                    {formatDateTime(selectedApplication.created_at)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <p className="font-medium break-all">
                      {selectedApplication.email}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="font-medium">{selectedApplication.phone_number}</p>
                  </div>
                </div>
              </div>

              {/* Cover Message */}
              {selectedApplication.message && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Cover Message
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm leading-relaxed">
                        {selectedApplication.message}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Documents */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Documents & Media</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-medium">Resume / CV</p>
                        <p className="text-xs text-gray-500">PDF Document</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        handleDownloadResume(
                          selectedApplication.resume_path,
                          getFullName(
                            selectedApplication.first_name,
                            selectedApplication.last_name
                          )
                        )
                      }
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>

                  <div className="p-4 border-2 border-dashed rounded-lg hover:border-purple-500 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Video className="w-8 h-8 text-purple-500" />
                      <div>
                        <p className="font-medium">Introduction Video</p>
                        <p className="text-xs text-gray-500">Video File</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleViewVideo(selectedApplication.video_path)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Video
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timeline */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Application Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Submitted</span>
                    <span className="font-medium">
                      {formatDateTime(selectedApplication.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="font-medium">
                      {formatDateTime(selectedApplication.updated_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Application
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Applicant
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllJobs;