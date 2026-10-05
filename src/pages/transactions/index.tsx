import { StatsCard } from "@/components/StatsCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ArrowDownLeft,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  Hash,
  LucideIcon,
  Receipt,
  Search,
  TrendingDown,
  TrendingUp,
  User,
  XCircle
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import makeApiRequest from "@/services/axios";
import { notify } from "@/utils/utils";
import { useEffect, useState } from "react";

// Type definitions based on API response
interface PaymentUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_photo: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

interface Booking {
  id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  hours: string;
  hourly_rate: string;
  total_amount: string;
  service_location: string;
  special_requirements: string;
  status: string;
  payment_status: string;
  created_at: string;
}

interface Payment {
  id: number;
  booking_id: number;
  client_id: number;
  service_provider_id: number;
  amount: string;
  platform_fee: string;
  provider_amount: string;
  currency: string;
  stripe_payment_intent_id: string;
  stripe_charge_id: string | null;
  stripe_customer_id: string;
  payment_method_id: string | null;
  payment_method_type: string;
  card_brand: string | null;
  card_last4: string | null;
  status: string;
  paid_at: string | null;
  failed_at: string | null;
  refunded_at: string | null;
  refund_amount: string | null;
  refund_reason: string | null;
  stripe_error: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  booking: Booking | null;
  client: PaymentUser;
  provider: PaymentUser;
  payout?: any;
  transactions?: any[];
}

interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

interface PaymentMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

interface PaymentsResponse {
  current_page: number;
  data: Payment[];
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

// Statistics API Types
interface PaymentStatistics {
  overview: {
    total_payments: number;
    total_amount: number;
    total_platform_fees: number;
    total_provider_earnings: number;
  };
  status_breakdown: {
    pending: number;
    succeeded: number;
    failed: number;
    refunded: number;
  };
  refunds: {
    total_refunds: number;
    total_refund_amount: number;
  };
  recent_payments: Array<{
    date: string;
    count: number;
    total: string;
  }>;
  top_providers: Array<any>;
  payouts: {
    pending_payouts: number;
    total_payouts: number;
  };
}

interface StatisticsResponse {
  success: boolean;
  data: PaymentStatistics;
}

// Payment Detail Response
interface PaymentDetailResponse {
  success: boolean;
  data: Payment;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down";
}

const TransactionHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [statsData, setStatsData] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(15);

