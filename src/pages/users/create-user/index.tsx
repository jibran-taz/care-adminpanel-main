import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Eye,
  EyeOff,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
const createUserValidationSchema = Yup.object({
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
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
      "Password must contain uppercase, lowercase, number and special character"
    )
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
  user_type: Yup.string()
    .oneOf(["client", "provider"], "Invalid user type")
    .required("User type is required"),
  city: Yup.string()
    .min(2, "City must be at least 2 characters")
    .required("City is required"),
  state: Yup.string()
    .min(2, "State must be at least 2 characters")
    .required("State is required"),
  country: Yup.string()
    .min(2, "Country must be at least 2 characters")
    .required("Country is required"),
  zip_code: Yup.string()
    .min(5, "Zip code must be at least 5 characters")
    .required("Zip code is required"),
});

const CreateUser = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Formik
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      user_type: "",
      city: "",
      state: "",
      country: "",
      zip_code: "",
    },
    validationSchema: createUserValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log("Creating user:", values);

        const response = await makeApiRequest(apiUrl.users, {
          method: "POST",
          data: values,
        });

        console.log("User created:", response);

        notify({
          message: "User created successfully",
          type: "success",
        });

        resetForm();
        navigate("/dashboard/users");
      } catch (error) {
        console.error("Error creating user:", error);
        notify({
          message: error?.response?.data?.message || "Failed to create user",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

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
            <h1 className="text-3xl font-bold tracking-tight">Create New User</h1>
            <p className="text-muted-foreground">
              Add a new user to the system
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={formik.handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Personal Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Enter the user's basic details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="first_name"
                      name="first_name"
                      placeholder="Enter first name"
                      className="pl-10"
                      value={formik.values.first_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.first_name && formik.errors.first_name && (
                    <p className="text-sm text-red-500">
                      {formik.errors.first_name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="last_name"
                      name="last_name"
                      placeholder="Enter last name"
                      className="pl-10"
                      value={formik.values.last_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.last_name && formik.errors.last_name && (
                    <p className="text-sm text-red-500">
                      {formik.errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    className="pl-10"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-red-500">{formik.errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1234567890"
                    className="pl-10"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-sm text-red-500">{formik.errors.phone}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Format: +1234567890 (with country code)
                </p>
              </div>

              {/* Password Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="pl-10 pr-10"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-sm text-red-500">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className="pl-10 pr-10"
                      value={formik.values.password_confirmation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formik.touched.password_confirmation &&
                    formik.errors.password_confirmation && (
                      <p className="text-sm text-red-500">
                        {formik.errors.password_confirmation}
                      </p>
                    )}
                </div>
              </div>

              {/* Password Requirements */}
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium mb-2">Password Requirements:</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>At least 8 characters long</li>
                  <li>Contains uppercase letter (A-Z)</li>
                  <li>Contains lowercase letter (a-z)</li>
                  <li>Contains number (0-9)</li>
                  <li>Contains special character (@$!%*?&#)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Type & Location */}
          <div className="space-y-6">
            {/* User Type */}
            <Card>
              <CardHeader>
                <CardTitle>User Type</CardTitle>
                <CardDescription>Select the user role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="user_type">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formik.values.user_type}
                  onValueChange={(value) =>
                    formik.setFieldValue("user_type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>User Types</SelectLabel>
                      <SelectItem value="client">Employer</SelectItem>
                      <SelectItem value="provider">Worker</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formik.touched.user_type && formik.errors.user_type && (
                  <p className="text-sm text-red-500">
                    {formik.errors.user_type}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location Information</CardTitle>
                <CardDescription>User's address details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="city"
                      name="city"
                      placeholder="Enter city"
                      className="pl-10"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.city && formik.errors.city && (
                    <p className="text-sm text-red-500">{formik.errors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">
                    State <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="state"
                      name="state"
                      placeholder="Enter state"
                      className="pl-10"
                      value={formik.values.state}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.state && formik.errors.state && (
                    <p className="text-sm text-red-500">{formik.errors.state}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="country"
                      name="country"
                      placeholder="Enter country"
                      className="pl-10"
                      value={formik.values.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.country && formik.errors.country && (
                    <p className="text-sm text-red-500">
                      {formik.errors.country}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip_code">
                    Zip Code <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="zip_code"
                      name="zip_code"
                      placeholder="Enter zip code"
                      className="pl-10"
                      value={formik.values.zip_code}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.zip_code && formik.errors.zip_code && (
                    <p className="text-sm text-red-500">{formik.errors.zip_code}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/users")}
            disabled={formik.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-emerald-600"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating User...
              </>
            ) : (
              <>
                <User className="mr-2 h-4 w-4" />
                Create User
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;