import { useEffect, useState } from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Search,
  Filter,
  TrendingUp,
  Users,
  Send,
  Smartphone,
  CircleDot,
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
interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  user_type: string;
  profile_photo: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  status: string;
  is_verified: boolean;
}

interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  related_type: string | null;
  related_id: number | null;
  action_url: string | null;
  data: any;
  is_read: boolean;
  read_at: string | null;
  sent_in_app: boolean;
  sent_email: boolean;
  sent_push: boolean;
  sent_sms: boolean;
  email_sent_at: string | null;
  push_sent_at: string | null;
  sms_sent_at: string | null;
  priority: "high" | "medium" | "low";
  created_at: string;
  updated_at: string;
  user: User;
}

interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: PaginationData;
  };
}

interface StatisticsData {
  overview: {
    total_notifications: number;
    unread_notifications: number;
    read_notifications: number;
    read_rate: string;
  };
  by_type: Record<string, number>;
  by_priority: Record<string, number>;
  delivery: {
    emails_sent: number;
    pushes_sent: number;
    sms_sent: number;
  };
  recent_notifications: Array<{ date: string; count: number }>;
  most_engaged_users: any[];
}

interface StatisticsResponse {
  success: boolean;
  data: StatisticsData;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [readStatusFilter, setReadStatusFilter] = useState("all");
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(50);

  // Stats
  const [statsData, setStatsData] = useState([
    {
      title: "Total Notifications",
      value: "0",
      change: "All time",
      icon: Bell,
      trend: "up" as const,
    },
    {
      title: "Unread",
      value: "0",
      change: "Pending review",
      icon: CircleDot,
      trend: "up" as const,
    },
    {
      title: "Emails Sent",
      value: "0",
      change: "Delivered",
      icon: Mail,
      trend: "up" as const,
    },
    {
      title: "Read Rate",
      value: "0%",
      change: "Engagement",
      icon: TrendingUp,
      trend: "up" as const,
    },
  ]);

