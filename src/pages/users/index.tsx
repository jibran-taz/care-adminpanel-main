// // // // import { useEffect, useState } from "react";
// // // // import { User, ChevronDown, Pencil, Eye, Trash2 } from "lucide-react";
// // // // import {
// // // //   Card,
// // // //   CardContent,
// // // //   CardDescription,
// // // //   CardHeader,
// // // //   CardTitle,
// // // // } from "@/components/ui/card";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Input } from "@/components/ui/input";
// // // // import { Badge } from "@/components/ui/badge";
// // // // import {
// // // //   Table,
// // // //   TableBody,
// // // //   TableCell,
// // // //   TableHead,
// // // //   TableHeader,
// // // //   TableRow,
// // // // } from "@/components/ui/table";
// // // // import {
// // // //   DropdownMenu,
// // // //   DropdownMenuContent,
// // // //   DropdownMenuItem,
// // // //   DropdownMenuTrigger,
// // // // } from "@/components/ui/dropdown-menu";
// // // // import makeApiRequest from "@/services/axios";
// // // // import { apiUrl } from "@/services/api-end-point";
// // // // import ToggleSwitch from "@/components/ui/toggle-switch";

// // // // export default function Users() {
// // // //   const [searchTerm, setSearchTerm] = useState("");
// // // //   const [filterRole, setFilterRole] = useState("All");
// // // //   const [filterStatus, setFilterStatus] = useState("All");
// // // //   const [isActive, setIsActive] = useState(false);

// // // //   const [apiData, setApiData] = useState({
// // // //     users: [],
// // // //   });

// // // //   const fetchUsers = async () => {
// // // //     try {
// // // //       const response = await makeApiRequest(apiUrl.users, { method: "GET" });

// // // //       setApiData((prev) => ({
// // // //         ...prev,
// // // //         users: response.data.users || [],
// // // //       }));
// // // //     } catch (error) {
// // // //       console.error("Error fetching users:", error);
// // // //     }
// // // //   };
// // // //   useEffect(() => {
// // // //     fetchUsers();
// // // //   }, []);

// // // //   const getStatusBadge = (status: string) => {
// // // //     const variants: Record<string, "default" | "secondary" | "destructive"> = {
// // // //       Active: "default",
// // // //       Inactive: "secondary",
// // // //       Pending: "secondary",
// // // //     };

// // // //     return (
// // // //       <Badge
// // // //         variant={variants[status] || "default"}
// // // //         className={
// // // //           status === "active"
// // // //             ? "bg-green-100 text-green-800 hover:bg-green-100"
// // // //             : status === "pending_verification"
// // // //             ? "bg-red-100 text-red-800 hover:bg-red-100"
// // // //             : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
// // // //         }
// // // //       >
// // // //         {status}
// // // //       </Badge>
// // // //     );
// // // //   };

// // // //   return (
// // // //     <div className="space-y-6">
// // // //       <div className="flex items-center justify-between">
// // // //         <div>
// // // //           <h1 className="text-3xl font-bold tracking-tight">Users</h1>
// // // //           <p className="text-muted-foreground">
// // // //             Manage your users and their permissions
// // // //           </p>
// // // //         </div>
// // // //         <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
// // // //           <User className="mr-2 h-4 w-4" />
// // // //           Add User
// // // //         </Button>
// // // //       </div>

// // // //       <Card>
// // // //         <CardHeader>
// // // //           <CardTitle>User Management</CardTitle>
// // // //           <CardDescription>
// // // //             View and manage all users in your system
// // // //           </CardDescription>

// // // //           {/* Filters */}
// // // //           <div className="flex gap-4 pt-4">
// // // //             <Input
// // // //               placeholder="Search users..."
// // // //               value={searchTerm}
// // // //               onChange={(e) => setSearchTerm(e.target.value)}
// // // //               className="max-w-sm"
// // // //             />

// // // //             <DropdownMenu>
// // // //               <DropdownMenuTrigger asChild>
// // // //                 <Button variant="outline">
// // // //                   Role: {filterRole}
// // // //                   <ChevronDown className="ml-2 h-4 w-4" />
// // // //                 </Button>
// // // //               </DropdownMenuTrigger>
// // // //               <DropdownMenuContent>
// // // //                 <DropdownMenuItem onClick={() => setFilterRole("All")}>
// // // //                   All
// // // //                 </DropdownMenuItem>
// // // //                 <DropdownMenuItem onClick={() => setFilterRole("Admin")}>
// // // //                   Admin
// // // //                 </DropdownMenuItem>
// // // //                 <DropdownMenuItem onClick={() => setFilterRole("Editor")}>
// // // //                   Editor
// // // //                 </DropdownMenuItem>
// // // //                 <DropdownMenuItem onClick={() => setFilterRole("User")}>
// // // //                   User
// // // //                 </DropdownMenuItem>
// // // //               </DropdownMenuContent>
// // // //             </DropdownMenu>

// // // //             <DropdownMenu>
// // // //               <DropdownMenuTrigger asChild>
// // // //                 <Button variant="outline">
// // // //                   Status: {filterStatus}
// // // //                   <ChevronDown className="ml-2 h-4 w-4" />
// // // //                 </Button>
// // // //               </DropdownMenuTrigger>
// // // //               <DropdownMenuContent>
// // // //                 <DropdownMenuItem onClick={() => setFilterStatus("All")}>
// // // //                   All
// // // //                 </DropdownMenuItem>
// // // //                 <DropdownMenuItem onClick={() => setFilterStatus("Active")}>
// // // //                   Active
// // // //                 </DropdownMenuItem>
// // // //                 <DropdownMenuItem onClick={() => setFilterStatus("Inactive")}>
// // // //                   Inactive
// // // //                 </DropdownMenuItem>
// // // //                 <DropdownMenuItem onClick={() => setFilterStatus("Pending")}>
// // // //                   Pending
// // // //                 </DropdownMenuItem>
// // // //               </DropdownMenuContent>
// // // //             </DropdownMenu>
// // // //           </div>
// // // //         </CardHeader>

