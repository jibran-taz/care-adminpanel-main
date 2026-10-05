import { Star, CheckCircle, Clock, XCircle, Flag, MessageSquare, Award, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Cell,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import makeApiRequest from "@/services/axios";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

// Type definitions
interface ReviewStats {
  total_reviews: number;
  approved: number;
  pending: number;
  rejected: number;
  flagged: number;
  average_rating: number;
  rating_distribution: {
    "5_star": number;
    "4_star": number;
    "3_star": number;
    "2_star": number;
    "1_star": number;
  };
  with_response: number;
  without_response: number;
}

interface RecentReview {
  date: string;
  count: number;
}

interface TopReviewedProvider {
  provider_id: number;
  provider_name: string;
  reviews_count: number;
  average_rating: number;
}

interface DashboardResponse {
  success: boolean;
  data: {
    total_reviews: number;
    approved: number;
    pending: number;
    rejected: number;
    flagged: number;
    average_rating: number;
    rating_distribution: {
      "5_star": number;
      "4_star": number;
      "3_star": number;
      "2_star": number;
      "1_star": number;
    };
    with_response: number;
    without_response: number;
    recent_reviews: RecentReview[];
    top_reviewed_providers: TopReviewedProvider[];
  };
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: any;
  trend: "up" | "down";
}

// Star Rating Component
const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
            }`}
        />
      ))}
    </div>
  );
};

// Rating Distribution Bar Component
const RatingBar = ({ stars, count, total }: { stars: number; count: number; total: number }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 w-20">
        <span className="text-sm font-medium">{stars}</span>
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      </div>
      <div className="flex-1">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-yellow-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="w-16 text-right">
        <span className="text-sm font-semibold">{count}</span>
        <span className="text-xs text-gray-500 ml-1">
          ({percentage.toFixed(0)}%)
        </span>
      </div>
    </div>
  );
};

export default function ReviewDashboard() {
  const [statsData, setStatsData] = useState<StatCard[]>([]);
  const [chartData, setChartData] = useState<Array<{ name: string; reviews: number }>>([]);
  const [ratingDistributionData, setRatingDistributionData] = useState<Array<{ name: string; count: number }>>([]);
  const [topProviders, setTopProviders] = useState<TopReviewedProvider[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: DashboardResponse = await makeApiRequest("/admin/reviews/statistics", {
        method: "GET",
      });

      console.log("Review Dashboard API Response:", response);

      if (response?.success && response?.data) {
        const data = response.data;

        // Store full stats
        setReviewStats({
          total_reviews: data.total_reviews,
          approved: data.approved,
          pending: data.pending,
          rejected: data.rejected,
          flagged: data.flagged,
          average_rating: data.average_rating,
          rating_distribution: data.rating_distribution,
          with_response: data.with_response,
          without_response: data.without_response,
        });

        // Transform API data to StatsCard format
        const transformedStats: StatCard[] = [
          {
            title: "Total Reviews",
            value: data.total_reviews.toString(),
            change: "All time reviews",
            icon: Star,
            trend: "up" as const,
          },
          {
            title: "Approved Reviews",
            value: data.approved.toString(),
            change: "Live on platform",
            icon: CheckCircle,
            trend: "up" as const,
          },
          {
            title: "Pending Reviews",
            value: data.pending.toString(),
            change: "Awaiting approval",
            icon: Clock,
            trend: "up" as const,
          },
          {
            title: "Average Rating",
            value: data.average_rating.toFixed(1),
            change: "Overall rating",
            icon: Award,
            trend: "up" as const,
          },
          {
            title: "With Response",
            value: data.with_response.toString(),
            change: "Worker replied",
            icon: MessageSquare,
            trend: "up" as const,
          },
          {
            title: "Without Response",
            value: data.without_response.toString(),
            change: "Need attention",
            icon: MessageSquare,
            trend: "down" as const,
          },
          {
            title: "Flagged Reviews",
            value: data.flagged.toString(),
            change: "Needs moderation",
            icon: Flag,
            trend: "down" as const,
          },
          {
            title: "Rejected Reviews",
            value: data.rejected.toString(),
            change: "Not approved",
            icon: XCircle,
            trend: "down" as const,
          },
        ];

        setStatsData(transformedStats);

        // Transform recent reviews for line chart
        if (response.data.recent_reviews && response.data.recent_reviews.length > 0) {
          const formattedChartData = response.data.recent_reviews.map(review => ({
            name: new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            reviews: review.count
          }));
          setChartData(formattedChartData);
        }

        // Transform rating distribution for bar chart
        const ratingDist = [
          { name: "5★", count: data.rating_distribution["5_star"], stars: 5 },
          { name: "4★", count: data.rating_distribution["4_star"], stars: 4 },
          { name: "3★", count: data.rating_distribution["3_star"], stars: 3 },
          { name: "2★", count: data.rating_distribution["2_star"], stars: 2 },
          { name: "1★", count: data.rating_distribution["1_star"], stars: 1 },
        ];
        setRatingDistributionData(ratingDist);

        // Set top providers
        if (response.data.top_reviewed_providers) {
          setTopProviders(response.data.top_reviewed_providers);
        }
      }
    } catch (error) {
      console.error("Error fetching review dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Colors for rating bars
  const RATING_COLORS = ["#10b981", "#84cc16", "#fbbf24", "#fb923c", "#ef4444"];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-32 bg-gray-200 animate-pulse rounded-lg"
            />
          ))
        ) : statsData.length > 0 ? (
          statsData.map((stat, index) => <StatsCard key={index} {...stat} />)
        ) : (
          <div className="col-span-4 text-center text-gray-500">
            No data available
          </div>
        )}
      </div>

      {/* Average Rating Card - Featured */}
      {!loading && reviewStats && (
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Overall Rating
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold text-gray-900">
                    {reviewStats.average_rating.toFixed(1)}
                  </span>
                  <span className="text-2xl text-gray-600">/5</span>
                </div>
                <div className="mt-3">
                  <StarRating rating={Math.round(reviewStats.average_rating)} size="lg" />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Based on {reviewStats.total_reviews} reviews
                </p>
              </div>

              <div className="w-full md:w-2/3 space-y-3">
                <RatingBar
                  stars={5}
                  count={reviewStats.rating_distribution["5_star"]}
                  total={reviewStats.total_reviews}
                />
                <RatingBar
                  stars={4}
                  count={reviewStats.rating_distribution["4_star"]}
                  total={reviewStats.total_reviews}
                />
                <RatingBar
                  stars={3}
                  count={reviewStats.rating_distribution["3_star"]}
                  total={reviewStats.total_reviews}
                />
                <RatingBar
                  stars={2}
                  count={reviewStats.rating_distribution["2_star"]}
                  total={reviewStats.total_reviews}
                />
                <RatingBar
                  stars={1}
                  count={reviewStats.rating_distribution["1_star"]}
                  total={reviewStats.total_reviews}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Reviews Trend */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between mb-3">
                Recent Reviews{" "}
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="reviews"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rating Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown by star rating</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {ratingDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RATING_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Reviewed Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Reviewed Workers
          </CardTitle>
          <CardDescription>Workers with most customer reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 bg-gray-200 animate-pulse rounded-lg"
                />
              ))
            ) : topProviders.length > 0 ? (
              topProviders.map((provider, index) => (
                <div
                  key={provider.provider_id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                      ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'}
                    `}>
                      {index + 1}
                    </div>

                    {/* Service Provider Info */}
                    <div>
                      <p className="font-semibold text-lg">
                        {provider.provider_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={Math.round(provider.average_rating)} size="sm" />
                        <span className="text-sm font-medium text-gray-700">
                          {provider.average_rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {provider.reviews_count}
                    </p>
                    <p className="text-sm text-gray-500">
                      reviews
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No worker data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Response Rate Card */}
      {!loading && reviewStats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Response Rate</CardTitle>
            <CardDescription>Worker engagement with reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* With Response */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <span className="font-medium">With Response</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {reviewStats.with_response}
                  </span>
                </div>
                <Progress
                  value={(reviewStats.with_response / reviewStats.total_reviews) * 100}
                  className="h-3"
                />
                <p className="text-sm text-gray-500">
                  {((reviewStats.with_response / reviewStats.total_reviews) * 100).toFixed(1)}% response rate
                </p>
              </div>

              {/* Without Response */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                    <span className="font-medium">Without Response</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">
                    {reviewStats.without_response}
                  </span>
                </div>
                <Progress
                  value={(reviewStats.without_response / reviewStats.total_reviews) * 100}
                  className="h-3 [&>div]:bg-orange-600"
                />
                <p className="text-sm text-gray-500">
                  {((reviewStats.without_response / reviewStats.total_reviews) * 100).toFixed(1)}% need attention
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}