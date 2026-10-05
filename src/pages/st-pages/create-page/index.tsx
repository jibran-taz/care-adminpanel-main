import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  Calendar,
  User,
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
import { Badge } from "@/components/ui/badge";
import makeApiRequest from "@/services/axios";
import { apiUrl } from "@/services/api-end-point";
import { notify } from "@/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Author {
  id: number;
  first_name: string;
  last_name: string;
}

interface PageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  template: string;
  is_published: boolean;
  show_in_menu: boolean;
  menu_order: number;
  author_id: number;
  meta_title: string;
  meta_description: string;
  meta_keywords: string | null;
  og_image: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  author: Author;
}

const TEMPLATES = [
  { value: "default", label: "Default" },
  { value: "full-width", label: "Full Width" },
  { value: "sidebar-left", label: "Sidebar Left" },
  { value: "sidebar-right", label: "Sidebar Right" },
  { value: "landing", label: "Landing Page" },
];

// Quill Editor Configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const quillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "align",
  "color",
  "background",
];

export default function CreateEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const isViewing = window.location.pathname.includes("/view/");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<Partial<PageData>>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image: null,
    template: "default",
    is_published: false,
    show_in_menu: true,
    menu_order: 1,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_image: null,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleInputChange = (field: keyof PageData, value: any) => {
    setPageData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug from title if creating new page
      if (field === "title" && !isEditing) {
        updated.slug = generateSlug(value as string);
      }

      // Auto-generate meta_title from title if empty
      if (field === "title" && !prev.meta_title) {
        updated.meta_title = value as string;
      }

      return updated;
    });
  };

  const fetchPageData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await makeApiRequest(`${apiUrl.cmsPages}/${id}`, {
        method: "GET",
      });

      if (response.success) {
        setPageData(response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching page:", error);
      notify({ message: "Failed to fetch page details", type: "error" });
      navigate("/dashboard/get-all-pages");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!pageData.title?.trim()) {
      notify({ message: "Title is required", type: "error" });
      return false;
    }

    if (!pageData.slug?.trim()) {
      notify({ message: "Slug is required", type: "error" });
      return false;
    }

    if (!pageData.content?.trim()) {
      notify({ message: "Content is required", type: "error" });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const dataToSend = {
        title: pageData.title,
        slug: pageData.slug,
        content: pageData.content,
        excerpt: pageData.excerpt || "",
        featured_image: pageData.featured_image || null,
        template: pageData.template || "default",
        is_published: pageData.is_published || false,
        show_in_menu: pageData.show_in_menu ?? true,
        menu_order: pageData.menu_order || 1,
        meta_title: pageData.meta_title || pageData.title,
        meta_description: pageData.meta_description || "",
        meta_keywords: pageData.meta_keywords || "",
        og_image: pageData.og_image || null,
      };

      const url = isEditing ? `${apiUrl.cmsPages}/${id}` : apiUrl.cmsPages;
      const method = isEditing ? "PUT" : "POST";

      const response = await makeApiRequest(url, {
        method,
        data: dataToSend,
      });

      if (response.success) {
        notify({
          message: isEditing
            ? "Page updated successfully"
            : "Page created successfully",
          type: "success",
        });
     navigate("/dashboard/get-all-pages");
      }
    } catch (error: any) {
      console.error("❌ Error saving page:", error);
      notify({
        message: error?.response?.data?.message || "Failed to save page",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      fetchPageData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isViewing
                ? "View Page"
                : isEditing
                  ? "Edit Page"
                  : "Create New Page"}
            </h1>
            <p className="text-muted-foreground">
              {isViewing
                ? pageData.title
                : isEditing
                  ? "Update page content and settings"
                  : "Add a new page to your website"}
            </p>
          </div>
        </div>

        {!isViewing && (
          <div className="flex gap-2">
            {/* <Button
              variant="outline"
              onClick={() => navigate("/admin/pages")}
              disabled={saving}
            >
              Cancel
            </Button> */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : isEditing ? "Update Page" : "Create Page"}
            </Button>
          </div>
        )}

        {isViewing && (
          <Button
            onClick={() => navigate(`/admin/pages/edit/${id}`)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            Edit Page
          </Button>
        )}
      </div>

      {/* Main Content Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the main details for your page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  {isViewing ? (
                    <p className="p-3 bg-muted rounded-md text-sm">
                      {pageData.title}
                    </p>
                  ) : (
                    <Input
                      id="title"
                      value={pageData.title || ""}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter page title"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  {isViewing ? (
                    <p className="p-3 bg-muted rounded-md text-sm">
                      {pageData.slug}
                    </p>
                  ) : (
                    <Input
                      id="slug"
                      value={pageData.slug || ""}
                      onChange={(e) => handleInputChange("slug", e.target.value)}
                      placeholder="page-slug"
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    URL-friendly version of the title
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                {isViewing ? (
                  <p className="p-3 bg-muted rounded-md text-sm">
                    {pageData.excerpt || "No excerpt"}
                  </p>
                ) : (
                  <Textarea
                    id="excerpt"
                    value={pageData.excerpt || ""}
                    onChange={(e) =>
                      handleInputChange("excerpt", e.target.value)
                    }
                    rows={2}
                    placeholder="Short description for listings and previews"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Card */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Write your page content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">
                  Page Content <span className="text-red-500">*</span>
                </Label>
                {isViewing ? (
                  <div
                    className="p-4 bg-muted rounded-md text-sm prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: pageData.content || "",
                    }}
                  />
                ) : (
                  <div className="border rounded-md">
                    <ReactQuill
                      theme="snow"
                      value={pageData.content || ""}
                      onChange={(value) => handleInputChange("content", value)}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Write your page content here..."
                      style={{ height: "400px", marginBottom: "42px" }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SEO Card */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your page for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                {isViewing ? (
                  <p className="p-3 bg-muted rounded-md text-sm">
                    {pageData.meta_title || "Not set"}
                  </p>
                ) : (
                  <>
                    <Input
                      id="meta_title"
                      value={pageData.meta_title || ""}
                      onChange={(e) =>
                        handleInputChange("meta_title", e.target.value)
                      }
                      placeholder="SEO title (50-60 characters recommended)"
                      maxLength={120}
                    />
                    <p className="text-xs text-muted-foreground">
                      {pageData.meta_title?.length || 0}/120 characters
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                {isViewing ? (
                  <p className="p-3 bg-muted rounded-md text-sm">
                    {pageData.meta_description || "Not set"}
                  </p>
                ) : (
                  <>
                    <Textarea
                      id="meta_description"
                      value={pageData.meta_description || ""}
                      onChange={(e) =>
                        handleInputChange("meta_description", e.target.value)
                      }
                      rows={3}
                      placeholder="SEO description (150-160 characters recommended)"
                      maxLength={320}
                    />
                    <p className="text-xs text-muted-foreground">
                      {pageData.meta_description?.length || 0}/320 characters
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                {isViewing ? (
                  <p className="p-3 bg-muted rounded-md text-sm">
                    {pageData.meta_keywords || "Not set"}
                  </p>
                ) : (
                  <Input
                    id="meta_keywords"
                    value={pageData.meta_keywords || ""}
                    onChange={(e) =>
                      handleInputChange("meta_keywords", e.target.value)
                    }
                    placeholder="keyword1, keyword2, keyword3"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_image">Open Graph Image URL</Label>
                {isViewing ? (
                  <p className="p-3 bg-muted rounded-md text-sm">
                    {pageData.og_image || "Not set"}
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="og_image"
                      value={pageData.og_image || ""}
                      onChange={(e) =>
                        handleInputChange("og_image", e.target.value)
                      }
                      placeholder="https://example.com/og-image.jpg"
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Recommended: 1200x630px
                </p>
                {pageData.og_image && (
                  <div className="mt-2">
                    <img
                      src={pageData.og_image}
                      alt="OG"
                      className="h-32 w-auto rounded-md border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Settings & Media */}
        <div className="space-y-6">
          {/* Page Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
              <CardDescription>Configure page options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                {isViewing ? (
                  <p className="p-3 bg-muted rounded-md text-sm capitalize">
                    {pageData.template}
                  </p>
                ) : (
                  <Select
                    value={pageData.template || "default"}
                    onValueChange={(value) =>
                      handleInputChange("template", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATES.map((template) => (
                        <SelectItem key={template.value} value={template.value}>
                          {template.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Published</Label>
                  <p className="text-xs text-muted-foreground">
                    Make page visible to visitors
                  </p>
                </div>
                {isViewing ? (
                  <Badge
                    className={
                      pageData.is_published
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {pageData.is_published ? "Yes" : "No"}
                  </Badge>
                ) : (
                  <Switch
                    checked={pageData.is_published || false}
                    onCheckedChange={(checked) =>
                      handleInputChange("is_published", checked)
                    }
                  />
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Show in Menu</Label>
                  <p className="text-xs text-muted-foreground">
                    Display in navigation
                  </p>
                </div>
                {isViewing ? (
                  <Badge
                    className={
                      pageData.show_in_menu
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {pageData.show_in_menu ? "Yes" : "No"}
                  </Badge>
                ) : (
                  <Switch
                    checked={pageData.show_in_menu ?? true}
                    onCheckedChange={(checked) =>
                      handleInputChange("show_in_menu", checked)
                    }
                  />
                )}
              </div>

              {pageData.show_in_menu && (
                <div className="space-y-2">
                  <Label htmlFor="menu_order">Menu Order</Label>
                  {isViewing ? (
                    <p className="p-3 bg-muted rounded-md text-sm">
                      {pageData.menu_order}
                    </p>
                  ) : (
                    <Input
                      id="menu_order"
                      type="number"
                      min="1"
                      value={pageData.menu_order || 1}
                      onChange={(e) =>
                        handleInputChange(
                          "menu_order",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    Lower numbers appear first
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Featured Image Card */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
              <CardDescription>Set the page thumbnail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="featured_image">Image URL</Label>
                {isViewing ? (
                  <p className="p-3 bg-muted rounded-md text-sm break-all">
                    {pageData.featured_image || "No featured image"}
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="featured_image"
                      value={pageData.featured_image || ""}
                      onChange={(e) =>
                        handleInputChange("featured_image", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {pageData.featured_image && (
                <div className="mt-4">
                  <img
                    src={pageData.featured_image}
                    alt="Featured"
                    className="w-full h-auto rounded-md border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Page Info (for edit/view mode) */}
          {isEditing && pageData.created_at && (
            <Card>
              <CardHeader>
                <CardTitle>Page Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <p className="font-medium text-foreground">Created</p>
                      <p>
                        {new Date(pageData.created_at).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  {pageData.updated_at && (
                    <div className="flex items-center gap-2 text-muted-foreground pt-2 border-t">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <p className="font-medium text-foreground">Updated</p>
                        <p>
                          {new Date(pageData.updated_at).toLocaleString(
                            "en-US",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {pageData.author && (
                    <div className="flex items-center gap-2 text-muted-foreground pt-2 border-t">
                      <User className="h-4 w-4" />
                      <div>
                        <p className="font-medium text-foreground">Author</p>
                        <p>
                          {pageData.author.first_name}{" "}
                          {pageData.author.last_name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}