// // // //         <CardContent>
// // // //           <Table>
// // // //             <TableHeader>
// // // //               <TableRow>
// // // //                 <TableHead>User</TableHead>
// // // //                 <TableHead>Role</TableHead>
// // // //                 <TableHead>Status</TableHead>
// // // //                 <TableHead>Verified</TableHead>
// // // //                 <TableHead>Join Date</TableHead>
// // // //                 <TableHead className="text-right">Actions</TableHead>
// // // //               </TableRow>
// // // //             </TableHeader>
// // // //             <TableBody>
// // // //               {apiData?.users?.map((user) => (
// // // //                 <TableRow key={user.id} className="hover:bg-muted/50">
// // // //                   <TableCell>
// // // //                     <div className="flex items-center space-x-3">
// // // //                       <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
// // // //                         <span className="text-xs font-medium text-primary-foreground">
// // // //                           {user?.full_name
// // // //                             .split(" ")
// // // //                             .map((n) => n[0])
// // // //                             .join("")}
// // // //                         </span>
// // // //                       </div>
// // // //                       <div>
// // // //                         <div className="font-medium">{user.full_name}</div>
// // // //                         <div className="text-sm text-muted-foreground">
// // // //                           {user.email}
// // // //                         </div>
// // // //                       </div>
// // // //                     </div>
// // // //                   </TableCell>
// // // //                   <TableCell>
// // // //                     <Badge variant="outline">{user.user_type}</Badge>
// // // //                   </TableCell>
// // // //                   <TableCell>{getStatusBadge(user.status)}</TableCell>
// // // //                   <TableCell>
// // // //                     {" "}
// // // //                     <ToggleSwitch
// // // //                       // label="Enable Notifications"
// // // //                       enabled={isActive}
// // // //                       onChange={(value) => {
// // // //                         setIsActive(value);
// // // //                         console.log("Toggle changed:", value);
// // // //                       }}
// // // //                     />
// // // //                   </TableCell>
// // // //                   <TableCell className="text-muted-foreground">
// // // //                     {user.created_at}
// // // //                     {/* {new Date(user.created_at).toLocaleDateString()} */}
// // // //                   </TableCell>
// // // //                   <TableCell className="text-right">
// // // //                     <div className="flex gap-2 justify-end cursor-pointer">
// // // //                       <Pencil size={15} />
// // // //                       <Eye size={15} />
// // // //                       <Trash2 size={15} />
// // // //                     </div>
// // // //                   </TableCell>
// // // //                 </TableRow>
// // // //               ))}
// // // //             </TableBody>
// // // //           </Table>
// // // //         </CardContent>
// // // //       </Card>
// // // //     </div>
// // // //   );
// // // // }

// // // import { useEffect, useState } from "react";
// // // import { User, ChevronDown, Pencil, Eye, Trash2 } from "lucide-react";
// // // import {
// // //   Card,
// // //   CardContent,
// // //   CardDescription,
// // //   CardHeader,
// // //   CardTitle,
// // // } from "@/components/ui/card";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Badge } from "@/components/ui/badge";
// // // import {
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableHead,
// // //   TableHeader,
// // //   TableRow,
// // // } from "@/components/ui/table";
// // // import {
// // //   DropdownMenu,
// // //   DropdownMenuContent,
// // //   DropdownMenuItem,
// // //   DropdownMenuTrigger,
// // // } from "@/components/ui/dropdown-menu";
// // // import makeApiRequest from "@/services/axios";
// // // import { apiUrl } from "@/services/api-end-point";
// // // import ToggleSwitch from "@/components/ui/toggle-switch";
// // // import { notify } from "@/utils/utils";

// // // interface User {
// // //   id: number;
// // //   full_name: string;
// // //   email: string;
// // //   user_type: string;
// // //   status: string;
// // //   is_verified: boolean;
// // //   created_at: string;
// // // }

// // // export default function Users() {
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [filterRole, setFilterRole] = useState("All");
// // //   const [filterStatus, setFilterStatus] = useState("All");
// // //   const [apiData, setApiData] = useState<{ users: User[] }>({
// // //     users: [],
// // //   });
// // //   const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
// // //     {}
// // //   );

// // //   const fetchUsers = async () => {
// // //     try {
// // //       const response = await makeApiRequest(apiUrl.users, { method: "GET" });

// // //       setApiData((prev) => ({
// // //         ...prev,
// // //         users: response.data.users || [],
// // //       }));
// // //     } catch (error) {
// // //       console.error("Error fetching users:", error);
// // //       notify({ message: "Failed to fetch users", type: "error" });
// // //     }
// // //   };

// // //   // Toggle verify user
// // //   const handleVerifyToggle = async (userId: number, currentStatus: boolean) => {
// // //     try {

// // //       setLoadingStates((prev) => ({ ...prev, [userId]: true }));

// // //       // Call API
// // //       const response = await makeApiRequest(
// // //         apiUrl.verifyUser(userId.toString()),
// // //         {
// // //           method: "PUT",
// // //           data: {
// // //             is_verified: !currentStatus,
// // //           },
// // //         }
// // //       );
// // //       if (response.success === true) {
// // //         await fetchUsers();
// // //         // Update local state
// // //         setApiData((prev) => ({
// // //           ...prev,
// // //           users: prev.users.map((user) =>
// // //             user.id === userId ? { ...user, is_verified: !currentStatus } : user
// // //           ),
// // //         }));
// // //       }

// // //       notify({
// // //         message: `User ${
// // //           !currentStatus ? "verified" : "unverified"
// // //         } successfully`,
// // //         type: "success",
// // //       });
// // //     } catch (error: unknown) {
// // //       const errorMessage =
// // //         error &&
// // //         typeof error === "object" &&
// // //         "response" in error &&
// // //         error.response &&
// // //         typeof error.response === "object" &&
// // //         "data" in error.response &&
// // //         error.response.data &&
// // //         typeof error.response.data === "object" &&
// // //         "message" in error.response.data
// // //           ? String(error.response.data.message)
// // //           : "Failed to update verification";
// // //       notify({
// // //         message: errorMessage,
// // //         type: "error",
// // //       });
// // //     } finally {
// // //       setLoadingStates((prev) => ({ ...prev, [userId]: false }));
// // //     }
// // //   };

// //   // const getStatusBadge = (status: string) => {
// //   //   const variants: Record<string, "default" | "secondary" | "destructive"> = {
// //   //     Active: "default",
// //   //     Inactive: "secondary",
// //   //     Pending: "secondary",
// //   //   };

// //   //   return (
// //   //     <Badge
// //   //       variant={variants[status] || "default"}
// //   //       className={
// //   //         status === "active"
// //   //           ? "bg-green-100 text-green-800 hover:bg-green-100"
// //   //           : status === "pending_verification"
// //   //           ? "bg-red-100 text-red-800 hover:bg-red-100"
// //   //           : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
// //   //       }
// //   //     >
// //   //       {status}
// //   //     </Badge>
// //   //   );
// //   // };

// // //     useEffect(() => {
// // //     fetchUsers();
// // //   }, []);
// // //   return (
// // //     <div className="space-y-6">
// // //       <div className="flex items-center justify-between">
// // //         <div>
// // //           <h1 className="text-3xl font-bold tracking-tight">Users</h1>
// // //           <p className="text-muted-foreground">
// // //             Manage your users and their permissions
// // //           </p>
// // //         </div>
// // //         <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
// // //           <User className="mr-2 h-4 w-4" />
// // //           Add User
// // //         </Button>
// // //       </div>

// // //       <Card>
// // //         <CardHeader>
// // //           <CardTitle>User Management</CardTitle>
// // //           <CardDescription>
// // //             View and manage all users in your system
// // //           </CardDescription>

// // //           {/* Filters */}
// // //           <div className="flex gap-4 pt-4">
// // //             <Input
// // //               placeholder="Search users..."
// // //               value={searchTerm}
// // //               onChange={(e) => setSearchTerm(e.target.value)}
// // //               className="max-w-sm"
// // //             />

