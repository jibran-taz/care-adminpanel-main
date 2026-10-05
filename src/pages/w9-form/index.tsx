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
import makeApiRequest from "@/services/axios";
import { formatDate, notify } from "@/utils/utils";
import { ChevronDown, Eye, FileText, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface W9Form {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    user_type: { id: number; name: string } | string;
  };
  document_name: string;
  verification_status: "pending" | "verified" | "rejected";
  rejection_reason: string | null;
  verified_at: string | null;
  uploaded_at: string;
}

interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from?: number;
  to?: number;
}

export default function W9FormListing() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [perPage, setPerPage] = useState(15);
  const [apiData, setApiData] = useState<{
    w9Forms: W9Form[];
    pagination: PaginationData | null;
  }>({
    w9Forms: [],
    pagination: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Delete state
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    form: W9Form | null;
  }>({ open: false, form: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchW9Forms = async (
    page: number = 1,
    itemsPerPage: number = 15,
    status: string = ""
  ) => {
    try {
      setIsLoading(true);

      let url = `admin/w9-forms?page=${page}&per_page=${itemsPerPage}`;
      if (status && status !== "all") {
        url += `&verification_status=${status}`;
      }

      const response = await makeApiRequest(url, { method: "GET" });
      const resData = response.data;

      setApiData({
        w9Forms: resData?.w9_forms || [],
        pagination: resData?.pagination
          ? {
              ...resData.pagination,
              from: (page - 1) * itemsPerPage + 1,
              to: Math.min(
                page * itemsPerPage,
                resData.pagination.total
              ),
            }
          : null,
      });
    } catch (error) {
      console.error("Error fetching W9 forms:", error);
      notify({ message: "Failed to fetch W9 forms", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.form) return;
    try {
      setIsDeleting(true);
      await makeApiRequest(`/admin/w9-forms/${deleteModal.form.id}`, {
        method: "DELETE",
      });

      notify({ message: "W9 form deleted successfully", type: "success" });

      setApiData((prev) => ({
        ...prev,
        w9Forms: prev.w9Forms.filter((f) => f.id !== deleteModal.form!.id),
      }));

      setDeleteModal({ open: false, form: null });
    } catch (error: any) {
      notify({
        message: error?.response?.data?.message || "Failed to delete W9 form",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusFilterChange = (status: string) => {
    setFilterStatus(status);
    fetchW9Forms(1, perPage, status === "all" ? "" : status);
  };

  const handlePageChange = (page: number) => {
    if (!apiData.pagination || page < 1 || page > apiData.pagination.last_page)
      return;
    fetchW9Forms(page, perPage, filterStatus === "all" ? "" : filterStatus);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    fetchW9Forms(1, value, filterStatus === "all" ? "" : filterStatus);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      verified: "bg-green-100 text-green-800 hover:bg-green-100",
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      rejected: "bg-red-100 text-red-800 hover:bg-red-100",
    };
    return (
      <Badge className={styles[status] ?? "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  const filteredForms = apiData.w9Forms.filter((form) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      form.user?.name?.toLowerCase().includes(term) ||
      form.user?.email?.toLowerCase().includes(term) ||
      form.document_name?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    fetchW9Forms(1, perPage, "");
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">W9 Forms</h1>
            <p className="text-muted-foreground">
              Manage and verify customer W9 form submissions
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>W9 Form Management</CardTitle>
                <CardDescription>
                  {apiData.pagination ? (
                    <span>
                      Showing {apiData.pagination.from} to{" "}
                      {apiData.pagination.to} of {apiData.pagination.total}{" "}
                      forms
                      {filterStatus !== "all" && ` • Status: ${filterStatus}`}
                    </span>
                  ) : (
                    "View and manage all W9 form submissions"
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
                  {[10, 15, 50, 100].map((n) => (
                    <DropdownMenuItem key={n} onClick={() => handlePerPageChange(n)}>
                      {n} per page
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Filters */}
            <div className="flex gap-4 pt-4">
              <Input
                placeholder="Search by name, email, document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />

              <Select value={filterStatus} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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
                    <TableHead>User</TableHead>
                    <TableHead>User Type</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rejection Reason</TableHead>
                    <TableHead>Uploaded At</TableHead>
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
                          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-[90px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[110px]" /></TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-3 justify-end">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-4 w-4" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : filteredForms.length > 0 ? (
                    filteredForms.map((form) => (
                      <TableRow key={form.id} className="hover:bg-muted/50">
                        {/* User */}
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium text-white">
                                {form.user?.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{form.user?.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {form.user?.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* User Type */}
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {(() => {
                              const type = typeof form.user?.user_type === "object"
                                ? form.user?.user_type?.name
                                : form.user?.user_type;
                              if (type?.toLowerCase() === 'provider') return 'Worker';
                              if (type?.toLowerCase() === 'client') return 'Employer';
                              return type;
                            })()}
                          </Badge>
                        </TableCell>

                        {/* Document */}
                        <TableCell className="max-w-[200px]">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText size={14} className="flex-shrink-0" />
                            <span className="truncate">{form.document_name}</span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          {getStatusBadge(form.verification_status)}
                        </TableCell>

                        {/* Rejection Reason */}
                        <TableCell className="max-w-[180px]">
                          {form.rejection_reason ? (
                            <p className="truncate text-sm text-red-500">
                              {form.rejection_reason}
                            </p>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </TableCell>

                        {/* Uploaded At */}
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {formatDate(form.uploaded_at)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex gap-3 justify-end items-center">
                            <Eye
                              size={15}
                              className="cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() =>
                                navigate(`/dashboard/w9-form/${form.id}`)
                              }
                            />
                            <Trash2
                              size={15}
                              className="cursor-pointer hover:text-red-600 transition-colors"
                              onClick={() =>
                                setDeleteModal({ open: true, form })
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
                          <FileText size={40} className="opacity-30" />
                          <p>No W9 forms found</p>
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
                  from={apiData.pagination.from ?? 0}
                  to={apiData.pagination.to ?? 0}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() =>
          !isDeleting && setDeleteModal({ open: false, form: null })
        }
        title="Delete W9 Form"
        showFooter={false}
        width="max-w-md"
      >
        <div className="space-y-5">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="h-7 w-7 text-red-600" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete the W9 form submitted by{" "}
              <strong className="text-foreground">
                {deleteModal.form?.user?.name}
              </strong>
              ? This action{" "}
              <span className="text-red-600 font-medium">cannot be undone</span>.
            </p>
          </div>

          <div className="bg-muted/40 rounded-lg p-3 text-sm text-muted-foreground border-l-4 border-red-400">
            <p className="font-medium text-xs mb-1 uppercase tracking-wide text-red-500">
              Document
            </p>
            <div className="flex items-center gap-2">
              <FileText size={14} />
              <span className="truncate">{deleteModal.form?.document_name}</span>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, form: null })}
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