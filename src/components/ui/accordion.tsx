import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const Accordion = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement> & {
    type?: 'single' | 'multiple';
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    disabled?: boolean;
    dir?: 'ltr' | 'rtl';
    orientation?: 'horizontal' | 'vertical';
    children?: React.ReactNode;
  }
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn('accordion', className)} 
    {...props} 
  />
));
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: string; disabled?: boolean }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-b', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline',
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
  </button>
));
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </div>
));
AccordionContent.displayName = 'AccordionContent';

export { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
};
