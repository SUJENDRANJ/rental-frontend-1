import { Skeleton } from "./skeleton"

export const SkeletonNavbar = () => {
  return (
    <div className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  )
}
