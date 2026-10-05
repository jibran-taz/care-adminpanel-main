// // import { useEffect, useState } from "react";
// // import { useParams, useNavigate, Link } from "react-router-dom";
// // import {
// //   ArrowLeft,
// //   Star,
// //   MessageSquare,
// //   ThumbsUp,
// //   Flag,
// //   CheckCircle2,
// //   XCircle,
// //   AlertCircle,
// //   Loader2,
// //   User as UserIcon,
// //   Phone,
// //   Mail,
// //   Calendar,
// //   Shield,
// //   FileText,
// //   Ban,
// //   Check,
// //   X,
// // } from "lucide-react";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Separator } from "@/components/ui/separator";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import makeApiRequest from "@/services/axios";
// // import { notify } from "@/utils/utils";
// // import { AxiosError } from "axios";
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// //   AlertDialogTrigger,
// // } from "@/components/ui/alert-dialog";
// // import { Modal } from "@/components/ui/modal";
// // import { Label } from "@/components/ui/label";
// // import { Textarea } from "@/components/ui/textarea";
// // import { useFormik } from "formik";
// // import * as Yup from "yup";

// // interface Client {
// //   id: number;
// //   name: string;
// //   profile_photo: string | null;
// // }

// // interface Provider {
// //   id: number;
// //   name: string;
// //   profile_photo: string | null;
// //   is_verified: boolean;
// // }

// // interface Booking {
// //   id: number;
// //   booking_date: string;
// //   service_type: string;
// // }

// // interface Listing {
// //   id: number;
// //   title: string;
// //   category: string;
// // }

// // interface Moderation {
// //   is_flagged: boolean;
// //   flag_reason: string | null;
// //   rejection_reason: string | null;
// //   moderated_by: number | null;
// //   moderated_at: string | null;
// // }

// // interface Review {
// //   id: number;
// //   rating: number;
// //   comment: string;
// //   status: string;
// //   client: Client;
// //   provider: Provider;
// //   booking: Booking;
// //   listing: Listing;
// //   provider_response: string | null;
// //   response_date: string | null;
// //   moderation: Moderation;
// //   helpful_count: number;
// //   created_at: string;
// //   updated_at: string;
// // }

// // interface ApiErrorResponse {
// //   message: string;
// //   errors?: Record<string, string[]>;
// // }

// // // Star Rating Component
// // const StarRating = ({ rating, size = "lg" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
// //   const sizeClasses = {
// //     sm: "w-4 h-4",
// //     md: "w-5 h-5",
// //     lg: "w-8 h-8"
// //   };

// //   return (
// //     <div className="flex items-center gap-1">
// //       {[1, 2, 3, 4, 5].map((star) => (
// //         <Star
// //           key={star}
// //           className={`${sizeClasses[size]} ${
// //             star <= rating
// //               ? "fill-yellow-400 text-yellow-400"
// //               : "fill-gray-200 text-gray-200"
// //           }`}
// //         />
// //       ))}
// //     </div>
// //   );
// // };

// // const rejectValidationSchema = Yup.object({
// //   reason: Yup.string()
// //     .min(10, "Reason must be at least 10 characters")
// //     .max(500, "Reason must not exceed 500 characters")
// //     .required("Rejection reason is required"),
// // });

// // const ReviewDetail = () => {
// //   const { id } = useParams<{ id: string }>();
// //   const navigate = useNavigate();
// //   const [review, setReview] = useState<Review | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [approveDialogOpen, setApproveDialogOpen] = useState(false);
// //   const [isApproving, setIsApproving] = useState(false);
// //   const [isFlagging, setIsFlagging] = useState(false);
// //   const [isModalOpen, setIsModalOpen] = useState(false);

// //   useEffect(() => {
// //     if (id) {
// //       fetchReviewDetail(id);
// //     }
// //   }, [id]);

// //   const fetchReviewDetail = async (reviewId: string) => {
// //     try {
// //       setIsLoading(true);
// //       const response = await makeApiRequest(`/admin/reviews/${reviewId}`, {
// //         method: "GET",
// //       });

// //       console.log("Review Details:", response);
// //       setReview(response.data);
// //     } catch (error) {
// //       console.error("Error fetching review:", error);
// //       const errorMessage =
// //         error?.response?.data?.message || "Failed to fetch review details";
// //       notify({ message: errorMessage, type: "error" });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleApproveReview = async () => {
// //     if (!id) return;
// //     try {
// //       setIsApproving(true);
// //       const response = await makeApiRequest(`/admin/reviews/${id}/status`, {
// //         method: "PATCH",
// //         data: { status: "approved" },
// //       });
// //       notify({ message: "Review approved successfully", type: "success" });
// //       setApproveDialogOpen(false);
// //       fetchReviewDetail(id);
// //     } catch (error) {
// //       console.error("Error approving review:", error);
// //       const axiosError = error as AxiosError<ApiErrorResponse>;
// //       const errorMessage =
// //         axiosError.response?.data?.message || "Failed to approve review";
// //       notify({ message: errorMessage, type: "error" });
// //     } finally {
// //       setIsApproving(false);
// //     }
// //   };

// //   const handleToggleFlag = async () => {
// //     if (!id || !review) return;
// //     try {
// //       setIsFlagging(true);
// //       const response = await makeApiRequest(`/admin/reviews/${id}/flag`, {
// //         method: "PATCH",
// //         data: { is_flagged: !review.moderation.is_flagged },
// //       });
// //       notify({ 
// //         message: `Review ${!review.moderation.is_flagged ? "flagged" : "unflagged"} successfully`, 
// //         type: "success" 
// //       });
// //       fetchReviewDetail(id);
// //     } catch (error) {
// //       console.error("Error toggling flag:", error);
// //       notify({ message: "Failed to update flag status", type: "error" });
// //     } finally {
// //       setIsFlagging(false);
// //     }
// //   };

// //   const rejectFormik = useFormik({
// //     initialValues: {
// //       reason: "",
// //     },
// //     validationSchema: rejectValidationSchema,
// //     onSubmit: async (values, { setSubmitting, resetForm }) => {
// //       try {
// //         const response = await makeApiRequest(`/admin/reviews/${id}/status`, {
// //           method: "PATCH",
// //           data: { 
// //             status: "rejected",
// //             rejection_reason: values.reason 
// //           },
// //         });

// //         if (response.success) {
// //           notify({
// //             message: "Review rejected successfully",
// //             type: "success",
// //           });
// //           setIsModalOpen(false);
// //           resetForm();
// //           fetchReviewDetail(id!);
// //         }
// //       } catch (error) {
// //         console.error("Error rejecting review:", error);
// //         notify({
// //           message: error?.response?.data?.message || "Failed to reject review",
// //           type: "error",
// //         });
// //       } finally {
// //         setSubmitting(false);
// //       }
// //     },
// //   });

// //   const getStatusBadge = (status: string) => {
// //     const config: Record<string, { className: string; icon: any }> = {
// //       pending: {
// //         className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
// //         icon: AlertCircle,
// //       },
// //       approved: {
// //         className: "bg-green-100 text-green-800 hover:bg-green-100",
// //         icon: CheckCircle2,
// //       },
// //       rejected: {
// //         className: "bg-red-100 text-red-800 hover:bg-red-100",
// //         icon: XCircle,
// //       },
// //     };

// //     const statusConfig = config[status] || config.pending;
// //     const Icon = statusConfig.icon;

