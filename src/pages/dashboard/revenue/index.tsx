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
  AreaChart,
  Area,
} from "recharts";
import { DollarSign, TrendingUp, CreditCard, Percent } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import makeApiRequest from "@/services/axios";

// Types
interface RevenueOverview {
  total_revenue: number;
  period_revenue: number;
  platform_fees: number;
  avg_transaction_value: number;
  subscription_revenue: number;
}

interface RevenueByMethod {
  method?: string;
  total: number | null;
}

interface RevenueByCategory {
  category: string;
  revenue: number;
}

interface RevenueTrend {
  date: string;
  revenue: number;
  platform_fees: number;
}

interface RevenueAnalyticsData {
  overview: RevenueOverview;
  revenue_by_method: RevenueByMethod[];
  revenue_by_category: RevenueByCategory[];
  revenue_trend: RevenueTrend[];
}

interface RevenueAnalyticsResponse {
  success: boolean;
  data: RevenueAnalyticsData;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"];

export default function RevenueAnalytics() {
  const [data, setData] = useState<RevenueAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response: RevenueAnalyticsResponse = await makeApiRequest(
        "admin/analytics/revenue",
        {
          method: "GET",
          params: { period: timeRange },
        }
      );

      console.log("Revenue Analytics Response:", response);

      if (response?.success && response?.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching revenue analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const statsCards = [
    {
      title: "Total Revenue",
      value: `$${data.overview.total_revenue.toFixed(2)}`,
      change: "all time",
      icon: DollarSign,
      trend: "up" as const,
    },
    {
      title: "Period Revenue",
      value: `$${data.overview.period_revenue.toFixed(2)}`,
      change: "this period",
      icon: TrendingUp,
      trend: "up" as const,
    },
    {
      title: "Platform Fees",
      value: `$${data.overview.platform_fees.toFixed(2)}`,
      change: "collected",
      icon: Percent,
      trend: "up" as const,
    },
    {
      title: "Avg Transaction",
      value: `$${data.overview.avg_transaction_value.toFixed(2)}`,
      change: "per transaction",
      icon: CreditCard,
      trend: "up" as const,
    },
    {
      title: "Subscription Revenue",
      value: `$${data.overview.subscription_revenue.toFixed(2)}`,
      change: "MRR",
      icon: TrendingUp,
      trend: "up" as const,
    },
  ];

  // Format revenue trend data
  const trendChartData = data.revenue_trend.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    revenue: item.revenue,
    fees: item.platform_fees,
  }));

  // Format revenue by method for pie chart
  const methodChartData = data.revenue_by_method
    .filter((item) => item.total !== null && item.total > 0)
    .map((item, index) => ({
      name: item.method || "Unknown",
      value: item.total || 0,
      fill: COLORS[index % COLORS.length],
    }));

  // Format revenue by category for bar chart
  const categoryChartData = data.revenue_by_category.map((item) => ({
    category: item.category,
    revenue: item.revenue,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Revenue Analytics</h1>
          <p className="text-muted-foreground">
            Track and analyze revenue performance
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Revenue Trend Chart */}
      {trendChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Revenue and platform fees over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={trendChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0088FE"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="fees"
                  stroke="#00C49F"
                  fillOpacity={1}
                  fill="url(#colorFees)"
                  name="Platform Fees"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue by Payment Method */}
        {methodChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Payment Method</CardTitle>
              <CardDescription>Distribution across payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={methodChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {methodChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Revenue by Category */}
        {categoryChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
              <CardDescription>Revenue distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#0088FE" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Empty State Messages */}
      {methodChartData.length === 0 && categoryChartData.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No revenue data available for this period</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}