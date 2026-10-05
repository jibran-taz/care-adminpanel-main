// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Package,
//   DollarSign,
//   TrendingUp,
//   Users,
//   Search,
//   Filter,
//   Download,
//   Eye,
//   Edit,
//   Trash2,
//   Plus,
//   CheckCircle,
//   XCircle,
//   Star,
//   Calendar,
//   CreditCard,
//   BarChart,
//   Code,
//   Headphones,
//   Sparkles,
//   AlertCircle,
//   Settings,
//   ArrowUpDown,
//   MoreVertical,
//   Copy,
//   LucideIcon,
// } from "lucide-react";
// import { StatsCard } from "@/components/StatsCard";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Separator } from "@/components/ui/separator";
// import { Progress } from "@/components/ui/progress";
// import { Switch } from "@/components/ui/switch";
// import makeApiRequest from "@/services/axios";
// import { apiUrl } from "@/services/api-end-point";
// import { notify } from "@/utils/utils";

// // Type Definitions
// interface PlanLimits {
//   max_listings: number;
//   max_bookings_per_month: number;
//   max_featured_listings: number;
//   unlimited_listings: boolean;
//   unlimited_bookings: boolean;
// }

// interface PlanFeatures {
//   featured_listings_allowed: boolean;
//   priority_support: boolean;
//   analytics_access: boolean;
//   api_access: boolean;
// }

// interface FeatureListItem {
//   id: number;
//   name: string;
//   description: string;
//   is_included: boolean;
// }

// interface SubscriptionPlan {
//   id: number;
//   name: string;
//   slug: string;
//   description: string;
//   price: string;
//   yearly_price: string;
//   currency: string;
//   formatted_price: string;
//   yearly_savings: number;
//   savings_percentage: number;
//   limits: PlanLimits;
//   features: PlanFeatures;
//   feature_list: FeatureListItem[];
//   trial_days: number;
//   has_trial: boolean;
//   is_active: boolean;
//   is_popular: boolean;
//   is_free: boolean;
//   created_at: string;
//   updated_at: string;
// }

// interface PaginationLinks {
//   url: string | null;
//   label: string;
//   page: number | null;
//   active: boolean;
// }

// interface MetaData {
//   current_page: number;
//   from: number;
//   last_page: number;
//   per_page: number;
//   to: number;
//   total: number;
//   links: PaginationLinks[];
// }

// interface ApiResponse {
//   data: SubscriptionPlan[];
//   meta: MetaData;
//   links: {
//     first: string;
//     last: string;
//     prev: string | null;
//     next: string | null;
//   };
// }

// interface StatCard {
//   title: string;
//   value: string;
//   change: string;
//   icon: LucideIcon;
//   trend: "up" | "down";
// }

// const GetAllSubscription = () => {
//   const navigate = useNavigate();

//   // State Management
//   const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
//   const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
//     null
//   );
//   const [statsData, setStatsData] = useState<StatCard[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [isDetailOpen, setIsDetailOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(
//     null
//   );

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const [perPage, setPerPage] = useState(15);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalPlans, setTotalPlans] = useState(0);

//   // Fetch Plans from API
//   const fetchPlans = async (page: number = 1) => {
//     try {
//       setLoading(true);

//       const params: any = {
//         page,
//         per_page: perPage,
//       };

//       if (activeFilter !== "all") {
//         params.is_active = activeFilter === "active" ? "true" : "false";
//       }

//       const response = await makeApiRequest(apiUrl.subscriptions.plans, {
//         method: "GET",
//       });

//       console.log("Plans fetched:", response);

//       setPlans(response.data);
//       setCurrentPage(response.meta.current_page);
//       setTotalPages(response.meta.last_page);
//       setTotalPlans(response.meta.total);

//       // Calculate stats
//       calculateStats(response.data);
//     } catch (error) {
//       console.error("Error fetching plans:", error);
//       notify({
//         message: "Failed to fetch subscription plans",
//         type: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate Statistics
//   const calculateStats = (plansData: SubscriptionPlan[]) => {
//     const totalRevenue = plansData.reduce(
//       (sum, plan) => sum + parseFloat(plan.price),
//       0
//     );
//     const activePlans = plansData.filter((p) => p.is_active).length;
//     const popularPlans = plansData.filter((p) => p.is_popular).length;
//     const avgPrice = plansData.length > 0 ? totalRevenue / plansData.length : 0;

//     const transformedStats: StatCard[] = [
//       {
//         title: "Total Plans",
//         value: totalPlans.toString(),
//         change: "All subscription plans",
//         icon: Package,
//         trend: "up" as const,
//       },
//       {
//         title: "Active Plans",
//         value: activePlans.toString(),
//         change: "Currently available",
//         icon: CheckCircle,
//         trend: "up" as const,
//       },
//       {
//         title: "Popular Plans",
//         value: popularPlans.toString(),
//         change: "Marked as popular",
//         icon: Star,
//         trend: "up" as const,
//       },
//       {
//         title: "Average Price",
//         value: `$${avgPrice.toFixed(2)}`,
//         change: "Monthly average",
//         icon: DollarSign,
//         trend: "up" as const,
//       },
//       {
//         title: "Total Revenue Potential",
//         value: `$${totalRevenue.toFixed(2)}`,
//         change: "All plans combined",
//         icon: TrendingUp,
//         trend: "up" as const,
//       },
//       {
//         title: "Inactive Plans",
//         value: (plansData.length - activePlans).toString(),
//         change: "Currently disabled",
//         icon: XCircle,
//         trend: "down" as const,
//       },
//     ];

