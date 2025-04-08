// src/components/ui/Label.tsx
'use client'; // Radix UI components often require client-side JS

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Define variants using CVA (optional, but good for future flexibility)
const labelVariants = cva(
  // Base styles: text size, font weight, prevents text selection, leading controls line height
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
  // You could add variants here if needed, e.g., for required fields:
  // variants: {
  //   required: {
  //     true: "after:ml-0.5 after:text-destructive after:content-['*']",
  //   }
  // }
);

// Define props interface, extending Radix Label props and our CVA variants
export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  // Explicitly add className to satisfy lint rule
  className?: string;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, /* required, */ ...props }, ref) => ( // Destructure variants if you add them
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(/* { required } */), className)} // Apply CVA variants and custom classes
    {...props} // Spread remaining props (like htmlFor)
  />
));
Label.displayName = LabelPrimitive.Root.displayName; // Assign display name

export { Label };