import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Clock,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Edit,
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
import { apiUrl } from "@/services/api-end-point";
import { formatDate, notify } from "@/utils/utils";
import ToggleSwitch from "@/components/ui/toggle-switch";
import { Modal } from "@/components/ui/modal";
import { useFormik } from "formik";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import * as Yup from "yup";
interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  business_name?: string;
  facility_type?: string;
  desired_role?: string;
  profile_completion_percentage?: number;
  email: string;
  phone: string;
  user_type: string;
  profile_photo: string | null;
  bio: string | null;
  address: string | null;
  city: string;
  state: string;
  country: string;
  zip_code: string | null;
  latitude: string | null;
  longitude: string | null;
  status: string;
  is_verified: boolean;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
}

const suspendValidationSchema = Yup.object({
  reason: Yup.string()
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must not exceed 500 characters")
    .required("Suspension reason is required"),
});


const ViewUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<{ modalOne: boolean }>({
    modalOne: false,
  });

  // Formik for Suspend User
  const suspendFormik = useFormik({
    initialValues: {
      reason: "",
    },
    validationSchema: suspendValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log("Suspending user with reason:", values.reason);

        // API call to suspend user
        await makeApiRequest(`/admin/users/${id}/suspend`, {
          method: "PUT",
          data: {
            reason: values.reason,
            status: "suspended",
          },
        });

        notify({
          message: "User suspended successfully",
          type: "success",
        });

        // Update local state
        setUser((prev) =>
          prev ? { ...prev, status: "suspended" } : null
        );

        // Close modal and reset form
        setIsModalOpen({ ...isModalOpen, modalOne: false });
        resetForm();
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

  useEffect(() => {
    if (id) {
      fetchUserDetails(id);
    }
  }, [id]);

  const fetchUserDetails = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await makeApiRequest(`${apiUrl.users}/${userId}`, {
        method: "GET",
      });

      console.log("User Details:", response);

      setUser(response.data.user);
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error("Error fetching user details:", error);
      notify({ message: "Failed to fetch user details", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyToggle = async (currentStatus: boolean) => {
    if (!user) return;

    try {
      setIsVerifying(true);
      await makeApiRequest(`/admin/users/${user.id}/verify`, {
        method: "PUT",
        data: {
          is_verified: !currentStatus,
        },
      });

      setUser((prev) =>
        prev ? { ...prev, is_verified: !currentStatus } : null
      );

      notify({
        message: `User ${!currentStatus ? "verified" : "unverified"
          } successfully`,
        type: "success",
      });
    } catch (error) {
      console.error("Error updating verification:", error);
      notify({
        message:
          error?.response?.data?.message || "Failed to update verification",
        type: "error",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: CheckCircle2,
      },
      pending_verification: {
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: Clock,
      },
      suspended: {
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        icon: XCircle,
      },
    };

    const statusConfig =
      config[status as keyof typeof config] || config.pending_verification;
    const Icon = statusConfig.icon;

    return (
      <Badge className={statusConfig.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace("_", " ")}
      </Badge>
    );
  };
  const handleModalClose = () => {
    setIsModalOpen({ ...isModalOpen, modalOne: false });
    suspendFormik.resetForm();
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground mb-4">User not found</p>
        <Button onClick={() => navigate("/dashboard/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
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
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                User Details
              </h1>
              <p className="text-muted-foreground">
                View and manage user information
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen({ ...isModalOpen, modalOne: true })}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Suspend User
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={user.profile_photo || undefined} />
                  <AvatarFallback className="text-3xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    {user.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user.full_name}</h2>
                {user.business_name && (
                  <p className="text-sm font-semibold text-blue-600 italic">{user.business_name}</p>
                )}
                {user.profile_completion_percentage !== undefined && (
                  <div className="w-full mt-4 px-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Profile Strength</span>
                      <span>{user.profile_completion_percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${user.profile_completion_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <Badge variant="outline" className="mt-4 capitalize">
                  {user.user_type === "provider" ? "Worker" : user.user_type === "client" ? "Employer" : user.user_type}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  {getStatusBadge(user.status)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Verified</span>
                  <ToggleSwitch
                    enabled={user.is_verified}
                    onChange={() => handleVerifyToggle(user.is_verified)}
                    disabled={isVerifying}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      {user.email_verified_at && (
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified on {formatDate(user.email_verified_at)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {user.phone}
                      </p>
                      {user.phone_verified_at && (
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified on {formatDate(user.phone_verified_at)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {[user.city, user.state, user.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Cards */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>User's personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      First Name
                    </label>
                    <p className="text-sm mt-1">{user.first_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Name
                    </label>
                    <p className="text-sm mt-1">{user.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      User Type
                    </label>
                    <p className="text-sm mt-1 capitalize">{user.user_type === "provider" ? "Worker" : user.user_type === "client" ? "Employer" : user.user_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      User ID
                    </label>
                    <p className="text-sm mt-1">#{user.id}</p>
                  </div>
                  {user.business_name && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Business Name
                      </label>
                      <p className="text-sm mt-1">{user.business_name}</p>
                    </div>
                  )}
                  {user.facility_type && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Facility Type
                      </label>
                      <p className="text-sm mt-1 capitalize">{user.facility_type}</p>
                    </div>
                  )}
                  {user.desired_role && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Desired Role / Profession
                      </label>
                      <p className="text-sm mt-1 capitalize">{user.desired_role}</p>
                    </div>
                  )}
                </div>

                {user.bio && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Bio
                      </label>
                      <p className="text-sm mt-1">{user.bio}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>User's location details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {user.address && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Address
                      </label>
                      <p className="text-sm mt-1">{user.address}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      City
                    </label>
                    <p className="text-sm mt-1">{user.city || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      State
                    </label>
                    <p className="text-sm mt-1">{user.state || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Country
                    </label>
                    <p className="text-sm mt-1">{user.country || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Zip Code
                    </label>
                    <p className="text-sm mt-1">{user.zip_code || "N/A"}</p>
                  </div>
                  {(user.latitude || user.longitude) && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Latitude
                        </label>
                        <p className="text-sm mt-1">{user.latitude || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Longitude
                        </label>
                        <p className="text-sm mt-1">
                          {user.longitude || "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Account Activity</CardTitle>
                <CardDescription>
                  Timestamps and account history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Account Created</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(user.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(user.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Last Active</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(user.last_active_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  {documents.length > 0
                    ? `${documents.length} document(s) uploaded`
                    : "No documents uploaded yet"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.type}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No documents available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen?.modalOne}
        onClose={handleModalClose}
        title="Suspend User"
        showFooter={false}
        width="max-w-2xl"
      >
        <form onSubmit={suspendFormik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to suspend <strong>{user?.full_name}</strong>?
              Suspending a user will restrict their access to the platform and they will not be able to
              log in until reactivated.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for Suspension <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="Enter detailed reason for suspension (minimum 10 characters)"
              value={suspendFormik.values.reason}
              onChange={suspendFormik.handleChange}
              onBlur={suspendFormik.handleBlur}
              rows={4}
              className={`resize-none ${suspendFormik.touched.reason && suspendFormik.errors.reason
                ? "border-red-500 focus:ring-red-500"
                : ""
                }`}
            />
            {suspendFormik.touched.reason && suspendFormik.errors.reason && (
              <p className="text-sm text-red-500 mt-1">
                {suspendFormik.errors.reason}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {suspendFormik.values.reason.length}/500 characters
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleModalClose}
              disabled={suspendFormik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={suspendFormik.isSubmitting}
            >
              {suspendFormik.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Suspending...
                </div>
              ) : (
                "Suspend User"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ViewUser;
