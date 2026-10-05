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
import { ChevronDown, Eye, MessageSquare, Trash2 } from "lucide-react";
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

  // Delete state
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    enquiry: Enquiry | null;
  }>({ open: false, enquiry: null });
  const [isDeleting, setIsDeleting] = useState(false);

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

      const response = await makeApiRequest(url, { method: "GET" });
      const resData = response.data;

      setApiData({
        enquiries: resData?.data || [],
        pagination: resData
          ? {
              total: resData.total,
              per_page: resData.per_page,
              current_page: resData.current_page,
              last_page: resData.last_page,
              from: resData.from,
              to: resData.to,
            }
          : null,
      });
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      notify({ message: "Failed to fetch enquiries", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Delete handler ──────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteModal.enquiry) return;
    try {
      setIsDeleting(true);
      await makeApiRequest(`/admin/inquiries/${deleteModal.enquiry.id}`, {
        method: "DELETE",
      });

      notify({ message: "Enquiry deleted successfully", type: "success" });

      // Remove from local list
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

  const handleStatusFilterChange = (status: string) => {
    setFilterStatus(status);
    const apiStatus = status === "all" ? "" : status;
    fetchEnquiries(1, perPage, apiStatus);
  };

  const handlePageChange = (page: number) => {
    if (!apiData.pagination || page < 1 || page > apiData.pagination.last_page)
      return;
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    fetchEnquiries(page, perPage, apiStatus);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    fetchEnquiries(1, value, apiStatus);
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge
        className={
          status === "resolved"
            ? "bg-green-100 text-green-800 hover:bg-green-100"
            : status === "pending"
            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            : "bg-red-100 text-red-800 hover:bg-red-100"
        }
      >
        {status}
      </Badge>
    );
  };

  const filteredEnquiries = apiData.enquiries.filter((enq) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      enq.name?.toLowerCase().includes(term) ||
      enq.email?.toLowerCase().includes(term) ||
      enq.phone?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    fetchEnquiries(1, perPage, "");
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Enquiries</h1>
            <p className="text-muted-foreground">
              Manage and respond to customer enquiries
            </p>
          </div>
        </div>

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
                            <Skeleton className="h-4 w-[200px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-[90px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-[110px]" />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-3 justify-end">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-4 w-4" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <>
                      {filteredEnquiries.length > 0 ? (
                        filteredEnquiries.map((enq) => (
                          <TableRow key={enq.id} className="hover:bg-muted/50">
                            {/* Contact */}
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-medium text-primary-foreground">
                                    {enq.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .slice(0, 2)
                                      .toUpperCase() || "?"}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium">{enq.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {enq.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            {/* Phone */}
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                              {enq.phone || "—"}
                            </TableCell>

                            {/* Message */}
                            <TableCell className="max-w-[250px]">
                              <p className="truncate text-sm text-muted-foreground">
                                {enq.message || "—"}
                              </p>
                            </TableCell>

                            {/* Status */}
                            <TableCell>{getStatusBadge(enq.status)}</TableCell>

                            {/* Responded By */}
                            <TableCell className="text-muted-foreground">
                              {enq.responded_by ? (
                                <span className="text-sm">
                                  {enq.responded_by}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">
                                  Not yet
                                </span>
                              )}
                            </TableCell>

                            {/* Date */}
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                              {formatDate(enq.created_at)}
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="text-right">
                              <div className="flex gap-3 justify-end items-center">
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <MessageSquare size={40} className="opacity-30" />
                              <p>No enquiries found</p>
                            </div>
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
      </div>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() =>
          !isDeleting && setDeleteModal({ open: false, enquiry: null })
        }
        title="Delete Enquiry"
        showFooter={false}
        width="max-w-md"
      >
        <div className="space-y-5">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="h-7 w-7 text-red-600" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete the enquiry from{" "}
              <strong className="text-foreground">
                {deleteModal.enquiry?.name}
              </strong>
              ? This action{" "}
              <span className="text-red-600 font-medium">cannot be undone</span>
              .
            </p>
          </div>

          {/* Enquiry preview */}
          <div className="bg-muted/40 rounded-lg p-3 text-sm text-muted-foreground border-l-4 border-red-400">
            <p className="font-medium text-xs mb-1 uppercase tracking-wide text-red-500">
              Enquiry Message
            </p>
            <p className="line-clamp-2">{deleteModal.enquiry?.message}</p>
          </div>

          {/* Buttons */}
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
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Yes, Delete
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}