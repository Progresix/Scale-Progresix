import { PageHeaderSkeleton, TableSkeleton } from "@/components/shared/skeletons";

export default function TransactionsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-6 w-16 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-card border border-border rounded-xl">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-[200px] bg-muted animate-pulse rounded" />
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <TableSkeleton rows={5} columns={5} />
        </div>
      </div>
    </div>
  );
}
