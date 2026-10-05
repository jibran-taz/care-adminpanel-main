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
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Loader2,
  Bell,
  ExternalLink,
  Calendar,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import makeApiRequest from "@/services/axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

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
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export default function ViewAnnouncement() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      const response = await makeApiRequest(`admin/cms/announcements/${id}`, {
        method: "GET",
      });

      if (response.success && response.data) {
        setAnnouncement(response.data);
      }
    } catch (error) {
      console.error("Error fetching announcement:", error);
      toast.error("Failed to fetch announcement");
      navigate("/dashboard/announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await makeApiRequest(`admin/cms/announcements/${id}`, {
        method: "DELETE",
      });

      toast.success("Announcement deleted successfully");
      navigate("/dashboard/announcements");
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("Failed to delete announcement");
    }
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 8) {
      return (
        <Badge className="bg-red-100 text-red-800">
          High Priority ({priority})
        </Badge>
      );
    } else if (priority >= 5) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          Medium Priority ({priority})
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800">
          Low Priority ({priority})
        </Badge>
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20" />
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        {/* Preview Skeleton */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-16 w-80" />
            </div>
          </CardContent>
        </Card>

        {/* Content Skeletons */}
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="border-2 border-gray-200">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="border-2 border-gray-200">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-600 mb-2">
            Announcement not found
          </p>
          <p className="text-sm text-gray-500 mb-4">
            The announcement you're looking for doesn't exist
          </p>
          <Button
            onClick={() => navigate("/dashboard/announcements")}
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Announcements
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
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
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight">
                Announcement Details
              </h1>
              {announcement.is_active ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <Eye className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Inactive
                </Badge>
              )}
              {getPriorityBadge(announcement.priority)}
            </div>
            <p className="text-muted-foreground mt-1">
              View announcement information
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/announcements/edit/${id}`)}
            className="hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-colors"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="hover:bg-red-50 hover:border-red-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Live Preview */}
        <Card className="border-2 border-green-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Live Preview</CardTitle>
                <CardDescription>
                  How this announcement appears to users
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Desktop Preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-600">
                    Desktop View
                  </p>
                  <Badge variant="outline" className="text-xs">
                    1920px
                  </Badge>
                </div>
                <div
                  className="rounded-lg p-4 shadow-lg border-2 border-gray-100"
                  style={{
                    backgroundColor: announcement.background_color,
                    color: announcement.text_color,
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {announcement.icon && (
                        <i
                          className={`${announcement.icon} text-lg mt-0.5`}
                        ></i>
                      )}
                      <p className="text-sm font-medium flex-1">
                        {announcement.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {announcement.link_text && (
                        <button
                          className="text-sm font-semibold underline hover:opacity-80 flex items-center gap-1 transition-opacity"
                          style={{ color: announcement.text_color }}
                        >
                          {announcement.link_text}
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      )}
                      {announcement.is_dismissible && (
                        <button
                          className="hover:opacity-80 transition-opacity"
                          style={{ color: announcement.text_color }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-600">
                    Mobile View
                  </p>
                  <Badge variant="outline" className="text-xs">
                    375px
                  </Badge>
                </div>
                <div
                  className="rounded-lg p-3 shadow-lg max-w-sm border-2 border-gray-100"
                  style={{
                    backgroundColor: announcement.background_color,
                    color: announcement.text_color,
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      {announcement.icon && (
                        <i className={`${announcement.icon} text-sm`}></i>
                      )}
                      <p className="text-xs flex-1">{announcement.message}</p>
                      {announcement.is_dismissible && (
                        <button
                          className="hover:opacity-80 transition-opacity"
                          style={{ color: announcement.text_color }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {announcement.link_text && (
                      <button
                        className="text-xs font-semibold underline hover:opacity-80 flex items-center gap-1 transition-opacity"
                        style={{ color: announcement.text_color }}
                      >
                        {announcement.link_text}
                        <ExternalLink className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Message & Content */}
          <Card className="border-2 border-green-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Bell className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Message & Content</CardTitle>
                  <CardDescription>Announcement text and links</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Message
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-base leading-relaxed">
                    {announcement.message}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Link Text
                  </p>
                  <p className="text-base font-medium">
                    {announcement.link_text || (
                      <span className="text-gray-400 text-sm italic">
                        No link text
                      </span>
                    )}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    Link URL
                  </p>
                  {announcement.link_url ? (
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-white px-2 py-1 rounded border border-gray-200 flex-1">
                        {announcement.link_url}
                      </code>
                      <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm italic">
                      No link URL
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="border-2 border-green-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Bell className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Appearance</CardTitle>
                  <CardDescription>
                    Colors and icon configuration
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-3">
                    Background Color
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-lg border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: announcement.background_color }}
                    />
                    <div>
                      <code className="text-sm bg-white px-3 py-1.5 rounded border border-gray-200 font-mono">
                        {announcement.background_color}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-3">
                    Text Color
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-lg border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: announcement.text_color }}
                    />
                    <div>
                      <code className="text-sm bg-white px-3 py-1.5 rounded border border-gray-200 font-mono">
                        {announcement.text_color}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-3">
                    Icon
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg border-2 border-gray-300 shadow-sm">
                      <i
                        className={`${announcement.icon} text-4xl`}
                        style={{ color: announcement.background_color }}
                      ></i>
                    </div>
                    <div>
                      <code className="text-sm bg-white px-3 py-1.5 rounded border border-gray-200 font-mono">
                        {announcement.icon}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings & Metadata */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Settings */}
          <Card className="border-2 border-green-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Bell className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Settings</CardTitle>
                  <CardDescription>Behavior configuration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="text-sm font-semibold">Active Status</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Currently visible to users
                  </p>
                </div>
                {announcement.is_active ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Active
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                    Inactive
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="text-sm font-semibold">Dismissible</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Users can close it
                  </p>
                </div>
                {announcement.is_dismissible ? (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    Yes
                  </Badge>
                ) : (
                  <Badge variant="outline">No</Badge>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm font-semibold mb-3">Priority Level</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          announcement.priority >= 8
                            ? "bg-red-500"
                            : announcement.priority >= 5
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                        }`}
                        style={{ width: `${announcement.priority * 10}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold min-w-[45px] text-right">
                    {announcement.priority}/10
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="border-2 border-green-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Metadata</CardTitle>
                  <CardDescription>Timestamps and scheduling</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Created At
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium">
                    {new Date(announcement.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Updated At
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium">
                    {new Date(announcement.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Start Date
                </p>
                <p className="text-sm font-medium">
                  {announcement.start_date ? (
                    new Date(announcement.start_date).toLocaleDateString()
                  ) : (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  End Date
                </p>
                <p className="text-sm font-medium">
                  {announcement.end_date ? (
                    new Date(announcement.end_date).toLocaleDateString()
                  ) : (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}