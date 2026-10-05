import { useEffect, useState } from "react";
import { User, ChevronDown, Pencil, Eye, Trash2 } from "lucide-react";
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
import ToggleSwitch from "@/components/ui/toggle-switch";
import { notify } from "@/utils/utils";
import { CustomPagination } from "@/components/custom-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

interface JobListing {
  id: number;
  provider: {
    name: string;
    business_name?: string;
  };
  category: {
    name: string;
  };
  years_of_experience: number;
  service_location: string;
  service_radius: number;
  shift_date?: string;
  shift_start_time?: string;
  shift_end_time?: string;
  is_urgent: boolean;
  quick_pay: boolean;
  status: string;
  created_at: string;
}

export default function JobListing() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterUrgent, setFilterUrgent] = useState("all");
  const [filterQuickPay, setFilterQuickPay] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [perPage, setPerPage] = useState(20);
  const [apiData, setApiData] = useState<{
    jobListing: JobListing[];
    pagination: PaginationData | null;
  }>({
    jobListing: [],
    pagination: null,
  });
  const [filterCity, setFilterCity] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterZipCode, setFilterZipCode] = useState("");
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async (
    page: number = 1,
    itemsPerPage: number = 20,
    status: string = "",
    search: string = "",
    urgent: string = "",
    quickPay: string = "",
    city: string = "",
    state: string = "",
    zipCode: string = ""
  ) => {
    try {
      setIsLoading(true);

      let url = `${apiUrl.jobListing}?page=${page}&per_page=${itemsPerPage}`;

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
      if (zipCode) {
        url += `&zip_code=${encodeURIComponent(zipCode)}`;
      }
      if (urgent && urgent !== "all") {
        url += `&is_urgent=${urgent === "yes" ? 1 : 0}`;
      }
      if (quickPay && quickPay !== "all") {
        url += `&quick_pay=${quickPay === "yes" ? 1 : 0}`;
      }

      const response = await makeApiRequest(url, {
        method: "GET",
      });

      setApiData({
        jobListing: response.data.listings || [],
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
        const apiStatus = filterStatus === "all" ? "" : filterStatus;
        await fetchUsers(
          apiData.pagination?.current_page || 1,
          perPage,
          apiStatus,
          searchTerm,
          filterUrgent,
          filterQuickPay,
          filterCity,
          filterState
        );
      }

      notify({
        message: `User ${!currentStatus ? "verified" : "unverified"
          } successfully`,
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




  const handlePageChange = (page: number) => {
    if (page < 1 || !apiData.pagination || page > apiData.pagination.last_page)
      return;

    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    fetchUsers(page, perPage, apiStatus, searchTerm, filterUrgent, filterQuickPay, filterCity, filterState);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    fetchUsers(1, value, apiStatus, searchTerm, filterUrgent, filterQuickPay, filterCity, filterState);
  };

  const handleStatusFilterChange = (status: string) => {
    setFilterStatus(status);
    fetchUsers(1, perPage, status === "all" ? "" : status, searchTerm, filterUrgent, filterQuickPay, filterCity, filterState);
  }

  const handleUrgentFilterChange = (urgent: string) => {
    setFilterUrgent(urgent);
    fetchUsers(1, perPage, filterStatus === "all" ? "" : filterStatus, searchTerm, urgent, filterQuickPay, filterCity, filterState);
  }

  const handleQuickPayFilterChange = (quickPay: string) => {
    setFilterQuickPay(quickPay);
    fetchUsers(1, perPage, filterStatus === "all" ? "" : filterStatus, searchTerm, filterUrgent, quickPay, filterCity, filterState);
  }

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    fetchUsers(1, perPage, filterStatus === "all" ? "" : filterStatus, search, filterUrgent, filterQuickPay, filterCity, filterState);
  }

  const handleCityChange = (city: string) => {
    setFilterCity(city);
    fetchUsers(1, perPage, filterStatus === "all" ? "" : filterStatus, searchTerm, filterUrgent, filterQuickPay, city, filterState);
  }

  const handleStateChange = (state: string) => {
    setFilterState(state);
    fetchUsers(1, perPage, filterStatus === "all" ? "" : filterStatus, searchTerm, filterUrgent, filterQuickPay, filterCity, state, filterZipCode);
  }

  const handleZipCodeChange = (zip: string) => {
    setFilterZipCode(zip);
    fetchUsers(1, perPage, filterStatus === "all" ? "" : filterStatus, searchTerm, filterUrgent, filterQuickPay, filterCity, filterState, zip);
  }

  useEffect(() => {
    fetchUsers(1, perPage);
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Worker Listings</h1>
          <p className="text-muted-foreground">
            Manage and overview all worker service listings
          </p>
        </div>
        {/* <Link to="/dashboard/create-user">
          <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
            <User className="mr-2 h-4 w-4" />
            Add Job
          </Button>
        </Link> */}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Worker Service Listings</CardTitle>
              <CardDescription>
                {apiData.pagination ? (
                  <span>
                    Showing {apiData.pagination.from} to {apiData.pagination.to} of{" "}
                    {apiData.pagination.total} listings
                    {filterUrgent !== "all" && ` • Urgent: ${filterUrgent}`}
                    {filterQuickPay !== "all" && ` • Quick Pay: ${filterQuickPay}`}
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
            {/* <Input
              placeholder="Search by worker/city..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="max-w-[200px]"
            /> */}

            <Input
              placeholder="Filter by city..."
              value={filterCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="max-w-[150px]"
            />

            <Input
              placeholder="Filter by state..."
              value={filterState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="max-w-[150px]"
            />

            <Input
              placeholder="Filter by zip..."
              value={filterZipCode}
              onChange={(e) => handleZipCodeChange(e.target.value)}
              className="max-w-[120px]"
            />

            <Select value={filterUrgent} onValueChange={handleUrgentFilterChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Is Urgent?" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Urgent</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Urgent Only</SelectItem>
                  <SelectItem value="no">Normal Only</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={filterQuickPay} onValueChange={handleQuickPayFilterChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Quick Pay?" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Quick Pay</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Quick Pay Only</SelectItem>
                  <SelectItem value="no">Standard Only</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-[130px]">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker / Business</TableHead>
                <TableHead>Category / Type</TableHead>
                <TableHead>Shift Date & Time</TableHead>
                <TableHead>Urgent / Quick</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
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
                  {apiData?.jobListing?.length > 0 ? (
                    apiData.jobListing.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary-foreground">
                                {user?.provider?.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "U"}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">
                                {user?.provider?.name}
                              </div>
                              {user?.provider?.business_name && (
                                <div className="text-xs text-blue-600 font-semibold italic">
                                  {user?.provider?.business_name}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className="capitalize">
                              {user?.category?.name}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.shift_date ? (
                            <div className="text-xs">
                              <div className="font-semibold">{user.shift_date}</div>
                              <div className="text-muted-foreground">{user.shift_start_time} - {user.shift_end_time}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs italic">Flexible / Not Set</span>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-1">
                            {user.is_urgent && (
                              <Badge className="bg-red-500 text-[10px] h-4">URGENT</Badge>
                            )}
                            {user.quick_pay && (
                              <Badge className="bg-amber-500 text-[10px] h-4">QUICK</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{user.service_location}</TableCell>
                        {/* <TableCell>{user?.status}</TableCell> */}
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        {/* <TableCell>
                          <ToggleSwitch
                            enabled={user.is_verified || false}
                            onChange={() =>
                              handleVerifyToggle(user.id, user.is_verified)
                            }
                            disabled={loadingStates[user.id]}
                          />
                        </TableCell> */}
                        <TableCell className="text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end cursor-pointer">
                            {/* <Pencil
                              size={15}
                              className="hover:text-blue-600 transition-colors"
                            /> */}
                            <Eye
                              size={15}
                              className="hover:text-green-600 transition-colors"
                              onClick={() =>
                                navigate(`/dashboard/job-listing/${user.id}`)
                              }
                            />
                            {/* <Trash2
                              size={15}
                              className="hover:text-red-600 transition-colors"
                            /> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <p className="text-muted-foreground">No users found</p>
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