//     setStatsData(transformedStats);
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchPlans(1);
//   }, [activeFilter, perPage]);

//   // Handlers
//   const handleViewDetails = (plan: SubscriptionPlan) => {
//     setSelectedPlan(plan);
//     setIsDetailOpen(true);
//   };

//   const handleEdit = (plan: SubscriptionPlan) => {
//     navigate(`/dashboard/subscription/edit-subscription/${plan.id}`);
//   };

//   const handleDelete = (plan: SubscriptionPlan) => {
//     setPlanToDelete(plan);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!planToDelete) return;

//     try {
//       await makeApiRequest(`${apiUrl.subscriptions.plans}/${planToDelete.id}`, {
//         method: "DELETE",
//       });

//       notify({
//         message: "Plan deleted successfully",
//         type: "success",
//       });

//       setDeleteDialogOpen(false);
//       setPlanToDelete(null);
//       fetchPlans(currentPage);
//     } catch (error) {
//       console.error("Error deleting plan:", error);
//       notify({
//         message: "Failed to delete plan",
//         type: "error",
//       });
//     }
//   };

//   const handleToggleActive = async (plan: SubscriptionPlan) => {
//     try {
//       await makeApiRequest(`${apiUrl.subscriptions.plans}/${plan.id}`, {
//         method: "PATCH",
//         data: {
//           is_active: !plan.is_active,
//         },
//       });

//       notify({
//         message: `Plan ${
//           !plan.is_active ? "activated" : "deactivated"
//         } successfully`,
//         type: "success",
//       });

//       fetchPlans(currentPage);
//     } catch (error) {
//       console.error("Error toggling plan status:", error);
//       notify({
//         message: "Failed to update plan status",
//         type: "error",
//       });
//     }
//   };

//   const handleDuplicate = async (plan: SubscriptionPlan) => {
//     try {
//       await makeApiRequest(apiUrl.subscriptions.plans, {
//         method: "POST",
//         data: {
//           ...plan,
//           name: `${plan.name} (Copy)`,
//           slug: `${plan.slug}-copy-${Date.now()}`,
//         },
//       });

//       notify({
//         message: "Plan duplicated successfully",
//         type: "success",
//       });

//       fetchPlans(currentPage);
//     } catch (error) {
//       console.error("Error duplicating plan:", error);
//       notify({
//         message: "Failed to duplicate plan",
//         type: "error",
//       });
//     }
//   };

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       fetchPlans(page);
//     }
//   };

//   // Filter plans by search
//   const filteredPlans = plans.filter((plan) => {
//     const matchesSearch =
//       plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       plan.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       plan.description.toLowerCase().includes(searchQuery.toLowerCase());

//     return matchesSearch;
//   });

