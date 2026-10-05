import { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Eye,
  User,
  Calendar,
  CreditCard,
  AlertCircle,
  Mail,
  Loader2,
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
import { Modal } from "@/components/ui/modal";
import { LucideIcon } from "lucide-react";
// Type definitions
interface Provider {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
}

interface Payout {
  id: number;
  provider_id: number;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "rejected" | "processing";
  created_at: string;
  provider: Provider;
}

interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface PayoutsResponse {
  success: boolean;
  data: {
    payouts: Payout[];
    pagination: PaginationData;
  };
}

interface StatisticsData {
  total_payouts: number;
  pending_payouts: number;
  pending_amount: number;
  paid_payouts: number;
  paid_amount: number;
  rejected_payouts: number;
  total_pending_value: string;
}

interface StatisticsResponse {
  success: boolean;
  data: StatisticsData;
}

const Payouts = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkApproveModalOpen, setIsBulkApproveModalOpen] = useState(false);
  const [bulkApproving, setBulkApproving] = useState(false);

  // Modal states
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedPayoutForAction, setSelectedPayoutForAction] =
    useState<Payout | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(20);

  // Stats
  const [statsData, setStatsData] = useState([
    {
      title: "Total Payouts",
      value: "0",
      change: "All time",
      icon: DollarSign,
      trend: "up" as const,
    },
    {
      title: "Paid Amount",
      value: "$0",
      change: "Completed payouts",
      icon: CheckCircle,
      trend: "up" as const,
    },
    {
      title: "Pending Amount",
      value: "$0",
      change: "Awaiting payment",
      icon: Clock,
      trend: "up" as const,
    },
    {
      title: "Rejected",
      value: "0",
      change: "Declined payouts",
      icon: XCircle,
      trend: "down" as const,
    },
  ]);

  const fetchStatistics = async () => {
    try {
      setStatsLoading(true);

      const response = await makeApiRequest<StatisticsResponse>(
        "admin/payouts/statistics",
        {
          method: "GET",
        }
      );

      if (response?.success && response.data) {
        const stats = response.data;

        setStatsData([
          {
            title: "Total Payouts",
            value: stats.total_payouts.toString(),
            change: "All time",
            icon: DollarSign,
            trend: "up" as const,
          },
          {
            title: "Paid Amount",
            value: `$${Number(stats.paid_amount).toFixed(2)}`,
            change: `${stats.paid_payouts} completed`,
            icon: CheckCircle,
            trend: "up" as const,
          },
          {
            title: "Pending Amount",
            value: `$${Number(stats.pending_amount).toFixed(2)}`,
            change: `${stats.pending_payouts} pending`,
            icon: Clock,
            trend: "up" as const,
          },
          {
            title: "Rejected",
            value: stats.rejected_payouts.toString(),
            change: "Declined payouts",
            icon: XCircle,
            trend: "down" as const,
          },
        ]);
      }
    } catch (error: any) {
      console.error("❌ Error fetching statistics:", error);
      notify({
        message: error?.response?.data?.message || "Failed to fetch statistics",
        type: "error",
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchPayouts = async (page: number = 1) => {
    try {
      setLoading(true);

      const response = await makeApiRequest<PayoutsResponse>(
        `admin/payouts?page=${page}`,
        {
          method: "GET",
        }
      );

      if (response?.success && response.data) {
        setPayouts(response.data.payouts);
        setCurrentPage(response.data.pagination.current_page);
        setTotalPages(response.data.pagination.last_page);
        setTotalRecords(response.data.pagination.total);
        setPerPage(response.data.pagination.per_page);
      }
    } catch (error: any) {
      console.error("❌ Error fetching payouts:", error);
      notify({
        message: error?.response?.data?.message || "Failed to fetch payouts",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
    fetchPayouts(currentPage);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchPayouts(page);
    }
  };



  const getStatusConfig = (status: string) => {
    const config: Record<string, { className: string; icon: any; label: string }> = {
      paid: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: CheckCircle,
        label: "Paid",
      },
      pending: {
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: Clock,
        label: "Pending",
      },
      rejected: {
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        icon: XCircle,
        label: "Rejected",
      },
      processing: {
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        icon: TrendingUp,
        label: "Processing",
      },
      failed: {
        className: "bg-red-200 text-red-900 hover:bg-red-200",
        icon: AlertCircle,
        label: "Failed",
      },
      cancelled: {
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        icon: XCircle,
        label: "Cancelled",
      },
    };
    return config[status] || config.pending;
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

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getFullName = (provider: Provider) => {
    return `${provider.first_name} ${provider.last_name}`;
  };

  const handleViewDetails = (payout: Payout) => {
    setSelectedPayout(payout);
    setIsDetailOpen(true);
  };

  const openApproveModal = (payout: Payout) => {
    setSelectedPayoutForAction(payout);
    setIsApproveModalOpen(true);
  };

  const openRejectModal = (payout: Payout) => {
    setSelectedPayoutForAction(payout);
    setIsRejectModalOpen(true);
  };

  const handleApprovePayout = async () => {
    if (!selectedPayoutForAction) return;

    try {
      setApproving(true);

      const response = await makeApiRequest(
        `admin/payouts/${selectedPayoutForAction.id}/approve`,
        {
          method: "POST",
        }
      );

      if (response?.success) {
        notify({
          message: response.message || "Payout approved successfully",
          type: "success",
        });
        setIsApproveModalOpen(false);
        setSelectedPayoutForAction(null);
        fetchPayouts(currentPage);
        fetchStatistics();
      }
    } catch (error: any) {
      console.error("❌ Error approving payout:", error);
      notify({
        message: error?.response?.data?.message || "Failed to approve payout",
        type: "error",
      });
    } finally {
      setApproving(false);
    }
  };

  const handleRejectPayout = async () => {
    if (!selectedPayoutForAction) return;

    try {
      setRejecting(true);

      const response = await makeApiRequest(
        `admin/payouts/${selectedPayoutForAction.id}/reject`,
        {
          method: "POST",
        }
      );

      if (response?.success) {
        notify({
          message: response.message || "Payout rejected successfully",
          type: "success",
        });
        setIsRejectModalOpen(false);
        setSelectedPayoutForAction(null);
        fetchPayouts(currentPage);
        fetchStatistics();
      }
    } catch (error: any) {
      console.error("❌ Error rejecting payout:", error);
      notify({
        message: error?.response?.data?.message || "Failed to reject payout",
        type: "error",
      });
    } finally {
      setRejecting(false);
    }
  };

  const handleBulkApprovePayout = async () => {
    if (selectedIds.length === 0) return;

    try {
      setBulkApproving(true);

      const response = await makeApiRequest("admin/payouts/bulk-approve", {
        method: "POST",
        data: {
          payout_ids: selectedIds,
        },
      });

      if (response?.success) {
        notify({
          message: response.message || `${selectedIds.length} payouts approved successfully`,
          type: "success",
        });
        setIsBulkApproveModalOpen(false);
        setSelectedIds([]);
        fetchPayouts(currentPage);
        fetchStatistics();
      }
    } catch (error: any) {
      console.error("❌ Error bulk approving payouts:", error);
      notify({
        message: error?.response?.data?.message || "Failed to bulk approve payouts",
        type: "error",
      });
    } finally {
      setBulkApproving(false);
    }
  };

  const filteredPayouts = payouts.filter((payout) => {
    const providerName = getFullName(payout.provider).toLowerCase();

    const matchesSearch =
      providerName.includes(searchQuery.toLowerCase()) ||
      payout.provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.id.toString().includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || payout.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Payouts Management
          </h1>
          <p className="text-muted-foreground">
            Manage and process worker payouts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {selectedIds.length > 0 && (
            <Button
              onClick={() => setIsBulkApproveModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Bulk Approve ({selectedIds.length})
            </Button>
          )}
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
            <DollarSign className="w-4 h-4 mr-2" />
            Process Payouts
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

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">All Payouts</CardTitle>
              <CardDescription>
                View and manage all payout requests
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
                placeholder="Search by ID, worker name, or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          const pendings = filteredPayouts
                            .filter(p => p.status === 'pending')
                            .map(p => p.id);
                          setSelectedIds(pendings);
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length === filteredPayouts.filter(p => p.status === 'pending').length
                      }
                    />
                  </TableHead>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Worker</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPayouts.length > 0 ? (
                  filteredPayouts.map((payout) => {
                    const statusConfig = getStatusConfig(payout.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <TableRow key={payout.id} className="hover:bg-gray-50">
                        <TableCell>
                          {payout.status === 'pending' && (
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(payout.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedIds([...selectedIds, payout.id]);
                                } else {
                                  setSelectedIds(selectedIds.filter(id => id !== payout.id));
                                }
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell className="font-mono font-semibold text-blue-600">
                          #{payout.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={payout.provider.avatar_url} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {getInitials(
                                  payout.provider.first_name,
                                  payout.provider.last_name
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {getFullName(payout.provider)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {payout.provider.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(payout.amount, payout.currency)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig.className}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDateTime(payout.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(payout)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {payout.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => openApproveModal(payout)}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => openRejectModal(payout)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No payouts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && filteredPayouts.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <p>
                Showing {(currentPage - 1) * perPage + 1} to{" "}
                {Math.min(currentPage * perPage, totalRecords)} of{" "}
                {totalRecords} payouts
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

      {/* Payout Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Payout Details</DialogTitle>
            <DialogDescription>
              Complete information about this payout request
            </DialogDescription>
          </DialogHeader>

          {selectedPayout && (
            <div className="space-y-6">
              {/* Payout Header */}
              <div className="flex items-start justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payout ID</p>
                  <p className="font-mono font-bold text-lg text-blue-600">
                    #{selectedPayout.id}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Worker ID: {selectedPayout.provider_id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Amount</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(
                      selectedPayout.amount,
                      selectedPayout.currency
                    )}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Status</p>
                {(() => {
                  const config = getStatusConfig(selectedPayout.status);
                  const Icon = config.icon;
                  return (
                    <Badge
                      className={`${config.className} text-base px-4 py-2`}
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {config.label}
                    </Badge>
                  );
                })()}
              </div>

              <Separator />

              {/* Provider Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Worker Information
                </h3>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedPayout.provider.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
                      {getInitials(
                        selectedPayout.provider.first_name,
                        selectedPayout.provider.last_name
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      {getFullName(selectedPayout.provider)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Mail className="w-4 h-4" />
                      <span>{selectedPayout.provider.email}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Worker ID: {selectedPayout.provider.id}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Details */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Amount</p>
                    <p className="font-bold text-lg text-green-600">
                      {formatCurrency(
                        selectedPayout.amount,
                        selectedPayout.currency
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Currency</p>
                    <p className="font-semibold uppercase">
                      {selectedPayout.currency}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timeline */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Created At</span>
                    <span className="font-medium">
                      {formatDateTime(selectedPayout.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedPayout.status === "pending" && (
                <>
                  <Separator />
                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setIsDetailOpen(false);
                        openApproveModal(selectedPayout);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Payout
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setIsDetailOpen(false);
                        openRejectModal(selectedPayout);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Payout
                    </Button>
                  </div>
                </>
              )}

              {selectedPayout.status === "paid" && (
                <>
                  <Separator />
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <p className="font-semibold">
                        This payout has been successfully processed
                      </p>
                    </div>
                  </div>
                </>
              )}

              {selectedPayout.status === "rejected" && (
                <>
                  <Separator />
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      <p className="font-semibold">This payout was rejected</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => !approving && setIsApproveModalOpen(false)}
        title="Approve Payout"
        width="max-w-md"
        showFooter={false}
      >
        {selectedPayoutForAction && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">Confirm Approval</p>
                <p className="text-sm text-gray-600">
                  Are you sure you want to approve this payout?
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Payout ID:</span>
                <span className="font-mono font-semibold">
                  #{selectedPayoutForAction.id}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Worker:</span>
                <span className="font-semibold">
                  {getFullName(selectedPayoutForAction.provider)}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(
                    selectedPayoutForAction.amount,
                    selectedPayoutForAction.currency
                  )}
                </span>
              </div>
            </div>

            {/* Custom Footer with Loading */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => setIsApproveModalOpen(false)}
                disabled={approving}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleApprovePayout}
                disabled={approving}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {approving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => !rejecting && setIsRejectModalOpen(false)}
        title="Reject Payout"
        width="max-w-md"
        showFooter={false}
      >
        {selectedPayoutForAction && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="font-semibold text-gray-900">Confirm Rejection</p>
                <p className="text-sm text-gray-600">
                  Are you sure you want to reject this payout?
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Payout ID:</span>
                <span className="font-mono font-semibold">
                  #{selectedPayoutForAction.id}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Worker:</span>
                <span className="font-semibold">
                  {getFullName(selectedPayoutForAction.provider)}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="font-bold text-red-600">
                  {formatCurrency(
                    selectedPayoutForAction.amount,
                    selectedPayoutForAction.currency
                  )}
                </span>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This action cannot be undone. The
                worker will be notified of the rejection.
              </p>
            </div>

            {/* Custom Footer with Loading */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                disabled={rejecting}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectPayout}
                disabled={rejecting}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {rejecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Reject
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
      {/* Bulk Approve Confirmation Modal */}
      <Modal
        isOpen={isBulkApproveModalOpen}
        onClose={() => !bulkApproving && setIsBulkApproveModalOpen(false)}
        title="Bulk Approve Payouts"
        width="max-w-md"
        showFooter={false}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-900">Confirm Bulk Approval</p>
              <p className="text-sm text-gray-600">
                Are you sure you want to approve {selectedIds.length} pending payouts?
              </p>
            </div>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <p className="text-yellow-800">
              This will process payments for all selected workers. This action is not reversible.
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={() => setIsBulkApproveModalOpen(false)}
              disabled={bulkApproving}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkApprovePayout}
              disabled={bulkApproving}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {bulkApproving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Bulk Approve"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Payouts;