// //     return (
// //       <Badge className={statusConfig.className}>
// //         <Icon className="w-3 h-3 mr-1" />
// //         {status.charAt(0).toUpperCase() + status.slice(1)}
// //       </Badge>
// //     );
// //   };

// //   const getInitials = (name: string) => {
// //     return name
// //       .split(" ")
// //       .map((n) => n[0])
// //       .join("")
// //       .toUpperCase()
// //       .slice(0, 2);
// //   };

// //   const formatDate = (dateString: string) => {
// //     return new Date(dateString).toLocaleDateString("en-US", {
// //       year: "numeric",
// //       month: "long",
// //       day: "numeric",
// //     });
// //   };

// //   const formatDateTime = (dateString: string) => {
// //     return new Date(dateString).toLocaleString("en-US", {
// //       year: "numeric",
// //       month: "short",
// //       day: "numeric",
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     });
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
// //       </div>
// //     );
// //   }

// //   if (!review) {
// //     return (
// //       <div className="flex flex-col items-center justify-center min-h-screen">
// //         <p className="text-muted-foreground mb-4">Review not found</p>
// //         <Button onClick={() => navigate("/dashboard/reviews")}>
// //           <ArrowLeft className="mr-2 h-4 w-4" />
// //           Back to Reviews
// //         </Button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       <div className="space-y-6 p-6">
// //         {/* Header */}
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center gap-4">
// //             <Button
// //               variant="outline"
// //               size="sm"
// //               onClick={() => navigate("/dashboard/reviews")}
// //             >
// //               <ArrowLeft className="mr-2 h-4 w-4" />
// //               Back
// //             </Button>
// //             <div>
// //               <h1 className="text-3xl font-bold tracking-tight">
// //                 Review Details
// //               </h1>
// //               <p className="text-muted-foreground">
// //                 View and manage review information
// //               </p>
// //             </div>
// //           </div>

// //           {/* Action Buttons */}
// //           <div className="flex gap-2">
            
// //               <>
// //                 <AlertDialog
// //                   open={approveDialogOpen}
// //                   onOpenChange={setApproveDialogOpen}
// //                 >
// //                   <AlertDialogTrigger asChild>
// //                     <Button variant="default" size="sm">
// //                       <Check className="mr-2 h-4 w-4" />
// //                       Approve
// //                     </Button>
// //                   </AlertDialogTrigger>
// //                   <AlertDialogContent>
// //                     <AlertDialogHeader>
// //                       <AlertDialogTitle>Approve Review?</AlertDialogTitle>
// //                       <AlertDialogDescription>
// //                         This will approve the review and make it visible to all users.
// //                       </AlertDialogDescription>
// //                     </AlertDialogHeader>
// //                     <AlertDialogFooter>
// //                       <AlertDialogCancel disabled={isApproving}>
// //                         Cancel
// //                       </AlertDialogCancel>
// //                       <AlertDialogAction
// //                         disabled={isApproving}
// //                         onClick={handleApproveReview}
// //                       >
// //                         {isApproving ? (
// //                           <>
// //                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                             Approving...
// //                           </>
// //                         ) : (
// //                           "Approve"
// //                         )}
// //                       </AlertDialogAction>
// //                     </AlertDialogFooter>
// //                   </AlertDialogContent>
// //                 </AlertDialog>

// //                 <Button
// //                   variant="outline"
// //                   size="sm"
// //                   onClick={() => setIsModalOpen(true)}
// //                 >
// //                   <X className="mr-2 h-4 w-4" />
// //                   Reject
// //                 </Button>
// //               </>
    

// //             <Button
// //               variant={review.moderation.is_flagged ? "default" : "outline"}
// //               size="sm"
// //               onClick={handleToggleFlag}
// //               disabled={isFlagging}
// //             >
// //               {isFlagging ? (
// //                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //               ) : (
// //                 <Flag className="mr-2 h-4 w-4" />
// //               )}
// //               {review.moderation.is_flagged ? "Unflag" : "Flag"}
// //             </Button>
// //           </div>
// //         </div>

// //         {/* Main Content */}
// //         <div className="grid gap-6 lg:grid-cols-3">
// //           {/* Left Column - Review Details */}
// //           <div className="lg:col-span-2 space-y-6">
// //             {/* Review Overview */}
// //             <Card>
// //               <CardHeader>
// //                 <div className="flex items-start justify-between">
// //                   <div className="flex-1">
// //                     <div className="flex items-center gap-3 mb-3">
// //                       <StarRating rating={review.rating} size="lg" />
// //                       <span className="text-3xl font-bold">{review.rating}.0</span>
// //                     </div>
// //                     <CardDescription className="flex items-center gap-4 text-base">
// //                       <span className="flex items-center gap-1">
// //                         <MessageSquare className="h-4 w-4" />
// //                         Review for {review.listing.title}
// //                       </span>
// //                       <Badge variant="outline" className="text-xs">
// //                         {review.listing.category}
// //                       </Badge>
// //                     </CardDescription>
// //                   </div>
// //                   {getStatusBadge(review.status)}
// //                 </div>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 {/* Review Comment */}
// //                 <div className="bg-muted p-4 rounded-lg">
// //                   <h3 className="font-semibold mb-2 flex items-center gap-2">
// //                     <MessageSquare className="h-4 w-4" />
// //                     Customer Review
// //                   </h3>
// //                   <p className="text-base leading-relaxed whitespace-pre-wrap">
// //                     {review.comment}
// //                   </p>
// //                 </div>

// //                 <Separator />

// //                 {/* Provider Response */}
// //                 {review.provider_response ? (
// //                   <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
// //                     <div className="flex items-center gap-2 mb-2">
// //                       <ThumbsUp className="h-4 w-4 text-blue-600" />
// //                       <h3 className="font-semibold text-blue-900">Provider Response</h3>
// //                       {review.response_date && (
// //                         <span className="text-xs text-muted-foreground ml-auto">
// //                           {formatDateTime(review.response_date)}
// //                         </span>
// //                       )}
// //                     </div>
// //                     <p className="text-sm text-blue-900 leading-relaxed">
// //                       {review.provider_response}
// //                     </p>
// //                   </div>
// //                 ) : (
// //                   <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
// //                     <p className="text-sm text-muted-foreground">
// //                       Provider has not responded yet
// //                     </p>
// //                   </div>
// //                 )}

// //                 {/* Booking Information */}
// //                 <Separator />

// //                 <div>
// //                   <h3 className="font-semibold mb-3">Associated Booking</h3>
// //                   <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
// //                     <div>
// //                       <p className="text-sm text-muted-foreground">Booking ID</p>
// //                       <Link 
// //                         to={`/dashboard/booking/${review.booking.id}`}
// //                         className="text-primary hover:underline font-medium"
// //                       >
// //                         #{review.booking.id}
// //                       </Link>
// //                     </div>
// //                     <div>
// //                       <p className="text-sm text-muted-foreground">Service Date</p>
// //                       <p className="font-medium">{formatDate(review.booking.booking_date)}</p>
// //                     </div>
// //                     <div className="col-span-2">
// //                       <p className="text-sm text-muted-foreground">Service Type</p>
// //                       <p className="font-medium">{review.booking.service_type}</p>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Moderation Info */}
// //                 {(review.moderation.is_flagged || review.moderation.rejection_reason) && (
// //                   <>
// //                     <Separator />
// //                     <div className="space-y-3">
// //                       <h3 className="font-semibold flex items-center gap-2">
// //                         <Shield className="h-4 w-4" />
// //                         Moderation Information
// //                       </h3>
                      
