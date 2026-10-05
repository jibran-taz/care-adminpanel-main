import { CustomPagination } from "@/components/custom-pagination";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import makeApiRequest from "@/services/axios";
import { notify } from "@/utils/utils";
import { Calendar, ChevronDown, DollarSign, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_photo: string | null;
}

interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_photo: string | null;
  is_verified: boolean;
}

interface Listing {
  id: number;
  title: string;
  category: string;
}

interface CancelledBy {
  id: number;
  name: string;
}

interface Booking {
  id: number;
  client: Client;
  provider: Provider;
  listing: Listing;
  booking_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  hourly_rate: number;
  total_amount: number;
  service_location: string;
  special_requirements: string | null;
  status: string;
  payment_status: string;
  cancellation_reason: string | null;
  cancelled_by: CancelledBy | null;
  cancelled_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function AllBookings() {
  const navigate = useNavigate();

  const [perPage, setPerPage] = useState(20);
  const [apiData, setApiData] = useState<{
    bookings: Booking[];
    pagination: PaginationData | null;
  }>({
    bookings: [],
    pagination: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookings = async (page: number = 1, itemsPerPage: number = 20) => {
    try {
      setIsLoading(true);

      const url = `/admin/bookings`;

      const response = await makeApiRequest(url, {
        method: "GET",
      });

      console.log("Bookings API Response:", response);

      setApiData({
        bookings: response.data.bookings || [],
        pagination: response.data.pagination || null,
      });
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      notify({ message: "Failed to fetch bookings", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
      accepted: { bg: "bg-blue-100", text: "text-blue-800" },
      in_progress: { bg: "bg-purple-100", text: "text-purple-800" },
      completed: { bg: "bg-green-100", text: "text-green-800" },
      cancelled: { bg: "bg-red-100", text: "text-red-800" },
      rejected: { bg: "bg-gray-100", text: "text-gray-800" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Badge className={`${config.bg} ${config.text} hover:${config.bg} capitalize`}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
      paid: { bg: "bg-green-100", text: "text-green-800" },
      refunded: { bg: "bg-red-100", text: "text-red-800" },
      failed: { bg: "bg-red-100", text: "text-red-800" },
    };

    const config = statusConfig[paymentStatus] || statusConfig.pending;

    return (
      <Badge className={`${config.bg} ${config.text} hover:${config.bg} capitalize`}>
        {paymentStatus}
      </Badge>
    );
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || !apiData.pagination || page > apiData.pagination.last_page)
      return;

    fetchBookings(page, perPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    fetchBookings(1, value);
  };

  useEffect(() => {
    fetchBookings(1, perPage);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Bookings</h1>
          <p className="text-muted-foreground">
            Manage and overview all bookings here.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bookings List</CardTitle>
              <CardDescription>
                {apiData.pagination ? (
                  <span>
                    Showing {apiData.pagination.current_page === 1 ? 1 : ((apiData.pagination.current_page - 1) * apiData.pagination.per_page) + 1} to{" "}
                    {Math.min(apiData.pagination.current_page * apiData.pagination.per_page, apiData.pagination.total)}{" "}
                    of {apiData.pagination.total} bookings
                  </span>
                ) : (
                  "View and manage all bookings"
                )}
              </CardDescription>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Show: {perPage}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handlePerPageChange(10)}>
                  10 per page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePerPageChange(20)}>
                  20 per page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePerPageChange(50)}>
                  50 per page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePerPageChange(100)}>
                  100 per page
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-[60px]" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[120px]" />
                            <Skeleton className="h-3 w-[150px]" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[120px]" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[70px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-4 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <>
                  {apiData?.bookings?.length > 0 ? (
                    apiData.bookings.map((booking) => (
                      <TableRow key={booking.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          #{booking.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary-foreground">
                                {booking?.client?.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "C"}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">
                                {booking?.client?.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {booking?.client?.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {booking?.provider?.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "P"}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-1">
                                {booking?.provider?.name}
                                {booking?.provider?.is_verified && (
                                  <Badge variant="outline" className="text-xs py-0 px-1">
                                    ✓
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">
                              {booking?.listing?.title}
                            </div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {booking?.listing?.category}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {new Date(booking.booking_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {booking.start_time} - {booking.end_time}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ({Math.abs(booking.hours)} hrs)
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-semibold">
                                ${Math.abs(booking.total_amount)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ${booking.hourly_rate}/hr
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(booking.status)}
                        </TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(booking.payment_status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end cursor-pointer">
                            <Eye
                              size={18}
                              className="hover:text-green-600 transition-colors"
                              onClick={() =>
                                navigate(`/dashboard/booking/${booking.id}`)
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <p className="text-muted-foreground">No bookings found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
          </div>

          {/* Pagination */}
          {apiData.pagination && apiData.pagination.last_page > 1 && (
            <div className="mt-6">
              <CustomPagination
                currentPage={apiData.pagination.current_page}
                lastPage={apiData.pagination.last_page}
                onPageChange={handlePageChange}
                total={apiData.pagination.total}
                from={(apiData.pagination.current_page - 1) * apiData.pagination.per_page + 1}
                to={Math.min(apiData.pagination.current_page * apiData.pagination.per_page, apiData.pagination.total)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}