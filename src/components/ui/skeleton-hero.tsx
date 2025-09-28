export const SkeletonHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content Skeleton */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-12 bg-gray-200 rounded w-40 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center space-y-2">
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="text-center space-y-2">
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="text-center space-y-2">
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Right Content Skeleton */}
          <div className="relative">
            <div className="relative z-10">
              <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
            
            {/* Floating Cards Skeleton */}
            <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};