//   // Format currency
//   const formatCurrency = (
//     amount: string | number,
//     currency: string = "USD"
//   ) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: currency,
//     }).format(parseFloat(amount.toString()));
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   // Get feature icon
//   const getFeatureIcon = (key: string) => {
//     const icons: Record<string, LucideIcon> = {
//       featured_listings_allowed: Star,
//       priority_support: Headphones,
//       analytics_access: BarChart,
//       api_access: Code,
//     };
//     return icons[key] || Settings;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       <div className="space-y-6 p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
//               <Package className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
//                 Subscription Plans
//               </h1>
//               <p className="text-muted-foreground">
//                 Manage all subscription plans and pricing
//               </p>
//             </div>
//           </div>
//           <Button
//             onClick={() => navigate("/dashboard/subscription/add-plan-subscription")}
//             className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Create Plan
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {loading ? (
//             Array.from({ length: 6 }).map((_, index) => (
//               <div
//                 key={index}
//                 className="h-32 bg-gray-200 animate-pulse rounded-lg"
//               />
//             ))
//           ) : statsData.length > 0 ? (
//             statsData.map((stat, index) => <StatsCard key={index} {...stat} />)
//           ) : (
//             <div className="col-span-3 text-center text-gray-500">
//               No data available
//             </div>
//           )}
//         </div> */}

//         {/* Plans Table */}
//         <Card className="border-2">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle className="text-xl flex items-center gap-2">
//                   <Sparkles className="h-5 w-5 text-green-600" />
//                   All Plans
//                 </CardTitle>
//                 <CardDescription>
//                   View and manage subscription plans
//                 </CardDescription>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button variant="outline" size="sm">
//                   <Download className="w-4 h-4 mr-2" />
//                   Export
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   <Filter className="w-4 h-4 mr-2" />
//                   Filter
//                 </Button>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {/* Filters */}
//             <div className="flex flex-col md:flex-row gap-4 mb-6">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <Input
//                   type="text"
//                   placeholder="Search by name, slug, or description..."
//                   className="pl-10 focus:ring-2 focus:ring-green-500"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//               <Select value={activeFilter} onValueChange={setActiveFilter}>
//                 <SelectTrigger className="w-full md:w-[180px]">
//                   <SelectValue placeholder="Filter by status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Plans</SelectItem>
//                   <SelectItem value="active">Active Only</SelectItem>
//                   <SelectItem value="inactive">Inactive Only</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Select
//                 value={perPage.toString()}
//                 onValueChange={(value) => setPerPage(parseInt(value))}
//               >
//                 <SelectTrigger className="w-full md:w-[120px]">
//                   <SelectValue placeholder="Per page" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="10">10 / page</SelectItem>
//                   <SelectItem value="15">15 / page</SelectItem>
//                   <SelectItem value="25">25 / page</SelectItem>
//                   <SelectItem value="50">50 / page</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Table */}
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Plan Details</TableHead>
//                     <TableHead>Pricing</TableHead>
//                     <TableHead>Limits</TableHead>
//                     <TableHead>Features</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Trial</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {loading ? (
//                     <TableRow>
//                       <TableCell colSpan={7} className="text-center py-8">
//                         <div className="flex items-center justify-center gap-2">
//                           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
//                           <span>Loading plans...</span>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ) : filteredPlans.length > 0 ? (
//                     filteredPlans.map((plan) => (
//                       <TableRow
//                         key={plan.id}
//                         className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
//                       >
//                         <TableCell>
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-2">
//                               <p className="font-semibold text-base">
//                                 {plan.name}
//                               </p>
//                               {plan.is_popular && (
//                                 <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
//                                   <Star className="w-3 h-3 mr-1" />
//                                   Popular
//                                 </Badge>
//                               )}
//                               {plan.is_free && (
//                                 <Badge
//                                   variant="outline"
//                                   className="border-green-500 text-green-600"
//                                 >
//                                   Free
//                                 </Badge>
//                               )}
//                             </div>
//                             <p className="text-xs text-muted-foreground font-mono">
//                               {plan.slug}
//                             </p>
//                             <p className="text-sm text-gray-600 line-clamp-1">
//                               {plan.description}
//                             </p>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="space-y-1">
//                             <p className="font-bold text-lg text-green-600">
//                               {formatCurrency(plan.price, plan.currency)}
//                               <span className="text-xs text-gray-500 font-normal">
//                                 /month
//                               </span>
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               {formatCurrency(plan.yearly_price, plan.currency)}
//                               <span className="text-xs text-gray-500">
//                                 /year
//                               </span>
//                             </p>
//                             {plan.savings_percentage > 0 && (
//                               <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
//                                 Save {plan.savings_percentage}%
//                               </Badge>
//                             )}
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="space-y-1 text-sm">
//                             <div className="flex items-center gap-2">
//                               <Users className="w-3.5 h-3.5 text-gray-400" />
//                               <span>
//                                 {plan.limits.unlimited_listings
//                                   ? "∞"
//                                   : plan.limits.max_listings}{" "}
//                                 Listings
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <Calendar className="w-3.5 h-3.5 text-gray-400" />
//                               <span>
//                                 {plan.limits.unlimited_bookings
//                                   ? "∞"
//                                   : plan.limits.max_bookings_per_month}{" "}
//                                 Bookings
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <Star className="w-3.5 h-3.5 text-yellow-500" />
//                               <span>
//                                 {plan.limits.max_featured_listings} Featured
//                               </span>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex flex-wrap gap-1">
//                             {Object.entries(plan.features).map(
//                               ([key, value]) =>
//                                 value && (
//                                   <div
//                                     key={key}
//                                     className="inline-flex items-center"
//                                   >
//                                     {(() => {
//                                       const Icon = getFeatureIcon(key);
//                                       return (
//                                         <div className="p-1 bg-green-100 dark:bg-green-900 rounded">
//                                           <Icon className="w-3 h-3 text-green-600 dark:text-green-400" />
//                                         </div>
//                                       );
//                                     })()}
//                                   </div>
//                                 )
//                             )}
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex items-center gap-2">
//                             {/* <Switch
//                               checked={plan.is_active}
//                               onCheckedChange={() => handleToggleActive(plan)}
//                               className="data-[state=checked]:bg-green-500"
//                             /> */}
//                             <Badge
//                               className={
//                                 plan.is_active
//                                   ? "bg-green-100 text-green-800 hover:bg-green-100"
//                                   : "bg-gray-100 text-gray-800 hover:bg-gray-100"
//                               }
//                             >
//                               {plan.is_active ? (
//                                 <>
//                                   <CheckCircle className="w-3 h-3 mr-1" />
//                                   Active
//                                 </>
//                               ) : (
//                                 <>
//                                   <XCircle className="w-3 h-3 mr-1" />
//                                   Inactive
//                                 </>
//                               )}
//                             </Badge>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           {plan.has_trial ? (
//                             <div className="flex items-center gap-1 text-sm">
//                               <Calendar className="w-3.5 h-3.5 text-blue-500" />
//                               <span className="font-medium">
//                                 {plan.trial_days} days
//                               </span>
//                             </div>
//                           ) : (
//                             <span className="text-sm text-gray-500">
//                               No trial
//                             </span>
//                           )}
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" size="sm">
//                                 <MoreVertical className="w-4 h-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end" className="w-48">
//                               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem
//                                 onClick={() => handleViewDetails(plan)}
//                               >
//                                 <Eye className="w-4 h-4 mr-2" />
//                                 View Details
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 onClick={() => handleEdit(plan)}
//                               >
//                                 <Edit className="w-4 h-4 mr-2" />
//                                 Edit Plan
//                               </DropdownMenuItem>
//                               {/* <DropdownMenuItem
//                                 onClick={() => handleDuplicate(plan)}
//                               >
//                                 <Copy className="w-4 h-4 mr-2" />
//                                 Duplicate
//                               </DropdownMenuItem> */}
//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem
//                                 onClick={() => handleDelete(plan)}
//                                 className="text-red-600 focus:text-red-600"
//                               >
//                                 <Trash2 className="w-4 h-4 mr-2" />
//                                 Delete
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={7} className="text-center py-8">
//                         <div className="flex flex-col items-center gap-2 text-gray-500">
//                           <Package className="w-12 h-12 text-gray-300" />
//                           <p className="text-lg font-medium">No plans found</p>
//                           <p className="text-sm">
//                             Try adjusting your search or filters
//                           </p>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>

//             {/* Pagination */}
//             {filteredPlans.length > 0 && (
//               <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <div className="text-sm text-gray-600">
//                   Showing {(currentPage - 1) * perPage + 1} to{" "}
//                   {Math.min(currentPage * perPage, totalPlans)} of {totalPlans}{" "}
//                   plans
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1 || loading}
//                   >
//                     Previous
//                   </Button>
//                   <div className="flex items-center gap-1">
//                     {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                       const pageNumber = i + 1;
//                       return (
//                         <Button
//                           key={pageNumber}
//                           variant={
//                             currentPage === pageNumber ? "default" : "outline"
//                           }
//                           size="sm"
//                           onClick={() => handlePageChange(pageNumber)}
//                           className={
//                             currentPage === pageNumber
//                               ? "bg-green-600 hover:bg-green-700"
//                               : ""
//                           }
//                         >
//                           {pageNumber}
//                         </Button>
//                       );
//                     })}
//                     {totalPages > 5 && (
//                       <>
//                         <span className="px-2">...</span>
//                         <Button
//                           variant={
//                             currentPage === totalPages ? "default" : "outline"
//                           }
//                           size="sm"
//                           onClick={() => handlePageChange(totalPages)}
//                           className={
//                             currentPage === totalPages
//                               ? "bg-green-600 hover:bg-green-700"
//                               : ""
//                           }
//                         >
//                           {totalPages}
//                         </Button>
//                       </>
//                     )}
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages || loading}
//                   >
//                     Next
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Detail Modal */}
//         <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
//           <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle className="text-2xl flex items-center gap-2">
//                 <Package className="h-6 w-6 text-green-600" />
//                 Plan Details
//               </DialogTitle>
//               <DialogDescription>
//                 Complete information about this subscription plan
//               </DialogDescription>
//             </DialogHeader>

