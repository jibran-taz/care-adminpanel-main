import { useEffect, useState } from "react";
import { ChevronDown, Eye, Pencil, Trash2, Plus, Image as ImageIcon } from "lucide-react";
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
import ToggleSwitch from "@/components/ui/toggle-switch";
import { notify } from "@/utils/utils";
import { CustomPagination } from "@/components/custom-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";

interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

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

export default function SlidersList() {
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(20);
  const [apiData, setApiData] = useState<{
    sliders: Slider[];
    pagination: PaginationData | null;
  }>({
    sliders: [],
    pagination: null,
  });
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchSliders = async (page: number = 1, itemsPerPage: number = 20) => {
    try {
      setIsLoading(true);

      const url = `admin/cms/sliders?page=${page}&per_page=${itemsPerPage}`;

      const response = await makeApiRequest(url, {
        method: "GET",
      });

      setApiData({
        sliders: response.data.data || [],
        pagination: {
          total: response.data.total,
          per_page: response.data.per_page,
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          from: response.data.from,
          to: response.data.to,
        },
      });
    } catch (error) {
      console.error("❌ Error fetching sliders:", error);
      notify({ message: "Failed to fetch sliders", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActiveToggle = async (sliderId: number, currentStatus: boolean) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [sliderId]: true }));

      const response = await makeApiRequest(`admin/cms/sliders/${sliderId}`, {
        method: "PUT",
        data: {
          is_active: !currentStatus,
        },
      });

      if (response.success === true) {
        await fetchSliders(apiData.pagination?.current_page || 1, perPage);
      }

      notify({
        message: `Slider ${!currentStatus ? "activated" : "deactivated"} successfully`,
        type: "success",
      });
    } catch (error: unknown) {
      console.error("❌ Error updating slider:", error);
      notify({
        message: "Failed to update slider",
        type: "error",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [sliderId]: false }));
    }
  };

  const handleDelete = async (sliderId: number) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;

    try {
      await makeApiRequest(`admin/cms/sliders/${sliderId}`, {
        method: "DELETE",
      });

      notify({
        message: "Slider deleted successfully",
        type: "success",
      });

      await fetchSliders(apiData.pagination?.current_page || 1, perPage);
    } catch (error) {
      console.error("❌ Error deleting slider:", error);
      notify({
        message: "Failed to delete slider",
        type: "error",
      });
    }
  };

  const getPositionBadge = (position: string) => {
    return (
      <Badge
        variant="outline"
        className={
          position === "left"
            ? "border-blue-500 text-blue-600"
            : position === "center"
            ? "border-purple-500 text-purple-600"
            : "border-green-500 text-green-600"
        }
      >
        {position}
      </Badge>
    );
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || !apiData.pagination || page > apiData.pagination.last_page)
      return;

    fetchSliders(page, perPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    fetchSliders(1, value);
  };

  useEffect(() => {
    fetchSliders(1, perPage);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sliders</h1>
          <p className="text-muted-foreground">
            Manage homepage sliders and banners
          </p>
        </div>
        <Link to="/dashboard/create-slider">
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Slider
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Sliders</CardTitle>
              <CardDescription>
                {apiData.pagination ? (
                  <span>
                    Showing {apiData.pagination.from} to {apiData.pagination.to}{" "}
                    of {apiData.pagination.total} sliders
                  </span>
                ) : (
                  "View and manage all sliders"
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
                <DropdownMenuItem onClick={() => handlePerPageChange(100)}>
                  100 per page
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Button</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-16 w-24 rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-3 w-[150px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[30px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[60px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[44px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-4" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <>
                  {apiData?.sliders?.length > 0 ? (
                    apiData.sliders.map((slider) => (
                      <TableRow key={slider.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="relative h-16 w-24 rounded overflow-hidden bg-gray-100">
                            {slider.image ? (
                              <img
                                src={slider.image}
                                alt={slider.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{slider.title}</div>
                            {slider.subtitle && (
                              <div className="text-sm text-muted-foreground">
                                {slider.subtitle}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {slider.button_text && (
                            <Badge
                              variant="outline"
                              className={
                                slider.button_style === "primary"
                                  ? "border-green-500 text-green-600"
                                  : "border-gray-500 text-gray-600"
                              }
                            >
                              {slider.button_text}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{slider.order}</Badge>
                        </TableCell>
                        <TableCell>
                          {getPositionBadge(slider.text_position)}
                        </TableCell>
                        <TableCell>
                          <ToggleSwitch
                            enabled={slider.is_active || false}
                            onChange={() =>
                              handleActiveToggle(slider.id, slider.is_active)
                            }
                            disabled={loadingStates[slider.id]}
                          />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(slider.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end cursor-pointer">
                            <Eye
                              size={15}
                              className="hover:text-green-600 transition-colors"
                              onClick={() =>
                                navigate(`/dashboard/view-slider/${slider.id}`)
                              }
                            />
                            <Pencil
                              size={15}
                              className="hover:text-blue-600 transition-colors"
                              onClick={() =>
                                navigate(`/dashboard/edit-slider/${slider.id}`)
                              }
                            />
                            <Trash2
                              size={15}
                              className="hover:text-red-600 transition-colors"
                              onClick={() => handleDelete(slider.id)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                          <p className="text-muted-foreground">No sliders found</p>
                          <Link to="/dashboard/sliders/create">
                            <Button
                              size="sm"
                              className="mt-2 bg-gradient-to-r from-green-500 to-emerald-600"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create First Slider
                            </Button>
                          </Link>
                        </div>
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
    </div>
  );
}