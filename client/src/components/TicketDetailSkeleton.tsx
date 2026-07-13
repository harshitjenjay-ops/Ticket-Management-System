import { Skeleton } from "@/components/ui/skeleton";

export default function TicketDetailSkeleton() {
  return (
    <div className="space-y-5 animate-in-page">
      <Skeleton className="h-8 w-96 shimmer rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-7 w-24 rounded-full shimmer" />
        <Skeleton className="h-7 w-32 rounded-full shimmer" />
        <Skeleton className="h-7 w-32 rounded-full shimmer" />
      </div>
      <Skeleton className="h-40 w-full shimmer rounded-xl" />
    </div>
  );
}
