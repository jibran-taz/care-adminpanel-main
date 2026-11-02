import { CustomPagination } from "@/components/custom-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiUrl } from "@/services/api-end-point";
import makeApiRequest from "@/services/axios";
import { formatDate, notify } from "@/utils/utils";
import {
  AlertTriangle,
  CheckSquare,
  ChevronDown,
  Eye,
  Loader2,
  MessageSquare,
  Trash2,
  XSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  admin_response: string | null;
  responded_by: string | null;
  responded_at: string | null;
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

export default function EnquiryListing() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [perPage, setPerPage] = useState(15);
  const [apiData, setApiData] = useState<{
    enquiries: Enquiry[];
    pagination: PaginationData | null;
  }>({
    enquiries: [],
    pagination: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Selection states
  const [selectedEnquiryIds, setSelectedEnquiryIds] = useState<number[]>([]);

  // Single Delete state
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    enquiry: Enquiry | null;
  }>({ open: false, enquiry: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Bulk Delete state
  const [bulkDeleteModal, setBulkDeleteModal] = useState<{
    open: boolean;
    all: boolean;
    count: number;
  }>({ open: false, all: false, count: 0 });
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState({ current: 0, total: 0 });

  const isAllSelected =
    apiData.enquiries.length > 0 &&
    apiData.enquiries.every((e) => selectedEnquiryIds.includes(e.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEnquiryIds(apiData.enquiries.map((e) => e.id));
    } else {
      setSelectedEnquiryIds([]);
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedEnquiryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const fetchEnquiries = async (
    page: number = 1,
    itemsPerPage: number = 15,
    status: string = ""
  ) => {
    try {
      setIsLoading(true);

      let url = `${`admin/inquiries`}?page=${page}&per_page=${itemsPerPage}`;

      if (status && status !== "all") {
        url += `&status=${status}`;
      }

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await makeApiRequest(url, {
        method: "GET",
      });

      setApiData({
        enquiries: response.data.data || [],
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
      console.error("Error fetching enquiries:", error);
      notify({ message: "Failed to fetch enquiries", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Single Delete handler
  const handleDelete = async () => {
    if (!deleteModal.enquiry) return;
    try {
      setIsDeleting(true);
      await makeApiRequest(`/admin/inquiries/${deleteModal.enquiry.id}`, {
        method: "DELETE",
      });

      notify({ message: "Enquiry deleted successfully", type: "success" });

      setSelectedEnquiryIds((prev) =>
        prev.filter((id) => id !== deleteModal.enquiry!.id)
      );
      setApiData((prev) => ({
        ...prev,
        enquiries: prev.enquiries.filter(
          (e) => e.id !== deleteModal.enquiry!.id
        ),
      }));

      setDeleteModal({ open: false, enquiry: null });
    } catch (error: any) {
      notify({
        message: error?.response?.data?.message || "Failed to delete enquiry",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk Delete handler
  const handleExecuteBulkDelete = async () => {
    const idsToDelete = bulkDeleteModal.all
      ? apiData.enquiries.map((e) => e.id)
      : selectedEnquiryIds;

    if (idsToDelete.length === 0) return;

    try {
      setIsBulkDeleting(true);
      setDeleteProgress({ current: 0, total: idsToDelete.length });

      let successCount = 0;
      for (let i = 0; i < idsToDelete.length; i++) {
        const id = idsToDelete[i];
        try {
          await makeApiRequest(`/admin/inquiries/${id}`, {
            method: "DELETE",
          });
          successCount++;
        } catch (err) {
          console.error(`Failed to delete enquiry ${id}:`, err);
        }
        setDeleteProgress({ current: i + 1, total: idsToDelete.length });
      }

      notify({
        message: `Successfully deleted ${successCount} enquiry(s)`,
        type: "success",
      });

      setSelectedEnquiryIds([]);
      setBulkDeleteModal({ open: false, all: false, count: 0 });

      await fetchEnquiries(
        apiData.pagination?.current_page || 1,
        perPage,
        filterStatus === "all" ? "" : filterStatus
      );
    } catch (error: any) {
      notify({
        message: error?.response?.data?.message || "Failed to complete bulk delete",
        type: "error",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Resolved
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Closed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            {status}
          </Badge>
        );
    }
  };

  const handleStatusFilterChange = (status: string) => {
    setFilterStatus(status);
    setSelectedEnquiryIds([]);
    const apiStatus = status === "all" ? "" : status;
    fetchEnquiries(1, perPage, apiStatus);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || !apiData.pagination || page > apiData.pagination.last_page)
      return;
    setSelectedEnquiryIds([]);
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    fetchEnquiries(page, perPage, apiStatus);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setSelectedEnquiryIds([]);
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    fetchEnquiries(1, value, apiStatus);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const apiStatus = filterStatus === "all" ? "" : filterStatus;
      fetchEnquiries(1, perPage, apiStatus);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    fetchEnquiries(1, perPage, apiStatus);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enquiries</h1>
          <p className="text-muted-foreground">
            Manage and respond to customer enquiries and contact form messages
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {apiData.enquiries.length > 0 && (
            <Button
              variant="destructive"
              onClick={() =>
                setBulkDeleteModal({
                  open: true,
                  all: true,
                  count: apiData.enquiries.length,
                })
              }
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All ({apiData.enquiries.length})
            </Button>
          )}
        </div>
      </div>

      {/* Floating Selection Banner */}
      {selectedEnquiryIds.length > 0 && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 font-medium">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            <span>
              <strong>{selectedEnquiryIds.length}</strong> enquiry(s) selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedEnquiryIds([])}
              className="bg-white hover:bg-gray-50 text-gray-700"
            >
              <XSquare className="mr-1 h-4 w-4" />
              Clear
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                setBulkDeleteModal({
                  open: true,
                  all: false,
                  count: selectedEnquiryIds.length,
                })
              }
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete Selected ({selectedEnquiryIds.length})
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Enquiry Management</CardTitle>
              <CardDescription>
                {apiData.pagination ? (
                  <span>
                    Showing {apiData.pagination.from} to{" "}
                    {apiData.pagination.to} of {apiData.pagination.total}{" "}
                    enquiries
                    {filterStatus !== "all" && ` • Status: ${filterStatus}`}
                  </span>
                ) : (
                  "View and manage all enquiries"
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
                <DropdownMenuItem onClick={() => handlePerPageChange(15)}>
                  15 per page
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
            <Input
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />

            <Select
              value={filterStatus}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[45px]">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responded By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-4 w-4" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[130px]" />
                              <Skeleton className="h-3 w-[180px]" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[110px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[250px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[70px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[90px]" />
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
                    {apiData?.enquiries?.length > 0 ? (
                      apiData.enquiries.map((enq) => {
                        const isSelected = selectedEnquiryIds.includes(enq.id);
                        return (
                          <TableRow
                            key={enq.id}
                            className={
                              isSelected ? "bg-blue-50/60" : "hover:bg-muted/50"
                            }
                          >
                            <TableCell>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() =>
                                  handleToggleSelect(enq.id)
                                }
                                aria-label={`Select enquiry ${enq.name}`}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
                                  {enq.name
                                    ? enq.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                    : "U"}
                                </div>
                                <div>
                                  <div className="font-medium text-foreground">
                                    {enq.name || "N/A"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {enq.email || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {enq.phone || "N/A"}
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <p className="line-clamp-2 text-sm text-muted-foreground">
                                {enq.message}
                              </p>
                            </TableCell>
                            <TableCell>{getStatusBadge(enq.status)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {enq.responded_by ? enq.responded_by : "—"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                              {formatDate(enq.created_at)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Eye
                                  size={15}
                                  className="cursor-pointer hover:text-green-600 transition-colors"
                                  onClick={() =>
                                    navigate(`/dashboard/enquiries/${enq.id}`)
                                  }
                                />
                                <Trash2
                                  size={15}
                                  className="cursor-pointer hover:text-red-600 transition-colors"
                                  onClick={() =>
                                    setDeleteModal({ open: true, enquiry: enq })
                                  }
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <p className="text-muted-foreground">
                            No enquiries found
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
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

      {/* Single Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() =>
          !isDeleting && setDeleteModal({ open: false, enquiry: null })
        }
        title="Delete Enquiry"
        showFooter={false}
        width="max-w-md"
      >
        <div className="space-y-4 pt-2">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete the enquiry from{" "}
              <strong className="text-foreground">
                {deleteModal.enquiry?.name}
              </strong>
              ? This action{" "}
              <span className="text-red-600 font-medium">cannot be undone</span>.
            </p>
          </div>

          <div className="bg-red-50 p-3 rounded-md text-xs text-muted-foreground border border-red-100">
            <p className="font-medium text-xs mb-1 uppercase tracking-wide text-red-500">
              Enquiry Message
            </p>
            <p className="line-clamp-2">{deleteModal.enquiry?.message}</p>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, enquiry: null })}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Delete Modal */}
      <Modal
        isOpen={bulkDeleteModal.open}
        onClose={() =>
          !isBulkDeleting &&
          setBulkDeleteModal({ open: false, all: false, count: 0 })
        }
        title={
          bulkDeleteModal.all
            ? "Delete All Enquiries"
            : "Delete Selected Enquiries"
        }
        showFooter={false}
        width="max-w-md"
      >
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3 p-3 bg-red-50 text-red-800 rounded-lg border border-red-200">
            <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" />
            <p className="text-sm">
              {bulkDeleteModal.all
                ? `You are about to delete ALL ${bulkDeleteModal.count} customer enquiry messages.`
                : `You are about to delete ${bulkDeleteModal.count} selected enquiry message(s).`}
            </p>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            This action <span className="text-red-600 font-semibold">cannot be undone</span>.
          </p>

          {isBulkDeleting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Deleting enquiries...</span>
                <span>
                  {deleteProgress.current} / {deleteProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${deleteProgress.total > 0
                        ? (deleteProgress.current / deleteProgress.total) * 100
                        : 0
                      }%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() =>
                setBulkDeleteModal({ open: false, all: false, count: 0 })
              }
              disabled={isBulkDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleExecuteBulkDelete}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                `Yes, Delete (${bulkDeleteModal.count})`
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