// // //             <DropdownMenu>
// // //               <DropdownMenuTrigger asChild>
// // //                 <Button variant="outline">
// // //                   Role: {filterRole}
// // //                   <ChevronDown className="ml-2 h-4 w-4" />
// // //                 </Button>
// // //               </DropdownMenuTrigger>
// // //               <DropdownMenuContent>
// // //                 <DropdownMenuItem onClick={() => setFilterRole("All")}>
// // //                   All
// // //                 </DropdownMenuItem>
// // //                 <DropdownMenuItem onClick={() => setFilterRole("Admin")}>
// // //                   Admin
// // //                 </DropdownMenuItem>
// // //                 <DropdownMenuItem onClick={() => setFilterRole("Editor")}>
// // //                   Editor
// // //                 </DropdownMenuItem>
// // //                 <DropdownMenuItem onClick={() => setFilterRole("User")}>
// // //                   User
// // //                 </DropdownMenuItem>
// // //               </DropdownMenuContent>
// // //             </DropdownMenu>

// // //             <DropdownMenu>
// // //               <DropdownMenuTrigger asChild>
// // //                 <Button variant="outline">
// // //                   Status: {filterStatus}
// // //                   <ChevronDown className="ml-2 h-4 w-4" />
// // //                 </Button>
// // //               </DropdownMenuTrigger>
// // //               <DropdownMenuContent>
// // //                 <DropdownMenuItem onClick={() => setFilterStatus("All")}>
// // //                   All
// // //                 </DropdownMenuItem>
// // //                 <DropdownMenuItem onClick={() => setFilterStatus("Active")}>
// // //                   Active
// // //                 </DropdownMenuItem>
// // //                 <DropdownMenuItem onClick={() => setFilterStatus("Inactive")}>
// // //                   Inactive
// // //                 </DropdownMenuItem>
// // //                 <DropdownMenuItem onClick={() => setFilterStatus("Pending")}>
// // //                   Pending
// // //                 </DropdownMenuItem>
// // //               </DropdownMenuContent>
// // //             </DropdownMenu>
// // //           </div>
// // //         </CardHeader>

// // //         <CardContent>
// // //           <Table>
// // //             <TableHeader>
// // //               <TableRow>
// // //                 <TableHead>User</TableHead>
// // //                 <TableHead>Role</TableHead>
// // //                 <TableHead>Status</TableHead>
// // //                 <TableHead>Verified</TableHead>
// // //                 <TableHead>Join Date</TableHead>
// // //                 <TableHead className="text-right">Actions</TableHead>
// // //               </TableRow>
// // //             </TableHeader>
// // //             <TableBody>
// // //               {apiData?.users?.map((user) => (
// // //                 <TableRow key={user.id} className="hover:bg-muted/50">
// // //                   <TableCell>
// // //                     <div className="flex items-center space-x-3">
// // //                       <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
// // //                         <span className="text-xs font-medium text-primary-foreground">
// // //                           {user?.full_name
// // //                             ?.split(" ")
// // //                             .map((n) => n[0])
// // //                             .join("") || "U"}
// // //                         </span>
// // //                       </div>
// // //                       <div>
// // //                         <div className="font-medium">{user.full_name}</div>
// // //                         <div className="text-sm text-muted-foreground">
// // //                           {user.email}
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <Badge variant="outline">{user.user_type}</Badge>
// // //                   </TableCell>
// // //                   <TableCell>{getStatusBadge(user.status)}</TableCell>
// // //                   <TableCell>
// // //                     <ToggleSwitch
// // //                       enabled={user.is_verified || false}
// // //                       onChange={(value) =>
// // //                         handleVerifyToggle(user.id, user.is_verified)
// // //                       }
// // //                       disabled={loadingStates[user.id]}
// // //                     />
// // //                   </TableCell>
// // //                   <TableCell className="text-muted-foreground">
// // //                     {user.created_at}
// // //                   </TableCell>
// // //                   <TableCell className="text-right">
// // //                     <div className="flex gap-2 justify-end cursor-pointer">
// // //                       <Pencil size={15} className="hover:text-blue-600" />
// // //                       <Eye size={15} className="hover:text-green-600" />
// // //                       <Trash2 size={15} className="hover:text-red-600" />
// // //                     </div>
// // //                   </TableCell>
// // //                 </TableRow>
// // //               ))}
// // //             </TableBody>
// // //           </Table>
// // //         </CardContent>
// // //       </Card>
// // //     </div>
// // //   );
// // // }

// // import { useEffect, useState } from "react";
// // import { User, ChevronDown, Pencil, Eye, Trash2 } from "lucide-react";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import {
// //   Pagination,
// //   PaginationContent,
// //   PaginationEllipsis,
// //   PaginationItem,
// //   PaginationLink,
// //   PaginationNext,
// //   PaginationPrevious,
// // } from "@/components/ui/pagination";
// // import makeApiRequest from "@/services/axios";
// // import { apiUrl } from "@/services/api-end-point";
// // import ToggleSwitch from "@/components/ui/toggle-switch";
// // import { notify } from "@/utils/utils";
// // import { CustomPagination } from "@/components/custom-pagination";

// // interface User {
// //   id: number;
// //   full_name: string;
// //   email: string;
// //   user_type: string;
// //   status: string;
// //   is_verified: boolean;
// //   created_at: string;
// // }

// // interface PaginationData {
// //   total: number;
// //   per_page: number;
// //   current_page: number;
// //   last_page: number;
// //   from: number;
// //   to: number;
// // }

