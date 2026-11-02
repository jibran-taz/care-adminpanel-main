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
import ToggleSwitch from "@/components/ui/toggle-switch";
import { apiUrl } from "@/services/api-end-point";
import makeApiRequest from "@/services/axios";
import { formatDate, notify } from "@/utils/utils";
import {
  AlertTriangle,
  CheckSquare,
  ChevronDown,
  Eye,
  Loader2,
  Pencil,
  Trash2,
  User,
  XSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

interface User {
  id: number;
  full_name: string;
  business_name?: string;
  email: string;
  user_type: string;
  desired_role?: string;
  city?: string;
  status: string;
  is_verified: boolean;
  created_at: string;
}

interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export default function Users() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Get filter from URL
  const urlUserType = searchParams.get("user_type") || "all";

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterDesiredRole, setFilterDesiredRole] = useState("all");
  const [filterRole, setFilterRole] = useState(urlUserType);
  const [filterStatus, setFilterStatus] = useState("all");
  const [perPage, setPerPage] = useState(20);
  const [apiData, setApiData] = useState<{
    users: User[];
    pagination: PaginationData | null;
  }>({
    users: [],
    pagination: null,
  });
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Selection states
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  // Single Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Bulk Delete modal state
  const [bulkDeleteModal, setBulkDeleteModal] = useState<{
    open: boolean;
    all: boolean;
    count: number;
  }>({ open: false, all: false, count: 0 });
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState({ current: 0, total: 0 });

  // Filter non-admin users for selection (admins cannot be deleted)
  const nonAdminUsers = apiData.users.filter((u) => u.user_type !== "admin");
  const isAllSelected =
    nonAdminUsers.length > 0 &&
    nonAdminUsers.every((u) => selectedUserIds.includes(u.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(nonAdminUsers.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleToggleSelect = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.user) return;
    try {
      setIsDeleting(true);
      await makeApiRequest(`${apiUrl.users}/${deleteModal.user.id}`, {
        method: "DELETE",
      });

      notify({ message: "User deleted successfully", type: "success" });

      setSelectedUserIds((prev) => prev.filter((id) => id !== deleteModal.user!.id));
      setApiData((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== deleteModal.user!.id),
      }));

      setDeleteModal({ open: false, user: null });
    } catch (error: any) {
      notify({
        message: error?.response?.data?.message || "Failed to delete user",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExecuteBulkDelete = async () => {
    const idsToDelete = bulkDeleteModal.all
      ? nonAdminUsers.map((u) => u.id)
      : selectedUserIds;

    if (idsToDelete.length === 0) return;

    try {
      setIsBulkDeleting(true);
      setDeleteProgress({ current: 0, total: idsToDelete.length });

      let successCount = 0;
      for (let i = 0; i < idsToDelete.length; i++) {
        const id = idsToDelete[i];
        try {
          await makeApiRequest(`${apiUrl.users}/${id}`, {
            method: "DELETE",
          });
          successCount++;
        } catch (err) {
          console.error(`Failed to delete user ID ${id}:`, err);
        }
        setDeleteProgress({ current: i + 1, total: idsToDelete.length });
      }

      notify({
        message: `Successfully deleted ${successCount} user(s)`,
        type: "success",
      });

      setSelectedUserIds([]);
      setBulkDeleteModal({ open: false, all: false, count: 0 });

      // Refresh list
      const apiRole = filterRole === "all" ? "" : filterRole;
      const apiStatus = filterStatus === "all" ? "" : filterStatus;
      await fetchUsers(
        apiData.pagination?.current_page || 1,
        perPage,
        apiRole,
        apiStatus,
        searchTerm,
        filterCity,
        filterState,
        filterDesiredRole === "all" ? "" : filterDesiredRole
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

  const fetchUsers = async (
    page: number = 1,
    itemsPerPage: number = 20,
    role: string = "",
    status: string = "",
    search: string = "",
    city: string = "",
    state: string = "",
    desiredRole: string = ""
  ) => {
    try {
      setIsLoading(true);

      let url = `${apiUrl.users}?page=${page}&per_page=${itemsPerPage}`;

      if (role && role !== "all") {
        url += `&user_type=${role}`;
      }

      if (status && status !== "all") {
        url += `&status=${status}`;
      }

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      if (city) {
        url += `&city=${encodeURIComponent(city)}`;
      }

      if (state) {
        url += `&state=${encodeURIComponent(state)}`;
      }

      if (desiredRole && desiredRole !== "all") {
        url += `&desired_role=${desiredRole}`;
      }

      const response = await makeApiRequest(url, {
        method: "GET",
      });

      setApiData({
        users: response.data.users || [],
        pagination: response.data.pagination || null,
      });
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      notify({ message: "Failed to fetch users", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyToggle = async (userId: number, currentStatus: boolean) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [userId]: true }));

      const response = await makeApiRequest(apiUrl.verifyUser(String(userId)), {
        method: "PUT",
        data: {
          is_verified: !currentStatus,
        },
      });

      if (response.success === true) {
        const apiRole = filterRole === "all" ? "" : filterRole;
        const apiStatus = filterStatus === "all" ? "" : filterStatus;
        await fetchUsers(
          apiData.pagination?.current_page || 1,
          perPage,
          apiRole,
          apiStatus,
          searchTerm,
          filterCity,
          filterState,
          filterDesiredRole === "all" ? "" : filterDesiredRole
        );
      }

      notify({
        message: `User ${!currentStatus ? "verified" : "unverified"} successfully`,
        type: "success",
      });
    } catch (error: unknown) {
      console.error("❌ Error updating verification:", error);
      const errorMessage =
        error &&
          typeof error === "object" &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "message" in error.response.data
          ? String(error.response.data.message)
          : "Failed to update verification";
      notify({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge
        className={
          status === "active"
            ? "bg-green-100 text-green-800 hover:bg-green-100"
            : status === "pending_verification"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              : "bg-red-100 text-red-800 hover:bg-red-100"
        }
      >
        {status}
      </Badge>
    );
  };

  const handleRoleFilterChange = async (role: string) => {
    setFilterRole(role);

    if (role === "all") {
      searchParams.delete("user_type");
    } else {
      searchParams.set("user_type", role);
    }
    setSearchParams(searchParams);
    setSelectedUserIds([]);

    const apiRole = role === "all" ? "" : role;
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    await fetchUsers(1, perPage, apiRole, apiStatus, searchTerm, filterCity, filterState, filterDesiredRole === "all" ? "" : filterDesiredRole);
  };

  const handleStatusFilterChange = async (status: string) => {
    setFilterStatus(status);
    setSelectedUserIds([]);
    const apiRole = filterRole === "all" ? "" : filterRole;
    const apiStatus = status === "all" ? "" : status;
    await fetchUsers(1, perPage, apiRole, apiStatus, searchTerm, filterCity, filterState, filterDesiredRole === "all" ? "" : filterDesiredRole);
  };

  const handleCityFilterChange = async (city: string) => {
    setFilterCity(city);
    const apiRole = filterRole === "all" ? "" : filterRole;
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    await fetchUsers(1, perPage, apiRole, apiStatus, searchTerm, city, filterState, filterDesiredRole === "all" ? "" : filterDesiredRole);
  };

  const handleStateFilterChange = async (state: string) => {
    setFilterState(state);
    const apiRole = filterRole === "all" ? "" : filterRole;
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    await fetchUsers(1, perPage, apiRole, apiStatus, searchTerm, filterCity, state, filterDesiredRole === "all" ? "" : filterDesiredRole);
  };

  const handleDesiredRoleFilterChange = async (role: string) => {
    setFilterDesiredRole(role);
    const apiRole = filterRole === "all" ? "" : filterRole;
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    await fetchUsers(1, perPage, apiRole, apiStatus, searchTerm, filterCity, filterState, role === "all" ? "" : role);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || !apiData.pagination || page > apiData.pagination.last_page)
      return;

    setSelectedUserIds([]);
    const apiRole = filterRole === "all" ? "" : filterRole;
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    fetchUsers(page, perPage, apiRole, apiStatus, searchTerm, filterCity, filterState, filterDesiredRole === "all" ? "" : filterDesiredRole);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setSelectedUserIds([]);
    const apiRole = filterRole === "all" ? "" : filterRole;
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    fetchUsers(1, value, apiRole, apiStatus, searchTerm, filterCity, filterState, filterDesiredRole === "all" ? "" : filterDesiredRole);
  };

  // ✅ Initial load - runs when URL params change
  useEffect(() => {
    if (urlUserType !== filterRole) {
      setFilterRole(urlUserType);
    }
    setSelectedUserIds([]);
    const apiRole = urlUserType === "all" ? "" : urlUserType;
    fetchUsers(1, perPage, apiRole, "");
  }, [urlUserType]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage your users, workers, employers and their permissions
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {nonAdminUsers.length > 0 && (
            <Button
              variant="destructive"
              onClick={() =>
                setBulkDeleteModal({
                  open: true,
                  all: true,
                  count: nonAdminUsers.length,
                })
              }
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All ({nonAdminUsers.length})
            </Button>
          )}

          <Link to="/dashboard/create-user">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600">
              <User className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </Link>
        </div>
      </div>

      {/* Floating Selection Banner */}
      {selectedUserIds.length > 0 && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 font-medium">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            <span>
              <strong>{selectedUserIds.length}</strong> user(s) selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedUserIds([])}
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
                  count: selectedUserIds.length,
                })
              }
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete Selected ({selectedUserIds.length})
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                {apiData.pagination ? (
                  <span>
                    Showing {apiData.pagination.from} to {apiData.pagination.to} of{" "}
                    {apiData.pagination.total} users
                    {filterRole !== "all" && ` • Role: ${filterRole}`}
                    {filterStatus !== "all" && ` • Status: ${filterStatus}`}
                  </span>
                ) : (
                  "View and manage all users"
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

          {/* Filters */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Input
              placeholder="Filter by city..."
              value={filterCity}
              onChange={(e) => handleCityFilterChange(e.target.value)}
              className="max-w-[150px]"
            />

            <Input
              placeholder="Filter by state..."
              value={filterState}
              onChange={(e) => handleStateFilterChange(e.target.value)}
              className="max-w-[150px]"
            />

            <Select value={filterRole} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="System Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>System Roles</SelectLabel>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="provider">Worker</SelectItem>
                  <SelectItem value="client">Employer</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={filterDesiredRole} onValueChange={handleDesiredRoleFilterChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Desired Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Desired Roles</SelectLabel>
                  <SelectItem value="all">All Desired Roles</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="cna">CNA</SelectItem>
                  <SelectItem value="caregiver">Caregiver</SelectItem>
                  <SelectItem value="lpn">LPN</SelectItem>
                  <SelectItem value="rn">RN</SelectItem>
                  <SelectItem value="med_tech">Med Tech</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending_verification">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
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
                  <TableHead>User / Business</TableHead>
                  <TableHead>Role / Desired</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Join Date</TableHead>
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
                              <Skeleton className="h-4 w-[150px]" />
                              <Skeleton className="h-3 w-[200px]" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[80px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-[44px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[120px]" />
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
                    {apiData?.users?.length > 0 ? (
                      apiData.users.map((user) => {
                        const isSelected = selectedUserIds.includes(user.id);
                        return (
                          <TableRow
                            key={user.id}
                            className={
                              isSelected ? "bg-blue-50/60" : "hover:bg-muted/50"
                            }
                          >
                            <TableCell>
                              {user.user_type !== "admin" ? (
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => handleToggleSelect(user.id)}
                                  aria-label={`Select ${user.full_name}`}
                                />
                              ) : (
                                <span className="text-[10px] text-muted-foreground font-semibold">
                                  ADMIN
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary-foreground">
                                    {user?.full_name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("") || "U"}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium">{user.full_name}</div>
                                  {user.business_name && (
                                    <div className="text-xs text-blue-600 font-semibold italic">
                                      {user.business_name}
                                    </div>
                                  )}
                                  <div className="text-sm text-muted-foreground">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge variant="outline" className="capitalize">
                                  {user.user_type === "provider"
                                    ? "Worker"
                                    : user.user_type === "client"
                                    ? "Employer"
                                    : user.user_type}
                                </Badge>
                                {user.desired_role && (
                                  <div className="text-[10px] text-muted-foreground bg-slate-100 px-1 rounded inline-block ml-1">
                                    {user.desired_role}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {user.city || "N/A"}
                            </TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>
                              <ToggleSwitch
                                enabled={user.is_verified || false}
                                onChange={() =>
                                  handleVerifyToggle(user.id, user.is_verified)
                                }
                                disabled={loadingStates[user.id]}
                              />
                            </TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                              {formatDate(user.created_at)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end cursor-pointer">
                                <Pencil
                                  size={15}
                                  className="hover:text-blue-600 transition-colors"
                                  onClick={() =>
                                    navigate(`/dashboard/users/${user.id}/edit`)
                                  }
                                />
                                <Eye
                                  size={15}
                                  className="hover:text-green-600 transition-colors"
                                  onClick={() =>
                                    navigate(`/dashboard/users/${user.id}`)
                                  }
                                />
                                {user.user_type !== "admin" && (
                                  <Trash2
                                    size={15}
                                    className="hover:text-red-600 transition-colors"
                                    onClick={() =>
                                      setDeleteModal({ open: true, user })
                                    }
                                  />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <p className="text-muted-foreground">No users found</p>
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
        onClose={() => !isDeleting && setDeleteModal({ open: false, user: null })}
        title="Delete User"
        showFooter={false}
        width="max-w-md"
      >
        <div className="space-y-4 pt-2">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete user{" "}
              <strong className="text-foreground">
                {deleteModal.user?.full_name || deleteModal.user?.email}
              </strong>
              ? This action <span className="text-red-600 font-medium">cannot be undone</span>.
            </p>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, user: null })}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk / Delete All Confirmation Modal */}
      <Modal
        isOpen={bulkDeleteModal.open}
        onClose={() =>
          !isBulkDeleting &&
          setBulkDeleteModal({ open: false, all: false, count: 0 })
        }
        title={bulkDeleteModal.all ? "Delete All Non-Admin Users" : "Delete Selected Users"}
        showFooter={false}
        width="max-w-md"
      >
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3 p-3 bg-red-50 text-red-800 rounded-lg border border-red-200">
            <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" />
            <p className="text-sm">
              {bulkDeleteModal.all
                ? `You are about to delete ALL ${bulkDeleteModal.count} non-admin user(s) (workers & employers). Primary Admin account will be preserved.`
                : `You are about to delete ${bulkDeleteModal.count} selected user(s).`}
            </p>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            This action <span className="text-red-600 font-semibold">cannot be undone</span>.
          </p>

          {isBulkDeleting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Deleting records...</span>
                <span>
                  {deleteProgress.current} / {deleteProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      deleteProgress.total > 0
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
