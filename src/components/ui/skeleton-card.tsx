import { Skeleton } from "./skeleton"
import { Card, CardContent, CardFooter } from "./card"

export const SkeletonCard = () => {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-t-lg" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}