// // export default function Users() {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [filterRole, setFilterRole] = useState("All");
// //   const [filterStatus, setFilterStatus] = useState("All");
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [apiData, setApiData] = useState<{
// //     users: User[];
// //     pagination: PaginationData | null;
// //   }>({
// //     users: [],
// //     pagination: null,
// //   });
// //   const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
// //   const [isLoading, setIsLoading] = useState(false);

// //   const fetchUsers = async (page: number = 1) => {
// //     try {
// //       setIsLoading(true);
// //       const response = await makeApiRequest(`${apiUrl.users}?page=${page}`, {
// //         method: "GET",
// //       });

// //       setApiData({
// //         users: response.data.users || [],
// //         pagination: response.data.pagination || null,
// //       });
// //       setCurrentPage(page);
// //     } catch (error) {
// //       console.error("Error fetching users:", error);
// //       notify({ message: "Failed to fetch users", type: "error" });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchUsers(1);
// //   }, []);

// //   // Toggle verify user
// //   const handleVerifyToggle = async (userId: number, currentStatus: boolean) => {
// //     try {
// //       setLoadingStates((prev) => ({ ...prev, [userId]: true }));

// //       const response = await makeApiRequest(`/admin/users/${userId}/verify`, {
// //         method: "PUT",
// //         data: {
// //           is_verified: !currentStatus,
// //         },
// //       });

// //       setApiData((prev) => ({
// //         ...prev,
// //         users: prev.users.map((user) =>
// //           user.id === userId ? { ...user, is_verified: !currentStatus } : user
// //         ),
// //       }));

// //       notify({
// //         message: `User ${!currentStatus ? "verified" : "unverified"} successfully`,
// //         type: "success",
// //       });
// //     } catch (error: unknown) {
// //       console.error("Error updating verification:", error);
// //       const errorMessage =
// //         error &&
// //         typeof error === "object" &&
// //         "response" in error &&
// //         error.response &&
// //         typeof error.response === "object" &&
// //         "data" in error.response &&
// //         error.response.data &&
// //         typeof error.response.data === "object" &&
// //         "message" in error.response.data
// //           ? String(error.response.data.message)
// //           : "Failed to update verification";
// //       notify({
// //         message: errorMessage,
// //         type: "error",
// //       });
// //     } finally {
// //       setLoadingStates((prev) => ({ ...prev, [userId]: false }));
// //     }
// //   };

// //   const getStatusBadge = (status: string) => {
// //     const variants: Record<string, "default" | "secondary" | "destructive"> = {
// //       Active: "default",
// //       Inactive: "secondary",
// //       Pending: "secondary",
// //     };

// //     return (
// //       <Badge
// //         variant={variants[status] || "default"}
// //         className={
// //           status === "active"
// //             ? "bg-green-100 text-green-800 hover:bg-green-100"
// //             : status === "pending_verification"
// //             ? "bg-red-100 text-red-800 hover:bg-red-100"
// //             : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
// //         }
// //       >
// //         {status}
// //       </Badge>
// //     );
// //   };

// //   const handlePageChange = (page: number) => {
// //     if (page < 1 || !apiData.pagination || page > apiData.pagination.last_page)
// //       return;
// //     fetchUsers(page);
// //     window.scrollTo({ top: 0, behavior: "smooth" });
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-3xl font-bold tracking-tight">Users</h1>
// //           <p className="text-muted-foreground">
// //             Manage your users and their permissions
// //           </p>
// //         </div>
// //         <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
// //           <User className="mr-2 h-4 w-4" />
// //           Add User
// //         </Button>
// //       </div>

// //       <Card>
// //         <CardHeader>
// //           <CardTitle>User Management</CardTitle>
// //           <CardDescription>
// //             {apiData.pagination && (
// //               <span>
// //                 Showing {apiData.pagination.from} to {apiData.pagination.to} of{" "}
// //                 {apiData.pagination.total} users
// //               </span>
// //             )}
// //           </CardDescription>

// //           {/* Filters */}
// //           <div className="flex gap-4 pt-4">
// //             <Input
// //               placeholder="Search users..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="max-w-sm"
// //             />

// //             <DropdownMenu>
// //               <DropdownMenuTrigger asChild>
// //                 <Button variant="outline">
// //                   Role: {filterRole}
// //                   <ChevronDown className="ml-2 h-4 w-4" />
// //                 </Button>
// //               </DropdownMenuTrigger>
// //               <DropdownMenuContent>
// //                 <DropdownMenuItem onClick={() => setFilterRole("All")}>
// //                   All
// //                 </DropdownMenuItem>
// //                 <DropdownMenuItem onClick={() => setFilterRole("Admin")}>
// //                   Admin
// //                 </DropdownMenuItem>
// //                 <DropdownMenuItem onClick={() => setFilterRole("Service Provider")}>
// //                   Service Provider
// //                 </DropdownMenuItem>
// //                 <DropdownMenuItem onClick={() => setFilterRole("Client")}>
// //                   Client
// //                 </DropdownMenuItem>
// //               </DropdownMenuContent>
// //             </DropdownMenu>

// //             <DropdownMenu>
// //               <DropdownMenuTrigger asChild>
// //                 <Button variant="outline">
// //                   Status: {filterStatus}
// //                   <ChevronDown className="ml-2 h-4 w-4" />
// //                 </Button>
// //               </DropdownMenuTrigger>
// //               <DropdownMenuContent>
// //                 <DropdownMenuItem onClick={() => setFilterStatus("All")}>
// //                   All
// //                 </DropdownMenuItem>
// //                 <DropdownMenuItem onClick={() => setFilterStatus("Active")}>
// //                   Active
// //                 </DropdownMenuItem>
// //                 <DropdownMenuItem onClick={() => setFilterStatus("Pending")}>
// //                   Pending
// //                 </DropdownMenuItem>
// //               </DropdownMenuContent>
// //             </DropdownMenu>
// //           </div>
// //         </CardHeader>

// //         <CardContent>
// //           {isLoading ? (
// //             <div className="flex items-center justify-center py-12">
// //               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
// //             </div>
// //           ) : (
// //             <>
// //               <Table>
// //                 <TableHeader>
// //                   <TableRow>
// //                     <TableHead>User</TableHead>
// //                     <TableHead>Role</TableHead>
// //                     <TableHead>Status</TableHead>
// //                     <TableHead>Verified</TableHead>
// //                     <TableHead>Join Date</TableHead>
// //                     <TableHead className="text-right">Actions</TableHead>
// //                   </TableRow>
// //                 </TableHeader>
// //                 <TableBody>
// //                   {apiData?.users?.length > 0 ? (
// //                     apiData.users.map((user) => (
// //                       <TableRow key={user.id} className="hover:bg-muted/50">
// //                         <TableCell>
// //                           <div className="flex items-center space-x-3">
// //                             <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
// //                               <span className="text-xs font-medium text-primary-foreground">
// //                                 {user?.full_name
// //                                   ?.split(" ")
// //                                   .map((n) => n[0])
// //                                   .join("") || "U"}
// //                               </span>
// //                             </div>
// //                             <div>
// //                               <div className="font-medium">{user.full_name}</div>
// //                               <div className="text-sm text-muted-foreground">
// //                                 {user.email}
// //                               </div>
// //                             </div>
// //                           </TableCell>
// //                         <TableCell>
// //                           <Badge variant="outline">{user.user_type}</Badge>
// //                         </TableCell>
// //                         <TableCell>{getStatusBadge(user.status)}</TableCell>
// //                         <TableCell>
// //                           <ToggleSwitch
// //                             enabled={user.is_verified || false}
// //                             onChange={() =>
// //                               handleVerifyToggle(user.id, user.is_verified)
// //                             }
// //                             disabled={loadingStates[user.id]}
// //                           />
// //                         </TableCell>
// //                         <TableCell className="text-muted-foreground">
// //                           {user.created_at}
// //                         </TableCell>
// //                         <TableCell className="text-right">
// //                           <div className="flex gap-2 justify-end cursor-pointer">
// //                             <Pencil
// //                               size={15}
// //                               className="hover:text-blue-600 transition-colors"
// //                             />
// //                             <Eye
// //                               size={15}
// //                               className="hover:text-green-600 transition-colors"
// //                             />
// //                             <Trash2
// //                               size={15}
// //                               className="hover:text-red-600 transition-colors"
// //                             />
// //                           </div>
// //                         </TableCell>
// //                       </TableRow>
// //                     ))
// //                   ) : (
// //                     <TableRow>
// //                       <TableCell colSpan={6} className="text-center py-12">
// //                         <p className="text-muted-foreground">No users found</p>
// //                       </TableCell>
// //                     </TableRow>
// //                   )}
// //                 </TableBody>
// //               </Table>
// // <CustomPagination
// //   currentPage={apiData?.pagination?.current_page}
// //   lastPage={apiData?.pagination?.last_page}
// //   onPageChange={handlePageChange}
// //   total={apiData?.pagination?.total}
// //   from={apiData?.pagination?.from}
// //   to={apiData?.pagination?.to}
// // />
// //               {/* Pagination */}
// //               {/* Commented out - using CustomPagination instead
// //               {apiData.pagination && apiData.pagination.last_page > 1 && (
// //                 <div className="mt-6">
// //                   <Pagination>
// //                     <PaginationContent>
// //                       <PaginationItem>
// //                         <PaginationPrevious
// //                           onClick={() =>
// //                             handlePageChange(apiData.pagination!.current_page - 1)
// //                           }
// //                           className={
// //                             apiData.pagination.current_page === 1
// //                               ? "pointer-events-none opacity-50"
// //                               : "cursor-pointer"
// //                           }
// //                         />
// //                       </PaginationItem>

// //                       {generatePageNumbers().map((page, index) => (
// //                         <PaginationItem key={index}>
// //                           {page === "ellipsis-start" || page === "ellipsis-end" ? (
// //                             <PaginationEllipsis />
// //                           ) : (
// //                             <PaginationLink
// //                               onClick={() => handlePageChange(page as number)}
// //                               isActive={
// //                                 page === apiData.pagination!.current_page
// //                               }
// //                               className="cursor-pointer"
// //                             >
// //                               {page}
// //                             </PaginationLink>
// //                           )}
// //                         </PaginationItem>
// //                       ))}

// //                       <PaginationItem>
// //                         <PaginationNext
// //                           onClick={() =>
// //                             handlePageChange(apiData.pagination!.current_page + 1)
// //                           }
// //                           className={
// //                             apiData.pagination.current_page ===
// //                             apiData.pagination.last_page
// //                               ? "pointer-events-none opacity-50"
// //                               : "cursor-pointer"
// //                           }
// //                         />
// //                       </PaginationItem>
// //                     </PaginationContent>
// //                   </Pagination>

// //                   <div className="text-center text-sm text-muted-foreground mt-4">
// //                     Page {apiData.pagination.current_page} of{" "}
// //                     {apiData.pagination.last_page}
// //                   </div>
// //                 </div>
// //               )}
// //               */}
// //             </>
// //           )}
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { User, ChevronDown, Pencil, Eye, Trash2 } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import makeApiRequest from "@/services/axios";
// import { apiUrl } from "@/services/api-end-point";
// import ToggleSwitch from "@/components/ui/toggle-switch";
// import { notify } from "@/utils/utils";
// import { CustomPagination } from "@/components/custom-pagination";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useNavigate } from "react-router-dom";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// interface User {
//   id: number;
//   full_name: string;
//   email: string;
//   user_type: string;
//   status: string;
//   is_verified: boolean;
//   created_at: string;
// }

// interface PaginationData {
//   total: number;
//   per_page: number;
//   current_page: number;
//   last_page: number;
//   from: number;
//   to: number;
// }

// export default function Users() {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterRole, setFilterRole] = useState("all");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [perPage, setPerPage] = useState(20); // Default 20 items per page
//   const [apiData, setApiData] = useState<{
//     users: User[];
//     pagination: PaginationData | null;
//   }>({
//     users: [],
//     pagination: null,
//   });
//   const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
//     {}
//   );
//   const [isLoading, setIsLoading] = useState(false);

//   // Fetch users with page and perPage parameters
//   const fetchUsers = async (page: number = 1, itemsPerPage: number = 20, role: string = "", status: string = "") => {
//     try {
//       setIsLoading(true);
//       const url = `${apiUrl.users}?page=${page}&per_page=${itemsPerPage}&user_type=${role}&status=${status}`

//       const response = await makeApiRequest(url, {
//         method: "GET",
//       });
//       setApiData({
//         users: response.data.users || [],
//         pagination: response.data.pagination || null,
//       });
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       notify({ message: "Failed to fetch users", type: "error" });
//     } finally {
//       setIsLoading(false);
//     }
//   };



//   // Toggle verify user
//   const handleVerifyToggle = async (userId: number, currentStatus: boolean) => {
//     try {
//       setLoadingStates((prev) => ({ ...prev, [userId]: true }));

//     const response = await makeApiRequest(apiUrl.verifyUser(String(userId)), {
//         method: "PUT",
//         data: {
//           is_verified: !currentStatus,
//         },
//       });

//     if(response.success === true){
//       await fetchUsers(apiData.pagination?.current_page || 1, perPage);
//       // Update local state
//       setApiData((prev) => ({
//         ...prev,
//         users: prev.users.map((user) =>
//           user.id === userId ? { ...user, is_verified: !currentStatus } : user
//         ),
//       }));
//     }

//       notify({
//         message: `User ${
//           !currentStatus ? "verified" : "unverified"
//         } successfully`,
//         type: "success",
//       });
//     } catch (error: unknown) {
//       console.error("❌ Error updating verification:", error);
//       const errorMessage =
//         error &&
//         typeof error === "object" &&
//         "response" in error &&
//         error.response &&
//         typeof error.response === "object" &&
//         "data" in error.response &&
//         error.response.data &&
//         typeof error.response.data === "object" &&
//         "message" in error.response.data
//           ? String(error.response.data.message)
//           : "Failed to update verification";
//       notify({
//         message: errorMessage,
//         type: "error",
//       });
//     } finally {
//       setLoadingStates((prev) => ({ ...prev, [userId]: false }));
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     return (
//       <Badge
//         className={
//           status === "active"
//             ? "bg-green-100 text-green-800 hover:bg-green-100"
//             : status === "pending_verification"
//             ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
//             : "bg-red-100 text-red-800 hover:bg-red-100"
//         }
//       >
//         {status}
//       </Badge>
//     );
//   };

//   const handlePageChange = (page: number) => {
//     if (page < 1 || !apiData.pagination || page > apiData.pagination.last_page)
//       return;
//     fetchUsers(page, perPage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handlePerPageChange = (value: number) => {
//     setPerPage(value);
//     fetchUsers(1, value); // Reset to page 1 when changing per_page
//   };

//   const handleRoleFilterChange = async (role: string) => {
//     setFilterRole(role);
//     const apiRole = role === "all" ? "" : role;
//     await fetchUsers(1, perPage, apiRole);
//   };

//   const handleStatusFilterChange =async  (status: string) => {
//     setFilterStatus(status);
//      const apiStatus = status === "pending" ? ""  : status ==="all" ?  "" : status;
//     await fetchUsers(1, perPage, undefined, apiStatus);
//   }


//  // Initial load
//   useEffect(() => {
//     fetchUsers(1, perPage);
//   }, []);
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Users</h1>
//           <p className="text-muted-foreground">
//             Manage your users and their permissions
//           </p>
//         </div>
//         <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
//           <User className="mr-2 h-4 w-4" />
//           Add User
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>User Management</CardTitle>
//               <CardDescription>
//                 {apiData.pagination ? (
//                   <span>
//                     Showing {apiData.pagination.from} to {apiData.pagination.to}{" "}
//                     of {apiData.pagination.total} users
//                   </span>
//                 ) : (
//                   "View and manage all users"
//                 )}
//               </CardDescription>
//             </div>

//             {/* Per Page Selector */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm">
//                   Show: {perPage}
//                   <ChevronDown className="ml-2 h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem onClick={() => handlePerPageChange(10)}>
//                   10 per page
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handlePerPageChange(20)}>
//                   20 per page
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handlePerPageChange(50)}>
//                   50 per page
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handlePerPageChange(100)}>
//                   100 per page
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           {/* Filters */}
//           <div className="flex gap-4 pt-4">
//             <Input
//               placeholder="Search users..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="max-w-sm"
//             />

