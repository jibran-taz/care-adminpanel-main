import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
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
import makeApiRequest from "@/services/axios";
import { apiUrl } from "@/services/api-end-point";
import { notify } from "@/utils/utils";

// Validation Schema
const createPlanValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Plan name must be at least 2 characters")
    .max(100, "Plan name must not exceed 100 characters")
    .required("Plan name is required"),
  slug: Yup.string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must not exceed 100 characters")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    )
    .required("Slug is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters")
    .required("Description is required"),
  price: Yup.number()
    .min(0, "Price must be at least 0")
    .required("Monthly price is required"),
  yearly_price: Yup.number()
    .min(0, "Yearly price must be at least 0")
    .required("Yearly price is required"),
  max_listings: Yup.number()
    .min(1, "Must allow at least 1 listing")
    .required("Max listings is required"),
  max_bookings_per_month: Yup.number()
    .min(1, "Must allow at least 1 booking per month")
    .required("Max bookings per month is required"),
  max_featured_listings: Yup.number()
    .min(0, "Featured listings cannot be negative")
    .required("Max featured listings is required"),
  trial_days: Yup.number()
    .min(0, "Trial days cannot be negative")
    .required("Trial days is required"),
  stripe_plan_id: Yup.string()
    .min(5, "Stripe plan ID must be at least 5 characters")
    .required("Stripe monthly plan ID is required"),
  stripe_yearly_plan_id: Yup.string()
    .min(5, "Stripe yearly plan ID must be at least 5 characters")
    .required("Stripe yearly plan ID is required"),
});