// //                       {review.moderation.is_flagged && (
// //                         <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
// //                           <div className="flex items-center gap-2 mb-1">
// //                             <Flag className="h-4 w-4 text-orange-600" />
// //                             <p className="font-medium text-orange-900">Flagged Content</p>
// //                           </div>
// //                           {review.moderation.flag_reason && (
// //                             <p className="text-sm text-orange-800 mt-1">
// //                               Reason: {review.moderation.flag_reason}
// //                             </p>
// //                           )}
// //                         </div>
// //                       )}

// //                       {review.moderation.rejection_reason && (
// //                         <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
// //                           <div className="flex items-center gap-2 mb-1">
// //                             <XCircle className="h-4 w-4 text-red-600" />
// //                             <p className="font-medium text-red-900">Rejection Reason</p>
// //                           </div>
// //                           <p className="text-sm text-red-800 mt-1">
// //                             {review.moderation.rejection_reason}
// //                           </p>
// //                           {review.moderation.moderated_at && (
// //                             <p className="text-xs text-red-700 mt-1">
// //                               Moderated at: {formatDateTime(review.moderation.moderated_at)}
// //                             </p>
// //                           )}
// //                         </div>
// //                       )}
// //                     </div>
// //                   </>
// //                 )}

// //                 {/* Engagement Stats */}
// //                 <Separator />
// //                 <div>
// //                   <h3 className="font-semibold mb-3">Engagement</h3>
// //                   <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
// //                     <div className="flex items-center gap-2">
// //                       <ThumbsUp className="h-5 w-5 text-muted-foreground" />
// //                       <div>
// //                         <p className="text-sm text-muted-foreground">Helpful Votes</p>
// //                         <p className="text-xl font-bold">{review.helpful_count}</p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Review Timeline */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Review Timeline</CardTitle>
// //                 <CardDescription>Track review lifecycle and updates</CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-4">
// //                   {/* Created */}
// //                   <div className="flex gap-4">
// //                     <div className="flex flex-col items-center">
// //                       <div className="rounded-full bg-primary p-2">
// //                         <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
// //                       </div>
// //                       <div className="w-px h-full bg-border mt-2" />
// //                     </div>
// //                     <div className="pb-4">
// //                       <p className="font-semibold">Review Submitted</p>
// //                       <p className="text-sm text-muted-foreground">
// //                         {formatDateTime(review.created_at)}
// //                       </p>
// //                     </div>
// //                   </div>

// //                   {/* Approved */}
// //                   {review.status === "approved" && (
// //                     <div className="flex gap-4">
// //                       <div className="flex flex-col items-center">
// //                         <div className="rounded-full bg-green-500 p-2">
// //                           <CheckCircle2 className="h-4 w-4 text-white" />
// //                         </div>
// //                         <div className="w-px h-full bg-border mt-2" />
// //                       </div>
// //                       <div className="pb-4">
// //                         <p className="font-semibold">Review Approved</p>
// //                         <p className="text-sm text-muted-foreground">
// //                           {formatDateTime(review.updated_at)}
// //                         </p>
// //                       </div>
// //                     </div>
// //                   )}

// //                   {/* Rejected */}
// //                   {review.status === "rejected" && review.moderation.rejection_reason && (
// //                     <div className="flex gap-4">
// //                       <div className="flex flex-col items-center">
// //                         <div className="rounded-full bg-red-500 p-2">
// //                           <XCircle className="h-4 w-4 text-white" />
// //                         </div>
// //                         <div className="w-px h-full bg-border mt-2" />
// //                       </div>
// //                       <div className="pb-4">
// //                         <p className="font-semibold">Review Rejected</p>
// //                         <p className="text-sm text-muted-foreground">
// //                           {review.moderation.moderated_at 
// //                             ? formatDateTime(review.moderation.moderated_at)
// //                             : formatDateTime(review.updated_at)}
// //                         </p>
// //                       </div>
// //                     </div>
// //                   )}

// //                   {/* Provider Response */}
// //                   {review.provider_response && review.response_date && (
// //                     <div className="flex gap-4">
// //                       <div className="flex flex-col items-center">
// //                         <div className="rounded-full bg-blue-500 p-2">
// //                           <ThumbsUp className="h-4 w-4 text-white" />
// //                         </div>
// //                       </div>
// //                       <div className="pb-4">
// //                         <p className="font-semibold">Provider Responded</p>
// //                         <p className="text-sm text-muted-foreground">
// //                           {formatDateTime(review.response_date)}
// //                         </p>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>

// //           {/* Right Column - User Info */}
// //           <div className="space-y-6">
// //             {/* Client Information */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Reviewer Information</CardTitle>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div className="flex items-center gap-3">
// //                   <Avatar className="h-16 w-16">
// //                     <AvatarImage
// //                       src={review.client.profile_photo || undefined}
// //                     />
// //                     <AvatarFallback className="text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
// //                       {getInitials(review.client.name)}
// //                     </AvatarFallback>
// //                   </Avatar>
// //                   <div className="flex-1">
// //                     <h3 className="font-semibold">{review.client.name}</h3>
// //                     <p className="text-sm text-muted-foreground">Customer</p>
// //                   </div>
// //                 </div>

// //                 <Separator />

// //                 <Link to={`/dashboard/users/${review.client.id}`}>
// //                   <Button className="w-full" variant="outline" size="sm">
// //                     <UserIcon className="mr-2 h-4 w-4" />
// //                     View Profile
// //                   </Button>
// //                 </Link>
// //               </CardContent>
// //             </Card>

// //             {/* Provider Information */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Provider Information</CardTitle>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div className="flex items-center gap-3">
// //                   <Avatar className="h-16 w-16">
// //                     <AvatarImage
// //                       src={review.provider.profile_photo || undefined}
// //                     />
// //                     <AvatarFallback className="text-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
// //                       {getInitials(review.provider.name)}
// //                     </AvatarFallback>
// //                   </Avatar>
// //                   <div className="flex-1">
// //                     <div className="flex items-center gap-2">
// //                       <h3 className="font-semibold">{review.provider.name}</h3>
// //                       {review.provider.is_verified && (
// //                         <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
// //                           <Shield className="w-3 h-3 mr-1" />
// //                           Verified
// //                         </Badge>
// //                       )}
// //                     </div>
// //                     <p className="text-sm text-muted-foreground">Service Provider</p>
// //                   </div>
// //                 </div>

// //                 <Separator />

// //                 <Link to={`/dashboard/users/${review.provider.id}`}>
// //                   <Button className="w-full" variant="outline" size="sm">
// //                     <UserIcon className="mr-2 h-4 w-4" />
// //                     View Profile
// //                   </Button>
// //                 </Link>
// //               </CardContent>
// //             </Card>

// //             {/* Review Meta Information */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Review Information</CardTitle>
// //               </CardHeader>
// //               <CardContent className="space-y-3">
// //                 <div>
// //                   <p className="text-sm text-muted-foreground">Review ID</p>
// //                   <p className="font-medium">#{review.id}</p>
// //                 </div>

// //                 <Separator />

// //                 <div>
// //                   <p className="text-sm text-muted-foreground">Service</p>
// //                   <p className="font-medium">{review.listing.title}</p>
// //                 </div>

// //                 <Separator />

// //                 <div>
// //                   <p className="text-sm text-muted-foreground">Category</p>
// //                   <Badge variant="outline">{review.listing.category}</Badge>
// //                 </div>

