"use client";

import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { cn } from '@/utils/cn';

interface FallbackImgProps {
  src: string | StaticImageData;
  alt: string;
  fallbackSrc?: string | StaticImageData;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
}

export function FallbackImg({
  src,
  alt,
  fallbackSrc = '/placeholder.svg', // Default placeholder
  className,
  width,
  height,
  fill = false,
  priority = false,
  ...props
}: FallbackImgProps) {
  const [currentSrc, setCurrentSrc] = React.useState<string | StaticImageData>(src);

  const handleError = () => {
    setCurrentSrc(fallbackSrc);
  };

  return (
    <div className={cn('relative', className)}>
      <Image
        src={currentSrc}
        alt={alt}
        onError={handleError}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={cn('object-cover', className)}
        priority={priority}
        {...props}
      />
    </div>
  );
}