//             {/* <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline">
//                   Role: All
//                   <ChevronDown className="ml-2 h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem onClick={() => handleRoleFilterChange("")} >
//                   All
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handleRoleFilterChange("provider")}>
//                   Provider
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handleRoleFilterChange("client")}>
//                   Client
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu> */}
//             <Select 
//               value={filterRole} 
//               onValueChange={(value) => {
//                 setFilterRole(value);
//                 handleRoleFilterChange(value);
//               }}
//             >
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Select a Role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Roles</SelectLabel>
//                   <SelectItem value="all">All</SelectItem>
//                   <SelectItem value="provider">Provider</SelectItem>
//                   <SelectItem value="client">Client</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//             <Select 
//               value={filterStatus} 
//               onValueChange={(value) => {
//                 setFilterStatus(value);
//                 handleStatusFilterChange(value);
//               }}
//             >
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Select a Role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Status</SelectLabel>
//                   <SelectItem value="all">All</SelectItem>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="pending">Pending</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>

//             {/* <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline">
//                   Status: {filterStatus}
//                   <ChevronDown className="ml-2 h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem onClick={() => setFilterStatus("All")}>
//                   All
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setFilterStatus("Active")}>
//                   Active
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setFilterStatus("Pending")}>
//                   Pending
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu> */}
//           </div>
//         </CardHeader>

