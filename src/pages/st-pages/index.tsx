import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Pencil,
  Eye,
  Trash2,
  Plus,
  FileText,
  Check,
  X,
  Image as ImageIcon,
  ExternalLink,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export default function GetAllPagesListing() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPublished, setFilterPublished] = useState("all");
  const [perPage, setPerPage] = useState(20);
  const [apiData, setApiData] = useState<{
    pages: PageData[];
    pagination: PaginationData | null;
  }>({
    pages: [],
    pagination: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<PageData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPages = async (
    page: number = 1,
    itemsPerPage: number = 20,
    published: string = "",
    search: string = ""
  ) => {
    try {
      setIsLoading(true);

      let url = `${apiUrl.cmsPages}?page=${page}&per_page=${itemsPerPage}`;

      if (published && published !== "all") {
        url += `&is_published=${published === "published" ? 1 : 0}`;
      }

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await makeApiRequest(url, {
        method: "GET",
      });

      if (response.success) {
        setApiData({
          pages: response.data.data || [],
          pagination: {
            total: response.data.total,
            per_page: response.data.per_page,
            current_page: response.data.current_page,
            last_page: response.data.last_page,
            from: response.data.from,
            to: response.data.to,
          },
        });
      }
    } catch (error) {
      console.error("❌ Error fetching pages:", error);
      notify({ message: "Failed to fetch pages", type: "error" });
      setApiData({ pages: [], pagination: null });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (page: PageData) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!pageToDelete) return;

    try {
      setDeleting(true);

      // Delete API call
      const response = await makeApiRequest(
        `${apiUrl.cmsPages}/${pageToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.success) {
        notify({ 
          message: "Page deleted successfully", 
          type: "success" 
        });
        
        // Close dialog
        setDeleteDialogOpen(false);
        setPageToDelete(null);

        // Refresh the list
        const apiPublished = filterPublished === "all" ? "" : filterPublished;
        await fetchPages(
          apiData.pagination?.current_page || 1,
          perPage,
          apiPublished,
          searchTerm
        );
      }
    } catch (error: any) {
      console.error("❌ Error deleting page:", error);
      notify({ 
        message: error?.response?.data?.message || "Failed to delete page", 
        type: "error" 
      });
    } finally {
      setDeleting(false);
    }
  };

  const handlePublishedFilterChange = (value: string) => {
    setFilterPublished(value);
    const apiPublished = value === "all" ? "" : value;
    fetchPages(1, perPage, apiPublished, searchTerm);
  };

  const handleSearch = () => {
    const apiPublished = filterPublished === "all" ? "" : filterPublished;
    fetchPages(1, perPage, apiPublished, searchTerm);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || !apiData.pagination || page > apiData.pagination.last_page)
      return;

    const apiPublished = filterPublished === "all" ? "" : filterPublished;
    fetchPages(page, perPage, apiPublished, searchTerm);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    const apiPublished = filterPublished === "all" ? "" : filterPublished;
    fetchPages(1, value, apiPublished, searchTerm);
  };

  useEffect(() => {
    fetchPages(1, perPage);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
          <p className="text-muted-foreground">
            Manage your website pages and content
          </p>
        </div>
        <Button
           onClick={()=> navigate('/dashboard/pages/create')}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Page
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Pages</CardTitle>
              <CardDescription>
                {apiData.pagination ? (
                  <span>
                    Showing {apiData.pagination.from} to {apiData.pagination.to}{" "}
                    of {apiData.pagination.total} pages
                    {filterPublished !== "all" &&
                      ` • ${filterPublished === "published" ? "Published" : "Draft"}`}
                  </span>
                ) : (
                  "Manage all your website pages"
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
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handlePerPageChange(10)}>
                  10 per page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePerPageChange(20)}>
                  20 per page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePerPageChange(50)}>
                  50 per page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePerPageChange(100)}>
                  100 per page
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Filters */}
          <div className="flex gap-4 pt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
              />
            </div>

            <Select
              value={filterPublished}
              onValueChange={handlePublishedFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Pages</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead className="w-[150px]">Slug</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Menu</TableHead>
                  <TableHead className="w-[120px]">Author</TableHead>
                  <TableHead className="w-[120px]">Published</TableHead>
                  <TableHead className="w-[100px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-3 w-[200px]" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[80px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[60px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Skeleton className="h-8 w-8 rounded" />
                            <Skeleton className="h-8 w-8 rounded" />
                            <Skeleton className="h-8 w-8 rounded" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : apiData?.pages?.length > 0 ? (
                  apiData.pages.map((page) => (
                    <TableRow key={page.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium flex items-center gap-2">
                            {page.title}
                            {page.featured_image && (
                              <ImageIcon className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {page.excerpt || "No excerpt"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {page.slug}
                          </code>
                          <ExternalLink className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-primary" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {page.is_published ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <Check className="h-3 w-3 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            <X className="h-3 w-3 mr-1" />
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {page.show_in_menu ? (
                          <Badge
                            variant="outline"
                            className="text-xs text-blue-600 border-blue-600"
                          >
                            #{page.menu_order}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            Hidden
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs">
                            {page.author.first_name[0]}
                            {page.author.last_name[0]}
                          </div>
                          <span className="text-sm">
                            {page.author.first_name} {page.author.last_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {page.published_at
                          ? new Date(page.published_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigate(`/dashboard/pages/edit/${page.id}`)
                            }
                            className="h-8 w-8"
                            title="View page"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigate(`/dashboard/pages/edit/${page.id}`)
                            }
                            className="h-8 w-8"
                            title="Edit page"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete(page)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete page"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <FileText className="h-12 w-12 text-muted-foreground/50" />
                        <div>
                          <p className="font-medium">No pages found</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {searchTerm || filterPublished !== "all"
                              ? "Try adjusting your filters"
                              : "Create your first page to get started"}
                          </p>
                        </div>
                        {!searchTerm && filterPublished === "all" && (
                          <Button
                            onClick={() => navigate("/admin/pages/create")}
                            className="mt-4"
                            variant="outline"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Page
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "<strong>{pageToDelete?.title}</strong>"? 
              This action cannot be undone and will permanently remove this page from your website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Deleting...
                </>
              ) : (
                "Delete Page"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}