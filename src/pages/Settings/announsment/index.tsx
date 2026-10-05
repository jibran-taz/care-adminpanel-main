// import { useEffect, useState } from "react";
// import {
//   ChevronDown,
//   Eye,
//   Pencil,
//   Trash2,
//   Plus,
//   Bell,
//   ExternalLink,
// } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
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
// import ToggleSwitch from "@/components/ui/toggle-switch";
// import { notify } from "@/utils/utils";
// import { CustomPagination } from "@/components/custom-pagination";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Link, useNavigate } from "react-router-dom";

// interface PaginationData {
//   total: number;
//   per_page: number;
//   current_page: number;
//   last_page: number;
//   from: number;
//   to: number;
// }

// interface Announcement {
//   id: number;
//   message: string;
//   link_text: string;
//   link_url: string;
//   background_color: string;
//   text_color: string;
//   icon: string;
//   is_dismissible: boolean;
//   is_active: boolean;
//   priority: number;
//   start_date: string | null;
//   end_date: string | null;
//   created_at: string;
//   updated_at: string;
// }

// export default function AnnouncementsList() {
//   const navigate = useNavigate();
//   const [perPage, setPerPage] = useState(20);
//   const [apiData, setApiData] = useState<{
//     announcements: Announcement[];
//     pagination: PaginationData | null;
//   }>({
//     announcements: [],
//     pagination: null,
//   });
//   const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
//     {}
//   );
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchAnnouncements = async (
//     page: number = 1,
//     itemsPerPage: number = 20
//   ) => {
//     try {
//       setIsLoading(true);

//       const url = `admin/cms/announcements?page=${page}&per_page=${itemsPerPage}`;

//       const response = await makeApiRequest(url, {
//         method: "GET",
//       });

//       setApiData({
//         announcements: response.data.data || [],
//         pagination: {
//           total: response.data.total,
//           per_page: response.data.per_page,
//           current_page: response.data.current_page,
//           last_page: response.data.last_page,
//           from: response.data.from,
//           to: response.data.to,
//         },
//       });
//     } catch (error) {
//       console.error("❌ Error fetching announcements:", error);
//       notify({ message: "Failed to fetch announcements", type: "error" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleActiveToggle = async (
//     announcementId: number,
//     currentStatus: boolean
//   ) => {
//     try {
//       setLoadingStates((prev) => ({ ...prev, [announcementId]: true }));

//       const response = await makeApiRequest(
//         `admin/cms/announcements/${announcementId}`,
//         {
//           method: "PUT",
//           data: {
//             is_active: !currentStatus,
//           },
//         }
//       );

//       if (response.success === true) {
//         await fetchAnnouncements(
//           apiData.pagination?.current_page || 1,
//           perPage
//         );
//       }

//       notify({
//         message: `Announcement ${
//           !currentStatus ? "activated" : "deactivated"
//         } successfully`,
//         type: "success",
//       });
//     } catch (error: unknown) {
//       console.error("❌ Error updating announcement:", error);
//       notify({
//         message: "Failed to update announcement",
//         type: "error",
//       });
//     } finally {
//       setLoadingStates((prev) => ({ ...prev, [announcementId]: false }));
//     }
//   };

//   const handleDelete = async (announcementId: number) => {
//     if (!confirm("Are you sure you want to delete this announcement?")) return;

//     try {
//       await makeApiRequest(`admin/cms/announcements/${announcementId}`, {
//         method: "DELETE",
//       });

//       notify({
//         message: "Announcement deleted successfully",
//         type: "success",
//       });

//       await fetchAnnouncements(
//         apiData.pagination?.current_page || 1,
//         perPage
//       );
//     } catch (error) {
//       console.error("❌ Error deleting announcement:", error);
//       notify({
//         message: "Failed to delete announcement",
//         type: "error",
//       });
//     }
//   };

//   const handlePageChange = (page: number) => {
//     if (
//       page < 1 ||
//       !apiData.pagination ||
//       page > apiData.pagination.last_page
//     )
//       return;

//     fetchAnnouncements(page, perPage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handlePerPageChange = (value: number) => {
//     setPerPage(value);
//     fetchAnnouncements(1, value);
//   };

//   useEffect(() => {
//     fetchAnnouncements(1, perPage);
//   }, []);

//   const truncateText = (text: string, maxLength: number = 60) => {
//     if (text.length <= maxLength) return text;
//     return text.substring(0, maxLength) + "...";
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
//           <p className="text-muted-foreground">
//             Manage announcement banners and notifications
//           </p>
//         </div>
//         <Link to="/dashboard/create-announcements">
//           <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
//             <Plus className="mr-2 h-4 w-4" />
//             Add Announcement
//           </Button>
//         </Link>
//       </div>

//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>All Announcements</CardTitle>
//               <CardDescription>
//                 {apiData.pagination ? (
//                   <span>
//                     Showing {apiData.pagination.from} to{" "}
//                     {apiData.pagination.to} of {apiData.pagination.total}{" "}
//                     announcements
//                   </span>
//                 ) : (
//                   "View and manage all announcements"
//                 )}
//               </CardDescription>
//             </div>

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
//         </CardHeader>

//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Message</TableHead>
//                 <TableHead>Colors</TableHead>
//                 <TableHead>Link</TableHead>
//                 <TableHead>Priority</TableHead>
//                 <TableHead>Dismissible</TableHead>
//                 <TableHead>Active</TableHead>
//                 <TableHead>Created</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {isLoading ? (
//                 <>
//                   {Array.from({ length: 5 }).map((_, index) => (
//                     <TableRow key={index}>
//                       <TableCell>
//                         <div className="space-y-2">
//                           <Skeleton className="h-4 w-[300px]" />
//                           <Skeleton className="h-3 w-[100px]" />
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex gap-2">
//                           <Skeleton className="h-8 w-8 rounded" />
//                           <Skeleton className="h-8 w-8 rounded" />
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Skeleton className="h-6 w-[100px]" />
//                       </TableCell>
//                       <TableCell>
//                         <Skeleton className="h-6 w-[40px]" />
//                       </TableCell>
//                       <TableCell>
//                         <Skeleton className="h-6 w-[60px]" />
//                       </TableCell>
//                       <TableCell>
//                         <Skeleton className="h-6 w-[44px]" />
//                       </TableCell>
//                       <TableCell>
//                         <Skeleton className="h-4 w-[100px]" />
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
//                   {apiData?.announcements?.length > 0 ? (
//                     apiData.announcements.map((announcement) => (
//                       <TableRow
//                         key={announcement.id}
//                         className="hover:bg-muted/50"
//                       >
//                         <TableCell>
//                           <div className="max-w-md">
//                             <div className="flex items-start gap-2">
//                               {announcement.icon && (
//                                 <span className="text-lg mt-0.5">
//                                   {announcement.icon.includes("fa-") ? (
//                                     <i className={announcement.icon}></i>
//                                   ) : (
//                                     <Bell className="h-5 w-5 text-gray-400" />
//                                   )}
//                                 </span>
//                               )}
//                               <div>
//                                 <p className="font-medium">
//                                   {truncateText(announcement.message)}
//                                 </p>
//                                 {announcement.message.length > 60 && (
//                                   <p className="text-xs text-gray-500 mt-1">
//                                     Full message available in details
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex gap-2">
//                             <div
//                               className="w-8 h-8 rounded border-2 border-gray-200 flex items-center justify-center"
//                               style={{
//                                 backgroundColor: announcement.background_color,
//                               }}
//                               title="Background Color"
//                             >
//                               <span
//                                 className="text-xs font-bold"
//                                 style={{ color: announcement.text_color }}
//                               >
//                                 Aa
//                               </span>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           {announcement.link_text ? (
//                             <div className="flex items-center gap-1">
//                               <Badge variant="outline" className="text-xs">
//                                 {announcement.link_text}
//                               </Badge>
//                               <ExternalLink className="h-3 w-3 text-gray-400" />
//                             </div>
//                           ) : (
//                             <span className="text-gray-400">—</span>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           <Badge
//                             variant="outline"
//                             className={
//                               announcement.priority >= 8
//                                 ? "border-red-500 text-red-600"
//                                 : announcement.priority >= 5
//                                 ? "border-yellow-500 text-yellow-600"
//                                 : "border-gray-500 text-gray-600"
//                             }
//                           >
//                             {announcement.priority}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           {announcement.is_dismissible ? (
//                             <Badge className="bg-blue-100 text-blue-800">
//                               Yes
//                             </Badge>
//                           ) : (
//                             <Badge variant="outline">No</Badge>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           <ToggleSwitch
//                             enabled={announcement.is_active || false}
//                             onChange={() =>
//                               handleActiveToggle(
//                                 announcement.id,
//                                 announcement.is_active
//                               )
//                             }
//                             disabled={loadingStates[announcement.id]}
//                           />
//                         </TableCell>
//                         <TableCell className="text-muted-foreground">
//                           {new Date(
//                             announcement.created_at
//                           ).toLocaleDateString()}
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <div className="flex gap-2 justify-end cursor-pointer">
//                             <Eye
//                               size={15}
//                               className="hover:text-green-600 transition-colors"
//                               onClick={() =>
//                                 navigate(
//                                   `/dashboard/view-announcements/${announcement.id}`
//                                 )
//                               }
//                             />
//                             <Pencil
//                               size={15}
//                               className="hover:text-blue-600 transition-colors"
//                               onClick={() =>
//                                 navigate(
//                                   `/dashboard/edit-announcements/${announcement.id}`
//                                 )
//                               }
//                             />
//                             <Trash2
//                               size={15}
//                               className="hover:text-red-600 transition-colors"
//                               onClick={() => handleDelete(announcement.id)}
//                             />
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={8} className="text-center py-12">
//                         <div className="flex flex-col items-center gap-2">
//                           <Bell className="h-12 w-12 text-gray-400" />
//                           <p className="text-muted-foreground">
//                             No announcements found
//                           </p>
//                           <Link to="/dashboard/announcements/create">
//                             <Button
//                               size="sm"
//                               className="mt-2 bg-gradient-to-r from-green-500 to-emerald-600"
//                             >
//                               <Plus className="mr-2 h-4 w-4" />
//                               Create First Announcement
//                             </Button>
//                           </Link>
//                         </div>
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











import { useEffect, useState } from "react";
import {
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  Plus,
  Bell,
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

interface Announcement {
  id: number;
  message: string;
  link_text: string;
  link_url: string;
  background_color: string;
  text_color: string;
  icon: string;
  is_dismissible: boolean;
  is_active: boolean;
  priority: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export default function AnnouncementsList() {
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(20);
  const [apiData, setApiData] = useState<{
    announcements: Announcement[];
    pagination: PaginationData | null;
  }>({
    announcements: [],
    pagination: null,
  });
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    announcement: Announcement | null;
    loading: boolean;
  }>({
    open: false,
    announcement: null,
    loading: false,
  });

  const fetchAnnouncements = async (
    page: number = 1,
    itemsPerPage: number = 20
  ) => {
    try {
      setIsLoading(true);

      const url = `admin/cms/announcements?page=${page}&per_page=${itemsPerPage}`;

      const response = await makeApiRequest(url, {
        method: "GET",
      });

      setApiData({
        announcements: response.data.data || [],
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
      console.error("❌ Error fetching announcements:", error);
      notify({ message: "Failed to fetch announcements", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActiveToggle = async (
    announcementId: number,
    currentStatus: boolean
  ) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [announcementId]: true }));

      const response = await makeApiRequest(
        `admin/cms/announcements/${announcementId}`,
        {
          method: "PUT",
          data: {
            is_active: !currentStatus,
          },
        }
      );

      if (response.success === true) {
        await fetchAnnouncements(
          apiData.pagination?.current_page || 1,
          perPage
        );
      }

      notify({
        message: `Announcement ${
          !currentStatus ? "activated" : "deactivated"
        } successfully`,
        type: "success",
      });
    } catch (error: unknown) {
      console.error("❌ Error updating announcement:", error);
      notify({
        message: "Failed to update announcement",
        type: "error",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [announcementId]: false }));
    }
  };

  const openDeleteDialog = (announcement: Announcement) => {
    setDeleteDialog({
      open: true,
      announcement,
      loading: false,
    });
  };

  const closeDeleteDialog = () => {
    if (deleteDialog.loading) return; // Prevent closing during deletion
    setDeleteDialog({
      open: false,
      announcement: null,
      loading: false,
    });
  };

  const handleDelete = async () => {
    if (!deleteDialog.announcement) return;

    try {
      setDeleteDialog((prev) => ({ ...prev, loading: true }));

      await makeApiRequest(
        `admin/cms/announcements/${deleteDialog.announcement.id}`,
        {
          method: "DELETE",
        }
      );

      notify({
        message: "Announcement deleted successfully",
        type: "success",
      });

      await fetchAnnouncements(apiData.pagination?.current_page || 1, perPage);
      closeDeleteDialog();
    } catch (error) {
      console.error("❌ Error deleting announcement:", error);
      notify({
        message: "Failed to delete announcement",
        type: "error",
      });
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const handlePageChange = (page: number) => {
    if (
      page < 1 ||
      !apiData.pagination ||
      page > apiData.pagination.last_page
    )
      return;

    fetchAnnouncements(page, perPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    fetchAnnouncements(1, value);
  };

  useEffect(() => {
    fetchAnnouncements(1, perPage);
  }, []);

  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              announcement:
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-2">
                  {deleteDialog.announcement?.icon && (
                    <i
                      className={`${deleteDialog.announcement.icon} text-sm`}
                    ></i>
                  )}
                  <p className="text-sm font-medium text-gray-900">
                    "{truncateText(deleteDialog.announcement?.message || "", 80)}"
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteDialog.loading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteDialog.loading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteDialog.loading ? (
                <>
                  <span className="mr-2">Deleting...</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">
            Manage announcement banners and notifications
          </p>
        </div>
        <Link to="/dashboard/create-announcements">
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Announcement
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Announcements</CardTitle>
              <CardDescription>
                {apiData.pagination ? (
                  <span>
                    Showing {apiData.pagination.from} to{" "}
                    {apiData.pagination.to} of {apiData.pagination.total}{" "}
                    announcements
                  </span>
                ) : (
                  "View and manage all announcements"
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
                <TableHead>Message</TableHead>
                <TableHead>Colors</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Dismissible</TableHead>
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
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[300px]" />
                          <Skeleton className="h-3 w-[100px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[40px]" />
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
                  {apiData?.announcements?.length > 0 ? (
                    apiData.announcements.map((announcement) => (
                      <TableRow
                        key={announcement.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="max-w-md">
                            <div className="flex items-start gap-2">
                              {announcement.icon && (
                                <span className="text-lg mt-0.5">
                                  {announcement.icon.includes("fa-") ? (
                                    <i className={announcement.icon}></i>
                                  ) : (
                                    <Bell className="h-5 w-5 text-gray-400" />
                                  )}
                                </span>
                              )}
                              <div>
                                <p className="font-medium">
                                  {truncateText(announcement.message)}
                                </p>
                                {announcement.message.length > 60 && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Full message available in details
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <div
                              className="w-8 h-8 rounded border-2 border-gray-200 flex items-center justify-center"
                              style={{
                                backgroundColor: announcement.background_color,
                              }}
                              title="Background Color"
                            >
                              <span
                                className="text-xs font-bold"
                                style={{ color: announcement.text_color }}
                              >
                                Aa
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {announcement.link_text ? (
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {announcement.link_text}
                              </Badge>
                              <ExternalLink className="h-3 w-3 text-gray-400" />
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              announcement.priority >= 8
                                ? "border-red-500 text-red-600"
                                : announcement.priority >= 5
                                ? "border-yellow-500 text-yellow-600"
                                : "border-gray-500 text-gray-600"
                            }
                          >
                            {announcement.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {announcement.is_dismissible ? (
                            <Badge className="bg-blue-100 text-blue-800">
                              Yes
                            </Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <ToggleSwitch
                            enabled={announcement.is_active || false}
                            onChange={() =>
                              handleActiveToggle(
                                announcement.id,
                                announcement.is_active
                              )
                            }
                            disabled={loadingStates[announcement.id]}
                          />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(
                            announcement.created_at
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end cursor-pointer">
                            <Eye
                              size={15}
                              className="hover:text-green-600 transition-colors"
                              onClick={() =>
                                navigate(
                                  `/dashboard/view-announcements/${announcement.id}`
                                )
                              }
                            />
                            <Pencil
                              size={15}
                              className="hover:text-blue-600 transition-colors"
                              onClick={() =>
                                navigate(
                                  `/dashboard/edit-announcements/${announcement.id}`
                                )
                              }
                            />
                            <Trash2
                              size={15}
                              className="hover:text-red-600 transition-colors"
                              onClick={() => openDeleteDialog(announcement)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Bell className="h-12 w-12 text-gray-400" />
                          <p className="text-muted-foreground">
                            No announcements found
                          </p>
                          <Link to="/dashboard/announcements/create">
                            <Button
                              size="sm"
                              className="mt-2 bg-gradient-to-r from-green-500 to-emerald-600"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Create First Announcement
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