//             {selectedPlan && (
//               <div className="space-y-6">
//                 {/* Plan Header */}
//                 <div className="flex items-start justify-between p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border-2 border-green-200 dark:border-green-800">
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <h3 className="text-2xl font-bold">
//                         {selectedPlan.name}
//                       </h3>
//                       {selectedPlan.is_popular && (
//                         <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
//                           <Star className="w-3 h-3 mr-1" />
//                           Popular
//                         </Badge>
//                       )}
//                     </div>
//                     <p className="text-sm text-muted-foreground font-mono">
//                       {selectedPlan.slug}
//                     </p>
//                     <p className="text-gray-700 dark:text-gray-300">
//                       {selectedPlan.description}
//                     </p>
//                   </div>
//                   <Badge
//                     className={
//                       selectedPlan.is_active
//                         ? "bg-green-100 text-green-800 hover:bg-green-100"
//                         : "bg-gray-100 text-gray-800 hover:bg-gray-100"
//                     }
//                   >
//                     {selectedPlan.is_active ? (
//                       <>
//                         <CheckCircle className="w-3 h-3 mr-1" />
//                         Active
//                       </>
//                     ) : (
//                       <>
//                         <XCircle className="w-3 h-3 mr-1" />
//                         Inactive
//                       </>
//                     )}
//                   </Badge>
//                 </div>

