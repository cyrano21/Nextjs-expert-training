"use client";

import React from 'react';
import Image from 'next/image';

interface FallbackImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export function FallbackImage({
  src,
  alt,
  fallbackSrc,
  fill = false,
  className = '',
  priority = false,
  width,
  height
}: FallbackImageProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Fallback si l'image n'existe pas
    if (fallbackSrc) {
      e.currentTarget.src = fallbackSrc;
    } else {
      // Fallback par défaut si aucun fallbackSrc n'est fourni
      e.currentTarget.src = `https://placehold.co/600x400/1a1b26/a9b1d6?text=${encodeURIComponent(alt)}`;
    }
    
    // Si l'image est en mode fill, on peut ajuster le style
    if (fill) {
      e.currentTarget.style.objectFit = 'contain';
    }
  };

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      priority={priority}
      onError={handleError}
    />
  );
}
