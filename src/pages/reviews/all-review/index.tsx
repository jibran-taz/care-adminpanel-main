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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import makeApiRequest from "@/services/axios";
import { formatDate, notify } from "@/utils/utils";
import { Check, ChevronDown, Eye, Flag, MessageSquare, Star, ThumbsUp, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

interface Client {
  id: number;
  name: string;
  profile_photo: string | null;
}

interface Provider {
  id: number;
  name: string;
  profile_photo: string | null;
  is_verified: boolean;
}

interface Booking {
  id: number;
  booking_date: string;
  service_type: string;
}

interface Listing {
  id: number;
  title: string;
  category: string;
}

interface Moderation {
  is_flagged: boolean;
  flag_reason: string | null;
  rejection_reason: string | null;
  moderated_by: number | null;
  moderated_at: string | null;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  status: string;
  client: Client;
  provider: Provider;
  booking: Booking;
  listing: Listing;
  provider_response: string | null;
  response_date: string | null;
  moderation: Moderation;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

// Star Rating Component
const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default function AllReviews() {
  const navigate = useNavigate();

  const [perPage, setPerPage] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [apiData, setApiData] = useState<{
    reviews: Review[];
    pagination: PaginationMeta | null;
  }>({
    reviews: [],
    pagination: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: "approve" | "reject" | "flag" | null;
  }>({ open: false, type: null });
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchReviews = async (
    page: number = 1, 
    itemsPerPage: number = 20,
    status: string = "all",
    rating: string = "all"
  ) => {
    try {
      setIsLoading(true);

      let url = `/admin/reviews?page=${page}&per_page=${itemsPerPage}`;
      
      if (status !== "all") {
        url += `&status=${status}`;
      }
      
      if (rating !== "all") {
        url += `&rating=${rating}`;
      }

      const response = await makeApiRequest(url, {
        method: "GET",
      });

      console.log("Reviews API Response:", response);

      // ✅ Updated to match API response structure
      setApiData({
        reviews: response.data || [], // Direct data array
        pagination: response.meta || null, // Pagination in meta
      });
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
      notify({ message: "Failed to fetch reviews", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: number, newStatus: string, reason?: string) => {
    try {
      await makeApiRequest(`/admin/reviews/${reviewId}/status`, {
        method: "PATCH",
        data: {
          status: newStatus,
          rejection_reason: reason,
        },
      });

      notify({ message: `Review ${newStatus} successfully`, type: "success" });
      fetchReviews(apiData.pagination?.current_page || 1, perPage, statusFilter, ratingFilter);
      setActionDialog({ open: false, type: null });
      setRejectionReason("");
      setSelectedReview(null);
    } catch (error) {
      console.error("❌ Error updating review status:", error);
      notify({ message: "Failed to update review status", type: "error" });
    }
  };

  const handleFlagToggle = async (reviewId: number, isFlagged: boolean) => {
    try {
      await makeApiRequest(`/admin/reviews/${reviewId}/flag`, {
        method: "PATCH",
        data: { is_flagged: !isFlagged },
      });

      notify({ 
        message: `Review ${!isFlagged ? "flagged" : "unflagged"} successfully`, 
        type: "success" 
      });
      fetchReviews(apiData.pagination?.current_page || 1, perPage, statusFilter, ratingFilter);
    } catch (error) {
      console.error("❌ Error toggling flag:", error);
      notify({ message: "Failed to update flag status", type: "error" });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
      approved: { bg: "bg-green-100", text: "text-green-800" },
      rejected: { bg: "bg-red-100", text: "text-red-800" },
      flagged: { bg: "bg-orange-100", text: "text-orange-800" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Badge className={`${config.bg} ${config.text} hover:${config.bg} capitalize`}>
        {status}
      </Badge>
    );
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || !apiData.pagination || page > apiData.pagination.last_page)
      return;

    fetchReviews(page, perPage, statusFilter, ratingFilter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    fetchReviews(1, value, statusFilter, ratingFilter);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    fetchReviews(1, perPage, value, ratingFilter);
  };

  const handleRatingFilterChange = (value: string) => {
    setRatingFilter(value);
    fetchReviews(1, perPage, statusFilter, value);
  };

  // ✅ Get initials from full name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    fetchReviews(1, perPage, statusFilter, ratingFilter);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Reviews</h1>
          <p className="text-muted-foreground">
            Manage and moderate customer reviews here.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Reviews List</CardTitle>
              <CardDescription>
                {apiData.pagination ? (
                  <span>
                    Showing {apiData.pagination.from || 0} to{" "}
                    {apiData.pagination.to || 0} of{" "}
                    {apiData.pagination.total} reviews
                  </span>
                ) : (
                  "View and manage all reviews"
                )}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {/* Rating Filter */}
              <Select value={ratingFilter} onValueChange={handleRatingFilterChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              {/* Per Page Dropdown */}
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
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Review ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review Text</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
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
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[120px]" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
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
                        <Skeleton className="h-12 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 ml-auto rounded" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <>
                  {apiData?.reviews?.length > 0 ? (
                    apiData.reviews.map((review) => (
                      <TableRow key={review.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          #{review.id}
                        </TableCell>
                        
                        {/* Customer */}
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {getInitials(review?.client?.name || "C")}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">
                                {review?.client?.name}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Provider */}
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {getInitials(review?.provider?.name || "P")}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-1">
                                {review?.provider?.name}
                                {review?.provider?.is_verified && (
                                  <Badge variant="outline" className="text-xs py-0 px-1">
                                    ✓
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Service/Listing */}
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">
                              {review?.listing?.title}
                            </div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {review?.listing?.category}
                            </Badge>
                          </div>
                        </TableCell>

                        {/* Rating */}
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="text-sm font-semibold">
                              {review.rating}.0
                            </span>
                          </div>
                        </TableCell>

                        {/* Review Text (comment field) */}
                        <TableCell className="max-w-xs">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                            <p className="text-sm line-clamp-3">
                              {review.comment}
                            </p>
                          </div>
                        </TableCell>

                        {/* Provider Response */}
                        <TableCell>
                          {review.provider_response ? (
                            <div className="flex items-center gap-2">
                              <ThumbsUp className="h-4 w-4 text-green-600" />
                              <Badge variant="outline" className="text-xs">
                                Responded
                              </Badge>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-gray-50">
                              No Response
                            </Badge>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            {getStatusBadge(review.status)}
                            {review.moderation?.is_flagged && (
                              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 w-fit">
                                <Flag className="h-3 w-3 mr-1" />
                                Flagged
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        {/* Date */}
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(review.created_at)}
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => navigate(`/dashboard/reviews/${review.id}`)}
                              title="View Details"
                            >
                              <Eye size={18} className="hover:text-blue-600 transition-colors" />
                            </Button>

                            {review.status === "pending" && (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedReview(review);
                                    setActionDialog({ open: true, type: "approve" });
                                  }}
                                  title="Approve Review"
                                >
                                  <Check size={18} className="hover:text-green-600 transition-colors" />
                                </Button>

                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedReview(review);
                                    setActionDialog({ open: true, type: "reject" });
                                  }}
                                  title="Reject Review"
                                >
                                  <X size={18} className="hover:text-red-600 transition-colors" />
                                </Button>
                              </>
                            )}

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleFlagToggle(review.id, review.moderation?.is_flagged || false)}
                              title={review.moderation?.is_flagged ? "Unflag Review" : "Flag Review"}
                            >
                              <Flag 
                                size={18} 
                                className={`transition-colors ${
                                  review.moderation?.is_flagged 
                                    ? "text-orange-600 fill-orange-600" 
                                    : "hover:text-orange-600"
                                }`}
                              />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                          <p className="text-muted-foreground font-medium">No reviews found</p>
                          <p className="text-sm text-muted-foreground">Reviews will appear here once submitted</p>
                        </div>
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
                from={apiData.pagination.from}
                to={apiData.pagination.to}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog 
        open={actionDialog.open} 
        onOpenChange={(open) => {
          if (!open) {
            setActionDialog({ open: false, type: null });
            setRejectionReason("");
            setSelectedReview(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "approve" ? "Approve Review" : "Reject Review"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "approve" 
                ? "Are you sure you want to approve this review? It will be visible to all users."
                : "Please provide a reason for rejecting this review."}
            </DialogDescription>
          </DialogHeader>

          {actionDialog.type === "reject" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Rejection Reason</label>
              <Textarea
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialog({ open: false, type: null });
                setRejectionReason("");
                setSelectedReview(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedReview) {
                  if (actionDialog.type === "approve") {
                    handleStatusChange(selectedReview.id, "approved");
                  } else if (actionDialog.type === "reject" && rejectionReason.trim()) {
                    handleStatusChange(selectedReview.id, "rejected", rejectionReason);
                  } else if (actionDialog.type === "reject") {
                    notify({ message: "Please provide a rejection reason", type: "error" });
                  }
                }
              }}
              className={actionDialog.type === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {actionDialog.type === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}