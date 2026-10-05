import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import makeApiRequest from "@/services/axios";
import { apiUrl } from "@/services/api-end-point";
import { useAuth } from "@/context/auth";
import { notify } from "@/utils/utils";

// Validation Schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Authlogin = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("🔐 Attempting login...");

        const res = await makeApiRequest(apiUrl.login, {
          method: "POST",
          data: values,
        });

        console.log("📥 Login Response:", res);

        // Extract token and user
        const token =
          res?.token ||
          res?.data?.token ||
          res?.access_token ||
          res?.data?.access_token;

        const user = res?.user || res?.data?.user;

        console.log("🔑 Extracted token:", token);
        console.log("👤 Extracted user:", user);

        if (token && user) {
          // Call login function from context
          login(user, token);

          // Show success message
          notify({ message: "Login Successful", type: 'success' });

          console.log("✅ About to navigate to dashboard");

          // Small delay to ensure state is updated
          setTimeout(() => {
            navigate("/dashboard");
          }, 100);
        } else {
          console.error("❌ Token or user missing in response");
          throw new Error("Invalid response: Token or user data missing");
        }
      } catch (error: unknown) {
        console.error("❌ Login failed:", error);

        let errorMessage = "Login failed. Please try again.";

        if (error && typeof error === 'object' && 'response' in error) {
          const response = error.response as { data?: { message?: string } };
          errorMessage = response.data?.message || errorMessage;
        }

        notify({
          message: errorMessage,
          type: 'error'
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quality Temp Service Agency
          </h1>
          <p className="text-gray-600">Admin Dashboard Login</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${formik.touched.email && formik.errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                    }`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`pl-11 pr-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${formik.touched.password && formik.errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {formik.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Authlogin;