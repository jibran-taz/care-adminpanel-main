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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
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
  text_position: string;
  overlay_color: string;
  overlay_opacity: number;
}

export default function EditSlider() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [mobileImagePreview, setMobileImagePreview] = useState<string>("");
  const [isDraggingDesktop, setIsDraggingDesktop] = useState(false);
  const [isDraggingMobile, setIsDraggingMobile] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: null as File | null,
    mobile_image: null as File | null,
    button_text: "",
    button_url: "",
    button_style: "primary",
    order: "1",
    text_position: "left",
    overlay_color: "#000000",
    overlay_opacity: "50",
  });

  const [existingImages, setExistingImages] = useState({
    desktop: "",
    mobile: "",
  });

  const fetchSlider = async () => {
    try {
      setFetchLoading(true);
      const response = await makeApiRequest(`admin/cms/sliders/${id}`, {
        method: "GET",
      });

      if (response.success && response.data) {
        const slider: Slider = response.data;

        setFormData({
          title: slider.title || "",
          subtitle: slider.subtitle || "",
          description: slider.description || "",
          image: null,
          mobile_image: null,
          button_text: slider.button_text || "",
          button_url: slider.button_url || "",
          button_style: slider.button_style || "primary",
          order: String(slider.order || 1),
          text_position: slider.text_position || "left",
          overlay_color: slider.overlay_color || "#000000",
          overlay_opacity: String(slider.overlay_opacity || 50),
        });

        setExistingImages({
          desktop: slider.image || "",
          mobile: slider.mobile_image || "",
        });

        setImagePreview(slider.image || "");
        setMobileImagePreview(slider.mobile_image || "");
      }
    } catch (error) {
      console.error("Error fetching slider:", error);
      toast.error("Failed to fetch slider");
      navigate("/dashboard/sliders");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSlider();
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const processImageFile = (file: File, type: "image" | "mobile_image") => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [type]: file,
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "image") {
        setImagePreview(reader.result as string);
      } else {
        setMobileImagePreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "mobile_image"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, type);
    }
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    type: "desktop" | "mobile"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "desktop") {
      setIsDraggingDesktop(true);
    } else {
      setIsDraggingMobile(true);
    }
  };

  const handleDragLeave = (
    e: React.DragEvent<HTMLDivElement>,
    type: "desktop" | "mobile"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "desktop") {
      setIsDraggingDesktop(false);
    } else {
      setIsDraggingMobile(false);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type: "image" | "mobile_image"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === "image") {
      setIsDraggingDesktop(false);
    } else {
      setIsDraggingMobile(false);
    }

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processImageFile(files[0], type);
    }
  };

  const handleRemoveImage = (type: "image" | "mobile_image") => {
    setFormData((prev) => ({
      ...prev,
      [type]: null,
    }));
    if (type === "image") {
      setImagePreview(existingImages.desktop);
    } else {
      setMobileImagePreview(existingImages.mobile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle);
      formDataToSend.append("description", formData.description);

      // Only append images if new files are selected
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      if (formData.mobile_image) {
        formDataToSend.append("mobile_image", formData.mobile_image);
      }

      formDataToSend.append("button_text", formData.button_text);
      formDataToSend.append("button_url", formData.button_url);
      formDataToSend.append("button_style", formData.button_style);
      formDataToSend.append("order", formData.order);
      formDataToSend.append("text_position", formData.text_position);
      formDataToSend.append("overlay_color", formData.overlay_color);
      formDataToSend.append("overlay_opacity", formData.overlay_opacity);
      formDataToSend.append("_method", "PUT");

      const response = await makeApiRequest(`admin/cms/sliders/${id}`, {
        method: "POST",
        data: formDataToSend,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.success) {
        toast.success("Slider updated successfully");
        navigate("/dashboard/sliders");
      }
    } catch (error) {
      console.error("Error updating slider:", error);
      toast.error("Failed to update slider");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading slider...</p>
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
          onClick={() => navigate("/dashboard/sliders")}
          className="hover:bg-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Slider</h1>
          <p className="text-muted-foreground">Update slider information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Basic Information */}
          <Card className="border-2 border-green-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the main content for your slider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title" className="text-sm font-semibold">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Find Trusted Care Providers"
                    className="mt-2 focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle" className="text-sm font-semibold">
                    Subtitle
                  </Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="In Your Area"
                    className="mt-2 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Book verified care providers for all your needs"
                  rows={3}
                  className="mt-2 focus:ring-2 focus:ring-green-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-2 border-green-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Images
              </CardTitle>
              <CardDescription>
                Upload desktop and mobile images for the slider (leave empty to
                keep existing)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Desktop Image */}
              <div>
                <Label className="text-sm font-semibold">Desktop Image</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Recommended size: 1920x800px • Drag and drop or click to
                  upload
                </p>

                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Desktop preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                      <input
                        type="file"
                        id="image-change"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "image")}
                        className="hidden"
                      />
                      <label htmlFor="image-change">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() =>
                            document.getElementById("image-change")?.click()
                          }
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Change
                        </Button>
                      </label>
                      {formData.image && (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveImage("image")}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => handleDragOver(e, "desktop")}
                    onDragLeave={(e) => handleDragLeave(e, "desktop")}
                    onDrop={(e) => handleDrop(e, "image")}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                      isDraggingDesktop
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-green-500"
                    }`}
                  >
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "image")}
                      className="hidden"
                    />
                    <label
                      htmlFor="image"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload
                        className={`h-12 w-12 mb-3 ${
                          isDraggingDesktop ? "text-green-500" : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm text-gray-600 mb-1">
                        {isDraggingDesktop
                          ? "Drop image here"
                          : "Drag and drop or click to upload desktop image"}
                      </span>
                      <span className="text-xs text-gray-400">
                        PNG, JPG up to 5MB
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Mobile Image */}
              <div>
                <Label className="text-sm font-semibold">Mobile Image</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Recommended size: 768x600px • Drag and drop or click to
                  upload
                </p>

                {mobileImagePreview ? (
                  <div className="relative group">
                    <img
                      src={mobileImagePreview}
                      alt="Mobile preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                      <input
                        type="file"
                        id="mobile-image-change"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "mobile_image")}
                        className="hidden"
                      />
                      <label htmlFor="mobile-image-change">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() =>
                            document
                              .getElementById("mobile-image-change")
                              ?.click()
                          }
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Change
                        </Button>
                      </label>
                      {formData.mobile_image && (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveImage("mobile_image")}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => handleDragOver(e, "mobile")}
                    onDragLeave={(e) => handleDragLeave(e, "mobile")}
                    onDrop={(e) => handleDrop(e, "mobile_image")}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                      isDraggingMobile
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-green-500"
                    }`}
                  >
                    <input
                      type="file"
                      id="mobile_image"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "mobile_image")}
                      className="hidden"
                    />
                    <label
                      htmlFor="mobile_image"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload
                        className={`h-12 w-12 mb-3 ${
                          isDraggingMobile ? "text-green-500" : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm text-gray-600 mb-1">
                        {isDraggingMobile
                          ? "Drop image here"
                          : "Drag and drop or click to upload mobile image"}
                      </span>
                      <span className="text-xs text-gray-400">
                        PNG, JPG up to 5MB
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Button Settings */}
          <Card className="border-2 border-green-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Button Settings
              </CardTitle>
              <CardDescription>
                Configure the call-to-action button
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label
                    htmlFor="button_text"
                    className="text-sm font-semibold"
                  >
                    Button Text
                  </Label>
                  <Input
                    id="button_text"
                    name="button_text"
                    value={formData.button_text}
                    onChange={handleInputChange}
                    placeholder="Get Started"
                    className="mt-2 focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <Label htmlFor="button_url" className="text-sm font-semibold">
                    Button URL
                  </Label>
                  <Input
                    id="button_url"
                    name="button_url"
                    value={formData.button_url}
                    onChange={handleInputChange}
                    placeholder="/register"
                    className="mt-2 focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="button_style"
                    className="text-sm font-semibold"
                  >
                    Button Style
                  </Label>
                  <Select
                    value={formData.button_style}
                    onValueChange={(value) =>
                      handleSelectChange("button_style", value)
                    }
                  >
                    <SelectTrigger className="mt-2 focus:ring-2 focus:ring-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card className="border-2 border-green-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Display Settings
              </CardTitle>
              <CardDescription>
                Configure how the slider appears
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="order" className="text-sm font-semibold">
                    Order
                  </Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="mt-2 focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers appear first
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="text_position"
                    className="text-sm font-semibold"
                  >
                    Text Position
                  </Label>
                  <Select
                    value={formData.text_position}
                    onValueChange={(value) =>
                      handleSelectChange("text_position", value)
                    }
                  >
                    <SelectTrigger className="mt-2 focus:ring-2 focus:ring-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label
                    htmlFor="overlay_color"
                    className="text-sm font-semibold"
                  >
                    Overlay Color
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="overlay_color"
                      name="overlay_color"
                      type="color"
                      value={formData.overlay_color}
                      onChange={handleInputChange}
                      className="w-20 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={formData.overlay_color}
                      onChange={handleInputChange}
                      name="overlay_color"
                      placeholder="#000000"
                      className="flex-1 focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="overlay_opacity"
                    className="text-sm font-semibold"
                  >
                    Overlay Opacity: {formData.overlay_opacity}%
                  </Label>
                  <Input
                    id="overlay_opacity"
                    name="overlay_opacity"
                    type="range"
                    min="0"
                    max="100"
                    value={formData.overlay_opacity}
                    onChange={handleInputChange}
                    className="mt-2 w-full cursor-pointer"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/sliders")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Slider"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}