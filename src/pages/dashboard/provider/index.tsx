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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Users,
  TrendingUp,
  Star,
  MessageSquare,
  CalendarDays,
  DollarSign,
  ArrowLeft,
  UserCheck,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import makeApiRequest from "@/services/axios";
import { useNavigate } from "react-router-dom";

// Types
interface ProviderOverview {
  total_bookings: number;
  total_earnings: number;
  avg_rating: number;
  total_reviews: number;
  response_rate: string;
}

interface TopProvider {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  status: string;
  is_verified: boolean;
  bookings_as_provider_count: number;
}

interface ProvidersAnalyticsData {
  overview: ProviderOverview;
  top_providers: TopProvider[];
}

interface ProvidersAnalyticsResponse {
  success: boolean;
  data: ProvidersAnalyticsData;
}

const COLORS = [
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#14B8A6",
];

const STATUS_COLORS: Record<string, string> = {
  active: "#10B981",
  pending_verification: "#F59E0B",
  suspended: "#EF4444",
  inactive: "#6B7280",
};

export default function ProvidersAnalytics() {
  const navigate = useNavigate();
  const [data, setData] = useState<ProvidersAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchProvidersData = async () => {
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

      const response: ProvidersAnalyticsResponse = await makeApiRequest(
        `admin/analytics/providers${
          useCustomRange && startDate && endDate
            ? `?start_date=${startDate}&end_date=${endDate}`
            : `?period=${timeRange}`
        }`,
        {
          method: "GET",
        }
      );

      console.log("Providers Analytics Response:", response);

      if (response?.success && response?.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching providers analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!useCustomRange) {
      fetchProvidersData();
    }
  }, [timeRange, useCustomRange]);

  const handleCustomDateSubmit = () => {
    if (startDate && endDate) {
      fetchProvidersData();
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-32 bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>

          {/* Charts Skeleton */}
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
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
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
      change: "across all workers",
      icon: Users,
      trend: "up" as const,
    },
    {
      title: "Total Earnings",
      value: `$${data.overview.total_earnings.toFixed(2)}`,
      change: "worker revenue",
      icon: DollarSign,
      trend: "up" as const,
    },
    {
      title: "Average Rating",
      value: data.overview.avg_rating.toFixed(1),
      change: `${data.overview.total_reviews} reviews`,
      icon: Star,
      trend: "up" as const,
    },
    {
      title: "Response Rate",
      value: data.overview.response_rate,
      change: "worker responses",
      icon: MessageSquare,
      trend: "up" as const,
    },
    {
      title: "Total Workers",
      value: data.top_providers.length.toString(),
      change: "registered workers",
      icon: UserCheck,
      trend: "up" as const,
    },
  ];

  // Top 10 providers by bookings
  const topProvidersData = data.top_providers
    .slice(0, 10)
    .map((provider) => ({
      name: `${provider.first_name} ${provider.last_name}`,
      bookings: provider.bookings_as_provider_count,
      status: provider.status,
    }));

  // Provider status distribution
  const statusDistribution = data.top_providers.reduce((acc, provider) => {
    const status = provider.status;
    const existing = acc.find((item) => item.status === status);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ status, count: 1 });
    }
    return acc;
  }, [] as { status: string; count: number }[]);

  const statusChartData = statusDistribution.map((item) => ({
    name: item.status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    value: item.count,
    fill: STATUS_COLORS[item.status] || COLORS[0],
  }));

  // Verification status
  const verificationData = [
    {
      name: "Verified",
      value: data.top_providers.filter((p) => p.is_verified).length,
      fill: "#10B981",
    },
    {
      name: "Not Verified",
      value: data.top_providers.filter((p) => !p.is_verified).length,
      fill: "#F59E0B",
    },
  ];

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
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                    Worker Analytics
                  </h1>
                  <p className="text-muted-foreground">
                    Track and analyze worker performance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <Card className="border-2 border-green-100 dark:border-green-900 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-green-600" />
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
                    className="w-full bg-white dark:bg-slate-900 border-2 focus:border-green-500"
                  >
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">📅 Today</SelectItem>
                    <SelectItem value="week">📆 This Week</SelectItem>
                    <SelectItem value="month">🗓️ This Month</SelectItem>
                    <SelectItem value="year">📊 This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Range */}
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
                    className="focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-900 border-2"
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
                    className="focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-900 border-2"
                  />
                </div>

                <Button
                  onClick={handleCustomDateSubmit}
                  disabled={!startDate || !endDate}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Apply Range
                </Button>
              </>
            </div>

            {/* Display Current Range */}
            <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950 rounded-lg border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <CalendarDays className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                      Current Period
                    </p>
                    <p className="text-sm font-bold text-green-900 dark:text-green-100">
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
                <Badge className="bg-green-500 text-white hover:bg-green-600">
                  {data.top_providers.length} Workers
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Providers - Bar Chart */}
          <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Top Workers by Bookings
                  </CardTitle>
                  <CardDescription>
                    Most active workers
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-600"
                >
                  Top {topProvidersData.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {topProvidersData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={topProvidersData}
                    layout="vertical"
                    margin={{ left: 80 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorProviderBar"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10B981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#059669"
                          stopOpacity={0.8}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#6b7280"
                      width={80}
                      style={{ fontSize: "12px" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="bookings"
                      fill="url(#colorProviderBar)"
                      name="Bookings"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No worker data</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Provider Status Distribution - Pie Chart */}
          <Card className="border-2 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                    Worker Status Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown by worker status
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500 text-emerald-600"
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
                    <UserCheck className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No worker data</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Verification Status - Pie Chart */}
        <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-green-600" />
                  Worker Verification Status
                </CardTitle>
                <CardDescription>
                  Verified vs unverified workers
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-green-500 text-green-600">
                {data.top_providers.length} Total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={verificationData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={3}
                  stroke="#fff"
                >
                  {verificationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}