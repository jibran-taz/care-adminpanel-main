// import { useState, useEffect } from "react";
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
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";
// import { Calendar, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";
// import { StatsCard } from "@/components/StatsCard";
// import makeApiRequest from "@/services/axios";

// // Types
// interface BookingOverview {
//   total_bookings: number;
//   period_bookings: number;
//   completed_bookings: number;
//   canceled_bookings: number;
//   completion_rate: string;
//   cancellation_rate: string;
//   avg_booking_value: number;
// }

// interface BookingByStatus {
//   status: string;
//   count: number;
// }

// interface BookingTrend {
//   date: string;
//   count: number;
//   revenue: string;
// }

// interface PeakHour {
//   hour: number;
//   count: number;
// }

// interface BookingByCategory {
//   category: string;
//   count: number;
// }

// interface BookingsAnalyticsData {
//   overview: BookingOverview;
//   bookings_by_status: BookingByStatus[];
//   booking_trend: BookingTrend[];
//   peak_hours: PeakHour[];
//   bookings_by_category: BookingByCategory[];
// }

// interface BookingsAnalyticsResponse {
//   success: boolean;
//   data: BookingsAnalyticsData;
// }

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"];

// const STATUS_COLORS: Record<string, string> = {
//   pending: "#FFA500",
//   accepted: "#00C49F",
//   rejected: "#FF4444",
//   in_progress: "#0088FE",
//   completed: "#00C851",
//   cancelled: "#FF8042",
// };

// export default function BookingsAnalytics() {
//   const [data, setData] = useState<BookingsAnalyticsData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [timeRange, setTimeRange] = useState("month");

//   const fetchBookingsData = async () => {
//     try {
//       setLoading(true);
//       const response: BookingsAnalyticsResponse = await makeApiRequest(
//         "admin/analytics/bookings",
//         {
//           method: "GET",
//           params: { period: timeRange },
//         }
//       );

//       console.log("Bookings Analytics Response:", response);