//                 {/* Pricing */}
//                 <div>
//                   <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
//                     <DollarSign className="w-5 h-5 text-green-600" />
//                     Pricing
//                   </h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="p-4 border-2 rounded-lg bg-white dark:bg-slate-900">
//                       <p className="text-sm text-gray-500 mb-1">
//                         Monthly Price
//                       </p>
//                       <p className="text-3xl font-bold text-green-600">
//                         {formatCurrency(
//                           selectedPlan.price,
//                           selectedPlan.currency
//                         )}
//                       </p>
//                     </div>
//                     <div className="p-4 border-2 rounded-lg bg-white dark:bg-slate-900">
//                       <p className="text-sm text-gray-500 mb-1">Yearly Price</p>
//                       <p className="text-3xl font-bold text-green-600">
//                         {formatCurrency(
//                           selectedPlan.yearly_price,
//                           selectedPlan.currency
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                   {selectedPlan.savings_percentage > 0 && (
//                     <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-lg">
//                       <div className="flex items-center justify-between">
//                         <span className="font-medium">Yearly Savings</span>
//                         <Badge className="bg-green-500 text-white">
//                           <TrendingUp className="w-3 h-3 mr-1" />
//                           {selectedPlan.savings_percentage}% OFF
//                         </Badge>
//                       </div>
//                       <p className="text-2xl font-bold text-green-600 mt-2">
//                         {formatCurrency(
//                           selectedPlan.yearly_savings,
//                           selectedPlan.currency
//                         )}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 <Separator />

//                 {/* Limits */}
//                 <div>
//                   <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
//                     <Settings className="w-5 h-5 text-green-600" />
//                     Usage Limits
//                   </h3>
//                   <div className="grid grid-cols-3 gap-4">
//                     <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
//                       <Users className="w-5 h-5 text-blue-600 mb-2" />
//                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                         Max Listings
//                       </p>
//                       <p className="text-2xl font-bold">
//                         {selectedPlan.limits.unlimited_listings
//                           ? "∞"
//                           : selectedPlan.limits.max_listings}
//                       </p>
//                     </div>
//                     <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
//                       <Calendar className="w-5 h-5 text-purple-600 mb-2" />
//                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                         Bookings/Month
//                       </p>
//                       <p className="text-2xl font-bold">
//                         {selectedPlan.limits.unlimited_bookings
//                           ? "∞"
//                           : selectedPlan.limits.max_bookings_per_month}
//                       </p>
//                     </div>
//                     <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
//                       <Star className="w-5 h-5 text-yellow-600 mb-2" />
//                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                         Featured Listings
//                       </p>
//                       <p className="text-2xl font-bold">
//                         {selectedPlan.limits.max_featured_listings}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <Separator />

//                 {/* Features */}
//                 <div>
//                   <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
//                     <Sparkles className="w-5 h-5 text-green-600" />
//                     Features
//                   </h3>
//                   <div className="grid grid-cols-2 gap-3">
//                     {Object.entries(selectedPlan.features).map(
//                       ([key, value]) => {
//                         const Icon = getFeatureIcon(key);
//                         const label = key
//                           .replace(/_/g, " ")
//                           .replace(/\b\w/g, (l) => l.toUpperCase());
//                         return (
//                           <div
//                             key={key}
//                             className={`p-4 rounded-lg border-2 ${
//                               value
//                                 ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
//                                 : "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-gray-800"
//                             }`}
//                           >
//                             <div className="flex items-center gap-2">
//                               <Icon
//                                 className={`w-5 h-5 ${
//                                   value ? "text-green-600" : "text-gray-400"
//                                 }`}
//                               />
//                               <span className="font-medium">{label}</span>
//                             </div>
//                             <Badge
//                               className={`mt-2 ${
//                                 value
//                                   ? "bg-green-100 text-green-800 hover:bg-green-100"
//                                   : "bg-gray-100 text-gray-600 hover:bg-gray-100"
//                               }`}
//                             >
//                               {value ? "Enabled" : "Disabled"}
//                             </Badge>
//                           </div>
//                         );
//                       }
//                     )}
//                   </div>
//                 </div>

//                 {/* Feature List */}
//                 {selectedPlan.feature_list.length > 0 && (
//                   <>
//                     <Separator />
//                     <div>
//                       <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
//                         <CheckCircle className="w-5 h-5 text-green-600" />
//                         Additional Features
//                       </h3>
//                       <div className="space-y-2">
//                         {selectedPlan.feature_list.map((feature) => (
//                           <div
//                             key={feature.id}
//                             className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg"
//                           >
//                             {feature.is_included ? (
//                               <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                             ) : (
//                               <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
//                             )}
//                             <div>
//                               <p className="font-medium">{feature.name}</p>
//                               <p className="text-sm text-gray-600">
//                                 {feature.description}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* Trial Info */}
//                 {selectedPlan.has_trial && (
//                   <>
//                     <Separator />
//                     <div className="p-4 bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Calendar className="w-5 h-5 text-blue-600" />
//                         <h3 className="font-semibold text-lg">Trial Period</h3>
//                       </div>
//                       <p className="text-3xl font-bold text-blue-600">
//                         {selectedPlan.trial_days} Days
//                       </p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
//                         Users can try this plan free for{" "}
//                         {selectedPlan.trial_days} days
//                       </p>
//                     </div>
//                   </>
//                 )}

//                 <Separator />

//                 {/* Metadata */}
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
//                     <p className="text-gray-500 mb-1">Created At</p>
//                     <p className="font-medium">
//                       {formatDate(selectedPlan.created_at)}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
//                     <p className="text-gray-500 mb-1">Last Updated</p>
//                     <p className="font-medium">
//                       {formatDate(selectedPlan.updated_at)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <DialogFooter className="gap-2">
//               <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
//                 Close
//               </Button>
//               {selectedPlan && (
//                 <>
//                   <Button
//                     variant="outline"
//                     onClick={() => handleEdit(selectedPlan)}
//                   >
//                     <Edit className="w-4 h-4 mr-2" />
//                     Edit Plan
//                   </Button>
//                   <Button
//                     className="bg-gradient-to-r from-green-500 to-emerald-600"
//                     onClick={() => {
//                       setIsDetailOpen(false);
//                       handleDuplicate(selectedPlan);
//                     }}
//                   >
//                     <Copy className="w-4 h-4 mr-2" />
//                     Duplicate
//                   </Button>
//                 </>
//               )}
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Delete Confirmation */}
//         <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle className="flex items-center gap-2 text-red-600">
//                 <AlertCircle className="w-5 h-5" />
//                 Delete Plan?
//               </AlertDialogTitle>
//               <AlertDialogDescription>
//                 Are you sure you want to delete{" "}
//                 <span className="font-semibold">{planToDelete?.name}</span>?
//                 This action cannot be undone and will affect all users currently
//                 subscribed to this plan.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={confirmDelete}
//                 className="bg-red-600 hover:bg-red-700"
//               >
//                 Delete Plan
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//     </div>
//   );
// };

// export default GetAllSubscription;








import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Star,
  Calendar,
  CreditCard,
  BarChart,
  Code,
  Headphones,
  Sparkles,
  AlertCircle,
  Settings,
  ArrowUpDown,
  MoreVertical,
  Copy,
  LucideIcon,
  Loader2,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import makeApiRequest from "@/services/axios";
import { apiUrl } from "@/services/api-end-point";
import { notify } from "@/utils/utils";
import { Modal } from "@/components/ui/modal";

// Type Definitions
interface PlanLimits {
  max_listings: number;
  max_bookings_per_month: number;
  max_featured_listings: number;
  unlimited_listings: boolean;
  unlimited_bookings: boolean;
}

interface PlanFeatures {
  featured_listings_allowed: boolean;
  priority_support: boolean;
  analytics_access: boolean;
  api_access: boolean;
}

interface FeatureListItem {
  id: number;
  name: string;
  description: string;
  is_included: boolean;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  yearly_price: string;
  currency: string;
  formatted_price: string;
  yearly_savings: number;
  savings_percentage: number;
  limits: PlanLimits;
  features: PlanFeatures;
  feature_list: FeatureListItem[];
  trial_days: number;
  has_trial: boolean;
  is_active: boolean;
  is_popular: boolean;
  is_free: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginationLinks {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

interface MetaData {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  links: PaginationLinks[];
}

interface ApiResponse {
  data: SubscriptionPlan[];
  meta: MetaData;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down";
}

const GetAllSubscription = () => {
  const navigate = useNavigate();

  // State Management
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [statsData, setStatsData] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(
    null
  );

  // Feature Modal State
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [selectedPlanForFeature, setSelectedPlanForFeature] =
    useState<SubscriptionPlan | null>(null);
  const [isSubmittingFeature, setIsSubmittingFeature] = useState(false);
  const [featureFormData, setFeatureFormData] = useState({
    name: "",
    description: "",
    is_included: true,
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPlans, setTotalPlans] = useState(0);

  // Fetch Plans from API
  const fetchPlans = async (page: number = 1) => {
    try {
      setLoading(true);

      const params: any = {
        page,
        per_page: perPage,
      };

      if (activeFilter !== "all") {
        params.is_active = activeFilter === "active" ? "true" : "false";
      }

      const response = await makeApiRequest(apiUrl.subscriptions.plans, {
        method: "GET",
      });

      console.log("Plans fetched:", response);

      setPlans(response.data);
      setCurrentPage(response.meta.current_page);
      setTotalPages(response.meta.last_page);
      setTotalPlans(response.meta.total);

      // Calculate stats
      calculateStats(response.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
      notify({
        message: "Failed to fetch subscription plans",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate Statistics
  const calculateStats = (plansData: SubscriptionPlan[]) => {
    const totalRevenue = plansData.reduce(
      (sum, plan) => sum + parseFloat(plan.price),
      0
    );
    const activePlans = plansData.filter((p) => p.is_active).length;
    const popularPlans = plansData.filter((p) => p.is_popular).length;
    const avgPrice = plansData.length > 0 ? totalRevenue / plansData.length : 0;

    const transformedStats: StatCard[] = [
      {
        title: "Total Plans",
        value: totalPlans.toString(),
        change: "All subscription plans",
        icon: Package,
        trend: "up" as const,
      },
      {
        title: "Active Plans",
        value: activePlans.toString(),
        change: "Currently available",
        icon: CheckCircle,
        trend: "up" as const,
      },
      {
        title: "Popular Plans",
        value: popularPlans.toString(),
        change: "Marked as popular",
        icon: Star,
        trend: "up" as const,
      },
      {
        title: "Average Price",
        value: `$${avgPrice.toFixed(2)}`,
        change: "Monthly average",
        icon: DollarSign,
        trend: "up" as const,
      },
      {
        title: "Total Revenue Potential",
        value: `$${totalRevenue.toFixed(2)}`,
        change: "All plans combined",
        icon: TrendingUp,
        trend: "up" as const,
      },
      {
        title: "Inactive Plans",
        value: (plansData.length - activePlans).toString(),
        change: "Currently disabled",
        icon: XCircle,
        trend: "down" as const,
      },
    ];

    setStatsData(transformedStats);
  };

  // Initial fetch
  useEffect(() => {
    fetchPlans(1);
  }, [activeFilter, perPage]);

  // Handlers
  const handleEdit = (plan: SubscriptionPlan) => {
    navigate(`/dashboard/subscription/edit-subscription/${plan.id}`);
  };

  const handleDelete = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;

    try {
      await makeApiRequest(`${apiUrl.subscriptions.plans}/${planToDelete.id}`, {
        method: "DELETE",
      });

      notify({
        message: "Plan deleted successfully",
        type: "success",
      });

      setDeleteDialogOpen(false);
      setPlanToDelete(null);
      fetchPlans(currentPage);
    } catch (error) {
      console.error("Error deleting plan:", error);
      notify({
        message: "Failed to delete plan",
        type: "error",
      });
    }
  };

  const handleToggleActive = async (plan: SubscriptionPlan) => {
    try {
      await makeApiRequest(`${apiUrl.subscriptions.plans}/${plan.id}`, {
        method: "PATCH",
        data: {
          is_active: !plan.is_active,
        },
      });

      notify({
        message: `Plan ${
          !plan.is_active ? "activated" : "deactivated"
        } successfully`,
        type: "success",
      });

      fetchPlans(currentPage);
    } catch (error) {
      console.error("Error toggling plan status:", error);
      notify({
        message: "Failed to update plan status",
        type: "error",
      });
    }
  };

  // Feature Modal Handlers
  const handleOpenFeatureModal = (plan: SubscriptionPlan) => {
    setSelectedPlanForFeature(plan);
    setFeatureFormData({
      name: "",
      description: "",
      is_included: true,
    });
    setIsFeatureModalOpen(true);
  };

  const handleCloseFeatureModal = () => {
    setIsFeatureModalOpen(false);
    setSelectedPlanForFeature(null);
    setFeatureFormData({
      name: "",
      description: "",
      is_included: true,
    });
  };

  const handleFeatureInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFeatureFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureSubmit = async () => {
    if (!selectedPlanForFeature) return;

    // Validation
    if (!featureFormData.name.trim()) {
      notify({
        message: "Feature name is required",
        type: "error",
      });
      return;
    }

    if (!featureFormData.description.trim()) {
      notify({
        message: "Feature description is required",
        type: "error",
      });
      return;
    }

    try {
      setIsSubmittingFeature(true);

      const response = await makeApiRequest(
        `${apiUrl.subscriptions.plans}/${selectedPlanForFeature.id}/features`,
        {
          method: "POST",
          data: featureFormData,
        }
      );

      console.log("Feature added successfully:", response);

      notify({
        message: "Feature added successfully! 🎉",
        type: "success",
      });

      handleCloseFeatureModal();
      fetchPlans(currentPage); // Refresh plans to show new feature
    } catch (error: any) {
      console.error("Error adding feature:", error);
      notify({
        message:
          error?.response?.data?.message || "Failed to add feature",
        type: "error",
      });
    } finally {
      setIsSubmittingFeature(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchPlans(page);
    }
  };

  // Filter plans by search
  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Format currency
  const formatCurrency = (
    amount: string | number,
    currency: string = "USD"
  ) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(parseFloat(amount.toString()));
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get feature icon
  const getFeatureIcon = (key: string) => {
    const icons: Record<string, LucideIcon> = {
      featured_listings_allowed: Star,
      priority_support: Headphones,
      analytics_access: BarChart,
      api_access: Code,
    };
    return icons[key] || Settings;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                Subscription Plans
              </h1>
              <p className="text-muted-foreground">
                Manage all subscription plans and pricing
              </p>
            </div>
          </div>
          <Button
            onClick={() =>
              navigate("/dashboard/subscription/add-plan-subscription")
            }
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>

        {/* Plans Table */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  All Plans
                </CardTitle>
                <CardDescription>
                  View and manage subscription plans
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, slug, or description..."
                  className="pl-10 focus:ring-2 focus:ring-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={perPage.toString()}
                onValueChange={(value) => setPerPage(parseInt(value))}
              >
                <SelectTrigger className="w-full md:w-[120px]">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="15">15 / page</SelectItem>
                  <SelectItem value="25">25 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Details</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Limits</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Trial</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                          <span>Loading plans...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredPlans.length > 0 ? (
                    filteredPlans.map((plan) => (
                      <TableRow
                        key={plan.id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-base">
                                {plan.name}
                              </p>
                              {plan.is_popular && (
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                                  <Star className="w-3 h-3 mr-1" />
                                  Popular
                                </Badge>
                              )}
                              {plan.is_free && (
                                <Badge
                                  variant="outline"
                                  className="border-green-500 text-green-600"
                                >
                                  Free
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground font-mono">
                              {plan.slug}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {plan.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-bold text-lg text-green-600">
                              {formatCurrency(plan.price, plan.currency)}
                              <span className="text-xs text-gray-500 font-normal">
                                /month
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatCurrency(plan.yearly_price, plan.currency)}
                              <span className="text-xs text-gray-500">
                                /year
                              </span>
                            </p>
                            {plan.savings_percentage > 0 && (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                                Save {plan.savings_percentage}%
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              <span>
                                {plan.limits.unlimited_listings
                                  ? "∞"
                                  : plan.limits.max_listings}{" "}
                                Listings
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              <span>
                                {plan.limits.unlimited_bookings
                                  ? "∞"
                                  : plan.limits.max_bookings_per_month}{" "}
                                Bookings
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-3.5 h-3.5 text-yellow-500" />
                              <span>
                                {plan.limits.max_featured_listings} Featured
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(plan.features).map(
                              ([key, value]) =>
                                value && (
                                  <div
                                    key={key}
                                    className="inline-flex items-center"
                                  >
                                    {(() => {
                                      const Icon = getFeatureIcon(key);
                                      return (
                                        <div className="p-1 bg-green-100 dark:bg-green-900 rounded">
                                          <Icon className="w-3 h-3 text-green-600 dark:text-green-400" />
                                        </div>
                                      );
                                    })()}
                                  </div>
                                )
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                plan.is_active
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                              }
                            >
                              {plan.is_active ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {plan.has_trial ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="w-3.5 h-3.5 text-blue-500" />
                              <span className="font-medium">
                                {plan.trial_days} days
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">
                              No trial
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleOpenFeatureModal(plan)}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Feature
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => navigate(`/dashboard/subscription/view-plan/${plan.id}`)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                               View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleEdit(plan)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Plan
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(plan)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <Package className="w-12 h-12 text-gray-300" />
                          <p className="text-lg font-medium">No plans found</p>
                          <p className="text-sm">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredPlans.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * perPage + 1} to{" "}
                  {Math.min(currentPage * perPage, totalPlans)} of {totalPlans}{" "}
                  plans
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <Button
                          key={pageNumber}
                          variant={
                            currentPage === pageNumber ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className={
                            currentPage === pageNumber
                              ? "bg-green-600 hover:bg-green-700"
                              : ""
                          }
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="px-2">...</span>
                        <Button
                          variant={
                            currentPage === totalPages ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className={
                            currentPage === totalPages
                              ? "bg-green-600 hover:bg-green-700"
                              : ""
                          }
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Feature Modal */}
        <Modal
          isOpen={isFeatureModalOpen}
          onClose={handleCloseFeatureModal}
          title={`Add Feature to ${selectedPlanForFeature?.name || "Plan"}`}
          showFooter={false}
          width="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Feature Name */}
            <div className="space-y-2">
              <Label htmlFor="feature-name" className="text-sm font-semibold">
                Feature Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="feature-name"
                  name="name"
                  placeholder="e.g., Custom Domain"
                  className="pl-10 focus:ring-2 focus:ring-green-500"
                  value={featureFormData.name}
                  onChange={handleFeatureInputChange}
                />
              </div>
            </div>

            {/* Feature Description */}
            <div className="space-y-2">
              <Label
                htmlFor="feature-description"
                className="text-sm font-semibold"
              >
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="feature-description"
                name="description"
                placeholder="Describe this feature in detail..."
                rows={4}
                className="focus:ring-2 focus:ring-green-500 resize-none"
                value={featureFormData.description}
                onChange={handleFeatureInputChange}
              />
            </div>

            {/* Is Included Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-semibold">
                  Include in Plan
                </Label>
                <p className="text-sm text-muted-foreground">
                  Is this feature included in the plan?
                </p>
              </div>
              <Switch
                checked={featureFormData.is_included}
                onCheckedChange={(checked) =>
                  setFeatureFormData((prev) => ({
                    ...prev,
                    is_included: checked,
                  }))
                }
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCloseFeatureModal}
                variant="outline"
                className="flex-1"
                disabled={isSubmittingFeature}
              >
                Cancel
              </Button>
              <Button
                onClick={handleFeatureSubmit}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                disabled={isSubmittingFeature}
              >
                {isSubmittingFeature ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Feature
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Delete Plan?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold">{planToDelete?.name}</span>?
                This action cannot be undone and will affect all users currently
                subscribed to this plan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Plan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default GetAllSubscription;