//         <CardContent>
//           <>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>User</TableHead>
//                   <TableHead>Role</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Verified</TableHead>
//                   <TableHead>Join Date</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {isLoading ? (
//                   <>
//                     {" "}
//                     {Array.from({ length: 5 }).map((_, index) => (
//                       <TableRow key={index}>
//                         <TableCell>
//                           <div className="flex items-center space-x-3">
//                             <Skeleton className="h-8 w-8 rounded-full" />
//                             <div className="space-y-2">
//                               <Skeleton className="h-4 w-[150px]" />
//                               <Skeleton className="h-3 w-[200px]" />
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-6 w-[80px]" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-6 w-[100px]" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-6 w-[44px]" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-4 w-[120px]" />
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <div className="flex gap-2 justify-end">
//                             <Skeleton className="h-4 w-4" />
//                             <Skeleton className="h-4 w-4" />
//                             <Skeleton className="h-4 w-4" />
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </>
//                 ) : (
//                   <>
//                     {apiData?.users?.length > 0 ? (
//                       apiData.users.map((user) => (
//                         <TableRow key={user.id} className="hover:bg-muted/50">
//                           <TableCell>
//                             <div className="flex items-center space-x-3">
//                               <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
//                                 <span className="text-xs font-medium text-primary-foreground">
//                                   {user?.full_name
//                                     ?.split(" ")
//                                     .map((n) => n[0])
//                                     .join("") || "U"}
//                                 </span>
//                               </div>
//                               <div>
//                                 <div className="font-medium">
//                                   {user.full_name}
//                                 </div>
//                                 <div className="text-sm text-muted-foreground">
//                                   {user.email}
//                                 </div>
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <Badge variant="outline" className="capitalize">
//                               {user.user_type}
//                             </Badge>
//                           </TableCell>
//                           <TableCell>{getStatusBadge(user.status)}</TableCell>
//                           <TableCell>
//                             <ToggleSwitch
//                               enabled={user.is_verified || false}
//                               onChange={() =>
//                                 handleVerifyToggle(user.id, user.is_verified)
//                               }
//                               disabled={loadingStates[user.id]}
//                             />
//                           </TableCell>
//                           <TableCell className="text-muted-foreground">
//                             {new Date(user.created_at).toLocaleDateString()}
//                           </TableCell>
//                           <TableCell className="text-right">
//                             <div className="flex gap-2 justify-end cursor-pointer">
//                               <Pencil
//                                 size={15}
//                                 className="hover:text-blue-600 transition-colors"
//                               />
//                               <Eye
//                                 size={15}
//                                 className="hover:text-green-600 transition-colors"
//                                onClick={() => navigate(`/dashboard/users/${user.id}`)}
//                               />
//                               <Trash2
//                                 size={15}
//                                 className="hover:text-red-600 transition-colors"
//                               />
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={6} className="text-center py-12">
//                           <p className="text-muted-foreground">
//                             No users found
//                           </p>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </>
//                 )}
//               </TableBody>
//             </Table>

//             {/* Pagination */}
//             {apiData.pagination && apiData.pagination.last_page > 1 && (
//               <div className="mt-6">
//                 <CustomPagination
//                   currentPage={apiData.pagination.current_page}
//                   lastPage={apiData.pagination.last_page}
//                   onPageChange={handlePageChange}
//                   total={apiData.pagination.total}
//                   from={apiData.pagination.from}
//                   to={apiData.pagination.to}
//                 />
//               </div>
//             )}
//           </>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { User, ChevronDown, Pencil, Eye, Trash2 } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import makeApiRequest from "@/services/axios";
// import { apiUrl } from "@/services/api-end-point";
// import ToggleSwitch from "@/components/ui/toggle-switch";
// import { notify } from "@/utils/utils";
// import { CustomPagination } from "@/components/custom-pagination";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface User {
//   id: number;
//   full_name: string;
//   email: string;
//   user_type: string;
//   status: string;
//   is_verified: boolean;
//   created_at: string;
// }

// interface PaginationData {
//   total: number;
//   per_page: number;
//   current_page: number;
//   last_page: number;
//   from: number;
//   to: number;
// }

// export default function Users() {
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const urlUserType = searchParams.get('user_type') || 'all';
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterRole, setFilterRole] = useState(urlUserType);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [perPage, setPerPage] = useState(20);
//   const [apiData, setApiData] = useState<{
//     users: User[];
//     pagination: PaginationData | null;
//   }>({
//     users: [],
//     pagination: null,
//   });
//   const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   // ✅ Updated fetchUsers - accepts both role and status
//   const fetchUsers = async (
//     page: number = 1,
//     itemsPerPage: number = 20,
//     role: string = "",
//     status: string = ""
//   ) => {
//     try {
//       setIsLoading(true);

