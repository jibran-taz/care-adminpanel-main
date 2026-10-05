import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Eye,
  Award,
  Calendar,
  Globe,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Briefcase,
  User as UserIcon,
  MessageCircle,
  Shield,
  Loader2,
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
import { apiUrl } from "@/services/api-end-point";
import { formatAvailability, formatDate, notify } from "@/utils/utils";
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
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
interface Provider {
  id: number;
  name: string;
  profile_photo: string | null;
  is_verified: boolean;
  city: string;
  state: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Availability {
  [key: string]: string[];
}
interface JobListing {
  id: number;
  provider: Provider;
  category: Category;
  title: string;
  description: string;
  hourly_rate: number;
  years_of_experience: number;
  skills: string[];
  languages: string[];
  certifications: string[];
  availability: Availability;
  service_location: string;
  service_radius: number;
  is_available: boolean;
  is_featured: boolean;
  status: string;
  views_count: number;
  rating: number;
  reviews_count: number;
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
const featureValidationSchema = Yup.object({
  featured_days: Yup.string().required("Feature Days is required"),
});

const ViewJobListing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<JobListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<{
    modalOne: boolean;
    modalTwo: boolean;
  }>({
    modalOne: false,
    modalTwo: false,
  });

  useEffect(() => {
    if (id) {
      fetchJobListing(id);
    }
  }, [id]);