//       if (response?.success && response?.data) {
//         setData(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching bookings analytics:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookingsData();
//   }, [timeRange]);

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           {Array.from({ length: 4 }).map((_, index) => (
//             <div key={index} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return <div>No data available</div>;
//   }

//   const statsCards = [
//     {
//       title: "Total Bookings",
//       value: data.overview.total_bookings.toString(),
//       change: `${data.overview.period_bookings} this period`,
//       icon: Calendar,
//       trend: "up" as const,
//     },
//     {
//       title: "Completed Bookings",
//       value: data.overview.completed_bookings.toString(),
//       change: `${data.overview.completion_rate} completion rate`,
//       icon: CheckCircle,
//       trend: "up" as const,
//     },
//     {
//       title: "Cancelled Bookings",
//       value: data.overview.canceled_bookings.toString(),
//       change: `${data.overview.cancellation_rate} cancellation rate`,
//       icon: XCircle,
//       trend: "down" as const,
//     },
//     {
//       title: "Avg Booking Value",
//       value: `$${data.overview.avg_booking_value.toFixed(2)}`,
//       change: "per booking",
//       icon: TrendingUp,
//       trend: "up" as const,
//     },
//   ];

//   // Format booking trend data for chart
//   const trendChartData = data.booking_trend.map((item) => ({
//     date: new Date(item.date).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     }),
//     bookings: item.count,
//     revenue: parseFloat(item.revenue),
//   }));

//   // Format status data for pie chart
//   const statusChartData = data.bookings_by_status.map((item) => ({
//     name: item.status.replace("_", " ").toUpperCase(),
//     value: item.count,
//     fill: STATUS_COLORS[item.status] || COLORS[0],
//   }));

//   // Format peak hours for bar chart
//   const peakHoursData = data.peak_hours.map((item) => ({
//     hour: `${item.hour}:00`,
//     bookings: item.count,
//   }));

//   // Format category data for pie chart
//   const categoryChartData = data.bookings_by_category.map((item, index) => ({
//     name: item.category,
//     value: item.count,
//     fill: COLORS[index % COLORS.length],
//   }));

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Bookings Analytics</h1>
//           <p className="text-muted-foreground">
//             Track and analyze booking performance
//           </p>
//         </div>
//         <Select value={timeRange} onValueChange={setTimeRange}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Select period" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="day">Today</SelectItem>
//             <SelectItem value="week">This Week</SelectItem>
//             <SelectItem value="month">This Month</SelectItem>
//             <SelectItem value="year">This Year</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {statsCards.map((stat, index) => (
//           <StatsCard key={index} {...stat} />
//         ))}
//       </div>

//       {/* Booking Trend Chart */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Booking Trend</CardTitle>
//           <CardDescription>Bookings and revenue over time</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={350}>
//             <LineChart data={trendChartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis yAxisId="left" />
//               <YAxis yAxisId="right" orientation="right" />
//               <Tooltip />
//               <Legend />
//               <Line
//                 yAxisId="left"
//                 type="monotone"
//                 dataKey="bookings"
//                 stroke="#0088FE"
//                 strokeWidth={2}
//                 name="Bookings"
//               />
//               <Line
//                 yAxisId="right"
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#00C49F"
//                 strokeWidth={2}
//                 name="Revenue ($)"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Bookings by Status - Pie Chart */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Bookings by Status</CardTitle>
//             <CardDescription>Distribution of booking statuses</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={350}>
//               <PieChart>
//                 <Pie
//                   data={statusChartData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) =>
//                     `${name}: ${(percent * 100).toFixed(0)}%`
//                   }
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {statusChartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.fill} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Bookings by Category - Pie Chart */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Bookings by Category</CardTitle>
//             <CardDescription>Distribution across service categories</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={350}>
//               <PieChart>
//                 <Pie
//                   data={categoryChartData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) =>
//                     `${name}: ${(percent * 100).toFixed(0)}%`
//                   }
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {categoryChartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.fill} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Peak Hours - Bar Chart */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Peak Booking Hours</CardTitle>
//           <CardDescription>Most popular booking times</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={350}>
//             <BarChart data={peakHoursData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="hour" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
//             </BarChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }






// import { useState, useEffect } from "react";
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
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";
// import { Calendar, TrendingUp, CheckCircle, XCircle, CalendarDays } from "lucide-react";
// import { StatsCard } from "@/components/StatsCard";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import makeApiRequest from "@/services/axios";

// // Types
// interface BookingOverview {
//   total_bookings: number;
//   period_bookings: number;
//   completed_bookings: number;
//   canceled_bookings: number;
//   completion_rate: string;
//   cancellation_rate: string;
//   avg_booking_value: number;
// }

// interface BookingByStatus {
//   status: string;
//   count: number;
// }

// interface BookingTrend {
//   date: string;
//   count: number;
//   revenue: string;
// }

// interface PeakHour {
//   hour: number;
//   count: number;
// }

// interface BookingByCategory {
//   category: string;
//   count: number;
// }

// interface BookingsAnalyticsData {
//   overview: BookingOverview;
//   bookings_by_status: BookingByStatus[];
//   booking_trend: BookingTrend[];
//   peak_hours: PeakHour[];
//   bookings_by_category: BookingByCategory[];
// }

// interface BookingsAnalyticsResponse {
//   success: boolean;
//   data: BookingsAnalyticsData;
// }

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"];

// const STATUS_COLORS: Record<string, string> = {
//   pending: "#FFA500",
//   accepted: "#00C49F",
//   rejected: "#FF4444",
//   in_progress: "#0088FE",
//   completed: "#00C851",
//   cancelled: "#FF8042",
// };

// export default function BookingsAnalytics() {
//   const [data, setData] = useState<BookingsAnalyticsData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [timeRange, setTimeRange] = useState("month");
//   const [useCustomRange, setUseCustomRange] = useState(false);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const fetchBookingsData = async () => {
//     try {
//       setLoading(true);

//       // Build query params
//       const params: any = {};
      
//       if (useCustomRange && startDate && endDate) {
//         params.start_date = startDate;
//         params.end_date = endDate;
//       } else {
//         params.period = timeRange;
//       }

//       const response: BookingsAnalyticsResponse = await makeApiRequest(
//         `admin/analytics/bookings?${params.start_date ? `start_date=${params.start_date}&end_date=${params.end_date}` : `period=${params.period}`}`,
//         {
//           method: "GET",
       
//         }
//       );

//       console.log("Bookings Analytics Response:", response);

//       if (response?.success && response?.data) {
//         setData(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching bookings analytics:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!useCustomRange) {
//       fetchBookingsData();
//     }
//   }, [timeRange, useCustomRange]);

//   const handleCustomDateSubmit = () => {
//     if (startDate && endDate) {
//       fetchBookingsData();
//     }
//   };

//   const handlePresetRangeChange = (value: string) => {
//     setTimeRange(value);
//     setUseCustomRange(false);
//   };

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         {/* Header Skeleton */}
//         <div className="flex items-center justify-between">
//           <div className="space-y-2">
//             <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
//             <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
//           </div>
//           <div className="h-10 w-48 bg-gray-200 animate-pulse rounded"></div>
//         </div>

//         {/* Stats Cards Skeleton */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           {Array.from({ length: 4 }).map((_, index) => (
//             <div key={index} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
//           ))}
//         </div>

//         {/* Charts Skeleton */}
//         <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
//         <div className="grid gap-6 md:grid-cols-2">
//           <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
//           <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//           <p className="text-lg text-gray-600">No data available</p>
//         </div>
//       </div>
//     );
//   }

//   const statsCards = [
//     {
//       title: "Total Bookings",
//       value: data.overview.total_bookings.toString(),
//       change: `${data.overview.period_bookings} this period`,
//       icon: Calendar,
//       trend: "up" as const,
//     },
//     {
//       title: "Completed Bookings",
//       value: data.overview.completed_bookings.toString(),
//       change: `${data.overview.completion_rate} completion rate`,
//       icon: CheckCircle,
//       trend: "up" as const,
//     },
//     {
//       title: "Cancelled Bookings",
//       value: data.overview.canceled_bookings.toString(),
//       change: `${data.overview.cancellation_rate} cancellation rate`,
//       icon: XCircle,
//       trend: "down" as const,
//     },
//     {
//       title: "Avg Booking Value",
//       value: `$${data.overview.avg_booking_value.toFixed(2)}`,
//       change: "per booking",
//       icon: TrendingUp,
//       trend: "up" as const,
//     },
//   ];

//   // Format booking trend data for chart
//   const trendChartData = data.booking_trend.map((item) => ({
//     date: new Date(item.date).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     }),
//     bookings: item.count,
//     revenue: parseFloat(item.revenue),
//   }));

//   // Format status data for pie chart
//   const statusChartData = data.bookings_by_status.map((item) => ({
//     name: item.status.replace("_", " ").toUpperCase(),
//     value: item.count,
//     fill: STATUS_COLORS[item.status] || COLORS[0],
//   }));

//   // Format peak hours for bar chart
//   const peakHoursData = data.peak_hours.map((item) => ({
//     hour: `${item.hour}:00`,
//     bookings: item.count,
//   }));

//   // Format category data for pie chart
//   const categoryChartData = data.bookings_by_category.map((item, index) => ({
//     name: item.category,
//     value: item.count,
//     fill: COLORS[index % COLORS.length],
//   }));

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
//             Bookings Analytics
//           </h1>
//           <p className="text-muted-foreground">
//             Track and analyze booking performance
//           </p>
//         </div>
//       </div>

//       {/* Filter Section */}
//       <Card className="border-2">
//         <CardHeader>
//           <CardTitle className="text-lg flex items-center gap-2">
//             <CalendarDays className="h-5 w-5 text-green-600" />
//             Date Range Filter
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col md:flex-row gap-4 items-end">
//             {/* Preset Range Selector */}
//             <div className="flex-1">
//               <Label htmlFor="preset-range" className="text-sm font-semibold mb-2 block">
//                 Quick Select
//               </Label>
//               <Select 
//                 value={useCustomRange ? "custom" : timeRange} 
//                 onValueChange={(value) => {
//                   if (value === "custom") {
//                     setUseCustomRange(true);
//                   } else {
//                     handlePresetRangeChange(value);
//                   }
//                 }}
//               >
//                 <SelectTrigger id="preset-range" className="w-full">
//                   <SelectValue placeholder="Select period" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="day">Today</SelectItem>
//                   <SelectItem value="week">This Week</SelectItem>
//                   <SelectItem value="month">This Month</SelectItem>
//                   <SelectItem value="year">This Year</SelectItem>
//                   <SelectItem value="custom">Custom Range</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Custom Date Range */}
//             {useCustomRange && (
//               <>
//                 <div className="flex-1">
//                   <Label htmlFor="start-date" className="text-sm font-semibold mb-2 block">
//                     Start Date
//                   </Label>
//                   <Input
//                     id="start-date"
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>

//                 <div className="flex-1">
//                   <Label htmlFor="end-date" className="text-sm font-semibold mb-2 block">
//                     End Date
//                   </Label>
//                   <Input
//                     id="end-date"
//                     type="date"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                     className="focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>

//                 <Button
//                   onClick={handleCustomDateSubmit}
//                   disabled={!startDate || !endDate}
//                   className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
//                 >
//                   <CalendarDays className="h-4 w-4 mr-2" />
//                   Apply Range
//                 </Button>
//               </>
//             )}
//           </div>

//           {/* Display Current Range */}
//           <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
//             <p className="text-sm font-medium text-green-900 dark:text-green-100">
//               {useCustomRange && startDate && endDate ? (
//                 <>
//                   📅 Showing data from{" "}
//                   <span className="font-bold">
//                     {new Date(startDate).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                       year: "numeric",
//                     })}
//                   </span>{" "}
//                   to{" "}
//                   <span className="font-bold">
//                     {new Date(endDate).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                       year: "numeric",
//                     })}
//                   </span>
//                 </>
//               ) : (
//                 <>
//                   📅 Showing data for:{" "}
//                   <span className="font-bold">
//                     {timeRange === "day" && "Today"}
//                     {timeRange === "week" && "This Week"}
//                     {timeRange === "month" && "This Month"}
//                     {timeRange === "year" && "This Year"}
//                   </span>
//                 </>
//               )}
//             </p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {statsCards.map((stat, index) => (
//           <StatsCard key={index} {...stat} />
//         ))}
//       </div>

//       {/* Booking Trend Chart */}
//       <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <TrendingUp className="h-5 w-5 text-green-600" />
//             Booking Trend
//           </CardTitle>
//           <CardDescription>Bookings and revenue over time</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {trendChartData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={350}>
//               <LineChart data={trendChartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis yAxisId="left" />
//                 <YAxis yAxisId="right" orientation="right" />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   yAxisId="left"
//                   type="monotone"
//                   dataKey="bookings"
//                   stroke="#0088FE"
//                   strokeWidth={2}
//                   name="Bookings"
//                 />
//                 <Line
//                   yAxisId="right"
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#00C49F"
//                   strokeWidth={2}
//                   name="Revenue ($)"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-80 flex items-center justify-center text-gray-500">
//               <div className="text-center">
//                 <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p>No trend data available for this period</p>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Bookings by Status - Pie Chart */}
//         <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <CheckCircle className="h-5 w-5 text-green-600" />
//               Bookings by Status
//             </CardTitle>
//             <CardDescription>Distribution of booking statuses</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {statusChartData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={350}>
//                 <PieChart>
//                   <Pie
//                     data={statusChartData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, percent }) =>
//                       `${name}: ${(percent * 100).toFixed(0)}%`
//                     }
//                     outerRadius={100}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {statusChartData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.fill} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-80 flex items-center justify-center text-gray-500">
//                 <p>No status data available</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Bookings by Category - Pie Chart */}
//         <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Calendar className="h-5 w-5 text-green-600" />
//               Bookings by Category
//             </CardTitle>
//             <CardDescription>Distribution across service categories</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {categoryChartData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={350}>
//                 <PieChart>
//                   <Pie
//                     data={categoryChartData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, percent }) =>
//                       `${name}: ${(percent * 100).toFixed(0)}%`
//                     }
//                     outerRadius={100}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {categoryChartData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.fill} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-80 flex items-center justify-center text-gray-500">
//                 <p>No category data available</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Peak Hours - Bar Chart */}
//       <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Calendar className="h-5 w-5 text-green-600" />
//             Peak Booking Hours
//           </CardTitle>
//           <CardDescription>Most popular booking times</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {peakHoursData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={350}>
//               <BarChart data={peakHoursData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="hour" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-80 flex items-center justify-center text-gray-500">
//               <div className="text-center">
//                 <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p>No peak hours data available for this period</p>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }














import { useState, useEffect } from "react";
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
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  CalendarDays,
  Clock,
  Package,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import makeApiRequest from "@/services/axios";
import { useNavigate } from "react-router-dom";

// Types
interface BookingOverview {
  total_bookings: number;
  period_bookings: number;
  completed_bookings: number;
  canceled_bookings: number;
  completion_rate: string;
  cancellation_rate: string;
  avg_booking_value: number;
}

interface BookingByStatus {
  status: string;
  count: number;
}

interface BookingTrend {
  date: string;
  count: number;
  revenue: string;
}

interface PeakHour {
  hour: number;
  count: number;
}

interface BookingByCategory {
  category: string;
  count: number;
}

interface BookingsAnalyticsData {
  overview: BookingOverview;
  bookings_by_status: BookingByStatus[];
  booking_trend: BookingTrend[];
  peak_hours: PeakHour[];
  bookings_by_category: BookingByCategory[];
}

interface BookingsAnalyticsResponse {
  success: boolean;
  data: BookingsAnalyticsData;
}

const COLORS = [
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  accepted: "#10B981",
  rejected: "#EF4444",
  in_progress: "#3B82F6",
  completed: "#059669",
  cancelled: "#DC2626",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function BookingsAnalytics() {
  const navigate = useNavigate();
  const [data, setData] = useState<BookingsAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchBookingsData = async () => {
    try {
      setLoading(true);

      // Build query params
      const params: any = {};

      if (useCustomRange && startDate && endDate) {
        params.start_date = startDate;
        params.end_date = endDate;
      } else {
        params.period = timeRange;
      }

      const response: BookingsAnalyticsResponse = await makeApiRequest(
        `admin/analytics/bookings${
          useCustomRange && startDate && endDate
            ? `?start_date=${startDate}&end_date=${endDate}`
            : `?period=${timeRange}`
        }`,
        {
          method: "GET",
        }
      );

      console.log("Bookings Analytics Response:", response);

      if (response?.success && response?.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching bookings analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!useCustomRange) {
      fetchBookingsData();
    }
  }, [timeRange, useCustomRange]);

  const handleCustomDateSubmit = () => {
    if (startDate && endDate) {
      fetchBookingsData();
    }
  };

  const handlePresetRangeChange = (value: string) => {
    setTimeRange(value);
    setUseCustomRange(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="space-y-6 p-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          {/* Filter Card Skeleton */}
          <div className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>

          {/* Stats Cards Skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
          <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <CalendarDays className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-gray-600">
              No data available
            </p>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Bookings",
      value: data.overview.total_bookings.toString(),
      change: `${data.overview.period_bookings} this period`,
      icon: Calendar,
      trend: "up" as const,
    },
    {
      title: "Completed Bookings",
      value: data.overview.completed_bookings.toString(),
      change: `${data.overview.completion_rate} completion rate`,
      icon: CheckCircle,
      trend: "up" as const,
    },
    {
      title: "Cancelled Bookings",
      value: data.overview.canceled_bookings.toString(),
      change: `${data.overview.cancellation_rate} cancellation rate`,
      icon: XCircle,
      trend: "down" as const,
    },
    {
      title: "Avg Booking Value",
      value: `$${data.overview.avg_booking_value.toFixed(2)}`,
      change: "per booking",
      icon: TrendingUp,
      trend: "up" as const,
    },
  ];

  // Format booking trend data for chart
  const trendChartData = data.booking_trend.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    bookings: item.count,
    revenue: parseFloat(item.revenue),
  }));

  // Format status data for pie chart
  const statusChartData = data.bookings_by_status.map((item) => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    fill: STATUS_COLORS[item.status] || COLORS[0],
  }));

  // Format peak hours for bar chart
  const peakHoursData = data.peak_hours
    .sort((a, b) => a.hour - b.hour)
    .map((item) => {
      const hour = item.hour;
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return {
        hour: `${displayHour} ${period}`,
        bookings: item.count,
      };
    });

  // Format category data for pie chart
  const categoryChartData = data.bookings_by_category.map((item, index) => ({
    name: item.category,
    value: item.count,
    fill: COLORS[index % COLORS.length],
  }));

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
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                    Bookings Analytics
                  </h1>
                  <p className="text-muted-foreground">
                    Track and analyze booking performance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <Card className="border-2 border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              Date Range Filter
            </CardTitle>
            <CardDescription>
              Select a time period to view analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Preset Range Selector */}
              <div className="flex-1">
                <Label
                  htmlFor="preset-range"
                  className="text-sm font-semibold mb-2 block"
                >
                  Quick Select
                </Label>
                <Select
                  value={useCustomRange ? "custom" : timeRange}
                  onValueChange={(value) => {
                    if (value === "custom") {
                      setUseCustomRange(true);
                    } else {
                      handlePresetRangeChange(value);
                    }
                  }}
                >
                  <SelectTrigger
                    id="preset-range"
                    className="w-full bg-white dark:bg-slate-900 border-2 focus:border-blue-500"
                  >
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">📅 Today</SelectItem>
                    <SelectItem value="week">📆 This Week</SelectItem>
                    <SelectItem value="month">🗓️ This Month</SelectItem>
                    <SelectItem value="year">📊 This Year</SelectItem>
                    {/* <SelectItem value="custom">🎯 Custom Range</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Range */}
              {/* {useCustomRange && ( */}
                <>
                  <div className="flex-1">
                    <Label
                      htmlFor="start-date"
                      className="text-sm font-semibold mb-2 block"
                    >
                      Start Date
                    </Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 border-2"
                    />
                  </div>

                  <div className="flex-1">
                    <Label
                      htmlFor="end-date"
                      className="text-sm font-semibold mb-2 block"
                    >
                      End Date
                    </Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 border-2"
                    />
                  </div>

                  <Button
                    onClick={handleCustomDateSubmit}
                    disabled={!startDate || !endDate}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg"
                  >
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Apply Range
                  </Button>
                </>
              {/* )} */}
            </div>

            {/* Display Current Range */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <CalendarDays className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                      Current Period
                    </p>
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                      {useCustomRange && startDate && endDate ? (
                        <>
                          {new Date(startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </>
                      ) : (
                        <>
                          {timeRange === "day" && "Today"}
                          {timeRange === "week" && "This Week"}
                          {timeRange === "month" && "This Month"}
                          {timeRange === "year" && "This Year"}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                  {data.overview.period_bookings} Bookings
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Booking Trend Chart */}
        <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Booking Trend
                </CardTitle>
                <CardDescription>
                  Bookings and revenue over time
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-blue-500 text-blue-600">
                {trendChartData.length} Data Points
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {trendChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={trendChartData}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="bookings"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorBookings)"
                    strokeWidth={2}
                    name="Bookings"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">
                    No trend data available
                  </p>
                  <p className="text-sm text-gray-400">
                    Try selecting a different time period
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Bookings by Status - Pie Chart */}
          <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Bookings by Status
                  </CardTitle>
                  <CardDescription>
                    Distribution of booking statuses
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-600"
                >
                  {statusChartData.length} Statuses
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {statusChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No status data</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bookings by Category - Pie Chart */}
          <Card className="border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-colors shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    Bookings by Category
                  </CardTitle>
                  <CardDescription>
                    Distribution across service categories
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="border-purple-500 text-purple-600"
                >
                  {categoryChartData.length} Categories
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No category data</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Peak Hours - Bar Chart */}
        <Card className="border-2 hover:border-orange-200 dark:hover:border-orange-800 transition-colors shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Peak Booking Hours
                </CardTitle>
                <CardDescription>
                  Most popular booking times throughout the day
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="border-orange-500 text-orange-600"
              >
                {peakHoursData.length} Hours
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {peakHoursData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={peakHoursData}>
                  <defs>
                    <linearGradient
                      id="colorBar"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="hour"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="bookings"
                    fill="url(#colorBar)"
                    name="Bookings"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Clock className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">No peak hours data</p>
                  <p className="text-sm text-gray-400">
                    Try selecting a different time period
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}