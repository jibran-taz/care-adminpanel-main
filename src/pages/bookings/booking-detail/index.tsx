import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  User as UserIcon,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  CreditCard,
  PackageCheck,
  Ban,
  FileText,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import makeApiRequest from "@/services/axios";
import { notify } from "@/utils/utils";
import { AxiosError } from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormik } from "formik";
import * as Yup from "yup";

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

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const rejectValidationSchema = Yup.object({
  reason: Yup.string()
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must not exceed 500 characters")
    .required("Rejection reason is required"),
});

const cancelValidationSchema = Yup.object({
  reason: Yup.string()
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must not exceed 500 characters")
    .required("Cancellation reason is required"),
});

const ViewBookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<{
    reject: boolean;
    cancel: boolean;
  }>({
    reject: false,
    cancel: false,
  });

  useEffect(() => {
    if (id) {
      fetchBookingDetail(id);
    }
  }, [id]);

  const fetchBookingDetail = async (bookingId: string) => {
    try {
      setIsLoading(true);
      const response = await makeApiRequest(`/admin/bookings/${bookingId}`, {
        method: "GET",
      });

      console.log("Booking Details:", response);
      setBooking(response.data);
    } catch (error) {
      console.error("Error fetching booking:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch booking details";
      notify({ message: errorMessage, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptBooking = async () => {
    if (!id) return;
    try {
      setIsAccepting(true);
      const response = await makeApiRequest(`/admin/bookings/${id}/accept`, {
        method: "PUT",
      });
      notify({ message: response.message || "Booking accepted successfully", type: "success" });
      setAcceptDialogOpen(false);
      fetchBookingDetail(id);
    } catch (error) {
      console.error("Error accepting booking:", error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to accept booking";
      notify({ message: errorMessage, type: "error" });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!id) return;
    try {
      setIsCompleting(true);
      const response = await makeApiRequest(`admin/bookings/${id}`, {
        method: "PUT",
      });
      notify({ message: response.message || "Booking Deleted successfully", type: "success" });
      setCompleteDialogOpen(false);
      fetchBookingDetail(id);
    } catch (error) {
      console.error("Error Deleting booking:", error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to delete booking";
      notify({ message: errorMessage, type: "error" });
    } finally {
      setIsCompleting(false);
    }
  };

  const rejectFormik = useFormik({
    initialValues: {
      reason: "",
    },
    validationSchema: rejectValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await makeApiRequest(`/admin/bookings/${id}/reject`, {
          method: "PUT",
          data: { reason: values.reason },
        });

        if (response.success) {
          notify({
            message: "Booking rejected successfully",
            type: "success",
          });
          setIsModalOpen({ ...isModalOpen, reject: false });
          resetForm();
          fetchBookingDetail(id!);
        }
      } catch (error) {
        console.error("Error rejecting booking:", error);
        notify({
          message: error?.response?.data?.message || "Failed to reject booking",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const cancelFormik = useFormik({
    initialValues: {
      reason: "",
    },
    validationSchema: cancelValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await makeApiRequest(`/admin/bookings/${id}/cancel`, {
          method: "PUT",
          data: { reason: values.reason },
        });

        if (response.success) {
          notify({
            message: "Booking cancelled successfully",
            type: "success",
          });
          setIsModalOpen({ ...isModalOpen, cancel: false });
          resetForm();
          fetchBookingDetail(id!);
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        notify({
          message: error?.response?.data?.message || "Failed to cancel booking",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { className: string; icon: any }> = {
      pending: {
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: Clock,
      },
      accepted: {
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        icon: CheckCircle2,
      },
      in_progress: {
        className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
        icon: AlertCircle,
      },
      completed: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: CheckCircle2,
      },
      cancelled: {
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        icon: XCircle,
      },
      rejected: {
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        icon: Ban,
      },
    };

    const statusConfig = config[status] || config.pending;
    const Icon = statusConfig.icon;

    return (
      <Badge className={statusConfig.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const config: Record<string, { className: string; icon }> = {
      pending: {
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: Clock,
      },
      paid: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: CheckCircle2,
      },
      refunded: {
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        icon: XCircle,
      },
      failed: {
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        icon: XCircle,
      },
    };

    const statusConfig = config[paymentStatus] || config.pending;
    const Icon = statusConfig.icon;

    return (
      <Badge className={statusConfig.className}>
        <Icon className="w-3 h-3 mr-1" />
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground mb-4">Booking not found</p>
        <Button onClick={() => navigate("/dashboard/bookings")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/bookings")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Booking Details
              </h1>
              <p className="text-muted-foreground">
                View and manage booking information
              </p>
            </div>
          </div>

          {/* Action Buttons based on status */}
          {/* <div className="flex gap-2">
            {booking.status === "pending" && (
              <>
                <AlertDialog
                  open={acceptDialogOpen}
                  onOpenChange={setAcceptDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="default" size="sm">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Accept Booking?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will accept the booking and notify the client and
                        provider.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isAccepting}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isAccepting}
                        onClick={handleAcceptBooking}
                      >
                        {isAccepting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Accepting...
                          </>
                        ) : (
                          "Accept"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setIsModalOpen({ ...isModalOpen, reject: true })
                  }
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </>
            )}

            {(booking.status === "accepted" ||
              booking.status === "in_progress") && (
              <>
                <AlertDialog
                  open={completeDialogOpen}
                  onOpenChange={setCompleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="default" size="sm">
                      <PackageCheck className="mr-2 h-4 w-4" />
                      Mark Complete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Complete Booking?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will mark the booking as completed and process the
                        payment.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isCompleting}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isCompleting}
                        onClick={handleDeleteBooking}
                      >
                        {isCompleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    setIsModalOpen({ ...isModalOpen, cancel: true })
                  }
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            )}
          </div> */}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl">
                        {booking.listing.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-4 text-base">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {booking.service_location}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {booking.listing.category}
                      </Badge>
                    </CardDescription>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Booking Time Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Booking Date</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatDate(booking.booking_date)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="h-4 w-4" />
                      <span>Time Slot</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {booking.start_time} - {booking.end_time}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="h-4 w-4" />
                      <span>Duration</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {Math.abs(booking.hours)} hours
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Payment Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <DollarSign className="h-4 w-4" />
                      <span>Hourly Rate</span>
                    </div>
                    <p className="text-xl font-bold text-green-600">
                      ${booking.hourly_rate}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <DollarSign className="h-4 w-4" />
                      <span>Total Amount</span>
                    </div>
                    <p className="text-xl font-bold text-green-600">
                      ${Math.abs(booking.total_amount)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <CreditCard className="h-4 w-4" />
                      <span>Payment Status</span>
                    </div>
                    {getPaymentStatusBadge(booking.payment_status)}
                  </div>
                </div>

                {/* Special Requirements */}
                {booking.special_requirements && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Special Requirements
                      </h3>
                      <p className="text-muted-foreground bg-muted p-3 rounded-lg">
                        {booking.special_requirements}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Timeline</CardTitle>
                <CardDescription>Track booking progress and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Created */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-primary p-2">
                        <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="w-px h-full bg-border mt-2" />
                    </div>
                    <div className="pb-4">
                      <p className="font-semibold">Booking Created</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(booking.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Accepted */}
                  {booking.accepted_at && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-blue-500 p-2">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                        <div className="w-px h-full bg-border mt-2" />
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold">Booking Accepted</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(booking.accepted_at)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Rejected */}
                  {booking.rejected_at && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-red-500 p-2">
                          <XCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold">Booking Rejected</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(booking.rejected_at)}
                        </p>
                        {booking.rejection_reason && (
                          <p className="text-sm text-muted-foreground mt-1 bg-red-50 p-2 rounded">
                            Reason: {booking.rejection_reason}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cancelled */}
                  {booking.cancelled_at && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-red-500 p-2">
                          <Ban className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold">Booking Cancelled</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(booking.cancelled_at)}
                        </p>
                        {booking.cancelled_by && (
                          <p className="text-sm text-muted-foreground mt-1">
                            By: {booking.cancelled_by.name}
                          </p>
                        )}
                        {booking.cancellation_reason && (
                          <p className="text-sm text-muted-foreground mt-1 bg-red-50 p-2 rounded">
                            Reason: {booking.cancellation_reason}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Completed */}
                  {booking.completed_at && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-green-500 p-2">
                          <PackageCheck className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold">Booking Completed</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(booking.completed_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Client & Provider Info */}
          <div className="space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle>Employer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={booking.client.profile_photo || undefined}
                    />
                    <AvatarFallback className="text-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      {booking.client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{booking.client.name}</h3>
                    <p className="text-sm text-muted-foreground">Employer</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    
                   <a   href={`mailto:${booking.client.email}`}
                      className="hover:underline"
                    >
                      {booking.client.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    
                     <a href={`tel:${booking.client.phone}`}
                      className="hover:underline"
                    >
                      {booking.client.phone}
                    </a>
                  </div>
                </div>

                <Separator />

                <Link to={`/dashboard/users/${booking.client.id}`}>
                  <Button className="w-full" variant="outline" size="sm">
                    <UserIcon className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Provider Information */}
            <Card>
              <CardHeader>
                <CardTitle>Worker Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={booking.provider.profile_photo || undefined}
                    />
                    <AvatarFallback className="text-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      {booking.provider.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{booking.provider.name}</h3>
                      {booking.provider.is_verified && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Worker</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    
                     <a href={`mailto:${booking.provider.email}`}
                      className="hover:underline"
                    >
                      {booking.provider.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    
                     <a href={`tel:${booking.provider.phone}`}
                      className="hover:underline"
                    >
                      {booking.provider.phone}
                    </a>
                  </div>
                </div>

                <Separator />

                <Link to={`/dashboard/users/${booking.provider.id}`}>
                  <Button className="w-full" variant="outline" size="sm">
                    <UserIcon className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Booking Meta Information */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-medium">#{booking.id}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium">{booking.listing.title}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="outline">{booking.listing.category}</Badge>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {formatDateTime(booking.created_at)}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {formatDateTime(booking.updated_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={isModalOpen.reject}
        onClose={() => {
          setIsModalOpen({ ...isModalOpen, reject: false });
          rejectFormik.resetForm();
        }}
        title="Reject Booking"
        showFooter={false}
        width="max-w-2xl"
      >
        <form onSubmit={rejectFormik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to reject this booking? This action will
              notify both the employer and worker.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for Rejection <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="Enter detailed reason for rejection (minimum 10 characters)"
              value={rejectFormik.values.reason}
              onChange={rejectFormik.handleChange}
              onBlur={rejectFormik.handleBlur}
              rows={4}
              className={`resize-none ${
                rejectFormik.touched.reason && rejectFormik.errors.reason
                  ? "border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
            {rejectFormik.touched.reason && rejectFormik.errors.reason && (
              <p className="text-sm text-red-500 mt-1">
                {rejectFormik.errors.reason}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {rejectFormik.values.reason.length}/500 characters
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen({ ...isModalOpen, reject: false });
                rejectFormik.resetForm();
              }}
              disabled={rejectFormik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={rejectFormik.isSubmitting}
            >
              {rejectFormik.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Booking"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={isModalOpen.cancel}
        onClose={() => {
          setIsModalOpen({ ...isModalOpen, cancel: false });
          cancelFormik.resetForm();
        }}
        title="Cancel Booking"
        showFooter={false}
        width="max-w-2xl"
      >
        <form onSubmit={cancelFormik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to cancel this booking? This action will
              notify both the employer and worker.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancel-reason" className="text-sm font-medium">
              Reason for Cancellation <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="cancel-reason"
              name="reason"
              placeholder="Enter detailed reason for cancellation (minimum 10 characters)"
              value={cancelFormik.values.reason}
              onChange={cancelFormik.handleChange}
              onBlur={cancelFormik.handleBlur}
              rows={4}
              className={`resize-none ${
                cancelFormik.touched.reason && cancelFormik.errors.reason
                  ? "border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
            {cancelFormik.touched.reason && cancelFormik.errors.reason && (
              <p className="text-sm text-red-500 mt-1">
                {cancelFormik.errors.reason}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {cancelFormik.values.reason.length}/500 characters
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen({ ...isModalOpen, cancel: false });
                cancelFormik.resetForm();
              }}
              disabled={cancelFormik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={cancelFormik.isSubmitting}
            >
              {cancelFormik.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Booking"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ViewBookingDetail;






