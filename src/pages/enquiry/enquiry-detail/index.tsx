import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  User as UserIcon,
  Send,
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

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  admin_response: string | null;
  responded_by: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
  responder: null | {
    id: number;
    full_name: string;
    email: string;
  };
}

const responseValidationSchema = Yup.object({
  admin_response: Yup.string()
    .min(10, "Response must be at least 10 characters")
    .max(1000, "Response must not exceed 1000 characters")
    .required("Response is required"),
});

const EnquiryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formik for respond
  const responseFormik = useFormik({
    initialValues: { admin_response: "" },
    validationSchema: responseValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await makeApiRequest(`/admin/inquiries/${id}/reply`, {
          method: "POST",
          data: {
            response: values.admin_response,
          },
        });

        notify({ message: "Response sent successfully", type: "success" });

        setEnquiry((prev) =>
          prev
            ? {
                ...prev,
                admin_response: values.admin_response,
                status: "resolved",
                responded_at: new Date().toISOString(),
              }
            : null
        );

        setIsModalOpen(false);
        resetForm();
      } catch (error: any) {
        notify({
          message: error?.response?.data?.message || "Failed to send response",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchEnquiryDetails = async (enquiryId: string) => {
    try {
      setIsLoading(true);
      const response = await makeApiRequest(`/admin/inquiries/${enquiryId}`, {
        method: "GET",
      });
      setEnquiry(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching enquiry:", error);
      notify({ message: "Failed to fetch enquiry details", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEnquiryDetails(id);
  }, [id]);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { className: string; icon: any }> = {
      resolved: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: CheckCircle2,
      },
      pending: {
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: Clock,
      },
      closed: {
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

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ─── Not found ───────────────────────────────────────────────────────────────
  if (!enquiry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground mb-4">Enquiry not found</p>
        <Button onClick={() => navigate("/dashboard/enquiries")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Enquiries
        </Button>
      </div>
    );
  }

  // ─── Main ────────────────────────────────────────────────────────────────────
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
                Enquiry Details
              </h1>
              <p className="text-muted-foreground">
                View and respond to enquiry #{enquiry.id}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {enquiry.status === "pending" && (
              <Button
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-600"
                onClick={() => setIsModalOpen(true)}
              >
                <Send className="mr-2 h-4 w-4" />
                Respond
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left: Contact Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar + Name */}
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">
                    {enquiry.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "?"}
                  </span>
                </div>
                <h2 className="text-xl font-bold">{enquiry.name}</h2>
                <div className="mt-2">{getStatusBadge(enquiry.status)}</div>
              </div>

              <Separator />

              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground break-all">
                      {enquiry.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {enquiry.phone || "N/A"}
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
                    <p className="text-sm font-medium">Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(enquiry.created_at)}
                    </p>
                  </div>
                </div>

                {enquiry.responded_at && (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 mt-1 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Responded At</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(enquiry.responded_at)}
                      </p>
                    </div>
                  </div>
                )}

                {enquiry.responder && (
                  <div className="flex items-start gap-3">
                    <UserIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Responded By</p>
                      <p className="text-sm text-muted-foreground">
                        {enquiry.responder.full_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right: Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Enquiry Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  Enquiry Message
                </CardTitle>
                <CardDescription>
                  Message submitted by {enquiry.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/40 rounded-lg p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {enquiry.message}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Admin Response */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5 text-muted-foreground" />
                      Admin Response
                    </CardTitle>
                    <CardDescription>
                      {enquiry.admin_response
                        ? "Response sent to the user"
                        : "No response sent yet"}
                    </CardDescription>
                  </div>
                  {enquiry.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Respond
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {enquiry.admin_response ? (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-green-900">
                      {enquiry.admin_response}
                    </p>
                    {enquiry.responded_at && (
                      <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Sent on {formatDate(enquiry.responded_at)}
                        {enquiry.responded_by && ` by ${enquiry.responded_by}`}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare
                      size={40}
                      className="mx-auto opacity-25 mb-3"
                    />
                    <p className="text-sm">No response has been sent yet.</p>
                    {enquiry.status === "pending" && (
                      <Button
                        size="sm"
                        className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Response
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enquiry Info */}
            <Card>
              <CardHeader>
                <CardTitle>Enquiry Information</CardTitle>
                <CardDescription>System details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Enquiry ID
                    </label>
                    <p className="text-sm mt-1">#{enquiry.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="mt-1">{getStatusBadge(enquiry.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created At
                    </label>
                    <p className="text-sm mt-1">
                      {formatDate(enquiry.created_at)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </label>
                    <p className="text-sm mt-1">
                      {formatDate(enquiry.updated_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Respond Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          responseFormik.resetForm();
        }}
        title="Respond to Enquiry"
        showFooter={false}
        width="max-w-2xl"
      >
        <form onSubmit={responseFormik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              You are responding to{" "}
              <strong>{enquiry?.name}</strong>'s enquiry. This response will
              mark the enquiry as{" "}
              <span className="text-green-600 font-medium">resolved</span>.
            </p>
          </div>

          {/* Original message preview */}
          <div className="bg-muted/40 rounded-lg p-3 text-sm text-muted-foreground border-l-4 border-primary">
            <p className="font-medium text-xs mb-1 uppercase tracking-wide">
              Original Message
            </p>
            <p className="line-clamp-3">{enquiry?.message}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin_response" className="text-sm font-medium">
              Your Response <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="admin_response"
              name="admin_response"
              placeholder="Write your response here... (minimum 10 characters)"
              value={responseFormik.values.admin_response}
              onChange={responseFormik.handleChange}
              onBlur={responseFormik.handleBlur}
              rows={5}
              className={`resize-none ${
                responseFormik.touched.admin_response &&
                responseFormik.errors.admin_response
                  ? "border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
            {responseFormik.touched.admin_response &&
              responseFormik.errors.admin_response && (
                <p className="text-sm text-red-500">
                  {responseFormik.errors.admin_response}
                </p>
              )}
            <p className="text-xs text-muted-foreground text-right">
              {responseFormik.values.admin_response.length}/1000 characters
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                responseFormik.resetForm();
              }}
              disabled={responseFormik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-600"
              disabled={responseFormik.isSubmitting}
            >
              {responseFormik.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </div>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Response
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EnquiryDetails;