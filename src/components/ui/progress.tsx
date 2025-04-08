// src/components/ui/Progress.tsx
'use client'; // Needs client for Radix UI

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils'; // Ensure this path is correct

// Define props, allowing custom classes for root and indicator
interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, ...props }, ref) => (
  // Progress Root: The background track of the progress bar
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      // Base styles: relative positioning, height, width, overflow hidden, rounding, background color
      'relative h-2 w-full overflow-hidden rounded-full bg-secondary', // Adjusted height for subtlety
      className // Merge custom classes
    )}
    {...props} // Spread remaining props
  >
    {/* Progress Indicator: The filled portion */}
    <ProgressPrimitive.Indicator
      className={cn(
        // Base styles: height, width, flex, background color, transition for smooth value changes
        'h-full w-full flex-1 bg-primary transition-all duration-300 ease-out',
        indicatorClassName // Merge custom indicator classes
      )}
      // Style transform to visually represent the progress value
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName; // Set display name

export { Progress }; // Export the component