// //                 <Separator />

// //                 <div>
// //                   <p className="text-sm text-muted-foreground">Status</p>
// //                   {getStatusBadge(review.status)}
// //                 </div>

// //                 <Separator />

// //                 <div>
// //                   <p className="text-sm text-muted-foreground">Created At</p>
// //                   <p className="font-medium">
// //                     {formatDateTime(review.created_at)}
// //                   </p>
// //                 </div>

// //                 <Separator />

// //                 <div>
// //                   <p className="text-sm text-muted-foreground">Last Updated</p>
// //                   <p className="font-medium">
// //                     {formatDateTime(review.updated_at)}
// //                   </p>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Reject Modal */}
// //       <Modal
// //         isOpen={isModalOpen}
// //         onClose={() => {
// //           setIsModalOpen(false);
// //           rejectFormik.resetForm();
// //         }}
// //         title="Reject Review"
// //         showFooter={false}
// //         width="max-w-2xl"
// //       >
// //         <form onSubmit={rejectFormik.handleSubmit} className="space-y-4">
// //           <div className="space-y-2">
// //             <p className="text-sm text-muted-foreground">
// //               Are you sure you want to reject this review? This action will remove it from public view.
// //             </p>
// //           </div>

// //           <div className="space-y-2">
// //             <Label htmlFor="reason" className="text-sm font-medium">
// //               Reason for Rejection <span className="text-red-500">*</span>
// //             </Label>
// //             <Textarea
// //               id="reason"
// //               name="reason"
// //               placeholder="Enter detailed reason for rejection (minimum 10 characters)"
// //               value={rejectFormik.values.reason}
// //               onChange={rejectFormik.handleChange}
// //               onBlur={rejectFormik.handleBlur}
// //               rows={4}
// //               className={`resize-none ${
// //                 rejectFormik.touched.reason && rejectFormik.errors.reason
// //                   ? "border-red-500 focus:ring-red-500"
// //                   : ""
// //               }`}
// //             />
// //             {rejectFormik.touched.reason && rejectFormik.errors.reason && (
// //               <p className="text-sm text-red-500 mt-1">
// //                 {rejectFormik.errors.reason}
// //               </p>
// //             )}
// //             <p className="text-xs text-muted-foreground">
// //               {rejectFormik.values.reason.length}/500 characters
// //             </p>
// //           </div>

// //           <div className="flex gap-2 justify-end pt-4">
// //             <Button
// //               type="button"
// //               variant="outline"
// //               onClick={() => {
// //                 setIsModalOpen(false);
// //                 rejectFormik.resetForm();
// //               }}
// //               disabled={rejectFormik.isSubmitting}
// //             >
// //               Cancel
// //             </Button>
// //             <Button
// //               type="submit"
// //               variant="destructive"
// //               disabled={rejectFormik.isSubmitting}
// //             >
// //               {rejectFormik.isSubmitting ? (
// //                 <>
// //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                   Rejecting...
// //                 </>
// //               ) : (
// //                 "Reject Review"
// //               )}
// //             </Button>
// //           </div>
// //         </form>
// //       </Modal>
// //     </>
// //   );
// // };

// // export default ReviewDetail;









// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   ArrowLeft,
//   Star,
//   MessageSquare,
//   ThumbsUp,
//   Flag,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   Loader2,
//   User as UserIcon,
//   Shield,
//   Check,
//   X,
//   Trash2,
// } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import makeApiRequest from "@/services/axios";
// import { notify } from "@/utils/utils";
// import { AxiosError } from "axios";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Modal } from "@/components/ui/modal";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// interface Client {
//   id: number;
//   name: string;
//   profile_photo: string | null;
// }

// interface Provider {
//   id: number;
//   name: string;
//   profile_photo: string | null;
//   is_verified: boolean;
// }

// interface Booking {
//   id: number;
//   booking_date: string;
//   service_type: string;
// }

// interface Listing {
//   id: number;
//   title: string;
//   category: string;
// }

// interface Moderation {
//   is_flagged: boolean;
//   flag_reason: string | null;
//   rejection_reason: string | null;
//   moderated_by: number | null;
//   moderated_at: string | null;
// }

// interface Review {
//   id: number;
//   rating: number;
//   comment: string;
//   status: string;
//   client: Client;
//   provider: Provider;
//   booking: Booking;
//   listing: Listing;
//   provider_response: string | null;
//   response_date: string | null;
//   moderation: Moderation;
//   helpful_count: number;
//   created_at: string;
//   updated_at: string;
// }

// interface ApiErrorResponse {
//   message: string;
//   errors?: Record<string, string[]>;
// }

// // Star Rating Component
// const StarRating = ({ rating, size = "lg" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
//   const sizeClasses = {
//     sm: "w-4 h-4",
//     md: "w-5 h-5",
//     lg: "w-8 h-8"
//   };

//   return (
//     <div className="flex items-center gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <Star
//           key={star}
//           className={`${sizeClasses[size]} ${
//             star <= rating
//               ? "fill-yellow-400 text-yellow-400"
//               : "fill-gray-200 text-gray-200"
//           }`}
//         />
//       ))}
//     </div>
//   );
// };

// const approveValidationSchema = Yup.object({
//   notes: Yup.string()
//     .max(500, "Notes must not exceed 500 characters"),
// });

// const rejectValidationSchema = Yup.object({
//   reason: Yup.string()
//     .min(10, "Reason must be at least 10 characters")
//     .max(500, "Reason must not exceed 500 characters")
//     .required("Rejection reason is required"),
// });

// const ReviewDetail = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [review, setReview] = useState<Review | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [unflagDialogOpen, setUnflagDialogOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [isUnflagging, setIsUnflagging] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState<{
//     approve: boolean;
//     reject: boolean;
//   }>({
//     approve: false,
//     reject: false,
//   });

//   useEffect(() => {
//     if (id) {
//       fetchReviewDetail(id);
//     }
//   }, [id]);

//   const fetchReviewDetail = async (reviewId: string) => {
//     try {
//       setIsLoading(true);
//       const response = await makeApiRequest(`/admin/reviews/${reviewId}`, {
//         method: "GET",
//       });