  const fetchJobListing = async (listingId: string) => {
    try {
      setIsLoading(true);
      const response = await makeApiRequest(
        `${apiUrl.jobListingByID}/${listingId}`,
        {
          method: "GET",
        }
      );

      console.log("Job Listing Details:", response);
      setListing(response.data);
    } catch (error) {
      console.error("Error fetching job listing:", error);

      const errorMessage = error
        ? error.response?.data?.message || "Failed to fetch job listing"
        : "An unexpected error occurred";

      notify({ message: errorMessage, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleListingApprove = async () => {
    if (!id) return;
    try {
      setIsApproving(true);
      const response = await makeApiRequest(apiUrl.approvedListing(id), {
        method: "PUT",
      });
      notify({ message: response.message, type: "success" });
      setApproveDialogOpen(false);
      fetchJobListing(id);
    } catch (error) {
      console.error("Error approving listing:", error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to approve listing";
      notify({ message: errorMessage, type: "error" });
    } finally {
      setIsApproving(false);
    }
  };

  const handleListingSuspend = async () => {
    if (!id) return;    
    try {
        setIsSuspending(true);
        const response = await makeApiRequest(apiUrl.suspendedListing(id), {
            method: "PUT",
        });
       if(response.success === true){
         notify({ message: response.message, type: "success" });
        setApproveDialogOpen(false);
        fetchJobListing(id);
       }
        } catch (error) {
        console.error("Error suspending listing:", error);
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const errorMessage =
        axiosError.response?.data?.message || "Failed to suspend listing";
        notify({ message: errorMessage, type: "error" });
    } finally {
        setIsSuspending(false);
    }
    };

    const handleListingDelete = async () => {
    if (!id) return;
    try {
        setIsDeleting(true);
        const response = await makeApiRequest(apiUrl.deleteListing(id), {
            method: "DELETE",
        });
         if(response.success === true){
            notify({ message: response.message, type: "success" });
            setDeleteDialogOpen(false);
            navigate("/dashboard/job-listing");
            }
        } catch (error) {
        console.error("Error deleting listing:", error);
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const errorMessage =
        axiosError.response?.data?.message || "Failed to delete listing";
        notify({ message: errorMessage, type: "error" });
    } finally {
        setIsDeleting(false);
    }
    };

  const getStatusBadge = (status: string) => {
    const config = {
      active: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: CheckCircle2,
      },
      pending: {
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: Clock,
      },
      rejected: {
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        icon: XCircle,
      },
    };

    const statusConfig =
      config[status as keyof typeof config] || config.pending;
    const Icon = statusConfig.icon;

    return (
      <Badge className={statusConfig.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  const handleModalClose = () => {
    setIsModalOpen({ ...isModalOpen, modalOne: false });
    rejectFormik.resetForm();
  };
  const handleModalCloseTwo = () => {
    setIsModalOpen({ ...isModalOpen, modalTwo: false });
    featureFormik.resetForm();
  };

  const rejectFormik = useFormik({
    initialValues: {
      reason: "",
    },
    validationSchema: rejectValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log("Rejecting listing with reason:", values.reason);

        // API call to reject listing
        const res = await makeApiRequest(apiUrl?.rejectedListing(id), {
          method: "PUT",
          data: { reason: values.reason },
        });

        if (res.success === true) {
          notify({
            message: "User Rejected successfully",
            type: "success",
          });

          // Close modal and reset form
          setIsModalOpen({ ...isModalOpen, modalOne: false });
          resetForm();
          fetchJobListing(id!);
        }
      } catch (error) {
        console.error("Error suspending user:", error);
        notify({
          message: error?.response?.data?.message || "Failed to suspend user",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });
  const featureFormik = useFormik({
    initialValues: {
      featured_days: "",
    },
    validationSchema: featureValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // API call to reject listing
        const res = await makeApiRequest(apiUrl?.featuredListing(id), {
          method: "PUT",
          data: { featured_days: Number(values.featured_days) },
        });

        if (res.success === true)
          notify({
            message: res.message,
            type: "success",
          });

        // Close modal and reset form
        setIsModalOpen({ ...isModalOpen, modalTwo: false });
        resetForm();
        fetchJobListing(id!);
      } catch (error) {
        console.error("Error suspending user:", error);
        notify({
          message: error?.response?.data?.message || "Failed to suspend user",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground mb-4">Job listing not found</p>
        <Button onClick={() => navigate("/dashboard/job-listing")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Button>
      </div>
    );
  }

  return (
    <>
      {" "}
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/job-listing")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Care Worker Details
              </h1>
              <p className="text-muted-foreground">
                View and manage listing information
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <AlertDialog
              open={approveDialogOpen}
              onOpenChange={setApproveDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Aproved
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently approve
                    this listing and notify the worker.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isApproving}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isApproving}
                    onClick={handleListingApprove}
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      "Approve"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen({ ...isModalOpen, modalOne: true })}
            >
              <Edit className="mr-2 h-4 w-4" />
              Reject
            </Button>
          
             <AlertDialog
              open={suspendDialogOpen}
              onOpenChange={setSuspendDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Suspended
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently suspend
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isSuspending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isSuspending}
                    onClick={handleListingSuspend}
                  >
                    {isSuspending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Suspending...
                      </>
                    ) : (
                      "Suspend"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen({ ...isModalOpen, modalTwo: true })}
            >
              <Edit className="mr-2 h-4 w-4" />
              Feature
            </Button>
              <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
               <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isDeleting}
                    onClick={handleListingDelete}
                  >
                    {isDeleting ? (
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
          
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl">
                        {listing.title}
                      </CardTitle>
                      {listing.is_featured && (
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-4 text-base">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {listing.service_location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {listing.views_count} views
                      </span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(listing.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{listing.description}</p>
                </div>

                <Separator />

                {/* Key Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <DollarSign className="h-4 w-4" />
                      <span>Hourly Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      ${listing.hourly_rate}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Briefcase className="h-4 w-4" />
                      <span>Experience</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {listing.years_of_experience} yrs
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Star className="h-4 w-4" />
                      <span>Rating</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {listing.rating.toFixed(1)}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({listing.reviews_count})
                      </span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>Service Radius</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {listing.service_radius} KM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Skills */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Languages */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.languages.map((language, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-sm bg-blue-50"
                      >
                        <Globe className="w-3 h-3 mr-1" />
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Certifications */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.certifications.map((cert, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-sm bg-green-50"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Availability Schedule</CardTitle>
                <CardDescription>
                  Weekly availability for services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formatAvailability(listing.availability).map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{item.day}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {item.times}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Provider & Meta Info */}
          <div className="space-y-6">
            {/* Provider Card */}
            <Card>
              <CardHeader>
                <CardTitle>Worker Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={listing.provider.profile_photo || undefined}
                    />
                    <AvatarFallback className="text-xl bg-gradient-to-r from-green-500 to-emerald-600  text-white">
                      {listing.provider.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{listing.provider.name}</h3>
                      {listing.provider.is_verified && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {listing.provider.city}, {listing.provider.state}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Link to={`/dashboard/users/${listing.provider.id}`}>
                    <Button className="w-full" variant="outline" size="sm">
                      <UserIcon className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                  </Link>
                  {/* <Button className="w-full" variant="outline" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Provider
                </Button> */}
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-base px-4 py-2">
                  {listing.category.name}
                </Badge>
              </CardContent>
            </Card>

            {/* Status Info */}
            <Card>
              <CardHeader>
                <CardTitle>Status Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Available for Work
                  </span>
                  <Badge
                    className={
                      listing.is_available
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {listing.is_available ? "Yes" : "No"}
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Featured Listing
                  </span>
                  <Badge
                    className={
                      listing.is_featured
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {listing.is_featured ? "Yes" : "No"}
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Listing Status
                  </span>
                  {getStatusBadge(listing.status)}
                </div>
              </CardContent>
            </Card>

            {/* Meta Information */}
            <Card>
              <CardHeader>
                <CardTitle>Meta Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Listing ID</p>
                  <p className="font-medium">#{listing.id}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {formatDate(listing.created_at)}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {formatDate(listing.updated_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen?.modalOne}
        onClose={handleModalClose}
        title="Reject Job Listing"
        showFooter={false}
        width="max-w-2xl"
      >
        <form onSubmit={rejectFormik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to reject{" "}
              <strong>{listing?.provider?.name}</strong>? Rejecting a job
              listing will remove it from the platform and notify the worker.
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
              onClick={handleModalClose}
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
                  Rejecting...
                </>
              ) : (
                "Reject Listing"
              )}
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={isModalOpen?.modalTwo}
        onClose={handleModalCloseTwo}
        title="Feature Days"
        showFooter={false}
        width="max-w-2xl"
      >
        <form onSubmit={featureFormik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to feature{" "}
              <strong>{listing?.provider?.name}</strong>? Featuring a job
              listing will highlight it on the platform and notify the worker.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Feature Days <span className="text-red-500">*</span>
            </Label>
            <Input
              id="featured_days"
              name="featured_days"
              placeholder="Enter number of feature days"
              value={featureFormik.values.featured_days}
              onChange={featureFormik.handleChange}
              onBlur={featureFormik.handleBlur}
              className={`resize-none ${
                featureFormik.touched.featured_days &&
                featureFormik.errors.featured_days
                  ? "border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
            {featureFormik.touched.featured_days &&
              featureFormik.errors.featured_days && (
                <p className="text-sm text-red-500 mt-1">
                  {featureFormik.errors.featured_days}
                </p>
              )}
            {/* <p className="text-xs text-muted-foreground">
              {featureFormik.values.featured_days.length}/500 characters
            </p> */}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleModalClose}
              disabled={featureFormik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={featureFormik.isSubmitting}
            >
              {featureFormik.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                " Feature Listing"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ViewJobListing;
