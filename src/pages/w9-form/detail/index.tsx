// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Mail,
//   Calendar,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   User as UserIcon,
//   FileText,
//   Download,
//   ExternalLink,
//   ShieldCheck,
//   ShieldX,
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
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Modal } from "@/components/ui/modal";
// import makeApiRequest from "@/services/axios";
// import { formatDate, notify } from "@/utils/utils";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// interface W9FormDetail {
//   id: number;
//   user: {
//     id: number;
//     name: string;
//     email: string;
//     user_type: string;
//   };
//   document_name: string;
//   verification_status: "pending" | "verified" | "rejected";
//   rejection_reason: string | null;
//   document_url: string;
//   verified_at: string | null;
//   verified_by: string | null;
//   uploaded_at: string;
// }

// const rejectionValidationSchema = Yup.object({
//   rejection_reason: Yup.string()
//     .min(10, "Reason must be at least 10 characters")
//     .max(500, "Reason must not exceed 500 characters")
//     .required("Rejection reason is required"),
// });

// const W9Detail = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const [form, setForm] = useState<W9FormDetail | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [rejectModalOpen, setRejectModalOpen] = useState(false);

//   // Formik for rejection reason
//   const rejectionFormik = useFormik({
//     initialValues: { rejection_reason: "" },
//     validationSchema: rejectionValidationSchema,
//     onSubmit: async (values, { setSubmitting, resetForm }) => {
//       try {
//         await makeApiRequest(`/admin/w9-forms/${id}/reject`, {
//           method: "POST",
//           data: { rejection_reason: values.rejection_reason },
//         });

//         notify({ message: "W9 form rejected successfully", type: "success" });

//         setForm((prev) =>
//           prev
//             ? {
//                 ...prev,
//                 verification_status: "rejected",
//                 rejection_reason: values.rejection_reason,
//               }
//             : null
//         );

