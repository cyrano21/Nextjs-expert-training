// src/components/ui/Input.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

// Define the props interface extending standard HTML input attributes
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  _placeholder?: never;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles: flex display, height, width, rounded corners, border, background
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          // Ring offset for focus state (works with focus-visible styles)
          'ring-offset-background',
          // File input specific styles (transparent background, font)
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          // Placeholder text color
          'placeholder:text-muted-foreground',
          // Focus visible styles: remove default outline, apply custom ring
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          // Disabled state styles: not-allowed cursor, reduced opacity
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Allow merging custom classes
          className
        )}
        ref={ref} // Forward the ref to the input element
        {...props} // Spread the rest of the props (value, onChange, placeholder, etc.)
      />
    );
  }
);
Input.displayName = 'Input'; // Assign display name for React DevTools

export { Input };