//       // Build URL with proper parameters
//       let url = `${apiUrl.users}?page=${page}&per_page=${itemsPerPage}`;

//       // Add role filter if not "all"
//       if (role && role !== "all") {
//         url += `&user_type=${role}`;
//       }

//       // Add status filter if not "all"
//       if (status && status !== "all") {
//         url += `&status=${status}`;
//       }

//       const response = await makeApiRequest(url, {
//         method: "GET",
//       });

//       setApiData({
//         users: response.data.users || [],
//         pagination: response.data.pagination || null,
//       });
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       notify({ message: "Failed to fetch users", type: "error" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Toggle verify user
//   const handleVerifyToggle = async (userId: number, currentStatus: boolean) => {
//     try {
//       setLoadingStates((prev) => ({ ...prev, [userId]: true }));

//       const response = await makeApiRequest(apiUrl.verifyUser(String(userId)), {
//         method: "PUT",
//         data: {
//           is_verified: !currentStatus,
//         },
//       });

//       if (response.success === true) {
//         // Refresh with current filters
//         const apiRole = filterRole === "all" ? "" : filterRole;
//         const apiStatus = filterStatus === "all" ? "" : filterStatus;
//         await fetchUsers(apiData.pagination?.current_page || 1, perPage, apiRole, apiStatus);
//       }

//       notify({
//         message: `User ${!currentStatus ? "verified" : "unverified"} successfully`,
//         type: "success",
//       });
//     } catch (error: unknown) {
//       console.error("❌ Error updating verification:", error);
//       const errorMessage =
//         error &&
//         typeof error === "object" &&
//         "response" in error &&
//         error.response &&
//         typeof error.response === "object" &&
//         "data" in error.response &&
//         error.response.data &&
//         typeof error.response.data === "object" &&
//         "message" in error.response.data
//           ? String(error.response.data.message)
//           : "Failed to update verification";
//       notify({
//         message: errorMessage,
//         type: "error",
//       });
//     } finally {
//       setLoadingStates((prev) => ({ ...prev, [userId]: false }));
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     return (
//       <Badge
//         className={
//           status === "active"
//             ? "bg-green-100 text-green-800 hover:bg-green-100"
//             : status === "pending_verification"
//             ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
//             : "bg-red-100 text-red-800 hover:bg-red-100"
//         }
//       >
//         {status}
//       </Badge>
//     );
//   };


//   const handleRoleFilterChange = async (role: string) => {
//     setFilterRole(role);

//     // Update URL params
//     if (role === "all") {
//       searchParams.delete('user_type');
//     } else {
//       searchParams.set('user_type', role);
//     }
//     setSearchParams(searchParams);

//     const apiRole = role === "all" ? "" : role;
//     const apiStatus = filterStatus === "all" ? "" : filterStatus;
//     await fetchUsers(1, perPage, apiRole, apiStatus);
//     // setFilterRole(role);
//     // const apiRole = role === "all" ? "" : role;
//     // const apiStatus = filterStatus === "all" ? "" : filterStatus;
//     // await fetchUsers(1, perPage, apiRole, apiStatus);
//   };

//   const handleStatusFilterChange = async (status: string) => {
//     setFilterStatus(status);
//     const apiRole = filterRole === "all" ? "" : filterRole;
//     const apiStatus = status === "all" ? "" : status;
//     await fetchUsers(1, perPage, apiRole, apiStatus);
//   };

//   const handlePageChange = (page: number) => {
//     if (page < 1 || !apiData.pagination || page > apiData.pagination.last_page)
//       return;

//     const apiRole = filterRole === "all" ? "" : filterRole;
//     const apiStatus = filterStatus === "all" ? "" : filterStatus;
//     fetchUsers(page, perPage, apiRole, apiStatus);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handlePerPageChange = (value: number) => {
//     setPerPage(value);
//     const apiRole = filterRole === "all" ? "" : filterRole;
//     const apiStatus = filterStatus === "all" ? "" : filterStatus;
//     fetchUsers(1, value, apiRole, apiStatus);
//   };

//   // Initial load
//   useEffect(() => {
//     fetchUsers(1, perPage);
//   }, []);

//   useEffect(() => {
//     const apiRole = filterRole === "all" ? "" : filterRole;
//     fetchUsers(1, perPage, apiRole, "");
//   }, []);



//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Users</h1>
//           <p className="text-muted-foreground">
//             Manage your users and their permissions
//           </p>
//         </div>
//         <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
//           <User className="mr-2 h-4 w-4" />
//           <Link to={"/dashboard/create-user"}>
//           Add User
//           </Link>
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>User Management</CardTitle>
//               <CardDescription>
//                 {apiData.pagination ? (
//                   <span>
//                     Showing {apiData.pagination.from} to {apiData.pagination.to} of{" "}
//                     {apiData.pagination.total} users
//                     {filterRole !== "all" && ` • Role: ${filterRole}`}
//                     {filterStatus !== "all" && ` • Status: ${filterStatus}`}
//                   </span>
//                 ) : (
//                   "View and manage all users"
//                 )}
//               </CardDescription>
//             </div>

//             {/* Per Page Selector */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm">
//                   Show: {perPage}
//                   <ChevronDown className="ml-2 h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem onClick={() => handlePerPageChange(10)}>
//                   10 per page
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handlePerPageChange(20)}>
//                   20 per page
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handlePerPageChange(50)}>
//                   50 per page
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handlePerPageChange(100)}>
//                   100 per page
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           {/* Filters */}
//           <div className="flex gap-4 pt-4">
//             <Input
//               placeholder="Search users..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="max-w-sm"
//             />

//             {/* Role Filter */}
//             <Select value={filterRole} onValueChange={handleRoleFilterChange}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Select Role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Roles</SelectLabel>
//                   <SelectItem value="all">All Roles</SelectItem>
//                   <SelectItem value="provider">Provider</SelectItem>
//                   <SelectItem value="client">Client</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>

//             {/* Status Filter */}
//             <Select value={filterStatus} onValueChange={handleStatusFilterChange}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Select Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Status</SelectLabel>
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="pending_verification">Pending</SelectItem>
//                   <SelectItem value="suspended">Suspended</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardHeader>