//         setRejectModalOpen(false);
//         resetForm();
//       } catch (error: any) {
//         notify({
//           message: error?.response?.data?.message || "Failed to reject W9 form",
//           type: "error",
//         });
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   const fetchW9Detail = async (formId: string) => {
//     try {
//       setIsLoading(true);
//       const response = await makeApiRequest(`/admin/w9-forms/${formId}`, {
//         method: "GET",
//       });
//       setForm(response.data?.data || response.data);
//     } catch (error) {
//       console.error("Error fetching W9 form:", error);
//       notify({ message: "Failed to fetch W9 form details", type: "error" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerify = async () => {
//     try {
//       setIsVerifying(true);
//       await makeApiRequest(`/admin/w9-forms/${id}/verify`, {
//         method: "POST",
//       });

//       notify({ message: "W9 form verified successfully", type: "success" });

//       setForm((prev) =>
//         prev
//           ? {
//               ...prev,
//               verification_status: "verified",
//               verified_at: new Date().toISOString(),
//             }
//           : null
//       );
//     } catch (error: any) {
//       notify({
//         message: error?.response?.data?.message || "Failed to verify W9 form",
//         type: "error",
//       });
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   useEffect(() => {
//     if (id) fetchW9Detail(id);
//   }, [id]);

//   const getStatusBadge = (status: string) => {
//     const config: Record<string, { className: string; icon: any }> = {
//       verified: {
//         className: "bg-green-100 text-green-800 hover:bg-green-100",
//         icon: CheckCircle2,
//       },
//       pending: {
//         className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
//         icon: Clock,
//       },
//       rejected: {
//         className: "bg-red-100 text-red-800 hover:bg-red-100",
//         icon: XCircle,
//       },
//     };

//     const s = config[status] || config.pending;
//     const Icon = s.icon;

//     return (
//       <Badge className={s.className}>
//         <Icon className="w-3 h-3 mr-1" />
//         {status}
//       </Badge>
//     );
//   };

//   // ─── Loading ─────────────────────────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
//       </div>
//     );
//   }

//   // ─── Not found ────────────────────────────────────────────────────────────────
//   if (!form) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <p className="text-muted-foreground mb-4">W9 form not found</p>
//         <Button onClick={() => navigate("/dashboard/w9-forms")}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to W9 Forms
//         </Button>
//       </div>
//     );
//   }

//   const isPending = form.verification_status === "pending";

//   // ─── Main ─────────────────────────────────────────────────────────────────────
//   return (
//     <>
//       <div className="space-y-6 p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <div>
//               <h1 className="text-3xl font-bold tracking-tight">
//                 W9 Form Details
//               </h1>
//               <p className="text-muted-foreground">
//                 View and verify W9 form #{form.id}
//               </p>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           {isPending && (
//             <div className="flex gap-2">
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="border-red-300 text-red-600 hover:bg-red-50"
//                 onClick={() => setRejectModalOpen(true)}
//               >
//                 <ShieldX className="mr-2 h-4 w-4" />
//                 Reject
//               </Button>
//               <Button
//                 size="sm"
//                 className="bg-gradient-to-r from-green-500 to-emerald-600"
//                 onClick={handleVerify}
//                 disabled={isVerifying}
//               >
//                 {isVerifying ? (
//                   <div className="flex items-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Verifying...
//                   </div>
//                 ) : (
//                   <>
//                     <ShieldCheck className="mr-2 h-4 w-4" />
//                     Verify
//                   </>
//                 )}
//               </Button>
//             </div>
//           )}
//         </div>

//         <div className="grid gap-6 md:grid-cols-3">
//           {/* Left: User Info Card */}
//           <Card className="md:col-span-1">
//             <CardHeader>
//               <CardTitle>User Info</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Avatar + Name */}
//               <div className="flex flex-col items-center text-center">
//                 <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
//                   <span className="text-3xl font-bold text-white">
//                     {form.user?.name
//                       ?.split(" ")
//                       .map((n) => n[0])
//                       .join("")
//                       .slice(0, 2)
//                       .toUpperCase() || "?"}
//                   </span>
//                 </div>
//                 <h2 className="text-xl font-bold">{form.user?.name}</h2>
//                 <Badge variant="outline" className="capitalize mt-1">
//                   {typeof form.user?.user_type === "object"
//  ?form.user?.user_type?.name
//  : form.user?.user_type}
//                 </Badge>
//                 <div className="mt-2">
//                   {getStatusBadge(form.verification_status)}
//                 </div>
//               </div>

//               <Separator />

//               {/* Contact Details */}
//               <div className="space-y-4">
//                 <div className="flex items-start gap-3">
//                   <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">Email</p>
//                     <p className="text-sm text-muted-foreground break-all">
//                       {form.user?.email}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3">
//                   <UserIcon className="h-4 w-4 mt-1 text-muted-foreground" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">User ID</p>
//                     <p className="text-sm text-muted-foreground">
//                       #{form.user?.id}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <Separator />

//               {/* Timestamps */}
//               <div className="space-y-3">
//                 <div className="flex items-start gap-3">
//                   <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
//                   <div>
//                     <p className="text-sm font-medium">Uploaded At</p>
//                     <p className="text-sm text-muted-foreground">
//                       {formatDate(form.uploaded_at)}
//                     </p>
//                   </div>
//                 </div>

//                 {form.verified_at && (
//                   <div className="flex items-start gap-3">
//                     <CheckCircle2 className="h-4 w-4 mt-1 text-green-600" />
//                     <div>
//                       <p className="text-sm font-medium">Verified At</p>
//                       <p className="text-sm text-muted-foreground">
//                         {formatDate(form.verified_at)}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {form.verified_by && (
//                   <div className="flex items-start gap-3">
//                     <UserIcon className="h-4 w-4 mt-1 text-muted-foreground" />
//                     <div>
//                       <p className="text-sm font-medium">Verified By</p>
//                       <p className="text-sm text-muted-foreground">
//                         {form.verified_by}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Right: Document & Status Details */}
//           <div className="md:col-span-2 space-y-6">
//             {/* Document Card */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <FileText className="h-5 w-5 text-muted-foreground" />
//                   W9 Document
//                 </CardTitle>
//                 <CardDescription>
//                   Submitted document for verification
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {/* Document Info */}
//                 <div className="flex items-center justify-between bg-muted/40 rounded-lg p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
//                       <FileText className="h-5 w-5 text-red-600" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium">{form.document_name}</p>
//                       <p className="text-xs text-muted-foreground">PDF Document</p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => window.open(form.document_url, "_blank")}
//                     >
//                       <ExternalLink className="mr-2 h-4 w-4" />
//                       View
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => {
//                         const a = document.createElement("a");
//                         a.href = form.document_url;
//                         a.download = form.document_name;
//                         a.click();
//                       }}
//                     >
//                       <Download className="mr-2 h-4 w-4" />
//                       Download
//                     </Button>
//                   </div>
//                 </div>

//                 {/* PDF Preview */}
//                 <div className="rounded-lg overflow-hidden border bg-muted/20">
//                   <iframe
//                     src={form.document_url}
//                     className="w-full h-[500px]"
//                     title="W9 Document Preview"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Rejection Reason Card — only if rejected */}
//             {form.verification_status === "rejected" && form.rejection_reason && (
//               <Card className="border-red-200">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 text-red-600">
//                     <XCircle className="h-5 w-5" />
//                     Rejection Reason
//                   </CardTitle>
//                   <CardDescription>
//                     Reason provided when this form was rejected
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="bg-red-50 border border-red-100 rounded-lg p-4">
//                     <p className="text-sm leading-relaxed text-red-900 whitespace-pre-wrap">
//                       {form.rejection_reason}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Form Info */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Form Information</CardTitle>
//                 <CardDescription>System details</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div>
//                     <label className="text-sm font-medium text-muted-foreground">
//                       Form ID
//                     </label>
//                     <p className="text-sm mt-1">#{form.id}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-muted-foreground">
//                       Verification Status
//                     </label>
//                     <div className="mt-1">
//                       {getStatusBadge(form.verification_status)}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-muted-foreground">
//                       Uploaded At
//                     </label>
//                     <p className="text-sm mt-1">{formatDate(form.uploaded_at)}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-muted-foreground">
//                       Verified At
//                     </label>
//                     <p className="text-sm mt-1">
//                       {form.verified_at ? formatDate(form.verified_at) : "—"}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* Reject Modal */}
//       <Modal
//         isOpen={rejectModalOpen}
//         onClose={() => {
//           setRejectModalOpen(false);
//           rejectionFormik.resetForm();
//         }}
//         title="Reject W9 Form"
//         showFooter={false}
//         width="max-w-lg"
//       >
//         <form onSubmit={rejectionFormik.handleSubmit} className="space-y-4">
//           <p className="text-sm text-muted-foreground">
//             You are rejecting the W9 form submitted by{" "}
//             <strong className="text-foreground">{form?.user?.name}</strong>.
//             Please provide a reason so the user can resubmit correctly.
//           </p>

//           {/* Document preview */}
//           <div className="bg-muted/40 rounded-lg p-3 text-sm text-muted-foreground border-l-4 border-red-400">
//             <p className="font-medium text-xs mb-1 uppercase tracking-wide text-red-500">
//               Document
//             </p>
//             <div className="flex items-center gap-2">
//               <FileText size={14} />
//               <span className="truncate">{form?.document_name}</span>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="rejection_reason" className="text-sm font-medium">
//               Rejection Reason <span className="text-red-500">*</span>
//             </Label>
//             <Textarea
//               id="rejection_reason"
//               name="rejection_reason"
//               placeholder="Explain why this W9 form is being rejected... (minimum 10 characters)"
//               value={rejectionFormik.values.rejection_reason}
//               onChange={rejectionFormik.handleChange}
//               onBlur={rejectionFormik.handleBlur}
//               rows={4}
//               className={`resize-none ${
//                 rejectionFormik.touched.rejection_reason &&
//                 rejectionFormik.errors.rejection_reason
//                   ? "border-red-500 focus:ring-red-500"
//                   : ""
//               }`}
//             />
//             {rejectionFormik.touched.rejection_reason &&
//               rejectionFormik.errors.rejection_reason && (
//                 <p className="text-sm text-red-500">
//                   {rejectionFormik.errors.rejection_reason}
//                 </p>
//               )}
//             <p className="text-xs text-muted-foreground text-right">
//               {rejectionFormik.values.rejection_reason.length}/500 characters
//             </p>
//           </div>

//           <div className="flex gap-2 justify-end pt-1">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => {
//                 setRejectModalOpen(false);
//                 rejectionFormik.resetForm();
//               }}
//               disabled={rejectionFormik.isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="destructive"
//               disabled={rejectionFormik.isSubmitting}
//             >
//               {rejectionFormik.isSubmitting ? (
//                 <div className="flex items-center gap-2">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Rejecting...
//                 </div>
//               ) : (
//                 <>
//                   <ShieldX className="mr-2 h-4 w-4" />
//                   Reject Form
//                 </>
//               )}
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </>
//   );
// };

// export default W9Detail;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  User as UserIcon,
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  ShieldX,
  AlertCircle,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import makeApiRequest from "@/services/axios";
import { formatDate, notify } from "@/utils/utils";
import { useFormik } from "formik";
import * as Yup from "yup";

interface W9FormDetail {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    user_type: { id: number; name: string } | string;
  };
  document_name: string;
  verification_status: "pending" | "verified" | "rejected";
  rejection_reason: string | null;
  document_url: string;
  verified_at: string | null;
  verified_by: { id: number; name: string } | string | null;
  uploaded_at: string;
}

const rejectionValidationSchema = Yup.object({
  reason: Yup.string()
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must not exceed 500 characters")
    .required("Rejection reason is required"),
});

const W9Detail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<W9FormDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);

  // Formik for rejection reason
  const rejectionFormik = useFormik({
    initialValues: { reason: "" },
    validationSchema: rejectionValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await makeApiRequest(`/admin/w9-forms/${id}/reject`, {
          method: "PUT",
          data: { reason: values.reason },
        });

        notify({ message: "W9 form rejected successfully", type: "success" });

        setForm((prev) =>
          prev
            ? {
              ...prev,
              verification_status: "rejected",
              rejection_reason: values.reason,
            }
            : null
        );

        setRejectModalOpen(false);
        resetForm();
      } catch (error: any) {
        notify({
          message: error?.response?.data?.message || "Failed to reject W9 form",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchW9Detail = async (formId: string) => {
    try {
      setIsLoading(true);
      const response = await makeApiRequest(`/admin/w9-forms/${formId}`, {
        method: "GET",
      });
      setForm(response.data?.data || response.data);
    } catch (error) {
      console.error("Error fetching W9 form:", error);
      notify({ message: "Failed to fetch W9 form details", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await makeApiRequest(`/admin/w9-forms/${id}/approve`, {
        method: "PUT",
      });

      notify({ message: "W9 form approved successfully", type: "success" });

      setForm((prev) =>
        prev
          ? {
            ...prev,
            verification_status: "verified",
            verified_at: new Date().toISOString(),
          }
          : null
      );

      setApproveConfirmOpen(false);
    } catch (error: any) {
      notify({
        message: error?.response?.data?.message || "Failed to approve W9 form",
        type: "error",
      });
    } finally {
      setIsApproving(false);
    }
  };

  useEffect(() => {
    if (id) fetchW9Detail(id);
  }, [id]);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { className: string; icon: any }> = {
      verified: {
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

    const s = config[status] || config.pending;
    const Icon = s.icon;

    return (
      <Badge className={s.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // ─── Not found ────────────────────────────────────────────────────────────────
  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground mb-4">W9 form not found</p>
        <Button onClick={() => navigate("/dashboard/w9-forms")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to W9 Forms
        </Button>
      </div>
    );
  }

  const isPending = form.verification_status === "pending";

  // ─── Main ─────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                W9 Form Details
              </h1>
              <p className="text-muted-foreground">
                View and verify W9 form #{form.id}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {isPending && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => setRejectModalOpen(true)}
              >
                <ShieldX className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-600"
                onClick={() => setApproveConfirmOpen(true)}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left: User Info Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>User Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar + Name */}
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">
                    {form.user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "?"}
                  </span>
                </div>
                <h2 className="text-xl font-bold">{form.user?.name}</h2>
                 <Badge variant="outline" className="capitalize mt-1">
                   {(() => {
                     const type = typeof form.user?.user_type === "object"
                       ? form.user?.user_type?.name
                       : form.user?.user_type;
                     if (type?.toLowerCase() === 'provider') return 'Worker';
                     if (type?.toLowerCase() === 'client') return 'Employer';
                     return type;
                   })()}
                 </Badge>
                <div className="mt-2">
                  {getStatusBadge(form.verification_status)}
                </div>
              </div>

              <Separator />

              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground break-all">
                      {form.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UserIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">User ID</p>
                    <p className="text-sm text-muted-foreground">
                      #{form.user?.id}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timestamps */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Uploaded At</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(form.uploaded_at)}
                    </p>
                  </div>
                </div>

                {form.verified_at && (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 mt-1 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Verified At</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(form.verified_at)}
                      </p>
                    </div>
                  </div>
                )}

                {form.verified_by && (
                  <div className="flex items-start gap-3">
                    <UserIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Verified By</p>
                      <p className="text-sm text-muted-foreground">
                        {typeof form.verified_by === "object"
                          ? form.verified_by?.name
                          : form.verified_by}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right: Document & Status Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Document Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  W9 Document
                </CardTitle>
                <CardDescription>
                  Submitted document for verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Document Info */}
                <div className="flex items-center justify-between bg-muted/40 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{form.document_name}</p>
                      <p className="text-xs text-muted-foreground">PDF Document</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(form.document_url, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = form.document_url;
                        a.download = form.document_name;
                        a.click();
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* PDF Preview */}
                <div className="rounded-lg overflow-hidden border bg-muted/20">
                  <iframe
                    src={form.document_url}
                    className="w-full h-[500px]"
                    title="W9 Document Preview"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Rejection Reason Card — only if rejected */}
            {form.verification_status === "rejected" && form.rejection_reason && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    Rejection Reason
                  </CardTitle>
                  <CardDescription>
                    Reason provided when this form was rejected
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <p className="text-sm leading-relaxed text-red-900 whitespace-pre-wrap">
                      {form.rejection_reason}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Info */}
            <Card>
              <CardHeader>
                <CardTitle>Form Information</CardTitle>
                <CardDescription>System details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Form ID
                    </label>
                    <p className="text-sm mt-1">#{form.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Verification Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(form.verification_status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Uploaded At
                    </label>
                    <p className="text-sm mt-1">{formatDate(form.uploaded_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Verified At
                    </label>
                    <p className="text-sm mt-1">
                      {form.verified_at ? formatDate(form.verified_at) : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={approveConfirmOpen}
        onClose={() => setApproveConfirmOpen(false)}
        title="Approve W9 Form"
        showFooter={false}
        width="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-lg p-4">
            <AlertCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">
                Are you sure you want to approve this W9 form?
              </p>
              <p className="text-sm text-green-700 mt-1">
                This will mark the W9 form submitted by{" "}
                <strong>{form?.user?.name}</strong> as verified.
              </p>
            </div>
          </div>

          {/* Document preview */}
          <div className="bg-muted/40 rounded-lg p-3 text-sm text-muted-foreground border-l-4 border-green-400">
            <p className="font-medium text-xs mb-1 uppercase tracking-wide text-green-600">
              Document
            </p>
            <div className="flex items-center gap-2">
              <FileText size={14} />
              <span className="truncate">{form?.document_name}</span>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setApproveConfirmOpen(false)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-gradient-to-r from-green-500 to-emerald-600"
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Approving...
                </div>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Yes, Approve
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          rejectionFormik.resetForm();
        }}
        title="Reject W9 Form"
        showFooter={false}
        width="max-w-lg"
      >
        <form onSubmit={rejectionFormik.handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You are rejecting the W9 form submitted by{" "}
            <strong className="text-foreground">{form?.user?.name}</strong>.
            Please provide a reason so the user can resubmit correctly.
          </p>

          {/* Document preview */}
          <div className="bg-muted/40 rounded-lg p-3 text-sm text-muted-foreground border-l-4 border-red-400">
            <p className="font-medium text-xs mb-1 uppercase tracking-wide text-red-500">
              Document
            </p>
            <div className="flex items-center gap-2">
              <FileText size={14} />
              <span className="truncate">{form?.document_name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Rejection Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="Explain why this W9 form is being rejected... (minimum 10 characters)"
              value={rejectionFormik.values.reason}
              onChange={rejectionFormik.handleChange}
              onBlur={rejectionFormik.handleBlur}
              rows={4}
              className={`resize-none ${rejectionFormik.touched.reason &&
                rejectionFormik.errors.reason
                ? "border-red-500 focus:ring-red-500"
                : ""
                }`}
            />
            {rejectionFormik.touched.reason &&
              rejectionFormik.errors.reason && (
                <p className="text-sm text-red-500">
                  {rejectionFormik.errors.reason}
                </p>
              )}
            <p className="text-xs text-muted-foreground text-right">
              {rejectionFormik.values.reason.length}/500 characters
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRejectModalOpen(false);
                rejectionFormik.resetForm();
              }}
              disabled={rejectionFormik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={rejectionFormik.isSubmitting}
            >
              {rejectionFormik.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Rejecting...
                </div>
              ) : (
                <>
                  <ShieldX className="mr-2 h-4 w-4" />
                  Reject Form
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default W9Detail;