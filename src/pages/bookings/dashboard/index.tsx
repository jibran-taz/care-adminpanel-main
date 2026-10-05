import { User, Activity, CalendarDays, FilePlus, LucideIcon, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
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
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import makeApiRequest from "@/services/axios";
import { apiUrl } from "@/services/api-end-point";
import { useEffect, useState } from "react";
import UsageCard from "@/pages/dashboard/UsageCard";
import SocketStatusCard from "@/pages/dashboard/SocketStatusCard";

// Type definition for API response
interface BookingStats {
  total_bookings: number;
  pending: number;
  accepted: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  rejected: number;
  total_revenue: string;
  pending_payments: number;
  paid_bookings: number;
}

interface RecentBooking {
  date: string;
  count: number;
}

interface TopProvider {
  provider_id: number;
  bookings_count: number;
  total_earned: string;
  provider: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface DashboardResponse {
  success: boolean;
  data: {
    stats: BookingStats;
    recent_bookings: RecentBooking[];
    top_providers: TopProvider[];
  };
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down";
}

export default function DashboardBooking() {
  const [statsData, setStatsData] = useState<StatCard[]>([]);
  const [chartData, setChartData] = useState<Array<{ name: string; bookings: number }>>([]);
  const [topProviders, setTopProviders] = useState<TopProvider[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: DashboardResponse = await makeApiRequest("/admin/bookings/statistics", {
        method: "GET",
      });

      console.log("Dashboard API Response:", response);

      if (response?.success && response?.data?.stats) {
        const stats = response.data.stats;

        // Transform API data to StatsCard format
        const transformedStats: StatCard[] = [
          {
            title: "Total Bookings",
            value: stats.total_bookings.toString(),
            change: "All time bookings",
            icon: CalendarDays,
            trend: "up" as const,
          },
          {
            title: "Pending Bookings",
            value: stats.pending.toString(),
            change: "Awaiting confirmation",
            icon: Clock,
            trend: "up" as const,
          },
          {
            title: "In Progress",
            value: stats.in_progress.toString(),
            change: "Active bookings",
            icon: Activity,
            trend: "up" as const,
          },
          {
            title: "Completed",
            value: stats.completed.toString(),
            change: "Successfully finished",
            icon: CheckCircle,
            trend: "up" as const,
          },
          {
            title: "Total Revenue",
            value: `$${stats.total_revenue}`,
            change: `${stats.paid_bookings} paid bookings`,
            icon: DollarSign,
            trend: "up" as const,
          },
          {
            title: "Pending Payments",
            value: stats.pending_payments.toString(),
            change: "Awaiting payment",
            icon: Clock,
            trend: "down" as const,
          },
          {
            title: "Cancelled",
            value: stats.cancelled.toString(),
            change: "Cancelled bookings",
            icon: XCircle,
            trend: "down" as const,
          },
          {
            title: "Accepted",
            value: stats.accepted.toString(),
            change: "Confirmed bookings",
            icon: CheckCircle,
            trend: "up" as const,
          },
        ];

        setStatsData(transformedStats);

        // Transform recent bookings for chart
        if (response.data.recent_bookings && response.data.recent_bookings.length > 0) {
          const formattedChartData = response.data.recent_bookings.map(booking => ({
            name: new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            bookings: booking.count
          }));
          setChartData(formattedChartData);
        }

        // Set top providers
        if (response.data.top_providers) {
          setTopProviders(response.data.top_providers);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between mb-3">
                Recent Bookings{" "}
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
                  dataKey="bookings"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
            <CardDescription>Daily booking statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Top Workers</CardTitle>
          <CardDescription>Workers with most bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProviders.length > 0 ? (
              topProviders.map((provider) => (
                <div
                  key={provider.provider_id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {provider.provider.first_name} {provider.provider.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {provider.provider_id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ${provider.total_earned}
                    </p>
                    <p className="text-sm text-gray-500">
                      {provider.bookings_count} bookings
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

      {/* Server Health Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Server Health Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-6 rounded-xl shadow-md pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UsageCard label="CPU Usage" value={60} />
              <UsageCard label="RAM Usage" value={45} />
              <UsageCard label="Disk Usage" value={75} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <SocketStatusCard status="connected" socketCount={132} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}