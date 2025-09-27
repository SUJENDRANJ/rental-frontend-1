import { Skeleton } from './skeleton';

export const SkeletonHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 lg:py-24">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-12 lg:h-16 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-40" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <Skeleton className="aspect-square rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};