import { useState, useEffect } from "react";
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
import { ArrowLeft, Bell, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import makeApiRequest from "@/services/axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";

interface Announcement {
  id: number;
  message: string;
  link_text: string;
  link_url: string;
  background_color: string;
  text_color: string;
  icon: string;
  is_dismissible: boolean;
  is_active: boolean;
  priority: number;
}

// Validation Schema - only editable fields
const validationSchema = Yup.object({
  message: Yup.string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be less than 500 characters"),
  is_active: Yup.boolean().required(),
  priority: Yup.number()
    .required("Priority is required")
    .min(1, "Priority must be at least 1")
    .max(10, "Priority must be at most 10"),
});

export default function EditAnnouncement() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const formik = useFormik({
    initialValues: {
      message: "",
      is_active: true,
      priority: 5,
      // Read-only fields for display
      link_text: "",
      link_url: "",
      background_color: "#3B82F6",
      text_color: "#FFFFFF",
      icon: "fas fa-bell",
      is_dismissible: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await makeApiRequest(`admin/cms/announcements/${id}`, {
          method: "PUT",
          data: {
            message: values.message,
            is_active: values.is_active,
            priority: values.priority,
          },
        });

        if (response.success) {
          toast.success("Announcement updated successfully");
          navigate("/dashboard/get-all-announcements");
        }
      } catch (error) {
        console.error("Error updating announcement:", error);
        toast.error("Failed to update announcement");
      } finally {
        setLoading(false);
      }
    },
  });

  const fetchAnnouncement = async () => {
    try {
      setFetchLoading(true);
      const response = await makeApiRequest(`admin/cms/announcements/${id}`, {
        method: "GET",
      });

      if (response.success && response.data) {
        const data: Announcement = response.data;
        setAnnouncement(data);

        // Set all values including read-only ones
        formik.setValues({
          message: data.message || "",
          is_active: data.is_active || false,
          priority: data.priority || 5,
          link_text: data.link_text || "",
          link_url: data.link_url || "",
          background_color: data.background_color || "#3B82F6",
          text_color: data.text_color || "#FFFFFF",
          icon: data.icon || "fas fa-bell",
          is_dismissible: data.is_dismissible || true,
        });
      }
    } catch (error) {
      console.error("Error fetching announcement:", error);
      toast.error("Failed to fetch announcement");
      navigate("/dashboard/announcements");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading announcement...</p>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-600">
            Announcement not found
          </p>
          <Button
            onClick={() => navigate("/dashboard/announcements")}
            variant="outline"
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Announcements
          </Button>
        </div>
      </div>
    );
  }

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
            Edit Announcement
          </h1>
          <p className="text-muted-foreground">
            Update announcement message and settings
          </p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form Section - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Editable Fields */}
            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-green-600" />
                  Editable Information
                </CardTitle>
                <CardDescription>
                  Update message, status, and priority
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Message - EDITABLE */}
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

                {/* Is Active - EDITABLE */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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

                {/* Priority - EDITABLE */}
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

            {/* Read-Only Fields */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gray-400" />
                  Read-Only Information
                </CardTitle>
                <CardDescription>
                  These fields cannot be edited
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Link Fields - READ ONLY */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">
                      Link Text
                    </Label>
                    <Input
                      value={formik.values.link_text || "—"}
                      disabled
                      className="mt-2 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-gray-600">
                      Link URL
                    </Label>
                    <Input
                      value={formik.values.link_url || "—"}
                      disabled
                      className="mt-2 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Color Fields - READ ONLY */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">
                      Background Color
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <div
                        className="w-10 h-10 rounded border-2 border-gray-300"
                        style={{ backgroundColor: formik.values.background_color }}
                      />
                      <Input
                        value={formik.values.background_color}
                        disabled
                        className="flex-1 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-gray-600">
                      Text Color
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <div
                        className="w-10 h-10 rounded border-2 border-gray-300"
                        style={{ backgroundColor: formik.values.text_color }}
                      />
                      <Input
                        value={formik.values.text_color}
                        disabled
                        className="flex-1 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Icon - READ ONLY */}
                <div>
                  <Label className="text-sm font-semibold text-gray-600">
                    Icon
                  </Label>
                  <div className="flex items-center gap-3 mt-2">
                    <i className={`${formik.values.icon} text-2xl text-gray-600`}></i>
                    <Input
                      value={formik.values.icon}
                      disabled
                      className="flex-1 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Is Dismissible - READ ONLY */}
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold text-gray-600">
                      Is Dismissible
                    </Label>
                    <p className="text-xs text-gray-500">
                      Users can close this announcement
                    </p>
                  </div>
                  <Switch
                    checked={formik.values.is_dismissible}
                    disabled
                    className="cursor-not-allowed"
                  />
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
                {loading ? "Updating..." : "Update Announcement"}
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

              {/* Status Info */}
              <Card className="border border-gray-200">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`font-bold ${
                          formik.values.is_active
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {formik.values.is_active ? "Active" : "Inactive"}
                      </span>
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
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Dismissible:</span>
                      <span className="font-bold text-gray-600">
                        {formik.values.is_dismissible ? "Yes" : "No"}
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