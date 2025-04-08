// src/components/ui/Skeleton.tsx
import { cn } from '@/lib/utils'; // Ensure this path is correct

// Skeleton component definition
function Skeleton({
  className,
  ...props // Accept standard div attributes
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      // Apply classes using cn: pulse animation, rounding, background color (muted), merge custom classes
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props} // Spread remaining props
    />
  );
}
Skeleton.displayName = 'Skeleton'; // Set display name

export { Skeleton }; // Export the component