  const fetchStatistics = async () => {
    try {
      setStatsLoading(true);

      const response = await makeApiRequest<StatisticsResponse>(
        "admin/payments/statistics",
        {
          method: "GET",
        }
      );

      if (response?.success && response.data) {
        const stats = response.data;

        const transformedStats: StatCard[] = [
          {
            title: "Total Payments",
            value: stats.overview.total_payments.toString(),
            change: "All time transactions",
            icon: Receipt,
            trend: "up" as const,
          },
          {
            title: "Total Amount",
            value: `$${stats.overview.total_amount.toFixed(2)}`,
            change: "Overall revenue",
            icon: DollarSign,
            trend: "up" as const,
          },
          {
            title: "Succeeded",
            value: stats.status_breakdown.succeeded.toString(),
            change: "Successful payments",
            icon: CheckCircle,
            trend: "up" as const,
          },
          {
            title: "Pending",
            value: stats.status_breakdown.pending.toString(),
            change: "Awaiting payment",
            icon: Clock,
            trend: "up" as const,
          },
          {
            title: "Platform Fees",
            value: `$${stats.overview.total_platform_fees.toFixed(2)}`,
            change: "Total fees collected",
            icon: TrendingUp,
            trend: "up" as const,
          },
          {
            title: "Worker Earnings",
            value: `$${stats.overview.total_provider_earnings.toFixed(2)}`,
            change: "Total to workers",
            icon: TrendingDown,
            trend: "down" as const,
          },
        ];

        setStatsData(transformedStats);
      }
    } catch (error: any) {
      console.error("❌ Error fetching statistics:", error);
      notify({
        message: error?.response?.data?.message || "Failed to fetch statistics",
        type: "error"
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchPayments = async (page: number = 1) => {
    try {
      setLoading(true);

      const response = await makeApiRequest<PaymentsResponse>(
        `admin/payments?page=${page}`,
        {
          method: "GET",
        }
      );

      if (response && response.data) {
        setPayments(response.data);
        setCurrentPage(response.current_page);
        setTotalPages(response.last_page);
        setTotalRecords(response.total);
        setPerPage(response.per_page);
      }
    } catch (error: any) {
      console.error("❌ Error fetching payments:", error);
      notify({
        message: error?.response?.data?.message || "Failed to fetch payments",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentDetail = async (paymentId: number) => {
    try {
      setDetailLoading(true);

      const response = await makeApiRequest<PaymentDetailResponse>(
        `admin/payments/${paymentId}`,
        {
          method: "GET",
        }
      );

      if (response?.success && response.data) {
        setSelectedPayment(response.data);
        setIsDetailOpen(true);
      }
    } catch (error: any) {
      console.error("❌ Error fetching payment details:", error);
      notify({
        message: error?.response?.data?.message || "Failed to fetch payment details",
        type: "error"
      });
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
    fetchPayments(currentPage);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchPayments(page);
    }
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { className: string; icon: LucideIcon; label: string }> = {
      succeeded: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: CheckCircle,
        label: "Succeeded",
      },
      completed: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: CheckCircle,
        label: "Completed",
      },
      requires_payment_method: {
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: Clock,
        label: "Requires Payment",
      },
      pending: {
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: Clock,
        label: "Pending",
      },
      failed: {
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        icon: XCircle,
        label: "Failed",
      },
      cancelled: {
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        icon: AlertCircle,
        label: "Cancelled",
      },
      refunded: {
        className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
        icon: ArrowDownLeft,
        label: "Refunded",
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

  const formatCurrency = (amount: string | number, currency: string = "USD") => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(numAmount);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getUserFullName = (user: PaymentUser) => {
    return `${user.first_name} ${user.last_name}`;
  };

  const handleViewDetails = (payment: Payment) => {
    fetchPaymentDetail(payment.id);
  };

  const filteredPayments = payments.filter((payment) => {
    const clientName = getUserFullName(payment.client).toLowerCase();
    const providerName = getUserFullName(payment.provider).toLowerCase();

    const matchesSearch =
      payment.stripe_payment_intent_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clientName.includes(searchQuery.toLowerCase()) ||
      providerName.includes(searchQuery.toLowerCase()) ||
      payment.client.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {statsLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-lg" />
          ))
        ) : statsData.length > 0 ? (
          statsData.map((stat, index) => <StatsCard key={index} {...stat} />)
        ) : (
          <div className="col-span-3 text-center text-gray-500">No data available</div>
        )}
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Payment History</CardTitle>
              <CardDescription>View and manage all payment transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by payment ID, employer, worker, or email..."
                className="pl-10 w-full"
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
                <SelectItem value="succeeded">Succeeded</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="requires_payment_method">Requires Payment</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell">Payment ID</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead className="hidden lg:table-cell">Worker</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden xl:table-cell">Platform Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Payment Method</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => {
                    const statusConfig = getStatusConfig(payment.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <TableRow key={payment.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-xs hidden md:table-cell">
                          {payment.stripe_payment_intent_id?.substring(0, 20)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={payment.client.profile_photo || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                {getInitials(payment.client.first_name, payment.client.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{getUserFullName(payment.client)}</p>
                              <p className="text-xs text-gray-500">{payment.client.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={payment.provider.profile_photo || undefined} />
                              <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-semibold">
                                {getInitials(payment.provider.first_name, payment.provider.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{getUserFullName(payment.provider)}</p>
                              <p className="text-xs text-gray-500">{payment.provider.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(payment.amount, payment.currency)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <span className="text-sm text-gray-600">
                            {formatCurrency(payment.platform_fee, payment.currency)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig.className}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-sm capitalize">{payment.payment_method_type}</span>
                            {payment.card_last4 && (
                              <span className="text-xs text-gray-500">****{payment.card_last4}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 hidden md:table-cell">
                          {formatDateTime(payment.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(payment)}
                            disabled={detailLoading}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {detailLoading ? "Loading..." : "View"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && filteredPayments.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
              <p>
                Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalRecords)} of {totalRecords} payments
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

      {/* Payment Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Payment Details</DialogTitle>
            <DialogDescription>
              Complete information about this payment transaction
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : selectedPayment ? (
            <div className="space-y-6">
              {/* Payment Header */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Intent ID</p>
                  <p className="font-mono font-semibold text-sm">
                    {selectedPayment.stripe_payment_intent_id}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Booking ID: #{selectedPayment.booking_id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                  </p>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Platform Fee</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatCurrency(selectedPayment.platform_fee, selectedPayment.currency)}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Worker Amount</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {formatCurrency(selectedPayment.provider_amount, selectedPayment.currency)}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  {(() => {
                    const config = getStatusConfig(selectedPayment.status);
                    const Icon = config.icon;
                    return (
                      <Badge className={config.className}>
                        <Icon className="w-4 h-4 mr-2" />
                        {config.label}
                      </Badge>
                    );
                  })()}
                </div>
              </div>

              <Separator />

              {/* Client & Provider Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Employer Information
                  </h3>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedPayment.client.profile_photo || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(selectedPayment.client.first_name, selectedPayment.client.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{getUserFullName(selectedPayment.client)}</p>
                      <p className="text-sm text-gray-600">{selectedPayment.client.email}</p>
                      <p className="text-xs text-gray-500">
                        {selectedPayment.client.phone && `Phone: ${selectedPayment.client.phone}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Worker Information
                  </h3>
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedPayment.provider.profile_photo || undefined} />
                      <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                        {getInitials(selectedPayment.provider.first_name, selectedPayment.provider.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{getUserFullName(selectedPayment.provider)}</p>
                      <p className="text-sm text-gray-600">{selectedPayment.provider.email}</p>
                      <p className="text-xs text-gray-500">
                        {selectedPayment.provider.city && selectedPayment.provider.state &&
                          `${selectedPayment.provider.city}, ${selectedPayment.provider.state}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                    <p className="font-medium capitalize">{selectedPayment.payment_method_type}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Currency</p>
                    <p className="font-medium uppercase">{selectedPayment.currency}</p>
                  </div>
                  {selectedPayment.card_brand && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Card Brand</p>
                      <p className="font-medium capitalize">{selectedPayment.card_brand}</p>
                    </div>
                  )}
                  {selectedPayment.card_last4 && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Card Number</p>
                      <p className="font-mono text-sm">****{selectedPayment.card_last4}</p>
                    </div>
                  )}
                  <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Stripe Customer ID</p>
                    <p className="font-mono text-sm">{selectedPayment.stripe_customer_id}</p>
                  </div>
                  {selectedPayment.stripe_charge_id && (
                    <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Stripe Charge ID</p>
                      <p className="font-mono text-sm">{selectedPayment.stripe_charge_id}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Information */}
              {selectedPayment.booking && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Receipt className="w-5 h-5" />
                      Booking Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Service Location</p>
                        <p className="font-medium text-sm">{selectedPayment.booking.service_location}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Hourly Rate</p>
                        <p className="font-medium">{formatCurrency(selectedPayment.booking.hourly_rate, selectedPayment.currency)}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Total Hours</p>
                        <p className="font-medium">{selectedPayment.booking.hours} hours</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Booking Status</p>
                        <Badge variant="outline" className="capitalize">
                          {selectedPayment.booking.status}
                        </Badge>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Booking Date</p>
                        <p className="font-medium text-sm">{formatDateTime(selectedPayment.booking.booking_date)}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                        <Badge variant="outline" className="capitalize">
                          {selectedPayment.booking.payment_status}
                        </Badge>
                      </div>
                      {selectedPayment.booking.special_requirements && (
                        <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                          <p className="text-sm text-gray-500 mb-1">Special Requirements</p>
                          <p className="text-sm">{selectedPayment.booking.special_requirements}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Refund Information */}
              {(selectedPayment.refunded_at || selectedPayment.refund_amount) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-orange-600">
                      <ArrowDownLeft className="w-5 h-5" />
                      Refund Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      {selectedPayment.refund_amount && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Refund Amount</p>
                          <p className="font-semibold text-orange-700">
                            {formatCurrency(selectedPayment.refund_amount, selectedPayment.currency)}
                          </p>
                        </div>
                      )}
                      {selectedPayment.refunded_at && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Refunded At</p>
                          <p className="font-medium">{formatDateTime(selectedPayment.refunded_at)}</p>
                        </div>
                      )}
                      {selectedPayment.refund_reason && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600 mb-1">Refund Reason</p>
                          <p className="text-sm">{selectedPayment.refund_reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Transactions */}
              {selectedPayment.transactions && selectedPayment.transactions.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Hash className="w-5 h-5" />
                      Related Transactions
                    </h3>
                    <div className="space-y-2">
                      {selectedPayment.transactions.map((transaction: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">Transaction #{index + 1}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Timestamps */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Created At</span>
                    <span className="font-medium">{formatDateTime(selectedPayment.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="font-medium">{formatDateTime(selectedPayment.updated_at)}</span>
                  </div>
                  {selectedPayment.paid_at && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-green-600 font-medium">Paid At</span>
                      <span className="font-medium">{formatDateTime(selectedPayment.paid_at)}</span>
                    </div>
                  )}
                  {selectedPayment.failed_at && (
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm text-red-600 font-medium">Failed At</span>
                      <span className="font-medium">{formatDateTime(selectedPayment.failed_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stripe Error */}
              {selectedPayment.stripe_error && (
                <>
                  <Separator />
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Stripe Error
                    </h3>
                    <p className="text-sm text-red-600">{selectedPayment.stripe_error}</p>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                <Button variant="outline" className="flex-1">
                  Print
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No payment details available
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionHistory;