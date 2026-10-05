// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   Package,
//   DollarSign,
//   TrendingUp,
//   Users,
//   Calendar,
//   Star,
//   CheckCircle,
//   XCircle,
//   Sparkles,
//   Edit,
//   Trash2,
//   Copy,
//   Settings,
//   BarChart,
//   Code,
//   Headphones,
//   Loader2,
//   AlertCircle,
//   Shield,
//   Clock,
//   CreditCard,
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
// import { Separator } from "@/components/ui/separator";
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

// interface SubscriptionPlanDetail {
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

// const ViewPlanDetail = () => {
//   const navigate = useNavigate();
//   const { planId } = useParams<{ planId: string }>();


  
//   const [plan, setPlan] = useState<SubscriptionPlanDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [isDuplicating, setIsDuplicating] = useState(false);

//   // Fetch Plan Details


//   const fetchPlanDetails = async () => {
//       setLoading(true);
//     try {
//           setLoading(false);
//       const response = await makeApiRequest(
//         `admin/subscriptions/plan/${planId}`,
//         {
//           method: "GET",
//         }
//       );

//       console.log("Plan details fetched:", response);
//       setPlan(response.data);
//     } catch (error) {
//       console.error("Error fetching plan details:", error);
//       notify({
//         message: "Failed to fetch plan details",
//         type: "error",
//       });
//     //   navigate("/dashboard/subscription/get-all-subscription");
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
  
//       fetchPlanDetails();
  
//   }, []);
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
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // Get feature icon
//   const getFeatureIcon = (key: string) => {
//     const icons: { [key: string]: any } = {
//       featured_listings_allowed: Star,
//       priority_support: Headphones,
//       analytics_access: BarChart,
//       api_access: Code,
//     };
//     return icons[key] || Settings;
//   };

//   // Get feature label
//   const getFeatureLabel = (key: string) => {
//     const labels: { [key: string]: string } = {
//       featured_listings_allowed: "Featured Listings",
//       priority_support: "Priority Support",
//       analytics_access: "Analytics Access",
//       api_access: "API Access",
//     };
//     return labels[key] || key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
//   };

//   // Handle Edit
//   const handleEdit = () => {
//     navigate(`/dashboard/subscription/edit-subscription/${planId}`);
//   };

//   // Handle Delete
//   const handleDelete = async () => {
//     try {
//       await makeApiRequest(`${apiUrl.subscriptions.plans}/${planId}`, {
//         method: "DELETE",
//       });

//       notify({
//         message: "Plan deleted successfully",
//         type: "success",
//       });

//       navigate("/dashboard/subscription/get-all-subscription");
//     } catch (error) {
//       console.error("Error deleting plan:", error);
//       notify({
//         message: "Failed to delete plan",
//         type: "error",
//       });
//     }
//   };

//   // Handle Duplicate
//   const handleDuplicate = async () => {
//     if (!plan) return;
    
//     try {
//       setIsDuplicating(true);
      
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

//       navigate("/dashboard/subscription/get-all-subscription");
//     } catch (error) {
//       console.error("Error duplicating plan:", error);
//       notify({
//         message: "Failed to duplicate plan",
//         type: "error",
//       });
//     } finally {
//       setIsDuplicating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//         <div className="flex items-center justify-center h-screen">
//           <div className="flex flex-col items-center gap-4">
//             <Loader2 className="h-12 w-12 animate-spin text-green-600" />
//             <p className="text-lg font-medium text-gray-600">Loading plan details...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!plan) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//         <div className="flex items-center justify-center h-screen">
//           <div className="flex flex-col items-center gap-4">
//             <AlertCircle className="h-12 w-12 text-red-600" />
//             <p className="text-lg font-medium text-gray-600">Plan not found</p>
//             <Button onClick={() => navigate("/dashboard/subscription/get-all-subscription")}>
//               Go Back
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       <div className="space-y-6 p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => navigate(-1)}
//               className="hover:bg-slate-100 dark:hover:bg-slate-800"
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <div>
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
//                   <Package className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
//                     {plan.name}
//                   </h1>
//                   <p className="text-muted-foreground font-mono text-sm">
//                     {plan.slug}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleDuplicate}
//               disabled={isDuplicating}
//             >
//               {isDuplicating ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Copy className="h-4 w-4" />
//               )}
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleEdit}
//               className="hover:bg-blue-50 dark:hover:bg-blue-950"
//             >
//               <Edit className="mr-2 h-4 w-4" />
//               Edit
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setDeleteDialogOpen(true)}
//               className="hover:bg-red-50 dark:hover:bg-red-950 text-red-600 hover:text-red-700"
//             >
//               <Trash2 className="mr-2 h-4 w-4" />
//               Delete
//             </Button>
//           </div>
//         </div>