  const fetchStatistics = async () => {
    try {
      setStatsLoading(true);

      const response = await makeApiRequest<StatisticsResponse>(
        "admin/notifications/statistics",
        {
          method: "GET",
        }
      );

      if (response?.success && response.data) {
        const stats = response.data.overview;
        const delivery = response.data.delivery;

        setStatsData([
          {
            title: "Total Notifications",
            value: stats.total_notifications.toString(),
            change: "All time",
            icon: Bell,
            trend: "up" as const,
          },
          {
            title: "Unread",
            value: stats.unread_notifications.toString(),
            change: "Pending review",
            icon: CircleDot,
            trend: "up" as const,
          },
          {
            title: "Emails Sent",
            value: delivery.emails_sent.toString(),
            change: "Delivered",
            icon: Mail,
            trend: "up" as const,
          },
          {
            title: "Read Rate",
            value: stats.read_rate,
            change: "Engagement",
            icon: TrendingUp,
            trend: "up" as const,
          },
        ]);
      }
    } catch (error: any) {
      console.error("❌ Error fetching statistics:", error);
      notify({
        message:
          error?.response?.data?.message || "Failed to fetch statistics",
        type: "error",
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchNotifications = async (page: number = 1) => {
    try {
      setLoading(true);

      const response = await makeApiRequest<NotificationsResponse>(
        `admin/notifications?page=${page}`,
        {
          method: "GET",
        }
      );

      if (response?.success && response.data) {
        setNotifications(response.data.notifications);
        setCurrentPage(response.data.pagination.current_page);
        setTotalPages(response.data.pagination.last_page);
        setTotalRecords(response.data.pagination.total);
        setPerPage(response.data.pagination.per_page);
      }
    } catch (error: any) {
      console.error("❌ Error fetching notifications:", error);
      notify({
        message:
          error?.response?.data?.message || "Failed to fetch notifications",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
    fetchNotifications(currentPage);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchNotifications(page);
    }
  };

  const getTypeConfig = (type: string) => {
    const config: Record<string, { className: string; icon: any; label: string }> = {
      system_announcement: {
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        icon: Bell,
        label: "System Announcement",
      },
      booking_update: {
        className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
        icon: Clock,
        label: "Booking Update",
      },
      payment_notification: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: CheckCircle,
        label: "Payment",
      },
      alert: {
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        icon: AlertCircle,
        label: "Alert",
      },
    };
    return (
      config[type] || {
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        icon: Bell,
        label: type.replace(/_/g, " "),
      }
    );
  };

  const getPriorityConfig = (priority: string) => {
    const config: Record<string, { className: string; label: string; dotColor: string }> = {
      high: {
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        label: "High",
        dotColor: "bg-red-500",
      },
      medium: {
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        label: "Medium",
        dotColor: "bg-yellow-500",
      },
      low: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        label: "Low",
        dotColor: "bg-green-500",
      },
    };
    return (
      config[priority] || {
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        label: priority,
        dotColor: "bg-gray-500",
      }
    );
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getFullName = (user: User) => {
    return `${user.first_name} ${user.last_name}`;
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDetailOpen(true);
  };

  const filteredNotifications = notifications.filter((notification) => {
    const userName = getFullName(notification.user).toLowerCase();
    const title = notification.title.toLowerCase();
    const message = notification.message.toLowerCase();

    const matchesSearch =
      userName.includes(searchQuery.toLowerCase()) ||
      title.includes(searchQuery.toLowerCase()) ||
      message.includes(searchQuery.toLowerCase()) ||
      notification.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" || notification.type === typeFilter;

    const matchesPriority =
      priorityFilter === "all" || notification.priority === priorityFilter;

    const matchesReadStatus =
      readStatusFilter === "all" ||
      (readStatusFilter === "read" && notification.is_read) ||
      (readStatusFilter === "unread" && !notification.is_read);

    return matchesSearch && matchesType && matchesPriority && matchesReadStatus;
  });

  // Get unique types for filter
  const uniqueTypes = Array.from(
    new Set(notifications.map((n) => n.type))
  ).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Notifications Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage system notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            <Send className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-lg" />
          ))
        ) : (
          statsData.map((stat, index) => <StatsCard key={index} {...stat} />)
        )}
      </div>

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">All Notifications</CardTitle>
              <CardDescription>
                View and manage all system notifications
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
                placeholder="Search by user, title, or message..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={readStatusFilter}
              onValueChange={setReadStatusFilter}
            >
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => {
                    const typeConfig = getTypeConfig(notification.type);
                    const priorityConfig = getPriorityConfig(
                      notification.priority
                    );
                    const TypeIcon = typeConfig.icon;

                    return (
                      <TableRow
                        key={notification.id}
                        className={`hover:bg-gray-50 ${!notification.is_read ? "bg-blue-50/30" : ""
                          }`}
                      >
                        <TableCell>
                          {notification.is_read ? (
                            <Eye className="w-4 h-4 text-gray-400" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-blue-600" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={notification.user.profile_photo || ""}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                                {getInitials(
                                  notification.user.first_name,
                                  notification.user.last_name
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {getFullName(notification.user)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {notification.user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-sm">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {notification.message}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge className={typeConfig.className}>
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {typeConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-2 h-2 rounded-full ${priorityConfig.dotColor}`}
                            />
                            <Badge className={priorityConfig.className}>
                              {priorityConfig.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {notification.sent_email && (
                              <Mail className="w-4 h-4 text-green-600" />
                            )}
                            {notification.sent_push && (
                              <Smartphone className="w-4 h-4 text-blue-600" />
                            )}
                            {notification.sent_sms && (
                              <MessageSquare className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDateTime(notification.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(notification)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      No notifications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && filteredNotifications.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <p>
                Showing {(currentPage - 1) * perPage + 1} to{" "}
                {Math.min(currentPage * perPage, totalRecords)} of{" "}
                {totalRecords} notifications
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

      {/* Notification Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Notification Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this notification
            </DialogDescription>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-6">
              {/* Notification Header */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">
                      Notification ID
                    </p>
                    <p className="font-mono font-bold text-lg text-blue-600">
                      #{selectedNotification.id}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {(() => {
                      const typeConfig = getTypeConfig(
                        selectedNotification.type
                      );
                      const TypeIcon = typeConfig.icon;
                      return (
                        <Badge className={typeConfig.className}>
                          <TypeIcon className="w-4 h-4 mr-1" />
                          {typeConfig.label}
                        </Badge>
                      );
                    })()}
                    {(() => {
                      const priorityConfig = getPriorityConfig(
                        selectedNotification.priority
                      );
                      return (
                        <Badge className={priorityConfig.className}>
                          <div
                            className={`w-2 h-2 rounded-full ${priorityConfig.dotColor} mr-1`}
                          />
                          {priorityConfig.label}
                        </Badge>
                      );
                    })()}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedNotification.title}
                </h3>
                <p className="text-gray-700">{selectedNotification.message}</p>
              </div>

              {/* Read Status */}
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Read Status</p>
                {selectedNotification.is_read ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <Eye className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">Read</p>
                      <p className="text-sm text-gray-600">
                        {selectedNotification.read_at
                          ? formatDateTime(selectedNotification.read_at)
                          : ""}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-blue-700">
                    <EyeOff className="w-5 h-5" />
                    <p className="font-semibold">Unread</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* User Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recipient Information
                </h3>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={selectedNotification.user.profile_photo || ""}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
                      {getInitials(
                        selectedNotification.user.first_name,
                        selectedNotification.user.last_name
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      {getFullName(selectedNotification.user)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Mail className="w-4 h-4" />
                      <span>{selectedNotification.user.email}</span>
                    </div>
                    {selectedNotification.user.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Smartphone className="w-4 h-4" />
                        <span>{selectedNotification.user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className="text-xs capitalize"
                      >
                        {selectedNotification.user.user_type === "provider" ? "Worker" : selectedNotification.user.user_type === "client" ? "Employer" : selectedNotification.user.user_type}
                      </Badge>
                      <Badge
                        variant={
                          selectedNotification.user.status === "active"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {selectedNotification.user.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Delivery Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Delivery Channels
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-lg border-2 ${selectedNotification.sent_email
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Mail
                        className={`w-5 h-5 ${selectedNotification.sent_email
                            ? "text-green-600"
                            : "text-gray-400"
                          }`}
                      />
                      <span className="font-semibold">Email</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedNotification.sent_email
                        ? selectedNotification.email_sent_at
                          ? formatDateTime(selectedNotification.email_sent_at)
                          : "Sent"
                        : "Not sent"}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-lg border-2 ${selectedNotification.sent_push
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone
                        className={`w-5 h-5 ${selectedNotification.sent_push
                            ? "text-blue-600"
                            : "text-gray-400"
                          }`}
                      />
                      <span className="font-semibold">Push</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedNotification.sent_push
                        ? selectedNotification.push_sent_at
                          ? formatDateTime(selectedNotification.push_sent_at)
                          : "Sent"
                        : "Not sent"}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-lg border-2 ${selectedNotification.sent_sms
                        ? "bg-purple-50 border-purple-200"
                        : "bg-gray-50 border-gray-200"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare
                        className={`w-5 h-5 ${selectedNotification.sent_sms
                            ? "text-purple-600"
                            : "text-gray-400"
                          }`}
                      />
                      <span className="font-semibold">SMS</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedNotification.sent_sms
                        ? selectedNotification.sms_sent_at
                          ? formatDateTime(selectedNotification.sms_sent_at)
                          : "Sent"
                        : "Not sent"}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-lg border-2 ${selectedNotification.sent_in_app
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-gray-50 border-gray-200"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Bell
                        className={`w-5 h-5 ${selectedNotification.sent_in_app
                            ? "text-indigo-600"
                            : "text-gray-400"
                          }`}
                      />
                      <span className="font-semibold">In-App</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedNotification.sent_in_app ? "Sent" : "Not sent"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timeline */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Created At</span>
                    <span className="font-medium">
                      {formatDateTime(selectedNotification.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Updated At</span>
                    <span className="font-medium">
                      {formatDateTime(selectedNotification.updated_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notifications;