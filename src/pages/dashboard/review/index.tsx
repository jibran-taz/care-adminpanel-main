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
  AreaChart,
  Area,
} from "recharts";
import {
  Star,
  TrendingUp,
  MessageCircle,
  CalendarDays,
  ArrowLeft,
  Award,
  ThumbsUp,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import makeApiRequest from "@/services/axios";
import { useNavigate } from "react-router-dom";

// Types
interface ReviewOverview {
  total_reviews: number;
  period_reviews: number;
  avg_rating: number;
  reviews_with_response: number;
  response_rate: string;
}

interface RatingDistribution {
  rating: number;
  count: number;
}

interface ReviewTrend {
  date: string;
  count: number;
  avg_rating: string;
}

interface TopRatedProvider {
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
  reviews_count: number;
  average_rating: number;
}

interface ReviewsAnalyticsData {
  overview: ReviewOverview;
  rating_distribution: RatingDistribution[];
  review_trend: ReviewTrend[];
  top_rated_providers: TopRatedProvider[];
}

interface ReviewsAnalyticsResponse {
  success: boolean;
  data: ReviewsAnalyticsData;
}

const COLORS = [
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

const RATING_COLORS: Record<number, string> = {
  5: "#10B981", // Green
  4: "#84CC16", // Lime
  3: "#F59E0B", // Amber
  2: "#F97316", // Orange
  1: "#EF4444", // Red
};

export default function ReviewsAnalytics() {
  const navigate = useNavigate();
  const [data, setData] = useState<ReviewsAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReviewsData = async () => {
    try {
      setLoading(true);

      const response: ReviewsAnalyticsResponse = await makeApiRequest(
        `admin/analytics/reviews${
          useCustomRange && startDate && endDate
            ? `?start_date=${startDate}&end_date=${endDate}`
            : `?period=${timeRange}`
        }`,
        {
          method: "GET",
        }
      );

      console.log("Reviews Analytics Response:", response);

      if (response?.success && response?.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching reviews analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!useCustomRange) {
      fetchReviewsData();
    }
  }, [timeRange, useCustomRange]);

  const handleCustomDateSubmit = () => {
    if (startDate && endDate) {
      fetchReviewsData();
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
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Star className="h-16 w-16 mx-auto text-gray-400 mb-4" />
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
      title: "Total Reviews",
      value: data.overview.total_reviews.toString(),
      change: `${data.overview.period_reviews} this period`,
      icon: Star,
      trend: "up" as const,
    },
    {
      title: "Average Rating",
      value: data.overview.avg_rating.toFixed(1),
      change: "overall rating",
      icon: Award,
      trend: "up" as const,
    },
    {
      title: "Reviews with Response",
      value: data.overview.reviews_with_response.toString(),
      change: "provider responses",
      icon: MessageCircle,
      trend: "up" as const,
    },
    {
      title: "Response Rate",
      value: data.overview.response_rate,
      change: "engagement rate",
      icon: ThumbsUp,
      trend: "up" as const,
    },
  ];

  // Rating distribution chart data
  const ratingChartData = data.rating_distribution
    .sort((a, b) => b.rating - a.rating)
    .map((item) => ({
      rating: `${item.rating} ⭐`,
      count: item.count,
      fill: RATING_COLORS[item.rating] || COLORS[0],
    }));

  // Review trend chart data
  const trendChartData = data.review_trend.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    reviews: item.count,
    rating: parseFloat(item.avg_rating),
  }));

  // Top rated providers data
  const topProvidersData = data.top_rated_providers
    .filter((p) => p.reviews_count > 0)
    .sort((a, b) => b.average_rating - a.average_rating)
    .slice(0, 10)
    .map((provider) => ({
      name: `${provider.first_name} ${provider.last_name}`,
      rating: provider.average_rating,
      reviews: provider.reviews_count,
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
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                    Reviews Analytics
                  </h1>
                  <p className="text-muted-foreground">
                    Track and analyze customer reviews and ratings
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
                  {data.overview.period_reviews} Reviews
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

        {/* Review Trend Chart */}
        <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Review Trend
                </CardTitle>
                <CardDescription>
                  Reviews and average ratings over time
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-green-500 text-green-600">
                {trendChartData.length} Data Points
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {trendChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={trendChartData}>
                  <defs>
                    <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
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
                    domain={[0, 5]}
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
                    dataKey="reviews"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorReviews)"
                    strokeWidth={2}
                    name="Reviews"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="rating"
                    stroke="#059669"
                    fillOpacity={1}
                    fill="url(#colorRating)"
                    strokeWidth={2}
                    name="Avg Rating"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">No trend data available</p>
                  <p className="text-sm text-gray-400">
                    Try selecting a different time period
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Rating Distribution - Bar Chart */}
          <Card className="border-2 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-emerald-600" />
                    Rating Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown by star ratings
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500 text-emerald-600"
                >
                  {ratingChartData.length} Ratings
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {ratingChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={ratingChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="rating"
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
                      dataKey="count"
                      name="Count"
                      radius={[8, 8, 0, 0]}
                    >
                      {ratingChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Star className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No rating data</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Rated Providers - Bar Chart */}
          <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    Top Rated Providers
                  </CardTitle>
                  <CardDescription>
                    Providers with highest ratings
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
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={topProvidersData}
                    layout="vertical"
                    margin={{ left: 80 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorProviderRating"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 5]} stroke="#6b7280" />
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
                      dataKey="rating"
                      fill="url(#colorProviderRating)"
                      name="Rating"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Award className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No provider data</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}