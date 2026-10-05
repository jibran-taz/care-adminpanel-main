import { useEffect, useState } from "react";
import { Search, ChevronDown, Pencil, Eye, Globe, Code, FileText, Home, List, Info, Phone, Settings, BookOpen } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import makeApiRequest from "@/services/axios";
import { apiUrl } from "@/services/api-end-point";
import { notify } from "@/utils/utils";
import { CustomPagination } from "@/components/custom-pagination";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";

interface SEOData {
  id: number;
  page_type: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string | null;
  og_type: string;
  twitter_card: string;
  schema_markup: string | null;
  custom_head_scripts: string | null;
  custom_body_scripts: string | null;
  created_at: string;
  updated_at: string;
}

interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export default function SEOManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPageType, setFilterPageType] = useState("all");
  const [perPage, setPerPage] = useState(20);
  const [apiData, setApiData] = useState<{
    seoData: SEOData[];
    pagination: PaginationData | null;
  }>({
    seoData: [],
    pagination: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSEO, setSelectedSEO] = useState<SEOData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<SEOData | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchSEOData = async (
    page: number = 1,
    itemsPerPage: number = 20,
    pageType: string = "",
    search: string = ""
  ) => {
    try {
      setIsLoading(true);

      let url = `${apiUrl.seoManagement}`;
      
      if (pageType && pageType !== "all") {
        url += `&page_type=${pageType}`;
      }
      
      if (search) {
        url += `&search=${search}`;
      }

      const response = await makeApiRequest(url, {
        method: "GET",
      });

      setApiData({
        seoData: response.data || [],
        pagination: response.data.pagination || null,
      });
    } catch (error) {
      console.error("❌ Error fetching SEO data:", error);
      notify({ message: "Failed to fetch SEO data", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSEO = async (pageType: string) => {
    try {
      const response = await makeApiRequest(`${apiUrl.seoManagement}/${pageType}`, {
        method: "GET",
      });

      if (response.success) {
        setSelectedSEO(response.data);
        setEditedData(response.data);
        setIsModalOpen(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("❌ Error fetching SEO details:", error);
      notify({ message: "Failed to fetch SEO details", type: "error" });
    }
  };

  const handleSave = async () => {
    if (!editedData) return;

    try {
      setSaving(true);
      const response = await makeApiRequest(
        `${apiUrl.seoManagement}/${editedData.page_type}`,
        {
          method: "PUT",
          data: editedData,
        }
      );

      if (response.success) {
        notify({ message: "SEO data updated successfully", type: "success" });
        setSelectedSEO(editedData);
        setIsEditing(false);
        
        // Refresh the list
        const apiPageType = filterPageType === "all" ? "" : filterPageType;
        await fetchSEOData(
          apiData.pagination?.current_page || 1,
          perPage,
          apiPageType,
          searchTerm
        );
      }
    } catch (error) {
      console.error("❌ Error saving SEO data:", error);
      notify({ message: "Failed to save SEO data", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SEOData, value: string) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSEO(null);
    setEditedData(null);
    setIsEditing(false);
  };

  const getPageIcon = (pageType: string) => {
    const iconProps = { className: "w-5 h-5 text-white" };
    
    switch (pageType) {
      case "home":
        return <Home {...iconProps} />;
      case "listings":
        return <List {...iconProps} />;
      case "about":
        return <Info {...iconProps} />;
      case "contact":
        return <Phone {...iconProps} />;
      case "services":
        return <Settings {...iconProps} />;
      case "blog":
        return <BookOpen {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  const getStatusBadge = (hasOG: boolean, hasSchema: boolean) => {
    if (hasOG && hasSchema) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Complete
        </Badge>
      );
    } else if (hasOG || hasSchema) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Partial
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        Basic
      </Badge>
    );
  };

  const handlePageTypeFilterChange = (value: string) => {
    setFilterPageType(value);
    const apiPageType = value === "all" ? "" : value;
    fetchSEOData(1, perPage, apiPageType, searchTerm);
  };

  const handleSearch = () => {
    const apiPageType = filterPageType === "all" ? "" : filterPageType;
    fetchSEOData(1, perPage, apiPageType, searchTerm);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || !apiData.pagination || page > apiData.pagination.last_page)
      return;

    const apiPageType = filterPageType === "all" ? "" : filterPageType;
    fetchSEOData(page, perPage, apiPageType, searchTerm);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    const apiPageType = filterPageType === "all" ? "" : filterPageType;
    fetchSEOData(1, value, apiPageType, searchTerm);
  };

  useEffect(() => {
    fetchSEOData(1, perPage);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Management</h1>
          <p className="text-muted-foreground">
            Manage meta tags, Open Graph, and SEO settings for all pages
          </p>
        </div>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg">
          <Globe className="mr-2 h-4 w-4" />
          SEO Analytics
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Page SEO Settings</CardTitle>
              <CardDescription>
                {apiData.pagination ? (
                  <span>
                    Showing {apiData.pagination.from} to {apiData.pagination.to}{" "}
                    of {apiData.pagination.total} pages
                    {filterPageType !== "all" && ` • Page Type: ${filterPageType}`}
                  </span>
                ) : (
                  "View and manage SEO settings for all pages"
                )}
              </CardDescription>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Show: {perPage}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handlePerPageChange(10)}>
                  10 per page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePerPageChange(20)}>
                  20 per page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePerPageChange(50)}>
                  50 per page
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Filters */}
          <div className="flex gap-4 pt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by page type or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
              />
            </div>

            <Select value={filterPageType} onValueChange={handlePageTypeFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Page Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Pages</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="listings">Listings</SelectItem>
                  <SelectItem value="about">About</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} variant="secondary">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Meta Title</TableHead>
                <TableHead>Meta Description</TableHead>
                <TableHead>SEO Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-[100px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[250px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-4" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <>
                  {apiData?.seoData?.length > 0 ? (
                    apiData.seoData.map((seo) => (
                      <TableRow key={seo.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg flex items-center justify-center">
                              {getPageIcon(seo.page_type)}
                            </div>
                            <div>
                              <div className="font-medium capitalize">
                                {seo.page_type}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                /{seo.page_type}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate font-medium">
                            {seo.meta_title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-sm truncate text-sm text-muted-foreground">
                            {seo.meta_description}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(
                            !!seo.og_title,
                            !!seo.schema_markup
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(seo.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Eye
                              size={16}
                              className="cursor-pointer hover:text-green-600 transition-colors"
                              onClick={() => handleViewSEO(seo.page_type)}
                            />
                            <Pencil
                              size={16}
                              className="cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => {
                                handleViewSEO(seo.page_type);
                                setTimeout(() => setIsEditing(true), 100);
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <p className="text-muted-foreground">No SEO data found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {apiData.pagination && apiData.pagination.last_page > 1 && (
            <div className="mt-6">
              <CustomPagination
                currentPage={apiData.pagination.current_page}
                lastPage={apiData.pagination.last_page}
                onPageChange={handlePageChange}
                total={apiData.pagination.total}
                from={apiData.pagination.from}
                to={apiData.pagination.to}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg flex items-center justify-center">
              {selectedSEO && getPageIcon(selectedSEO.page_type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold capitalize">
                {selectedSEO?.page_type} - SEO Settings
              </h3>
              <p className="text-sm text-muted-foreground">
                {isEditing ? "Edit SEO settings" : "View SEO settings"}
              </p>
            </div>
          </div>
        }
        showFooter={false}
        width="max-w-4xl"
      >
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pb-4 border-b">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedData(selectedSEO);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>

          {selectedSEO && (
            <Tabs defaultValue="meta" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="meta">
                  <FileText className="mr-2 h-4 w-4" />
                  Meta Tags
                </TabsTrigger>
                <TabsTrigger value="social">
                  <Globe className="mr-2 h-4 w-4" />
                  Social Media
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <Code className="mr-2 h-4 w-4" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              {/* Meta Tags Tab */}
              <TabsContent value="meta" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  {isEditing ? (
                    <Input
                      id="meta_title"
                      value={editedData?.meta_title || ""}
                      onChange={(e) =>
                        handleInputChange("meta_title", e.target.value)
                      }
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 p-3 bg-muted rounded-md">
                      {selectedSEO.meta_title}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  {isEditing ? (
                    <Textarea
                      id="meta_description"
                      value={editedData?.meta_description || ""}
                      onChange={(e) =>
                        handleInputChange("meta_description", e.target.value)
                      }
                      rows={3}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 p-3 bg-muted rounded-md">
                      {selectedSEO.meta_description}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  {isEditing ? (
                    <Input
                      id="meta_keywords"
                      value={editedData?.meta_keywords || ""}
                      onChange={(e) =>
                        handleInputChange("meta_keywords", e.target.value)
                      }
                      className="mt-2"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  ) : (
                    <p className="mt-2 p-3 bg-muted rounded-md">
                      {selectedSEO.meta_keywords}
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* Social Media Tab */}
              <TabsContent value="social" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="og_title">Open Graph Title</Label>
                  {isEditing ? (
                    <Input
                      id="og_title"
                      value={editedData?.og_title || ""}
                      onChange={(e) =>
                        handleInputChange("og_title", e.target.value)
                      }
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 p-3 bg-muted rounded-md">
                      {selectedSEO.og_title}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="og_description">Open Graph Description</Label>
                  {isEditing ? (
                    <Textarea
                      id="og_description"
                      value={editedData?.og_description || ""}
                      onChange={(e) =>
                        handleInputChange("og_description", e.target.value)
                      }
                      rows={2}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 p-3 bg-muted rounded-md">
                      {selectedSEO.og_description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="og_type">OG Type</Label>
                    {isEditing ? (
                      <Input
                        id="og_type"
                        value={editedData?.og_type || ""}
                        onChange={(e) =>
                          handleInputChange("og_type", e.target.value)
                        }
                        className="mt-2"
                      />
                    ) : (
                      <p className="mt-2 p-3 bg-muted rounded-md">
                        {selectedSEO.og_type}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="twitter_card">Twitter Card</Label>
                    {isEditing ? (
                      <Input
                        id="twitter_card"
                        value={editedData?.twitter_card || ""}
                        onChange={(e) =>
                          handleInputChange("twitter_card", e.target.value)
                        }
                        className="mt-2"
                      />
                    ) : (
                      <p className="mt-2 p-3 bg-muted rounded-md">
                        {selectedSEO.twitter_card}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="og_image">OG Image URL</Label>
                  {isEditing ? (
                    <Input
                      id="og_image"
                      value={editedData?.og_image || ""}
                      onChange={(e) =>
                        handleInputChange("og_image", e.target.value)
                      }
                      className="mt-2"
                      placeholder="https://example.com/image.jpg"
                    />
                  ) : (
                    <p className="mt-2 p-3 bg-muted rounded-md">
                      {selectedSEO.og_image || "Not set"}
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="schema_markup">Schema Markup (JSON-LD)</Label>
                  {isEditing ? (
                    <Textarea
                      id="schema_markup"
                      value={editedData?.schema_markup || ""}
                      onChange={(e) =>
                        handleInputChange("schema_markup", e.target.value)
                      }
                      rows={6}
                      className="mt-2 font-mono text-sm"
                      placeholder='{"@context": "https://schema.org", ...}'
                    />
                  ) : (
                    <pre className="mt-2 p-3 bg-muted rounded-md overflow-x-auto text-sm">
                      {selectedSEO.schema_markup || "Not set"}
                    </pre>
                  )}
                </div>

                <div>
                  <Label htmlFor="custom_head_scripts">Custom Head Scripts</Label>
                  {isEditing ? (
                    <Textarea
                      id="custom_head_scripts"
                      value={editedData?.custom_head_scripts || ""}
                      onChange={(e) =>
                        handleInputChange("custom_head_scripts", e.target.value)
                      }
                      rows={4}
                      className="mt-2 font-mono text-sm"
                      placeholder="<script>...</script>"
                    />
                  ) : (
                    <pre className="mt-2 p-3 bg-muted rounded-md overflow-x-auto text-sm">
                      {selectedSEO.custom_head_scripts || "Not set"}
                    </pre>
                  )}
                </div>

                <div>
                  <Label htmlFor="custom_body_scripts">Custom Body Scripts</Label>
                  {isEditing ? (
                    <Textarea
                      id="custom_body_scripts"
                      value={editedData?.custom_body_scripts || ""}
                      onChange={(e) =>
                        handleInputChange("custom_body_scripts", e.target.value)
                      }
                      rows={4}
                      className="mt-2 font-mono text-sm"
                      placeholder="<script>...</script>"
                    />
                  ) : (
                    <pre className="mt-2 p-3 bg-muted rounded-md overflow-x-auto text-sm">
                      {selectedSEO.custom_body_scripts || "Not set"}
                    </pre>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Timestamps */}
          {selectedSEO && (
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t mt-6">
              <div className="flex items-center space-x-2">
                <span>
                  Created: {new Date(selectedSEO.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span>
                  Updated: {new Date(selectedSEO.updated_at).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}