//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>User</TableHead>
//                 <TableHead>Role</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Verified</TableHead>
//                 <TableHead>Join Date</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {isLoading ? (
//                 <>
//                   {Array.from({ length: 5 }).map((_, index) => (
//                     <TableRow key={index}>
//                       <TableCell>
//                         <div className="flex items-center space-x-3">
//                           <Skeleton className="h-8 w-8 rounded-full" />
//                           <div className="space-y-2">
//                             <Skeleton className="h-4 w-[150px]" />
//                             <Skeleton className="h-3 w-[200px]" />
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Skeleton className="h-6 w-[80px]" />
//                       </TableCell>
//                       <TableCell>
//                         <Skeleton className="h-6 w-[100px]" />
//                       </TableCell>
//                       <TableCell>
//                         <Skeleton className="h-6 w-[44px]" />
//                       </TableCell>
//                       <TableCell>
//                         <Skeleton className="h-4 w-[120px]" />
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex gap-2 justify-end">
//                           <Skeleton className="h-4 w-4" />
//                           <Skeleton className="h-4 w-4" />
//                           <Skeleton className="h-4 w-4" />
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </>
//               ) : (
//                 <>
//                   {apiData?.users?.length > 0 ? (
//                     apiData.users.map((user) => (
//                       <TableRow key={user.id} className="hover:bg-muted/50">
//                         <TableCell>
//                           <div className="flex items-center space-x-3">
//                             <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
//                               <span className="text-xs font-medium text-primary-foreground">
//                                 {user?.full_name
//                                   ?.split(" ")
//                                   .map((n) => n[0])
//                                   .join("") || "U"}
//                               </span>
//                             </div>
//                             <div>
//                               <div className="font-medium">{user.full_name}</div>
//                               <div className="text-sm text-muted-foreground">
//                                 {user.email}
//                               </div>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="outline" className="capitalize">
//                             {user.user_type}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>{getStatusBadge(user.status)}</TableCell>
//                         <TableCell>
//                           <ToggleSwitch
//                             enabled={user.is_verified || false}
//                             onChange={() =>
//                               handleVerifyToggle(user.id, user.is_verified)
//                             }
//                             disabled={loadingStates[user.id]}
//                           />
//                         </TableCell>
//                         <TableCell className="text-muted-foreground">
//                           {new Date(user.created_at).toLocaleDateString()}
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <div className="flex gap-2 justify-end cursor-pointer">
//                             <Pencil
//                               size={15}
//                               className="hover:text-blue-600 transition-colors"
//                             />
//                             <Eye
//                               size={15}
//                               className="hover:text-green-600 transition-colors"
//                               onClick={() => navigate(`/dashboard/users/${user.id}`)}
//                             />
//                             <Trash2
//                               size={15}
//                               className="hover:text-red-600 transition-colors"
//                             />
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={6} className="text-center py-12">
//                         <p className="text-muted-foreground">No users found</p>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </>
//               )}
//             </TableBody>
//           </Table>

//           {/* Pagination */}
//           {apiData.pagination && apiData.pagination.last_page > 1 && (
//             <div className="mt-6">
//               <CustomPagination
//                 currentPage={apiData.pagination.current_page}
//                 lastPage={apiData.pagination.last_page}
//                 onPageChange={handlePageChange}
//                 total={apiData.pagination.total}
//                 from={apiData.pagination.from}
//                 to={apiData.pagination.to}
//               />
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




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
import { ChevronDown, Eye, User } from "lucide-react";
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
  const urlUserType = searchParams.get('user_type') || 'all';

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

      // ✅ Add user_type filter
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

      console.log("🔍 Fetching URL:", url);
      console.log("📋 Filters - Role:", role, "Status:", status);

      const response = await makeApiRequest(url, {
        method: "GET",
      });

      console.log("✅ API Response:", response.data);

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
    console.log("🔄 Changing role filter to:", role);
    setFilterRole(role);

    // Update URL params
    if (role === "all") {
      searchParams.delete('user_type');
    } else {
      searchParams.set('user_type', role);
    }
    setSearchParams(searchParams);

    const apiRole = role === "all" ? "" : role;
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    await fetchUsers(1, perPage, apiRole, apiStatus, searchTerm, filterCity, filterState, filterDesiredRole === "all" ? "" : filterDesiredRole);
  };

  const handleStatusFilterChange = async (status: string) => {
    setFilterStatus(status);
    const apiRole = filterRole === "all" ? "" : filterRole;
    const apiStatus = status === "all" ? "" : status;
    await fetchUsers(1, perPage, apiRole, apiStatus, searchTerm, filterCity, filterState, filterDesiredRole === "all" ? "" : filterDesiredRole);
  };

  const handleCityFilterChange = async (city: string) => {
    setFilterCity(city);
    const apiRole = filterRole === "all" ? "" : filterRole;
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    await fetchUsers(1, perPage, apiRole, apiStatus, searchTerm, city, filterState, filterDesiredRole === "all" ? "" : filterDesiredRole);
  }

  const handleStateFilterChange = async (state: string) => {
    setFilterState(state);
    const apiRole = filterRole === "all" ? "" : filterRole;
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    await fetchUsers(1, perPage, apiRole, apiStatus, searchTerm, filterCity, state, filterDesiredRole === "all" ? "" : filterDesiredRole);
  }

  const handleDesiredRoleFilterChange = async (role: string) => {
    setFilterDesiredRole(role);
    const apiRole = filterRole === "all" ? "" : filterRole;
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    await fetchUsers(1, perPage, apiRole, apiStatus, searchTerm, filterCity, filterState, role === "all" ? "" : role);
  }

  const handleSearchChange = async (search: string) => {
    setSearchTerm(search);
    const apiRole = filterRole === "all" ? "" : filterRole;
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    // Use a debounce ideally, but for now simple trigger
    await fetchUsers(1, perPage, apiRole, apiStatus, search, filterCity, filterState, filterDesiredRole === "all" ? "" : filterDesiredRole);
  }

  const handlePageChange = (page) => {
    if (page < 1 || !apiData.pagination || page > apiData.pagination.last_page)
      return;

    const apiRole = filterRole === "all" ? "" : filterRole;
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    fetchUsers(page, perPage, apiRole, apiStatus, searchTerm, filterCity, filterState, filterDesiredRole === "all" ? "" : filterDesiredRole);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (value) => {
    setPerPage(value);
    const apiRole = filterRole === "all" ? "" : filterRole;
    const apiStatus = filterStatus === "all" ? "" : filterStatus;
    fetchUsers(1, value, apiRole, apiStatus, searchTerm, filterCity, filterState, filterDesiredRole === "all" ? "" : filterDesiredRole);
  };

  // ✅ Initial load - runs when URL params change
  useEffect(() => {
    console.log("🚀 Component mounted/URL changed");
    console.log("📍 URL user_type param:", urlUserType);
    console.log("📍 Current filterRole state:", filterRole);

    // Update filterRole if URL changed
    if (urlUserType !== filterRole) {
      setFilterRole(urlUserType);
    }

    // Fetch with URL params
    const apiRole = urlUserType === "all" ? "" : urlUserType;
    fetchUsers(1, perPage, apiRole, "");
  }, [urlUserType]); // ✅ Re-run when URL param changes

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage your users and their permissions
          </p>
        </div>
        <Link to="/dashboard/create-user">
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600">
            <User className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

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
            {/* <Input
              placeholder="Search by name/email..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="max-w-[200px]"
            /> */}

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
                      apiData.users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/50">
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
                                {user.user_type === "provider" ? "Worker" : user.user_type === "client" ? "Employer" : user.user_type}
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
                              {/* <Pencil
                              size={15}
                              className="hover:text-blue-600 transition-colors"
                            /> */}
                              <Eye
                                size={15}
                                className="hover:text-green-600 transition-colors"
                                onClick={() => navigate(`/dashboard/users/${user.id}`)}
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
  );
}
