'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-1">
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((card) => (
          <Card key={card} className="animate-pulse">
            <CardHeader>
              <CardTitle className="sr-only">Loading Card</CardTitle>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-6 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
