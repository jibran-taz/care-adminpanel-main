import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Loader2,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import makeApiRequest from "@/services/axios";
import { apiUrl } from "@/services/api-end-point";
import { notify } from "@/utils/utils";

// Validation Schema
const editUserValidationSchema = Yup.object({
  first_name: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string().nullable(),
  user_type: Yup.string()
    .oneOf(["client", "provider", "admin"], "Invalid user type")
    .required("User type is required"),
  status: Yup.string().required("Status is required"),
  city: Yup.string().nullable(),
  state: Yup.string().nullable(),
  country: Yup.string().nullable(),
  zip_code: Yup.string().nullable(),
  address: Yup.string().nullable(),
  bio: Yup.string().nullable(),
  desired_role: Yup.string().nullable(),
});

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      user_type: "client",
      status: "active",
      desired_role: "",
      city: "",
      state: "",
      country: "",
      zip_code: "",
      address: "",
      bio: "",
    },
    validationSchema: editUserValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await makeApiRequest(`${apiUrl.users}/${id}`, {
          method: "PUT",
          data: values,
        });

        notify({
          message: "User updated successfully",
          type: "success",
        });

        navigate("/dashboard/users");
      } catch (error: any) {
        notify({
          message: error?.response?.data?.message || "Failed to update user",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await makeApiRequest(`${apiUrl.users}/${id}`, {
          method: "GET",
        });

        const user = response.data?.user || response.data;
        if (user) {
          formik.setValues({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            phone: user.phone || "",
            user_type: user.user_type || "client",
            status: user.status || "active",
            desired_role: user.desired_role || "",
            city: user.city || "",
            state: user.state || "",
            country: user.country || "",
            zip_code: user.zip_code || "",
            address: user.address || "",
            bio: user.bio || "",
          });
        }
      } catch (error: any) {
        notify({
          message: error?.response?.data?.message || "Failed to load user details",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard/users")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
            <p className="text-muted-foreground">
              Update user details and status
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Personal details and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="first_name">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter first name"
                  />
                  {formik.touched.first_name && formik.errors.first_name && (
                    <p className="text-sm text-red-500">{formik.errors.first_name}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="last_name">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter last name"
                  />
                  {formik.touched.last_name && formik.errors.last_name && (
                    <p className="text-sm text-red-500">{formik.errors.last_name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="pl-9"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="user@example.com"
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-sm text-red-500">{formik.errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      className="pl-9"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="+1234567890"
                    />
                  </div>
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-sm text-red-500">{formik.errors.phone}</p>
                  )}
                </div>

                {/* User Type */}
                <div className="space-y-2">
                  <Label htmlFor="user_type">
                    User Role <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formik.values.user_type}
                    onValueChange={(val) => formik.setFieldValue("user_type", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value="client">Employer (Client)</SelectItem>
                        <SelectItem value="provider">Worker (Provider)</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Account Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formik.values.status}
                    onValueChange={(val) => formik.setFieldValue("status", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending_verification">Pending Verification</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Desired Role */}
                {formik.values.user_type === "provider" && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="desired_role">Desired Role / Title</Label>
                    <Select
                      value={formik.values.desired_role}
                      onValueChange={(val) => formik.setFieldValue("desired_role", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select worker desired role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Desired Role</SelectLabel>
                          <SelectItem value="nurse">Nurse</SelectItem>
                          <SelectItem value="cna">CNA</SelectItem>
                          <SelectItem value="caregiver">Caregiver</SelectItem>
                          <SelectItem value="lpn">LPN</SelectItem>
                          <SelectItem value="rn">RN</SelectItem>
                          <SelectItem value="med_tech">Med Tech</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter street address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="State"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip_code">Zip Code</Label>
                  <Input
                    id="zip_code"
                    name="zip_code"
                    value={formik.values.zip_code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Zip code"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Country"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio / Notes</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="User biography or internal notes..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/users")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-gradient-to-r from-green-500 to-emerald-600"
            >
              {formik.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating User...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