//       console.log("Review Details:", response);
//       setReview(response.data);
//     } catch (error) {
//       console.error("Error fetching review:", error);
//       const errorMessage =
//         error?.response?.data?.message || "Failed to fetch review details";
//       notify({ message: errorMessage, type: "error" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteReview = async () => {
//     if (!id) return;
//     try {
//       setIsDeleting(true);
//       const response = await makeApiRequest(`/admin/reviews/${id}`, {
//         method: "DELETE",
//       });
//       notify({ message: response.message || "Review deleted successfully", type: "success" });
//       setDeleteDialogOpen(false);
//       navigate("/dashboard/reviews");
//     } catch (error) {
//       console.error("Error deleting review:", error);
//       const axiosError = error as AxiosError<ApiErrorResponse>;
//       const errorMessage =
//         axiosError.response?.data?.message || "Failed to delete review";
//       notify({ message: errorMessage, type: "error" });
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleUnflagReview = async () => {
//     if (!id) return;
//     try {
//       setIsUnflagging(true);
//       const response = await makeApiRequest(`/admin/reviews/${id}/flag`, {
//         method: "put",
//         data: { is_flagged: false },
//       });
//       notify({ message: "Review unflagged successfully", type: "success" });
//       setUnflagDialogOpen(false);
//       fetchReviewDetail(id);
//     } catch (error) {
//       console.error("Error unflagging review:", error);
//       const axiosError = error as AxiosError<ApiErrorResponse>;
//       const errorMessage =
//         axiosError.response?.data?.message || "Failed to unflag review";
//       notify({ message: errorMessage, type: "error" });
//     } finally {
//       setIsUnflagging(false);
//     }
//   };

//   const approveFormik = useFormik({
//     initialValues: {
//       notes: "",
//     },
//     validationSchema: approveValidationSchema,
//     onSubmit: async (values, { setSubmitting, resetForm }) => {
//       try {
//         const response = await makeApiRequest(`/admin/reviews/${id}/approve`, {
//           method: "put",
//           data: { notes: values.notes || "Review approved" },
//         });

//         if (response.success) {
//           notify({
//             message: "Review approved successfully",
//             type: "success",
//           });
//           setIsModalOpen({ ...isModalOpen, approve: false });
//           resetForm();
//           fetchReviewDetail(id!);
//         }
//       } catch (error) {
//         console.error("Error approving review:", error);
//         notify({
//           message: error?.response?.data?.message || "Failed to approve review",
//           type: "error",
//         });
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   const rejectFormik = useFormik({
//     initialValues: {
//       reason: "",
//     },
//     validationSchema: rejectValidationSchema,
//     onSubmit: async (values, { setSubmitting, resetForm }) => {
//       try {
//         const response = await makeApiRequest(`/admin/reviews/${id}/reject`, {
//           method: "put",
//           data: { reason: values.reason },
//         });

//         if (response.success) {
//           notify({
//             message: "Review rejected successfully",
//             type: "success",
//           });
//           setIsModalOpen({ ...isModalOpen, reject: false });
//           resetForm();
//           fetchReviewDetail(id!);
//         }
//       } catch (error) {
//         console.error("Error rejecting review:", error);
//         notify({
//           message: error?.response?.data?.message || "Failed to reject review",
//           type: "error",
//         });
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   const getStatusBadge = (status: string) => {
//     const config: Record<string, { className: string; icon }> = {
//       pending: {
//         className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
//         icon: AlertCircle,
//       },
//       approved: {
//         className: "bg-green-100 text-green-800 hover:bg-green-100",
//         icon: CheckCircle2,
//       },
//       rejected: {
//         className: "bg-red-100 text-red-800 hover:bg-red-100",
//         icon: XCircle,
//       },
//     };

//     const statusConfig = config[status] || config.pending;
//     const Icon = statusConfig.icon;

//     return (
//       <Badge className={statusConfig.className}>
//         <Icon className="w-3 h-3 mr-1" />
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </Badge>
//     );
//   };

//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const formatDateTime = (dateString: string) => {
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (!review) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <p className="text-muted-foreground mb-4">Review not found</p>
//         <Button onClick={() => navigate("/dashboard/reviews")}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Reviews
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="space-y-6 p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => navigate("/dashboard/reviews")}
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <div>
//               <h1 className="text-3xl font-bold tracking-tight">
//                 Review Details
//               </h1>
//               <p className="text-muted-foreground">
//                 View and manage review information
//               </p>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-2">
//             <Button
//               variant="default"
//               size="sm"
//               onClick={() => setIsModalOpen({ ...isModalOpen, approve: true })}
//             >
//               <Check className="mr-2 h-4 w-4" />
//               Approve
//             </Button>

//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setIsModalOpen({ ...isModalOpen, reject: true })}
//             >
//               <X className="mr-2 h-4 w-4" />
//               Reject
//             </Button>

//             {review.moderation.is_flagged ? (
//               <AlertDialog
//                 open={unflagDialogOpen}
//                 onOpenChange={setUnflagDialogOpen}
//               >
//                 <AlertDialogTrigger asChild>
//                   <Button variant="default" size="sm">
//                     <Flag className="mr-2 h-4 w-4" />
//                     Unflag
//                   </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>Unflag Review?</AlertDialogTitle>
//                     <AlertDialogDescription>
//                       This will remove the flag from this review and mark it as safe.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel disabled={isUnflagging}>
//                       Cancel
//                     </AlertDialogCancel>
//                     <AlertDialogAction
//                       disabled={isUnflagging}
//                       onClick={handleUnflagReview}
//                     >
//                       {isUnflagging ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Unflagging...
//                         </>
//                       ) : (
//                         "Unflag"
//                       )}
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             ) : (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setIsModalOpen({ ...isModalOpen, reject: true })}
//               >
//                 <Flag className="mr-2 h-4 w-4" />
//                 Flag
//               </Button>
//             )}

//             <AlertDialog
//               open={deleteDialogOpen}
//               onOpenChange={setDeleteDialogOpen}
//             >
//               <AlertDialogTrigger asChild>
//                 <Button variant="destructive" size="sm">
//                   <Trash2 className="mr-2 h-4 w-4" />
//                   Delete
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>Delete Review?</AlertDialogTitle>
//                   <AlertDialogDescription>
//                     This action cannot be undone. This will permanently delete the review
//                     and remove it from our servers.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel disabled={isDeleting}>
//                     Cancel
//                   </AlertDialogCancel>
//                   <AlertDialogAction
//                     disabled={isDeleting}
//                     onClick={handleDeleteReview}
//                     className="bg-red-600 hover:bg-red-700"
//                   >
//                     {isDeleting ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Deleting...
//                       </>
//                     ) : (
//                       "Delete"
//                     )}
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid gap-6 lg:grid-cols-3">
//           {/* Left Column - Review Details */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Review Overview */}
//             <Card>
//               <CardHeader>
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-3">
//                       <StarRating rating={review.rating} size="lg" />
//                       <span className="text-3xl font-bold">{review.rating}.0</span>
//                     </div>
//                     <CardDescription className="flex items-center gap-4 text-base">
//                       <span className="flex items-center gap-1">
//                         <MessageSquare className="h-4 w-4" />
//                         Review for {review.listing.title}
//                       </span>
//                       <Badge variant="outline" className="text-xs">
//                         {review.listing.category}
//                       </Badge>
//                     </CardDescription>
//                   </div>
//                   {getStatusBadge(review.status)}
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {/* Review Comment */}
//                 <div className="bg-muted p-4 rounded-lg">
//                   <h3 className="font-semibold mb-2 flex items-center gap-2">
//                     <MessageSquare className="h-4 w-4" />
//                     Customer Review
//                   </h3>
//                   <p className="text-base leading-relaxed whitespace-pre-wrap">
//                     {review.comment}
//                   </p>
//                 </div>

//                 <Separator />

//                 {/* Provider Response */}
//                 {review.provider_response ? (
//                   <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
//                     <div className="flex items-center gap-2 mb-2">
//                       <ThumbsUp className="h-4 w-4 text-blue-600" />
//                       <h3 className="font-semibold text-blue-900">Provider Response</h3>
//                       {review.response_date && (
//                         <span className="text-xs text-muted-foreground ml-auto">
//                           {formatDateTime(review.response_date)}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-sm text-blue-900 leading-relaxed">
//                       {review.provider_response}
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
//                     <p className="text-sm text-muted-foreground">
//                       Provider has not responded yet
//                     </p>
//                   </div>
//                 )}

//                 {/* Booking Information */}
//                 <Separator />

//                 <div>
//                   <h3 className="font-semibold mb-3">Associated Booking</h3>
//                   <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
//                     <div>
//                       <p className="text-sm text-muted-foreground">Booking ID</p>
//                       <Link 
//                         to={`/dashboard/booking/${review.booking.id}`}
//                         className="text-primary hover:underline font-medium"
//                       >
//                         #{review.booking.id}
//                       </Link>
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">Service Date</p>
//                       <p className="font-medium">{formatDate(review.booking.booking_date)}</p>
//                     </div>
//                     <div className="col-span-2">
//                       <p className="text-sm text-muted-foreground">Service Type</p>
//                       <p className="font-medium">{review.booking.service_type}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Moderation Info */}
//                 {(review.moderation.is_flagged || review.moderation.rejection_reason) && (
//                   <>
//                     <Separator />
//                     <div className="space-y-3">
//                       <h3 className="font-semibold flex items-center gap-2">
//                         <Shield className="h-4 w-4" />
//                         Moderation Information
//                       </h3>
                      
//                       {review.moderation.is_flagged && (
//                         <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
//                           <div className="flex items-center gap-2 mb-1">
//                             <Flag className="h-4 w-4 text-orange-600" />
//                             <p className="font-medium text-orange-900">Flagged Content</p>
//                           </div>
//                           {review.moderation.flag_reason && (
//                             <p className="text-sm text-orange-800 mt-1">
//                               Reason: {review.moderation.flag_reason}
//                             </p>
//                           )}
//                         </div>
//                       )}

//                       {review.moderation.rejection_reason && (
//                         <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
//                           <div className="flex items-center gap-2 mb-1">
//                             <XCircle className="h-4 w-4 text-red-600" />
//                             <p className="font-medium text-red-900">Rejection Reason</p>
//                           </div>
//                           <p className="text-sm text-red-800 mt-1">
//                             {review.moderation.rejection_reason}
//                           </p>
//                           {review.moderation.moderated_at && (
//                             <p className="text-xs text-red-700 mt-1">
//                               Moderated at: {formatDateTime(review.moderation.moderated_at)}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 )}

//                 {/* Engagement Stats */}
//                 <Separator />
//                 <div>
//                   <h3 className="font-semibold mb-3">Engagement</h3>
//                   <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
//                     <div className="flex items-center gap-2">
//                       <ThumbsUp className="h-5 w-5 text-muted-foreground" />
//                       <div>
//                         <p className="text-sm text-muted-foreground">Helpful Votes</p>
//                         <p className="text-xl font-bold">{review.helpful_count}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Review Timeline */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Review Timeline</CardTitle>
//                 <CardDescription>Track review lifecycle and updates</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {/* Created */}
//                   <div className="flex gap-4">
//                     <div className="flex flex-col items-center">
//                       <div className="rounded-full bg-primary p-2">
//                         <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
//                       </div>
//                       <div className="w-px h-full bg-border mt-2" />
//                     </div>
//                     <div className="pb-4">
//                       <p className="font-semibold">Review Submitted</p>
//                       <p className="text-sm text-muted-foreground">
//                         {formatDateTime(review.created_at)}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Approved */}
//                   {review.status === "approved" && (
//                     <div className="flex gap-4">
//                       <div className="flex flex-col items-center">
//                         <div className="rounded-full bg-green-500 p-2">
//                           <CheckCircle2 className="h-4 w-4 text-white" />
//                         </div>
//                         <div className="w-px h-full bg-border mt-2" />
//                       </div>
//                       <div className="pb-4">
//                         <p className="font-semibold">Review Approved</p>
//                         <p className="text-sm text-muted-foreground">
//                           {formatDateTime(review.updated_at)}
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {/* Rejected */}
//                   {review.status === "rejected" && review.moderation.rejection_reason && (
//                     <div className="flex gap-4">
//                       <div className="flex flex-col items-center">
//                         <div className="rounded-full bg-red-500 p-2">
//                           <XCircle className="h-4 w-4 text-white" />
//                         </div>
//                         <div className="w-px h-full bg-border mt-2" />
//                       </div>
//                       <div className="pb-4">
//                         <p className="font-semibold">Review Rejected</p>
//                         <p className="text-sm text-muted-foreground">
//                           {review.moderation.moderated_at 
//                             ? formatDateTime(review.moderation.moderated_at)
//                             : formatDateTime(review.updated_at)}
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {/* Provider Response */}
//                   {review.provider_response && review.response_date && (
//                     <div className="flex gap-4">
//                       <div className="flex flex-col items-center">
//                         <div className="rounded-full bg-blue-500 p-2">
//                           <ThumbsUp className="h-4 w-4 text-white" />
//                         </div>
//                       </div>
//                       <div className="pb-4">
//                         <p className="font-semibold">Provider Responded</p>
//                         <p className="text-sm text-muted-foreground">
//                           {formatDateTime(review.response_date)}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Column - User Info */}
//           <div className="space-y-6">
//             {/* Client Information */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Reviewer Information</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <Avatar className="h-16 w-16">
//                     <AvatarImage
//                       src={review.client.profile_photo || undefined}
//                     />
//                     <AvatarFallback className="text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
//                       {getInitials(review.client.name)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <h3 className="font-semibold">{review.client.name}</h3>
//                     <p className="text-sm text-muted-foreground">Customer</p>
//                   </div>
//                 </div>

//                 <Separator />

//                 <Link to={`/dashboard/users/${review.client.id}`}>
//                   <Button className="w-full" variant="outline" size="sm">
//                     <UserIcon className="mr-2 h-4 w-4" />
//                     View Profile
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>

//             {/* Provider Information */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Provider Information</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <Avatar className="h-16 w-16">
//                     <AvatarImage
//                       src={review.provider.profile_photo || undefined}
//                     />
//                     <AvatarFallback className="text-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
//                       {getInitials(review.provider.name)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                       <h3 className="font-semibold">{review.provider.name}</h3>
//                       {review.provider.is_verified && (
//                         <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
//                           <Shield className="w-3 h-3 mr-1" />
//                           Verified
//                         </Badge>
//                       )}
//                     </div>
//                     <p className="text-sm text-muted-foreground">Service Provider</p>
//                   </div>
//                 </div>

//                 <Separator />

//                 <Link to={`/dashboard/users/${review.provider.id}`}>
//                   <Button className="w-full" variant="outline" size="sm">
//                     <UserIcon className="mr-2 h-4 w-4" />
//                     View Profile
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>

//             {/* Review Meta Information */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Review Information</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Review ID</p>
//                   <p className="font-medium">#{review.id}</p>
//                 </div>

//                 <Separator />

//                 <div>
//                   <p className="text-sm text-muted-foreground">Service</p>
//                   <p className="font-medium">{review.listing.title}</p>
//                 </div>

//                 <Separator />

//                 <div>
//                   <p className="text-sm text-muted-foreground">Category</p>
//                   <Badge variant="outline">{review.listing.category}</Badge>
//                 </div>

//                 <Separator />

//                 <div>
//                   <p className="text-sm text-muted-foreground">Status</p>
//                   {getStatusBadge(review.status)}
//                 </div>

//                 <Separator />

//                 <div>
//                   <p className="text-sm text-muted-foreground">Created At</p>
//                   <p className="font-medium">
//                     {formatDateTime(review.created_at)}
//                   </p>
//                 </div>

//                 <Separator />

//                 <div>
//                   <p className="text-sm text-muted-foreground">Last Updated</p>
//                   <p className="font-medium">
//                     {formatDateTime(review.updated_at)}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* Approve Modal */}
//       <Modal
//         isOpen={isModalOpen.approve}
//         onClose={() => {
//           setIsModalOpen({ ...isModalOpen, approve: false });
//           approveFormik.resetForm();
//         }}
//         title="Approve Review"
//         showFooter={false}
//         width="max-w-2xl"
//       >
//         <form onSubmit={approveFormik.handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <p className="text-sm text-muted-foreground">
//               Are you sure you want to approve this review? This will make it visible to all users.
//             </p>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="notes" className="text-sm font-medium">
//               Approval Notes <span className="text-muted-foreground">(Optional)</span>
//             </Label>
//             <Textarea
//               id="notes"
//               name="notes"
//               placeholder="Add any notes about this approval (optional)"
//               value={approveFormik.values.notes}
//               onChange={approveFormik.handleChange}
//               onBlur={approveFormik.handleBlur}
//               rows={3}
//               className="resize-none"
//             />
//             {approveFormik.touched.notes && approveFormik.errors.notes && (
//               <p className="text-sm text-red-500 mt-1">
//                 {approveFormik.errors.notes}
//               </p>
//             )}
//             <p className="text-xs text-muted-foreground">
//               {approveFormik.values.notes.length}/500 characters
//             </p>
//           </div>

//           <div className="flex gap-2 justify-end pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => {
//                 setIsModalOpen({ ...isModalOpen, approve: false });
//                 approveFormik.resetForm();
//               }}
//               disabled={approveFormik.isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="default"
//               disabled={approveFormik.isSubmitting}
//             >
//               {approveFormik.isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Approving...
//                 </>
//               ) : (
//                 "Approve Review"
//               )}
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {/* Reject Modal */}
//       <Modal
//         isOpen={isModalOpen.reject}
//         onClose={() => {
//           setIsModalOpen({ ...isModalOpen, reject: false });
//           rejectFormik.resetForm();
//         }}
//         title="Reject Review"
//         showFooter={false}
//         width="max-w-2xl"
//       >
//         <form onSubmit={rejectFormik.handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <p className="text-sm text-muted-foreground">
//               Are you sure you want to reject this review? This action will remove it from public view.
//             </p>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="reason" className="text-sm font-medium">
//               Reason for Rejection <span className="text-red-500">*</span>
//             </Label>
//             <Textarea
//               id="reason"
//               name="reason"
//               placeholder="Enter detailed reason for rejection (minimum 10 characters)"
//               value={rejectFormik.values.reason}
//               onChange={rejectFormik.handleChange}
//               onBlur={rejectFormik.handleBlur}
//               rows={4}
//               className={`resize-none ${
//                 rejectFormik.touched.reason && rejectFormik.errors.reason
//                   ? "border-red-500 focus:ring-red-500"
//                   : ""
//               }`}
//             />
//             {rejectFormik.touched.reason && rejectFormik.errors.reason && (
//               <p className="text-sm text-red-500 mt-1">
//                 {rejectFormik.errors.reason}
//               </p>
//             )}
//             <p className="text-xs text-muted-foreground">
//               {rejectFormik.values.reason.length}/500 characters
//             </p>
//           </div>

//           <div className="flex gap-2 justify-end pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => {
//                 setIsModalOpen({ ...isModalOpen, reject: false });
//                 rejectFormik.resetForm();
//               }}
//               disabled={rejectFormik.isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="destructive"
//               disabled={rejectFormik.isSubmitting}
//             >
//               {rejectFormik.isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Rejecting...
//                 </>
//               ) : (
//                 "Reject Review"
//               )}
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </>
//   );
// };

// export default ReviewDetail;












import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MessageSquare,
  ThumbsUp,
  Flag,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  User as UserIcon,
  Shield,
  Check,
  X,
  Trash2,
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

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Star Rating Component
const StarRating = ({ rating, size = "lg" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8"
  };

  return (
    <div className="flex items-center gap-1">
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

const approveValidationSchema = Yup.object({
  notes: Yup.string()
    .max(500, "Notes must not exceed 500 characters"),
});

const rejectValidationSchema = Yup.object({
  reason: Yup.string()
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must not exceed 500 characters")
    .required("Rejection reason is required"),
});

const ReviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [unflagDialogOpen, setUnflagDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isFlagging, setIsFlagging] = useState(false);
  const [isUnflagging, setIsUnflagging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<{
    approve: boolean;
    reject: boolean;
  }>({
    approve: false,
    reject: false,
  });

  useEffect(() => {
    if (id) {
      fetchReviewDetail(id);
    }
  }, [id]);

  const fetchReviewDetail = async (reviewId: string) => {
    try {
      setIsLoading(true);
      const response = await makeApiRequest(`/admin/reviews/${reviewId}`, {
        method: "GET",
      });

      console.log("Review Details:", response);
      setReview(response.data);
    } catch (error) {
      console.error("Error fetching review:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch review details";
      notify({ message: errorMessage, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!id) return;
    try {
      setIsDeleting(true);
      const response = await makeApiRequest(`/admin/reviews/${id}`, {
        method: "DELETE",
      });
      notify({ message: response.message || "Review deleted successfully", type: "success" });
      setDeleteDialogOpen(false);
      navigate("/dashboard/reviews");
    } catch (error) {
      console.error("Error deleting review:", error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to delete review";
      notify({ message: errorMessage, type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFlagReview = async () => {
    if (!id) return;
    try {
      setIsFlagging(true);
      const response = await makeApiRequest(`/admin/reviews/${id}/flag`, {
        method: "PUT",
      });
      notify({ message: "Review flagged successfully", type: "success" });
      setFlagDialogOpen(false);
      fetchReviewDetail(id);
    } catch (error) {
      console.error("Error flagging review:", error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to flag review";
      notify({ message: errorMessage, type: "error" });
    } finally {
      setIsFlagging(false);
    }
  };

  const handleUnflagReview = async () => {
    if (!id) return;
    try {
      setIsUnflagging(true);
      const response = await makeApiRequest(`/admin/reviews/${id}/flag`, {
        method: "PUT",
      });
      notify({ message: "Review unflagged successfully", type: "success" });
      setUnflagDialogOpen(false);
      fetchReviewDetail(id);
    } catch (error) {
      console.error("Error unflagging review:", error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to unflag review";
      notify({ message: errorMessage, type: "error" });
    } finally {
      setIsUnflagging(false);
    }
  };

  const approveFormik = useFormik({
    initialValues: {
      notes: "",
    },
    validationSchema: approveValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await makeApiRequest(`/admin/reviews/${id}/approve`, {
          method: "put",
          data: { notes: values.notes || "Review approved" },
        });

        if (response.success) {
          notify({
            message: "Review approved successfully",
            type: "success",
          });
          setIsModalOpen({ ...isModalOpen, approve: false });
          resetForm();
          fetchReviewDetail(id!);
        }
      } catch (error) {
        console.error("Error approving review:", error);
        notify({
          message: error?.response?.data?.message || "Failed to approve review",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const rejectFormik = useFormik({
    initialValues: {
      reason: "",
    },
    validationSchema: rejectValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await makeApiRequest(`/admin/reviews/${id}/reject`, {
          method: "put",
          data: { reason: values.reason },
        });

        if (response.success) {
          notify({
            message: "Review rejected successfully",
            type: "success",
          });
          setIsModalOpen({ ...isModalOpen, reject: false });
          resetForm();
          fetchReviewDetail(id!);
        }
      } catch (error) {
        console.error("Error rejecting review:", error);
        notify({
          message: error?.response?.data?.message || "Failed to reject review",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { className: string; icon }> = {
      pending: {
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: AlertCircle,
      },
      approved: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: CheckCircle2,
      },
      rejected: {
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        icon: XCircle,
      },
    };

    const statusConfig = config[status] || config.pending;
    const Icon = statusConfig.icon;

    return (
      <Badge className={statusConfig.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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

  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground mb-4">Review not found</p>
        <Button onClick={() => navigate("/dashboard/reviews")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reviews
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
              onClick={() => navigate("/dashboard/reviews")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Review Details
              </h1>
              <p className="text-muted-foreground">
                View and manage review information
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsModalOpen({ ...isModalOpen, approve: true })}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen({ ...isModalOpen, reject: true })}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>

            {review.moderation.is_flagged ? (
              <AlertDialog
                open={unflagDialogOpen}
                onOpenChange={setUnflagDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="default" size="sm">
                    <Flag className="mr-2 h-4 w-4" />
                    Unflag
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Unflag Review?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the flag from this review and mark it as safe.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isUnflagging}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isUnflagging}
                      onClick={handleUnflagReview}
                    >
                      {isUnflagging ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Unflagging...
                        </>
                      ) : (
                        "Unflag"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <AlertDialog
                open={flagDialogOpen}
                onOpenChange={setFlagDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Flag className="mr-2 h-4 w-4" />
                    Flag
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Flag Review?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will flag this review for moderation. Are you sure you want to continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isFlagging}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isFlagging}
                      onClick={handleFlagReview}
                    >
                      {isFlagging ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Flagging...
                        </>
                      ) : (
                        "Flag"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

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
                  <AlertDialogTitle>Delete Review?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the review
                    and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isDeleting}
                    onClick={handleDeleteReview}
                    className="bg-red-600 hover:bg-red-700"
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
          {/* Left Column - Review Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Review Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <StarRating rating={review.rating} size="lg" />
                      <span className="text-3xl font-bold">{review.rating}.0</span>
                    </div>
                    <CardDescription className="flex items-center gap-4 text-base">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        Review for {review.listing.title}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {review.listing.category}
                      </Badge>
                    </CardDescription>
                  </div>
                  {getStatusBadge(review.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Review Comment */}
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Customer Review
                  </h3>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {review.comment}
                  </p>
                </div>

                <Separator />

                {/* Provider Response */}
                {review.provider_response ? (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsUp className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Worker Response</h3>
                      {review.response_date && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatDateTime(review.response_date)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-blue-900 leading-relaxed">
                      {review.provider_response}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      Worker has not responded yet
                    </p>
                  </div>
                )}

                {/* Booking Information */}
                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Associated Booking</h3>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Booking ID</p>
                      <Link 
                        to={`/dashboard/booking/${review.booking.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        #{review.booking.id}
                      </Link>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Service Date</p>
                      <p className="font-medium">{formatDate(review.booking.booking_date)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Service Type</p>
                      <p className="font-medium">{review.booking.service_type}</p>
                    </div>
                  </div>
                </div>

                {/* Moderation Info */}
                {(review.moderation.is_flagged || review.moderation.rejection_reason) && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Moderation Information
                      </h3>
                      
                      {review.moderation.is_flagged && (
                        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Flag className="h-4 w-4 text-orange-600" />
                            <p className="font-medium text-orange-900">Flagged Content</p>
                          </div>
                          {review.moderation.flag_reason && (
                            <p className="text-sm text-orange-800 mt-1">
                              Reason: {review.moderation.flag_reason}
                            </p>
                          )}
                        </div>
                      )}

                      {review.moderation.rejection_reason && (
                        <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <p className="font-medium text-red-900">Rejection Reason</p>
                          </div>
                          <p className="text-sm text-red-800 mt-1">
                            {review.moderation.rejection_reason}
                          </p>
                          {review.moderation.moderated_at && (
                            <p className="text-xs text-red-700 mt-1">
                              Moderated at: {formatDateTime(review.moderation.moderated_at)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Engagement Stats */}
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Engagement</h3>
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Helpful Votes</p>
                        <p className="text-xl font-bold">{review.helpful_count}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Review Timeline</CardTitle>
                <CardDescription>Track review lifecycle and updates</CardDescription>
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
                      <p className="font-semibold">Review Submitted</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(review.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Approved */}
                  {review.status === "approved" && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-green-500 p-2">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                        <div className="w-px h-full bg-border mt-2" />
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold">Review Approved</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(review.updated_at)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Rejected */}
                  {review.status === "rejected" && review.moderation.rejection_reason && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-red-500 p-2">
                          <XCircle className="h-4 w-4 text-white" />
                        </div>
                        <div className="w-px h-full bg-border mt-2" />
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold">Review Rejected</p>
                        <p className="text-sm text-muted-foreground">
                          {review.moderation.moderated_at 
                            ? formatDateTime(review.moderation.moderated_at)
                            : formatDateTime(review.updated_at)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Provider Response */}
                  {review.provider_response && review.response_date && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-blue-500 p-2">
                          <ThumbsUp className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold">Worker Responded</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(review.response_date)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - User Info */}
          <div className="space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle>Reviewer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={review.client.profile_photo || undefined}
                    />
                    <AvatarFallback className="text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {getInitials(review.client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{review.client.name}</h3>
                    <p className="text-sm text-muted-foreground">Customer</p>
                  </div>
                </div>

                <Separator />

                <Link to={`/dashboard/users/${review.client.id}`}>
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
                      src={review.provider.profile_photo || undefined}
                    />
                    <AvatarFallback className="text-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      {getInitials(review.provider.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{review.provider.name}</h3>
                      {review.provider.is_verified && (
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

                <Link to={`/dashboard/users/${review.provider.id}`}>
                  <Button className="w-full" variant="outline" size="sm">
                    <UserIcon className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Review Meta Information */}
            <Card>
              <CardHeader>
                <CardTitle>Review Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Review ID</p>
                  <p className="font-medium">#{review.id}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium">{review.listing.title}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="outline">{review.listing.category}</Badge>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(review.status)}
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {formatDateTime(review.created_at)}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {formatDateTime(review.updated_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={isModalOpen.approve}
        onClose={() => {
          setIsModalOpen({ ...isModalOpen, approve: false });
          approveFormik.resetForm();
        }}
        title="Approve Review"
        showFooter={false}
        width="max-w-2xl"
      >
        <form onSubmit={approveFormik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to approve this review? This will make it visible to all users.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Approval Notes <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add any notes about this approval (optional)"
              value={approveFormik.values.notes}
              onChange={approveFormik.handleChange}
              onBlur={approveFormik.handleBlur}
              rows={3}
              className="resize-none"
            />
            {approveFormik.touched.notes && approveFormik.errors.notes && (
              <p className="text-sm text-red-500 mt-1">
                {approveFormik.errors.notes}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {approveFormik.values.notes.length}/500 characters
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen({ ...isModalOpen, approve: false });
                approveFormik.resetForm();
              }}
              disabled={approveFormik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={approveFormik.isSubmitting}
            >
              {approveFormik.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                "Approve Review"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isModalOpen.reject}
        onClose={() => {
          setIsModalOpen({ ...isModalOpen, reject: false });
          rejectFormik.resetForm();
        }}
        title="Reject Review"
        showFooter={false}
        width="max-w-2xl"
      >
        <form onSubmit={rejectFormik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to reject this review? This action will remove it from public view.
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
                  Rejecting...
                </>
              ) : (
                "Reject Review"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ReviewDetail;