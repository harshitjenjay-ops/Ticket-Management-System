import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorAlert from "@/components/ErrorAlert";
import {
  TicketIcon,
  CircleDot,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";

interface Stats {
  totalTickets: number;
  openTickets: number;
  resolvedByAI: number;
  aiResolutionRate: number;
  avgResolutionTime: number;
}

interface DailyVolume {
  data: { date: string; tickets: number }[];
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return "N/A";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

const chartConfig = {
  tickets: {
    label: "Tickets",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const gradientTints = [
  "from-chart-1/10 to-chart-1/0",
  "from-chart-5/10 to-chart-5/0",
  "from-chart-3/10 to-chart-3/0",
  "from-chart-2/10 to-chart-2/0",
  "from-chart-4/10 to-chart-4/0",
];

const iconColors = [
  "bg-chart-1/15 text-chart-1",
  "bg-chart-5/15 text-chart-5",
  "bg-chart-3/15 text-chart-3",
  "bg-chart-2/15 text-chart-2",
  "bg-chart-4/15 text-chart-4",
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const { data: session } = useSession();

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery<Stats>({
    queryKey: ["ticket-stats"],
    queryFn: async () => {
      const res = await axios.get("/api/tickets/stats");
      return res.data;
    },
  });

  const {
    data: volume,
    isLoading: volumeLoading,
    error: volumeError,
  } = useQuery<DailyVolume>({
    queryKey: ["ticket-daily-volume"],
    queryFn: async () => {
      const res = await axios.get("/api/tickets/stats/daily-volume");
      return res.data;
    },
  });

  if (statsError) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-6">
          Dashboard
        </h1>
        <ErrorAlert
          error={statsError}
          fallback="Failed to load dashboard stats"
        />
      </div>
    );
  }

  const firstName = session?.user?.name?.split(" ")[0] ?? "";

  const cards = [
    { title: "Total Tickets", value: stats?.totalTickets, icon: TicketIcon },
    { title: "Open Tickets", value: stats?.openTickets, icon: CircleDot },
    { title: "Resolved by AI", value: stats?.resolvedByAI, icon: Sparkles },
    {
      title: "AI Resolution Rate",
      value: stats ? `${stats.aiResolutionRate}%` : undefined,
      icon: TrendingUp,
    },
    {
      title: "Avg Resolution Time",
      value: stats ? formatDuration(stats.avgResolutionTime) : undefined,
      icon: Clock,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's what's happening with your support tickets today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <Card
            key={card.title}
            className={`relative overflow-hidden hover-lift bg-gradient-to-br ${gradientTints[i]} animate-in-page`}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[12.5px] font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center ${iconColors[i]}`}
                >
                  <card.icon className="h-[18px] w-[18px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-9 w-20 shimmer" />
              ) : (
                <p className="text-3xl font-bold tracking-tight">
                  {card.value}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="mt-6 animate-in-page" style={{ animationDelay: "0.3s" }}>
        <CardHeader>
          <CardTitle className="text-[15px] font-semibold">Tickets Per Day</CardTitle>
          <CardDescription>Daily volume over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {volumeError ? (
            <ErrorAlert
              error={volumeError}
              fallback="Failed to load chart data"
            />
          ) : volumeLoading ? (
            <Skeleton className="h-[300px] w-full shimmer" />
          ) : (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={volume?.data}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value: string) => {
                    const d = new Date(value + "T00:00:00");
                    return d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  interval="preserveStartEnd"
                  minTickGap={40}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value: string) => {
                        const d = new Date(value + "T00:00:00");
                        return d.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                />
                <Bar
                  dataKey="tickets"
                  fill="var(--color-tickets)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