//         {/* Status Badges */}
//         <Card className="border-2">
//           <CardContent className="pt-6">
//             <div className="flex flex-wrap items-center gap-3">
//               <Badge
//                 className={
//                   plan.is_active
//                     ? "bg-green-100 text-green-800 hover:bg-green-100 px-4 py-2 text-sm"
//                     : "bg-gray-100 text-gray-800 hover:bg-gray-100 px-4 py-2 text-sm"
//                 }
//               >
//                 {plan.is_active ? (
//                   <>
//                     <CheckCircle className="w-4 h-4 mr-2" />
//                     Active
//                   </>
//                 ) : (
//                   <>
//                     <XCircle className="w-4 h-4 mr-2" />
//                     Inactive
//                   </>
//                 )}
//               </Badge>
//               {plan.is_popular && (
//                 <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-4 py-2 text-sm">
//                   <Star className="w-4 h-4 mr-2" />
//                   Popular Plan
//                 </Badge>
//               )}
//               {plan.is_free && (
//                 <Badge
//                   variant="outline"
//                   className="border-green-500 text-green-600 px-4 py-2 text-sm"
//                 >
//                   <Sparkles className="w-4 h-4 mr-2" />
//                   Free Plan
//                 </Badge>
//               )}
//               {plan.has_trial && (
//                 <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 px-4 py-2 text-sm">
//                   <Calendar className="w-4 h-4 mr-2" />
//                   {plan.trial_days} Days Trial
//                 </Badge>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         <div className="grid gap-6 lg:grid-cols-3">
//           {/* Left Column - Main Details */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Description */}
//             <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Package className="h-5 w-5 text-green-600" />
//                   Plan Description
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
//                   {plan.description}
//                 </p>
//               </CardContent>
//             </Card>

//             {/* Pricing Details */}
//             <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <DollarSign className="h-5 w-5 text-green-600" />
//                   Pricing Details
//                 </CardTitle>
//                 <CardDescription>Monthly and yearly pricing breakdown</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                   <div className="p-6 border-2 border-green-200 dark:border-green-800 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Calendar className="w-5 h-5 text-green-600" />
//                       <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                         Monthly Price
//                       </p>
//                     </div>
//                     <p className="text-4xl font-bold text-green-600">
//                       {formatCurrency(plan.price, plan.currency)}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-1">per month</p>
//                   </div>

//                   <div className="p-6 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
//                     <div className="flex items-center gap-2 mb-2">
//                       <TrendingUp className="w-5 h-5 text-blue-600" />
//                       <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                         Yearly Price
//                       </p>
//                     </div>
//                     <p className="text-4xl font-bold text-blue-600">
//                       {formatCurrency(plan.yearly_price, plan.currency)}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-1">per year</p>
//                   </div>
//                 </div>

