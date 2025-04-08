// src/components/ui/Badge.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils'; // Ensure this path is correct

// Define Badge variants using CVA
const badgeVariants = cva(
  // Base styles: inline flex, alignment, rounding (full), border, padding, text size/weight, transitions, focus styles
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        // Define styles for each variant (background, text, border, hover)
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        success: 'border-transparent bg-success text-success-foreground hover:bg-success/80',
        warning: 'border-transparent bg-warning text-warning-foreground hover:bg-warning/80',
        outline: 'text-foreground', // Outline variant just uses border and foreground text color
      },
    },
    defaultVariants: { // Set the default variant if none is specified
      variant: 'default',
    },
  }
);

// Define Badge props interface, including CVA variants
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, // Standard div attributes
    VariantProps<typeof badgeVariants> {} // CVA variants

// Badge component definition
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    // Render a div applying the CVA variant classes and any custom classes
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
Badge.displayName = 'Badge'; // Set display name

export { Badge, badgeVariants }; // Export component and variants object