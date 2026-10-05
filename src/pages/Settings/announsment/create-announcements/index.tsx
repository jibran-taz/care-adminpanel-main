import { useState } from "react";
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
import { ArrowLeft, Bell, ExternalLink, Sparkles } from "lucide-react";
import makeApiRequest from "@/services/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation Schema
const validationSchema = Yup.object({
  message: Yup.string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be less than 500 characters"),
  link_text: Yup.string().max(50, "Link text must be less than 50 characters"),
  link_url: Yup.string().url("Please enter a valid URL or path"),
  background_color: Yup.string()
    .required("Background color is required")
    .matches(/^#([0-9A-F]{3}){1,2}$/i, "Please enter a valid hex color"),
  text_color: Yup.string()
    .required("Text color is required")
    .matches(/^#([0-9A-F]{3}){1,2}$/i, "Please enter a valid hex color"),
  icon: Yup.string().required("Icon is required"),
  is_dismissible: Yup.boolean().required(),
  is_active: Yup.boolean().required(),
  priority: Yup.number()
    .required("Priority is required")
    .min(1, "Priority must be at least 1")
    .max(10, "Priority must be at most 10"),
});

export default function CreateAnnouncement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Common icon suggestions
  const iconSuggestions = [
    { name: "Bell", class: "fas fa-bell" },
    { name: "Gift", class: "fas fa-gift" },
    { name: "Star", class: "fas fa-star" },
    { name: "Sparkles", class: "fas fa-sparkles" },
    { name: "Fire", class: "fas fa-fire" },
    { name: "Heart", class: "fas fa-heart" },
    { name: "Trophy", class: "fas fa-trophy" },
    { name: "Rocket", class: "fas fa-rocket" },
    { name: "Bullhorn", class: "fas fa-bullhorn" },
    { name: "Exclamation", class: "fas fa-exclamation-circle" },
  ];

  const formik = useFormik({
    initialValues: {
      message: "",
      link_text: "",
      link_url: "",
      background_color: "#3B82F6",
      text_color: "#FFFFFF",
      icon: "fas fa-bell",
      is_dismissible: true,
      is_active: true,
      priority: 5,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await makeApiRequest("admin/cms/announcements", {
          method: "POST",
          data: values,
        });

        if (response.success) {
          toast.success("Announcement created successfully");
          navigate("/dashboard/get-all-announcements");
        }
      } catch (error) {
        console.error("Error creating announcement:", error);
        toast.error("Failed to create announcement");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="hover:bg-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Announcement
          </h1>
          <p className="text-muted-foreground">
            Add a new announcement banner
          </p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form Section - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-green-600" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Enter the main content for your announcement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="message" className="text-sm font-semibold">
                    Message <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="🎉 New Year Special: Get 20% off on all bookings!"
                    rows={3}
                    className={`mt-2 focus:ring-2 focus:ring-green-500 ${
                      formik.touched.message && formik.errors.message
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {formik.touched.message && formik.errors.message && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    You can use emojis in your message (10-500 characters)
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="link_text" className="text-sm font-semibold">
                      Link Text
                    </Label>
                    <Input
                      id="link_text"
                      name="link_text"
                      value={formik.values.link_text}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Learn More"
                      className={`mt-2 focus:ring-2 focus:ring-green-500 ${
                        formik.touched.link_text && formik.errors.link_text
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {formik.touched.link_text && formik.errors.link_text && (
                      <p className="text-xs text-red-500 mt-1">
                        {formik.errors.link_text}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="link_url" className="text-sm font-semibold">
                      Link URL
                    </Label>
                    <Input
                      id="link_url"
                      name="link_url"
                      value={formik.values.link_url}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="/promotions"
                      className={`mt-2 focus:ring-2 focus:ring-green-500 ${
                        formik.touched.link_url && formik.errors.link_url
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {formik.touched.link_url && formik.errors.link_url && (
                      <p className="text-xs text-red-500 mt-1">
                        {formik.errors.link_url}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  Appearance
                </CardTitle>
                <CardDescription>Customize colors and icon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label
                      htmlFor="background_color"
                      className="text-sm font-semibold"
                    >
                      Background Color <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="background_color"
                        name="background_color"
                        type="color"
                        value={formik.values.background_color}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-20 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={formik.values.background_color}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="background_color"
                        placeholder="#3B82F6"
                        className={`flex-1 focus:ring-2 focus:ring-green-500 ${
                          formik.touched.background_color &&
                          formik.errors.background_color
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                    </div>
                    {formik.touched.background_color &&
                      formik.errors.background_color && (
                        <p className="text-xs text-red-500 mt-1">
                          {formik.errors.background_color}
                        </p>
                      )}
                  </div>

                  <div>
                    <Label htmlFor="text_color" className="text-sm font-semibold">
                      Text Color <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="text_color"
                        name="text_color"
                        type="color"
                        value={formik.values.text_color}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-20 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={formik.values.text_color}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="text_color"
                        placeholder="#FFFFFF"
                        className={`flex-1 focus:ring-2 focus:ring-green-500 ${
                          formik.touched.text_color && formik.errors.text_color
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                    </div>
                    {formik.touched.text_color && formik.errors.text_color && (
                      <p className="text-xs text-red-500 mt-1">
                        {formik.errors.text_color}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="icon" className="text-sm font-semibold">
                    Icon (FontAwesome Class) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="icon"
                    name="icon"
                    value={formik.values.icon}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="fas fa-bell"
                    className={`mt-2 focus:ring-2 focus:ring-green-500 ${
                      formik.touched.icon && formik.errors.icon
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {formik.touched.icon && formik.errors.icon && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.icon}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Use FontAwesome class names (e.g., fas fa-gift)
                  </p>

                  {/* Icon Suggestions */}
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      Quick Select:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {iconSuggestions.map((icon) => (
                        <Button
                          key={icon.class}
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => formik.setFieldValue("icon", icon.class)}
                          className={`hover:bg-green-50 hover:border-green-500 ${
                            formik.values.icon === icon.class
                              ? "bg-green-50 border-green-500"
                              : ""
                          }`}
                        >
                          <i className={`${icon.class} mr-2`}></i>
                          {icon.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
                <CardDescription>
                  Configure behavior and priority
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">
                      Is Dismissible <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-xs text-gray-500">
                      Allow users to close this announcement
                    </p>
                  </div>
                  <Switch
                    checked={formik.values.is_dismissible}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("is_dismissible", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">
                      Is Active <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-xs text-gray-500">
                      Show this announcement to users
                    </p>
                  </div>
                  <Switch
                    checked={formik.values.is_active}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("is_active", checked)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="priority" className="text-sm font-semibold">
                    Priority: {formik.values.priority}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Higher priority announcements appear first (1-10)
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">Low</span>
                    <Input
                      id="priority"
                      name="priority"
                      type="range"
                      min="1"
                      max="10"
                      value={formik.values.priority}
                      onChange={(e) =>
                        formik.setFieldValue("priority", parseInt(e.target.value))
                      }
                      className="flex-1 cursor-pointer"
                    />
                    <span className="text-xs text-gray-500">High</span>
                    <span className="text-sm font-bold w-8 text-center">
                      {formik.values.priority}
                    </span>
                  </div>
                  {formik.touched.priority && formik.errors.priority && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.priority}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/announcements")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                disabled={loading || !formik.isValid}
              >
                {loading ? "Creating..." : "Create Announcement"}
              </Button>
            </div>
          </div>

          {/* Live Preview Section - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <Card className="border-2 border-green-100">
                <CardHeader>
                  <CardTitle className="text-lg">Live Preview</CardTitle>
                  <CardDescription>
                    See how your announcement will look
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Desktop Preview */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Desktop View
                      </p>
                      <div
                        className="rounded-lg p-4 shadow-sm"
                        style={{
                          backgroundColor: formik.values.background_color,
                          color: formik.values.text_color,
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            {formik.values.icon && (
                              <i
                                className={`${formik.values.icon} text-lg mt-0.5`}
                              ></i>
                            )}
                            <p className="text-sm font-medium flex-1">
                              {formik.values.message ||
                                "Your message will appear here..."}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {formik.values.link_text && (
                              <button
                                className="text-sm font-semibold underline hover:opacity-80 flex items-center gap-1"
                                style={{ color: formik.values.text_color }}
                              >
                                {formik.values.link_text}
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            )}
                            {formik.values.is_dismissible && (
                              <button
                                className="hover:opacity-80"
                                style={{ color: formik.values.text_color }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Preview */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Mobile View
                      </p>
                      <div
                        className="rounded-lg p-3 shadow-sm"
                        style={{
                          backgroundColor: formik.values.background_color,
                          color: formik.values.text_color,
                        }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            {formik.values.icon && (
                              <i className={`${formik.values.icon} text-sm`}></i>
                            )}
                            <p className="text-xs flex-1">
                              {formik.values.message ||
                                "Your message will appear here..."}
                            </p>
                            {formik.values.is_dismissible && (
                              <button
                                className="hover:opacity-80"
                                style={{ color: formik.values.text_color }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          {formik.values.link_text && (
                            <button
                              className="text-xs font-semibold underline hover:opacity-80 flex items-center gap-1"
                              style={{ color: formik.values.text_color }}
                            >
                              {formik.values.link_text}
                              <ExternalLink className="h-2.5 w-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Color Contrast Info */}
              <Card className="border border-gray-200">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Background:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        {formik.values.background_color}
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Text:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        {formik.values.text_color}
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Priority:</span>
                      <span
                        className={`font-bold ${
                          formik.values.priority >= 8
                            ? "text-red-600"
                            : formik.values.priority >= 5
                            ? "text-yellow-600"
                            : "text-gray-600"
                        }`}
                      >
                        {formik.values.priority}/10
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}