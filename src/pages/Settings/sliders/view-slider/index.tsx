import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Loader2,
  ExternalLink,
  ImageIcon,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import makeApiRequest from "@/services/axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface Slider {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  mobile_image: string;
  button_text: string;
  button_url: string;
  button_style: string;
  order: number;
  is_active: boolean;
  text_position: string;
  overlay_color: string;
  overlay_opacity: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export default function ViewSlider() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [slider, setSlider] = useState<Slider | null>(null);

  const fetchSlider = async () => {
    try {
      setLoading(true);
      const response = await makeApiRequest(`admin/cms/sliders/${id}`, {
        method: "GET",
      });

      if (response.success && response.data) {
        setSlider(response.data);
      }
    } catch (error) {
      console.error("Error fetching slider:", error);
      toast.error("Failed to fetch slider");
      navigate("/dashboard/sliders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSlider();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this slider?")) return;

    try {
      await makeApiRequest(`admin/cms/sliders/${id}`, {
        method: "DELETE",
      });

      toast.success("Slider deleted successfully");
      navigate("/dashboard/sliders");
    } catch (error) {
      console.error("Error deleting slider:", error);
      toast.error("Failed to delete slider");
    }
  };

  const getPositionBadge = (position: string) => {
    const colors = {
      left: "bg-blue-100 text-blue-800",
      center: "bg-purple-100 text-purple-800",
      right: "bg-green-100 text-green-800",
    };
    return (
      <Badge className={colors[position as keyof typeof colors] || ""}>
        {position}
      </Badge>
    );
  };

  const getButtonStyleBadge = (style: string) => {
    const colors = {
      primary: "bg-green-100 text-green-800",
      secondary: "bg-gray-100 text-gray-800",
      outline: "bg-blue-100 text-blue-800",
    };
    return (
      <Badge className={colors[style as keyof typeof colors] || ""}>
        {style}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading slider...</p>
        </div>
      </div>
    );
  }

  if (!slider) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-600">Slider not found</p>
          <Button
            onClick={() => navigate("/dashboard/sliders")}
            variant="outline"
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sliders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard/sliders")}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {slider.title}
              </h1>
              {slider.is_active ? (
                <Badge className="bg-green-100 text-green-800">
                  <Eye className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Inactive
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">View slider details</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/sliders/edit/${id}`)}
            className="hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="hover:bg-red-50 hover:border-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Images Preview */}
        <Card className="border-2 border-green-100">
          <CardHeader>
            <CardTitle className="text-lg">Slider Images</CardTitle>
            <CardDescription>Desktop and mobile versions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Desktop Image */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">Desktop Image</h3>
                  <Badge variant="outline">1920x800</Badge>
                </div>
                {slider.image ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={slider.image}
                      alt="Desktop slider"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Mobile Image */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">Mobile Image</h3>
                  <Badge variant="outline">768x600</Badge>
                </div>
                {slider.mobile_image ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={slider.mobile_image}
                      alt="Mobile slider"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="border-2 border-green-100">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
            <CardDescription>Main content and text</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Title
                  </p>
                  <p className="text-base">{slider.title || "—"}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Subtitle
                  </p>
                  <p className="text-base">{slider.subtitle || "—"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Description
                </p>
                <p className="text-base">{slider.description || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Button Settings */}
        <Card className="border-2 border-green-100">
          <CardHeader>
            <CardTitle className="text-lg">Button Settings</CardTitle>
            <CardDescription>Call-to-action configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Button Text
                </p>
                <p className="text-base">{slider.button_text || "—"}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Button URL
                </p>
                {slider.button_url ? (
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {slider.button_url}
                    </code>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                ) : (
                  <p className="text-base">—</p>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Button Style
                </p>
                {getButtonStyleBadge(slider.button_style)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="border-2 border-green-100">
          <CardHeader>
            <CardTitle className="text-lg">Display Settings</CardTitle>
            <CardDescription>Appearance and positioning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Order
                  </p>
                  <Badge variant="outline" className="text-base">
                    {slider.order}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Text Position
                  </p>
                  {getPositionBadge(slider.text_position)}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Overlay Color
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded border-2 border-gray-200"
                      style={{ backgroundColor: slider.overlay_color }}
                    />
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {slider.overlay_color}
                    </code>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Overlay Opacity
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${slider.overlay_opacity}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {slider.overlay_opacity}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card className="border-2 border-green-100">
          <CardHeader>
            <CardTitle className="text-lg">Metadata</CardTitle>
            <CardDescription>Timestamps and scheduling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Created At
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-base">
                    {new Date(slider.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Updated At
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-base">
                    {new Date(slider.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Start Date
                </p>
                <p className="text-base">
                  {slider.start_date
                    ? new Date(slider.start_date).toLocaleDateString()
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  End Date
                </p>
                <p className="text-base">
                  {slider.end_date
                    ? new Date(slider.end_date).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}