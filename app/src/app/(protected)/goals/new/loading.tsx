import { Skeleton } from "@/components/ui/skeleton";

export default function NewGoalLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-72 max-w-full" />
      </div>
      <Skeleton className="h-[520px]" />
    </div>
  );
}
