import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category badge */}
        <Skeleton className="h-5 w-20" />
        
        {/* Title */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        
        {/* Description */}
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        
        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-4" />
            ))}
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
        
        {/* Stock */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        
        {/* Price and button */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
};