import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  DollarSign,
  Users,
  Settings,
  CreditCard,
  Loader2,
  TrendingUp,
  Calendar,
  Star,
  BarChart,
  Code,
  Headphones,
  Sparkles,
  AlertTriangle,
  Lock,
  Edit,
  Info,
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
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import makeApiRequest from "@/services/axios";
import { apiUrl } from "@/services/api-end-point";
import { notify } from "@/utils/utils";

// Validation Schema - Only editable fields
const editPlanValidationSchema = Yup.object({
  price: Yup.number()
    .min(0, "Price must be at least 0")
    .required("Monthly price is required"),
  yearly_price: Yup.number()
    .min(0, "Yearly price must be at least 0")
    .required("Yearly price is required"),
  max_bookings_per_month: Yup.number()
    .min(1, "Must allow at least 1 booking per month")
    .required("Max bookings per month is required"),
  trial_days: Yup.number()
    .min(0, "Trial days cannot be negative")
    .required("Trial days is required"),
});

const EditPlanSubscription = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState(null);

  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
      description: "",
      price: "",
      yearly_price: "",
      max_listings: "",
      max_bookings_per_month: "",
      max_featured_listings: "",
      featured_listings_allowed: false,
      priority_support: false,
      analytics_access: false,
      api_access: false,
      trial_days: "",
      stripe_plan_id: "",
      stripe_yearly_plan_id: "",
    },
    validationSchema: editPlanValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("Updating subscription plan:", values);

        // Only send editable fields
        const updateData = {
          price: parseFloat(values.price),
          yearly_price: parseFloat(values.yearly_price),
          max_bookings_per_month: parseInt(values.max_bookings_per_month),
          trial_days: parseInt(values.trial_days),
        };

        const response = await makeApiRequest(
          `${apiUrl.subscriptions.Editplans}/${id}`,
          {
            method: "PUT", // or "PATCH" depending on your API
            data: updateData,
          }
        );

        console.log("Plan updated successfully:", response);

        notify({
          message: "Subscription plan updated successfully! 🎉",
          type: "success",
        });

        // Navigate back to plans list
        // navigate("/admin/subscriptions/plans");
      } catch (error) {
        console.error("Error updating plan:", error);
        notify({
          message:
            error?.response?.data?.message ||
            "Failed to update subscription plan",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Fetch plan data
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setLoading(true);

        const response = await makeApiRequest(
          `${apiUrl.subscriptions.getIDByPlan}/${id}`,
          {
            method: "GET",
          }
        );

        console.log("Plan data fetched:", response);

        const plan = response.data || response;
        setPlanData(plan);

        // Set all form values
        formik.setValues({
          name: plan.name || "",
          slug: plan.slug || "",
          description: plan.description || "",
          price: plan.price || "",
          yearly_price: plan.yearly_price || "",
          max_listings: plan.limits?.max_listings || plan.max_listings || "",
          max_bookings_per_month:
            plan.limits?.max_bookings_per_month ||
            plan.max_bookings_per_month ||
            "",
          max_featured_listings:
            plan.limits?.max_featured_listings ||
            plan.max_featured_listings ||
            "",
          featured_listings_allowed:
            plan.features?.featured_listings_allowed ||
            plan.featured_listings_allowed ||
            false,
          priority_support:
            plan.features?.priority_support || plan.priority_support || false,
          analytics_access:
            plan.features?.analytics_access || plan.analytics_access || false,
          api_access: plan.features?.api_access || plan.api_access || false,
          trial_days: plan.trial_days || "",
          stripe_plan_id: plan.stripe_plan_id || "",
          stripe_yearly_plan_id: plan.stripe_yearly_plan_id || "",
        });
      } catch (error) {
        console.error("Error fetching plan:", error);
        notify({
          message: "Failed to load plan data",
          type: "error",
        });
        // navigate("/admin/subscriptions/plans");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlanData();
    }
  }, [id]);

  // Calculate yearly savings
  const calculateSavings = () => {
    const monthly = parseFloat(formik.values.price) || 0;
    const yearly = parseFloat(formik.values.yearly_price) || 0;

    if (monthly > 0 && yearly > 0) {
      const totalMonthly = monthly * 12;
      const savings = totalMonthly - yearly;
      const percentage = ((savings / totalMonthly) * 100).toFixed(0);

      return {
        amount: savings.toFixed(2),
        percentage,
        show: savings > 0,
      };
    }

    return { amount: "0.00", percentage: "0", show: false };
  };

  const savings = calculateSavings();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto" />
            <p className="text-lg text-gray-600">Loading plan data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                    Edit Subscription Plan
                  </h1>
                  <p className="text-muted-foreground">
                    Update pricing and booking limits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Alert */}
        <Alert className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-900 dark:text-amber-100 font-semibold">
            Limited Edit Access
          </AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            You can only edit the following fields:{" "}
            <span className="font-semibold">
              Monthly Price, Yearly Price, Max Bookings per Month, and Trial
              Days
            </span>
            . All other fields are locked for data integrity.
          </AlertDescription>
        </Alert>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Plan Details & Pricing */}
            <div className="lg:col-span-2 space-y-6">
              {/* Plan Details - DISABLED */}
              <Card className="border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-500">
                    <Lock className="h-5 w-5" />
                    Plan Details (Locked)
                  </CardTitle>
                  <CardDescription>
                    These fields cannot be modified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 opacity-60">
                  {/* Name & Slug */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-semibold flex items-center gap-1"
                      >
                        <Lock className="h-3 w-3" />
                        Plan Name
                      </Label>
                      <div className="relative">
                        <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          className="pl-10 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                          value={formik.values.name}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="slug"
                        className="text-sm font-semibold flex items-center gap-1"
                      >
                        <Lock className="h-3 w-3" />
                        Slug
                      </Label>
                      <Input
                        id="slug"
                        name="slug"
                        className="cursor-not-allowed bg-gray-100 dark:bg-gray-800 font-mono text-sm"
                        value={formik.values.slug}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-semibold flex items-center gap-1"
                    >
                      <Lock className="h-3 w-3" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="cursor-not-allowed bg-gray-100 dark:bg-gray-800 resize-none"
                      value={formik.values.description}
                      disabled
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing - EDITABLE */}
              <Card className="border-2 border-green-500 dark:border-green-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Edit className="h-5 w-5" />
                    Pricing (Editable)
                  </CardTitle>
                  <CardDescription>
                    Update monthly and yearly pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="price"
                        className="text-sm font-semibold flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3 text-green-600" />
                        Monthly Price ($) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="49.99"
                          className="pl-10 focus:ring-2 focus:ring-green-500 border-green-300"
                          value={formik.values.price}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {formik.touched.price && formik.errors.price && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span className="text-xs">⚠️</span>
                          {formik.errors.price}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="yearly_price"
                        className="text-sm font-semibold flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3 text-green-600" />
                        Yearly Price ($) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="yearly_price"
                          name="yearly_price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="499.99"
                          className="pl-10 focus:ring-2 focus:ring-green-500 border-green-300"
                          value={formik.values.yearly_price}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {formik.touched.yearly_price &&
                        formik.errors.yearly_price && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <span className="text-xs">⚠️</span>
                            {formik.errors.yearly_price}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="trial_days"
                        className="text-sm font-semibold flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3 text-green-600" />
                        Trial Days <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="trial_days"
                          name="trial_days"
                          type="number"
                          min="0"
                          placeholder="14"
                          className="pl-10 focus:ring-2 focus:ring-green-500 border-green-300"
                          value={formik.values.trial_days}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {formik.touched.trial_days && formik.errors.trial_days && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <span className="text-xs">⚠️</span>
                          {formik.errors.trial_days}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Yearly savings indicator */}
                  {savings.show && (
                    <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-4 border-2 border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-500 rounded-full">
                            <TrendingUp className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-green-700 dark:text-green-300">
                              Yearly Savings
                            </p>
                            <p className="text-lg font-bold text-green-900 dark:text-green-100">
                              ${savings.amount}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                            <Sparkles className="h-3 w-3" />
                            {savings.percentage}% OFF
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Usage Limits - PARTIALLY EDITABLE */}
              <Card className="border-2 border-gray-300 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    Usage Limits
                  </CardTitle>
                  <CardDescription>
                    Update booking limits (listings locked)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Max Listings - DISABLED */}
                    <div className="space-y-2 opacity-60">
                      <Label
                        htmlFor="max_listings"
                        className="text-sm font-semibold flex items-center gap-1"
                      >
                        <Lock className="h-3 w-3" />
                        Max Listings
                      </Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="max_listings"
                          name="max_listings"
                          type="number"
                          className="pl-10 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                          value={formik.values.max_listings}
                          disabled
                        />
                      </div>
                    </div>

                    {/* Max Bookings - EDITABLE */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="max_bookings_per_month"
                        className="text-sm font-semibold flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3 text-green-600" />
                        Max Bookings/Month{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="max_bookings_per_month"
                          name="max_bookings_per_month"
                          type="number"
                          min="1"
                          placeholder="50"
                          className="pl-10 focus:ring-2 focus:ring-green-500 border-green-300"
                          value={formik.values.max_bookings_per_month}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {formik.touched.max_bookings_per_month &&
                        formik.errors.max_bookings_per_month && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <span className="text-xs">⚠️</span>
                            {formik.errors.max_bookings_per_month}
                          </p>
                        )}
                    </div>

                    {/* Max Featured - DISABLED */}
                    <div className="space-y-2 opacity-60">
                      <Label
                        htmlFor="max_featured_listings"
                        className="text-sm font-semibold flex items-center gap-1"
                      >
                        <Lock className="h-3 w-3" />
                        Max Featured Listings
                      </Label>
                      <div className="relative">
                        <Star className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="max_featured_listings"
                          name="max_featured_listings"
                          type="number"
                          className="pl-10 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                          value={formik.values.max_featured_listings}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stripe Integration - DISABLED */}
              <Card className="border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-500">
                    <Lock className="h-5 w-5" />
                    Stripe Integration (Locked)
                  </CardTitle>
                  <CardDescription>
                    Payment gateway settings cannot be modified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 opacity-60">
                  <div className="space-y-2">
                    <Label
                      htmlFor="stripe_plan_id"
                      className="text-sm font-semibold flex items-center gap-1"
                    >
                      <Lock className="h-3 w-3" />
                      Stripe Monthly Plan ID
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="stripe_plan_id"
                        name="stripe_plan_id"
                        className="pl-10 cursor-not-allowed bg-gray-100 dark:bg-gray-800 font-mono text-sm"
                        value={formik.values.stripe_plan_id}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="stripe_yearly_plan_id"
                      className="text-sm font-semibold flex items-center gap-1"
                    >
                      <Lock className="h-3 w-3" />
                      Stripe Yearly Plan ID
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="stripe_yearly_plan_id"
                        name="stripe_yearly_plan_id"
                        className="pl-10 cursor-not-allowed bg-gray-100 dark:bg-gray-800 font-mono text-sm"
                        value={formik.values.stripe_yearly_plan_id}
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features Sidebar - DISABLED */}
            <div className="space-y-6">
              <Card className="border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-500">
                    <Lock className="h-5 w-5" />
                    Plan Features (Locked)
                  </CardTitle>
                  <CardDescription>Features cannot be modified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 opacity-60">
                  {/* Featured Listings */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <div className="space-y-1 flex-1">
                      <Label className="text-base flex items-center gap-2">
                        <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900 rounded">
                          <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        Featured Listings
                      </Label>
                      <p className="text-xs text-muted-foreground pl-8">
                        Allow workers to feature their listings
                      </p>
                    </div>
                    <Switch
                      checked={formik.values.featured_listings_allowed}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  {/* Priority Support */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <div className="space-y-1 flex-1">
                      <Label className="text-base flex items-center gap-2">
                        <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded">
                          <Headphones className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        Priority Support
                      </Label>
                      <p className="text-xs text-muted-foreground pl-8">
                        Faster response times and dedicated help
                      </p>
                    </div>
                    <Switch
                      checked={formik.values.priority_support}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  {/* Analytics Access */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <div className="space-y-1 flex-1">
                      <Label className="text-base flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded">
                          <BarChart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        Analytics Access
                      </Label>
                      <p className="text-xs text-muted-foreground pl-8">
                        Advanced insights and performance metrics
                      </p>
                    </div>
                    <Switch
                      checked={formik.values.analytics_access}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  {/* API Access */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <div className="space-y-1 flex-1">
                      <Label className="text-base flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded">
                          <Code className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        API Access
                      </Label>
                      <p className="text-xs text-muted-foreground pl-8">
                        Programmatic access to platform features
                      </p>
                    </div>
                    <Switch
                      checked={formik.values.api_access}
                      disabled
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-0 text-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur">
                      <Info className="h-5 w-5" />
                    </div>
                    Current Values
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/10 backdrop-blur">
                      <span className="text-sm font-medium">Monthly Price</span>
                      <span className="text-lg font-bold">
                        ${formik.values.price || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/10 backdrop-blur">
                      <span className="text-sm font-medium">Yearly Price</span>
                      <span className="text-lg font-bold">
                        ${formik.values.yearly_price || "0.00"}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-white/20 my-3" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" />
                        Listings
                      </span>
                      <span className="font-semibold">
                        {formik.values.max_listings || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-1 rounded bg-white/10">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        Bookings/mo
                      </span>
                      <span className="font-semibold">
                        {formik.values.max_bookings_per_month || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Star className="h-3.5 w-3.5" />
                        Featured
                      </span>
                      <span className="font-semibold">
                        {formik.values.max_featured_listings || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-1 rounded bg-white/10">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        Trial Days
                      </span>
                      <span className="font-semibold">
                        {formik.values.trial_days || "0"}
                      </span>
                    </div>
                  </div>

                  {/* Editable Fields Indicator */}
                  <div className="border-t border-white/20 pt-3 mt-3">
                    <p className="text-xs font-medium mb-2">Editable Fields</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur">
                        💵 Pricing
                      </span>
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur">
                        📅 Bookings
                      </span>
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur">
                        🎁 Trial
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <Card className="mt-6 border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {formik.dirty ? (
                    <span className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                      You have unsaved changes
                    </span>
                  ) : (
                    "All changes saved"
                  )}
                </p>
                <div className="flex items-center gap-3">
                  {/* <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/subscriptions/plans")}
                    disabled={formik.isSubmitting}
                    className="hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </Button> */}
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={formik.isSubmitting || !formik.dirty}
                  >
                    {formik.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Plan...
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Update Plan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default EditPlanSubscription;