//                 {plan.savings_percentage > 0 && (
//                   <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border-2 border-green-200 dark:border-green-800">
//                     <div className="flex items-center justify-between">
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-2">
//                           <TrendingUp className="w-5 h-5 text-green-600" />
//                           <p className="font-semibold text-lg text-green-900 dark:text-green-100">
//                             Yearly Savings
//                           </p>
//                         </div>
//                         <p className="text-3xl font-bold text-green-600">
//                           {formatCurrency(plan.yearly_savings, plan.currency)}
//                         </p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Save by choosing yearly billing
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full">
//                           <Sparkles className="h-5 w-5" />
//                           <span className="text-2xl font-bold">
//                             {plan.savings_percentage}% OFF
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Usage Limits */}
//             <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Settings className="h-5 w-5 text-green-600" />
//                   Usage Limits
//                 </CardTitle>
//                 <CardDescription>Maximum allowances for this plan</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
//                         <Users className="w-6 h-6 text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Max Listings
//                         </p>
//                         <p className="text-3xl font-bold text-blue-600">
//                           {plan.limits.unlimited_listings ? "∞" : plan.limits.max_listings}
//                         </p>
//                       </div>
//                     </div>
//                     {plan.limits.unlimited_listings && (
//                       <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
//                         Unlimited
//                       </Badge>
//                     )}
//                   </div>

//                   <div className="p-6 bg-purple-50 dark:bg-purple-950 rounded-lg border-2 border-purple-200 dark:border-purple-800">
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
//                         <Calendar className="w-6 h-6 text-purple-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Bookings/Month
//                         </p>
//                         <p className="text-3xl font-bold text-purple-600">
//                           {plan.limits.unlimited_bookings
//                             ? "∞"
//                             : plan.limits.max_bookings_per_month}
//                         </p>
//                       </div>
//                     </div>
//                     {plan.limits.unlimited_bookings && (
//                       <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
//                         Unlimited
//                       </Badge>
//                     )}
//                   </div>

