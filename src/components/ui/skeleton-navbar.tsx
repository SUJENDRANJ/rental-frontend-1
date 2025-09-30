import { Skeleton } from './skeleton';

export const SkeletonNavbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="md:hidden">
            <Skeleton className="h-8 w-8" />
          </div>
          
          <Skeleton className="h-6 w-32" />
          
          <nav className="hidden md:flex items-center space-x-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </nav>
          
          <div className="flex-1 max-w-md mx-4">
            <Skeleton className="h-10 w-full" />
          </div>
          
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </header>
  );
};