const AddPlanSubscription = () => {
  const navigate = useNavigate();
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

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
    validationSchema: createPlanValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log("Creating subscription plan:", values);

        // Convert string numbers to actual numbers
        const formattedValues = {
          ...values,
          price: parseFloat(values.price),
          yearly_price: parseFloat(values.yearly_price),
          max_listings: parseInt(values.max_listings),
          max_bookings_per_month: parseInt(values.max_bookings_per_month),
          max_featured_listings: parseInt(values.max_featured_listings),
          trial_days: parseInt(values.trial_days),
        };

        const response = await makeApiRequest(apiUrl.subscriptions.plans, {
          method: "POST",
          data: formattedValues,
        });

        console.log("Plan created successfully:", response);

        notify({
          message: "Subscription plan created successfully! 🎉",
          type: "success",
        });

        resetForm();
        setIsSlugManuallyEdited(false);
        // navigate("/admin/subscriptions/plans");
      } catch (error) {
        console.error("Error creating plan:", error);
        notify({
          message:
            error?.response?.data?.message ||
            "Failed to create subscription plan",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    formik.setFieldValue("name", name);

    // Only auto-generate slug if it hasn't been manually edited
    if (!isSlugManuallyEdited) {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
      formik.setFieldValue("slug", slug);
    }
  };

  // Track manual slug edits
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    formik.handleChange(e);
  };

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
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                    Create Subscription Plan
                  </h1>
                  <p className="text-muted-foreground">
                    Add a new subscription plan for workers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Plan Details & Pricing */}
            <div className="lg:col-span-2 space-y-6">
              {/* Plan Details */}
              <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Plan Details
                  </CardTitle>
                  <CardDescription>
                    Basic information about the subscription plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name & Slug */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">
                        Plan Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g., Professional"
                          className="pl-10 focus:ring-2 focus:ring-green-500"
                          value={formik.values.name}
                          onChange={handleNameChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {formik.touched.name && formik.errors.name && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          {formik.errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug" className="text-sm font-semibold">
                        Slug <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="slug"
                        name="slug"
                        placeholder="e.g., professional"
                        className="focus:ring-2 focus:ring-green-500 font-mono text-sm"
                        value={formik.values.slug}
                        onChange={handleSlugChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.slug && formik.errors.slug && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          {formik.errors.slug}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        {isSlugManuallyEdited ? (
                          <>✏️ Manually edited</>
                        ) : (
                          <>✨ Auto-generated from plan name</>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-semibold"
                    >
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Perfect for professional workers who need advanced features..."
                      rows={4}
                      className="focus:ring-2 focus:ring-green-500 resize-none"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          {formik.errors.description}
                        </p>
                      )}
                    <p className="text-xs text-muted-foreground">
                      {formik.values.description.length}/500 characters
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Pricing
                  </CardTitle>
                  <CardDescription>
                    Set monthly and yearly pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-semibold">
                        Monthly Price ($){" "}
                        <span className="text-red-500">*</span>
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
                          className="pl-10 focus:ring-2 focus:ring-green-500"
                          value={formik.values.price}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {formik.touched.price && formik.errors.price && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          {formik.errors.price}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="yearly_price"
                        className="text-sm font-semibold"
                      >
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
                          className="pl-10 focus:ring-2 focus:ring-green-500"
                          value={formik.values.yearly_price}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {formik.touched.yearly_price &&
                        formik.errors.yearly_price && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            {formik.errors.yearly_price}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="trial_days"
                        className="text-sm font-semibold"
                      >
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
                          className="pl-10 focus:ring-2 focus:ring-green-500"
                          value={formik.values.trial_days}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {formik.touched.trial_days &&
                        formik.errors.trial_days && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
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

              {/* Usage Limits */}
              <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-green-600" />
                    Usage Limits
                  </CardTitle>
                  <CardDescription>
                    Define maximum usage allowances
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="max_listings"
                        className="text-sm font-semibold"
                      >
                        Max Listings <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="max_listings"
                          name="max_listings"
                          type="number"
                          min="1"
                          placeholder="10"
                          className="pl-10 focus:ring-2 focus:ring-green-500"
                          value={formik.values.max_listings}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {formik.touched.max_listings &&
                        formik.errors.max_listings && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            {formik.errors.max_listings}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="max_bookings_per_month"
                        className="text-sm font-semibold"
                      >
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
                          className="pl-10 focus:ring-2 focus:ring-green-500"
                          value={formik.values.max_bookings_per_month}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {formik.touched.max_bookings_per_month &&
                        formik.errors.max_bookings_per_month && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            {formik.errors.max_bookings_per_month}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="max_featured_listings"
                        className="text-sm font-semibold"
                      >
                        Max Featured Listings{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Star className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="max_featured_listings"
                          name="max_featured_listings"
                          type="number"
                          min="0"
                          placeholder="3"
                          className="pl-10 focus:ring-2 focus:ring-green-500"
                          value={formik.values.max_featured_listings}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      {formik.touched.max_featured_listings &&
                        formik.errors.max_featured_listings && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            {formik.errors.max_featured_listings}
                          </p>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stripe Integration */}
              <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    Stripe Integration
                  </CardTitle>
                  <CardDescription>
                    Connect with Stripe pricing plans
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="stripe_plan_id"
                      className="text-sm font-semibold"
                    >
                      Stripe Monthly Plan ID{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="stripe_plan_id"
                        name="stripe_plan_id"
                        placeholder="price_xxxxx"
                        className="pl-10 focus:ring-2 focus:ring-green-500 font-mono text-sm"
                        value={formik.values.stripe_plan_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    {formik.touched.stripe_plan_id &&
                      formik.errors.stripe_plan_id && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          {formik.errors.stripe_plan_id}
                        </p>
                      )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="stripe_yearly_plan_id"
                      className="text-sm font-semibold"
                    >
                      Stripe Yearly Plan ID{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="stripe_yearly_plan_id"
                        name="stripe_yearly_plan_id"
                        placeholder="price_xxxxx_yearly"
                        className="pl-10 focus:ring-2 focus:ring-green-500 font-mono text-sm"
                        value={formik.values.stripe_yearly_plan_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    {formik.touched.stripe_yearly_plan_id &&
                      formik.errors.stripe_yearly_plan_id && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          {formik.errors.stripe_yearly_plan_id}
                        </p>
                      )}
                  </div>

                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex gap-2">
                      <span className="text-lg">💡</span>
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Stripe Dashboard
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Get these IDs from your Stripe Dashboard under
                          Products → Prices
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features Sidebar */}
            <div className="space-y-6">
              <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    Plan Features
                  </CardTitle>
                  <CardDescription>Enable or disable features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Featured Listings */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="space-y-1 flex-1">
                      <Label className="text-base flex items-center gap-2 cursor-pointer">
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
                      onCheckedChange={(checked) =>
                        formik.setFieldValue(
                          "featured_listings_allowed",
                          checked
                        )
                      }
                      className="mt-1"
                    />
                  </div>

                  {/* Priority Support */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="space-y-1 flex-1">
                      <Label className="text-base flex items-center gap-2 cursor-pointer">
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
                      onCheckedChange={(checked) =>
                        formik.setFieldValue("priority_support", checked)
                      }
                      className="mt-1"
                    />
                  </div>

                  {/* Analytics Access */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="space-y-1 flex-1">
                      <Label className="text-base flex items-center gap-2 cursor-pointer">
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
                      onCheckedChange={(checked) =>
                        formik.setFieldValue("analytics_access", checked)
                      }
                      className="mt-1"
                    />
                  </div>

                  {/* API Access */}
                  <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="space-y-1 flex-1">
                      <Label className="text-base flex items-center gap-2 cursor-pointer">
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
                      onCheckedChange={(checked) =>
                        formik.setFieldValue("api_access", checked)
                      }
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    Quick Summary
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
                    <div className="flex justify-between items-center">
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
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        Trial Days
                      </span>
                      <span className="font-semibold">
                        {formik.values.trial_days || "0"}
                      </span>
                    </div>
                  </div>

                  {/* Active Features */}
                  <div className="border-t border-white/20 pt-3 mt-3">
                    <p className="text-xs font-medium mb-2">Active Features</p>
                    <div className="flex flex-wrap gap-1.5">
                      {formik.values.featured_listings_allowed && (
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur">
                          ⭐ Featured
                        </span>
                      )}
                      {formik.values.priority_support && (
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur">
                          🎧 Support
                        </span>
                      )}
                      {formik.values.analytics_access && (
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur">
                          📊 Analytics
                        </span>
                      )}
                      {formik.values.api_access && (
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur">
                          💻 API
                        </span>
                      )}
                      {!formik.values.featured_listings_allowed &&
                        !formik.values.priority_support &&
                        !formik.values.analytics_access &&
                        !formik.values.api_access && (
                          <span className="text-xs text-white/60">
                            No features enabled
                          </span>
                        )}
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
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                      </span>
                      You have unsaved changes
                    </span>
                  ) : (
                    "All changes saved"
                  )}
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/subscriptions/plans")}
                    disabled={formik.isSubmitting}
                    className="hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={formik.isSubmitting || !formik.dirty}
                  >
                    {formik.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Plan...
                      </>
                    ) : (
                      <>
                        <Package className="mr-2 h-4 w-4" />
                        Create Plan
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

export default AddPlanSubscription;