//                   <div className="p-6 bg-yellow-50 dark:bg-yellow-950 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
//                         <Star className="w-6 h-6 text-yellow-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Featured Listings
//                         </p>
//                         <p className="text-3xl font-bold text-yellow-600">
//                           {plan.limits.max_featured_listings}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Plan Features */}
//             <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Sparkles className="h-5 w-5 text-green-600" />
//                   Plan Features
//                 </CardTitle>
//                 <CardDescription>Core features included in this plan</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {Object.entries(plan.features).map(([key, value]) => {
//                     const Icon = getFeatureIcon(key);
//                     const label = getFeatureLabel(key);
//                     return (
//                       <div
//                         key={key}
//                         className={`p-4 rounded-lg border-2 transition-all ${
//                           value
//                             ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
//                             : "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-gray-800 opacity-60"
//                         }`}
//                       >
//                         <div className="flex items-center justify-between mb-2">
//                           <div className="flex items-center gap-3">
//                             <div
//                               className={`p-2 rounded-lg ${
//                                 value
//                                   ? "bg-green-100 dark:bg-green-900"
//                                   : "bg-gray-200 dark:bg-gray-800"
//                               }`}
//                             >
//                               <Icon
//                                 className={`w-5 h-5 ${
//                                   value ? "text-green-600" : "text-gray-400"
//                                 }`}
//                               />
//                             </div>
//                             <span className="font-medium">{label}</span>
//                           </div>
//                           {value ? (
//                             <CheckCircle className="w-5 h-5 text-green-600" />
//                           ) : (
//                             <XCircle className="w-5 h-5 text-gray-400" />
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Additional Features List */}
//             {plan.feature_list.length > 0 && (
//               <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-600" />
//                     Additional Features
//                   </CardTitle>
//                   <CardDescription>
//                     {plan.feature_list.length} custom features included
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {plan.feature_list.map((feature) => (
//                       <div
//                         key={feature.id}
//                         className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
//                           feature.is_included
//                             ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
//                             : "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-gray-800 opacity-60"
//                         }`}
//                       >
//                         <div className="flex-shrink-0 mt-1">
//                           {feature.is_included ? (
//                             <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded-full">
//                               <CheckCircle className="w-5 h-5 text-green-600" />
//                             </div>
//                           ) : (
//                             <div className="p-1.5 bg-gray-200 dark:bg-gray-800 rounded-full">
//                               <XCircle className="w-5 h-5 text-gray-400" />
//                             </div>
//                           )}
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex items-center justify-between mb-1">
//                             <h4 className="font-semibold text-base">{feature.name}</h4>
//                             <Badge
//                               className={
//                                 feature.is_included
//                                   ? "bg-green-100 text-green-800 hover:bg-green-100"
//                                   : "bg-gray-100 text-gray-600 hover:bg-gray-100"
//                               }
//                             >
//                               {feature.is_included ? "Included" : "Not Included"}
//                             </Badge>
//                           </div>
//                           <p className="text-sm text-gray-600 dark:text-gray-400">
//                             {feature.description}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Right Column - Summary & Info */}
//           <div className="space-y-6">
//             {/* Quick Summary */}
//             <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white shadow-lg">
//               <CardHeader>
//                 <CardTitle className="text-white flex items-center gap-2">
//                   <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur">
//                     <TrendingUp className="h-5 w-5" />
//                   </div>
//                   Quick Summary
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center p-3 rounded-lg bg-white/10 backdrop-blur">
//                     <span className="text-sm font-medium">Monthly</span>
//                     <span className="text-xl font-bold">
//                       {formatCurrency(plan.price, plan.currency)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center p-3 rounded-lg bg-white/10 backdrop-blur">
//                     <span className="text-sm font-medium">Yearly</span>
//                     <span className="text-xl font-bold">
//                       {formatCurrency(plan.yearly_price, plan.currency)}
//                     </span>
//                   </div>
//                 </div>

//                 <Separator className="bg-white/20" />

//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between items-center">
//                     <span className="flex items-center gap-2">
//                       <Users className="h-4 w-4" />
//                       Listings
//                     </span>
//                     <span className="font-semibold">
//                       {plan.limits.unlimited_listings ? "∞" : plan.limits.max_listings}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4" />
//                       Bookings/mo
//                     </span>
//                     <span className="font-semibold">
//                       {plan.limits.unlimited_bookings
//                         ? "∞"
//                         : plan.limits.max_bookings_per_month}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="flex items-center gap-2">
//                       <Star className="h-4 w-4" />
//                       Featured
//                     </span>
//                     <span className="font-semibold">
//                       {plan.limits.max_featured_listings}
//                     </span>
//                   </div>
//                 </div>

//                 {plan.has_trial && (
//                   <>
//                     <Separator className="bg-white/20" />
//                     <div className="p-3 bg-white/10 backdrop-blur rounded-lg">
//                       <div className="flex items-center gap-2 mb-1">
//                         <Clock className="h-4 w-4" />
//                         <span className="text-sm font-medium">Trial Period</span>
//                       </div>
//                       <p className="text-2xl font-bold">{plan.trial_days} Days</p>
//                     </div>
//                   </>
//                 )}

//                 {/* Active Features Count */}
//                 <Separator className="bg-white/20" />
//                 <div>
//                   <p className="text-xs font-medium mb-2">Active Features</p>
//                   <div className="flex flex-wrap gap-1.5">
//                     {Object.entries(plan.features).map(
//                       ([key, value]) =>
//                         value && (
//                           <span
//                             key={key}
//                             className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur"
//                           >
//                             {(() => {
//                               const Icon = getFeatureIcon(key);
//                               return <Icon className="inline h-3 w-3 mr-1" />;
//                             })()}
//                             {getFeatureLabel(key)}
//                           </span>
//                         )
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Stripe Integration */}
//             <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-lg">
//                   <CreditCard className="h-5 w-5 text-blue-600" />
//                   Payment Info
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
//                   <p className="text-xs text-gray-500 mb-1">Currency</p>
//                   <p className="text-lg font-bold text-blue-600">
//                     {plan.currency}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
//                   <p className="text-xs text-gray-500 mb-1">Formatted Price</p>
//                   <p className="text-sm font-mono font-medium">
//                     {plan.formatted_price}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Metadata */}
//             <Card className="border-2">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-lg">
//                   <Clock className="h-5 w-5 text-gray-600" />
//                   Metadata
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
//                   <p className="text-xs text-gray-500 mb-1">Plan ID</p>
//                   <p className="text-sm font-mono font-medium">#{plan.id}</p>
//                 </div>
//                 <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
//                   <p className="text-xs text-gray-500 mb-1">Created At</p>
//                   <p className="text-sm font-medium">{formatDate(plan.created_at)}</p>
//                 </div>
//                 <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
//                   <p className="text-xs text-gray-500 mb-1">Last Updated</p>
//                   <p className="text-sm font-medium">{formatDate(plan.updated_at)}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2 text-red-600">
//               <AlertCircle className="w-5 h-5" />
//               Delete Plan?
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete{" "}
//               <span className="font-semibold">{plan.name}</span>? This action cannot
//               be undone and will affect all users currently subscribed to this plan.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               Delete Plan
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default ViewPlanDetail;











import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Star,
  CheckCircle,
  XCircle,
  Sparkles,
  Edit,
  Trash2,
  Copy,
  Settings,
  BarChart,
  Code,
  Headphones,
  Loader2,
  AlertCircle,
  Shield,
  Clock,
  CreditCard,
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
import { Separator } from "@/components/ui/separator";
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
import { apiUrl } from "@/services/api-end-point";
import { notify } from "@/utils/utils";

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

interface SubscriptionPlanDetail {
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

// Skeleton Component
const PlanDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="space-y-6 p-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-9 w-20 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              <div>
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
            <div className="h-9 w-20 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
            <div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
          </div>
        </div>

        {/* Status Badges Skeleton */}
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="h-8 w-28 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-4 w-56 bg-gray-200 dark:bg-gray-800 rounded mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-6 border-2 rounded-lg">
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  </div>
                  <div className="p-6 border-2 rounded-lg">
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Limits Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-lg border-2">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                        <div>
                          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-4 w-56 bg-gray-200 dark:bg-gray-800 rounded mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 rounded-lg border-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                        </div>
                        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                  <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
                      <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Info Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                  <div className="h-6 w-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
                <div className="p-3 rounded-lg">
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
              </CardContent>
            </Card>

            {/* Metadata Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 rounded-lg">
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewPlanDetail = () => {
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();

  const [plan, setPlan] = useState<SubscriptionPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  // Fetch Plan Details
  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const response = await makeApiRequest(
        `admin/subscriptions/plan/${planId}`,
        {
          method: "GET",
        }
      );

      console.log("Plan details fetched:", response);
      setPlan(response.data);
    } catch (error) {
      console.error("Error fetching plan details:", error);
      notify({
        message: "Failed to fetch plan details",
        type: "error",
      });
      // Navigate back on error
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanDetails();
  }, []);

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get feature icon
  const getFeatureIcon = (key: string) => {
    const icons: { [key: string]: any } = {
      featured_listings_allowed: Star,
      priority_support: Headphones,
      analytics_access: BarChart,
      api_access: Code,
    };
    return icons[key] || Settings;
  };

  // Get feature label
  const getFeatureLabel = (key: string) => {
    const labels: { [key: string]: string } = {
      featured_listings_allowed: "Featured Listings",
      priority_support: "Priority Support",
      analytics_access: "Analytics Access",
      api_access: "API Access",
    };
    return (
      labels[key] ||
      key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  // Handle Edit
  const handleEdit = () => {
    navigate(`/dashboard/subscription/edit-subscription/${planId}`);
  };

  // Handle Delete
  const handleDelete = async () => {
    try {
      await makeApiRequest(`${apiUrl.subscriptions.plans}/${planId}`, {
        method: "DELETE",
      });

      notify({
        message: "Plan deleted successfully",
        type: "success",
      });

      navigate("/dashboard/subscription/get-all-subscription");
    } catch (error) {
      console.error("Error deleting plan:", error);
      notify({
        message: "Failed to delete plan",
        type: "error",
      });
    }
  };

  // Handle Duplicate
  const handleDuplicate = async () => {
    if (!plan) return;

    try {
      setIsDuplicating(true);

      await makeApiRequest(apiUrl.subscriptions.plans, {
        method: "POST",
        data: {
          ...plan,
          name: `${plan.name} (Copy)`,
          slug: `${plan.slug}-copy-${Date.now()}`,
        },
      });

      notify({
        message: "Plan duplicated successfully",
        type: "success",
      });

      navigate("/dashboard/subscription/get-all-subscription");
    } catch (error) {
      console.error("Error duplicating plan:", error);
      notify({
        message: "Failed to duplicate plan",
        type: "error",
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  // Show skeleton while loading
  if (loading) {
    return <PlanDetailSkeleton />;
  }

  // If plan not found after loading, redirect back
  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                    {plan.name}
                  </h1>
                  <p className="text-muted-foreground font-mono text-sm">
                    {plan.slug}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              disabled={isDuplicating}
            >
              {isDuplicating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="hover:bg-red-50 dark:hover:bg-red-950 text-red-600 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Status Badges */}
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                className={
                  plan.is_active
                    ? "bg-green-100 text-green-800 hover:bg-green-100 px-4 py-2 text-sm"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100 px-4 py-2 text-sm"
                }
              >
                {plan.is_active ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Inactive
                  </>
                )}
              </Badge>
              {plan.is_popular && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-4 py-2 text-sm">
                  <Star className="w-4 h-4 mr-2" />
                  Popular Plan
                </Badge>
              )}
              {plan.is_free && (
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-600 px-4 py-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Free Plan
                </Badge>
              )}
              {plan.has_trial && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 px-4 py-2 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {plan.trial_days} Days Trial
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  Plan Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                  {plan.description}
                </p>
              </CardContent>
            </Card>

            {/* Pricing Details */}
            <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Pricing Details
                </CardTitle>
                <CardDescription>
                  Monthly and yearly pricing breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-6 border-2 border-green-200 dark:border-green-800 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Monthly Price
                      </p>
                    </div>
                    <p className="text-4xl font-bold text-green-600">
                      {formatCurrency(plan.price, plan.currency)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">per month</p>
                  </div>

                  <div className="p-6 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Yearly Price
                      </p>
                    </div>
                    <p className="text-4xl font-bold text-blue-600">
                      {formatCurrency(plan.yearly_price, plan.currency)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">per year</p>
                  </div>
                </div>

                {plan.savings_percentage > 0 && (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <p className="font-semibold text-lg text-green-900 dark:text-green-100">
                            Yearly Savings
                          </p>
                        </div>
                        <p className="text-3xl font-bold text-green-600">
                          {formatCurrency(plan.yearly_savings, plan.currency)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Save by choosing yearly billing
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full">
                          <Sparkles className="h-5 w-5" />
                          <span className="text-2xl font-bold">
                            {plan.savings_percentage}% OFF
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Usage Limits */}
            <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-green-600" />
                  Usage Limits
                </CardTitle>
                <CardDescription>
                  Maximum allowances for this plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Max Listings
                        </p>
                        <p className="text-3xl font-bold text-blue-600">
                          {plan.limits.unlimited_listings
                            ? "∞"
                            : plan.limits.max_listings}
                        </p>
                      </div>
                    </div>
                    {plan.limits.unlimited_listings && (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        Unlimited
                      </Badge>
                    )}
                  </div>

                  <div className="p-6 bg-purple-50 dark:bg-purple-950 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Bookings/Month
                        </p>
                        <p className="text-3xl font-bold text-purple-600">
                          {plan.limits.unlimited_bookings
                            ? "∞"
                            : plan.limits.max_bookings_per_month}
                        </p>
                      </div>
                    </div>
                    {plan.limits.unlimited_bookings && (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                        Unlimited
                      </Badge>
                    )}
                  </div>

                  <div className="p-6 bg-yellow-50 dark:bg-yellow-950 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                        <Star className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Featured Listings
                        </p>
                        <p className="text-3xl font-bold text-yellow-600">
                          {plan.limits.max_featured_listings}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan Features */}
            <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  Plan Features
                </CardTitle>
                <CardDescription>
                  Core features included in this plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(plan.features).map(([key, value]) => {
                    const Icon = getFeatureIcon(key);
                    const label = getFeatureLabel(key);
                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          value
                            ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                            : "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-gray-800 opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                value
                                  ? "bg-green-100 dark:bg-green-900"
                                  : "bg-gray-200 dark:bg-gray-800"
                              }`}
                            >
                              <Icon
                                className={`w-5 h-5 ${
                                  value ? "text-green-600" : "text-gray-400"
                                }`}
                              />
                            </div>
                            <span className="font-medium">{label}</span>
                          </div>
                          {value ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Additional Features List */}
            {plan.feature_list.length > 0 && (
              <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Additional Features
                  </CardTitle>
                  <CardDescription>
                    {plan.feature_list.length} custom features included
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {plan.feature_list.map((feature) => (
                      <div
                        key={feature.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                          feature.is_included
                            ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                            : "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-gray-800 opacity-60"
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {feature.is_included ? (
                            <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded-full">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                          ) : (
                            <div className="p-1.5 bg-gray-200 dark:bg-gray-800 rounded-full">
                              <XCircle className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-base">
                              {feature.name}
                            </h4>
                            <Badge
                              className={
                                feature.is_included
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                              }
                            >
                              {feature.is_included ? "Included" : "Not Included"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Summary & Info */}
          <div className="space-y-6">
            {/* Quick Summary */}
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  Quick Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/10 backdrop-blur">
                    <span className="text-sm font-medium">Monthly</span>
                    <span className="text-xl font-bold">
                      {formatCurrency(plan.price, plan.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/10 backdrop-blur">
                    <span className="text-sm font-medium">Yearly</span>
                    <span className="text-xl font-bold">
                      {formatCurrency(plan.yearly_price, plan.currency)}
                    </span>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Listings
                    </span>
                    <span className="font-semibold">
                      {plan.limits.unlimited_listings
                        ? "∞"
                        : plan.limits.max_listings}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Bookings/mo
                    </span>
                    <span className="font-semibold">
                      {plan.limits.unlimited_bookings
                        ? "∞"
                        : plan.limits.max_bookings_per_month}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Featured
                    </span>
                    <span className="font-semibold">
                      {plan.limits.max_featured_listings}
                    </span>
                  </div>
                </div>

                {plan.has_trial && (
                  <>
                    <Separator className="bg-white/20" />
                    <div className="p-3 bg-white/10 backdrop-blur rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">Trial Period</span>
                      </div>
                      <p className="text-2xl font-bold">{plan.trial_days} Days</p>
                    </div>
                  </>
                )}

                {/* Active Features Count */}
                <Separator className="bg-white/20" />
                <div>
                  <p className="text-xs font-medium mb-2">Active Features</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(plan.features).map(
                      ([key, value]) =>
                        value && (
                          <span
                            key={key}
                            className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur"
                          >
                            {(() => {
                              const Icon = getFeatureIcon(key);
                              return <Icon className="inline h-3 w-3 mr-1" />;
                            })()}
                            {getFeatureLabel(key)}
                          </span>
                        )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stripe Integration */}
            <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Payment Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Currency</p>
                  <p className="text-lg font-bold text-blue-600">
                    {plan.currency}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Formatted Price</p>
                  <p className="text-sm font-mono font-medium">
                    {plan.formatted_price}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                  Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Plan ID</p>
                  <p className="text-sm font-mono font-medium">#{plan.id}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Created At</p>
                  <p className="text-sm font-medium">
                    {formatDate(plan.created_at)}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                  <p className="text-sm font-medium">
                    {formatDate(plan.updated_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Delete Plan?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{plan.name}</span>? This action
              cannot be undone and will affect all users currently subscribed to
              this plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ViewPlanDetail;




