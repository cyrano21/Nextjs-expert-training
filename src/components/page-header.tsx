import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  className 
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8 space-y-4', className)}>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export function PageHeaderHeading({ 
  children, 
  className 
}: { 
  children: React.ReactNode, 
  className?: string 
}) {
  return (
    <h1 className={cn(
      "text-3xl font-bold tracking-tight text-foreground",
      className
    )}>
      {children}
    </h1>
  );
}

export function PageHeaderDescription({ 
  children, 
  className 
}: { 
  children: React.ReactNode, 
  className?: string 
}) {
  return (
    <p className={cn(
      "text-muted-foreground text-lg",
      className
    )}>
      {children}
    </p>
  );
}
