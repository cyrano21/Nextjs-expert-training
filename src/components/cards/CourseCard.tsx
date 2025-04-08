"use client";

import React from 'react';
import Link from 'next/link';
import { Clock, Users, BookOpen, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/badge';
import { FallbackImage } from '@/components/ui/fallback-image';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  level: string;
  studentsCount: number;
  lessonsCount: number;
  href?: string;
  featured?: boolean;
}

export function CourseCard({
  id,
  title,
  description,
  imageUrl,
  duration,
  level,
  studentsCount,
  lessonsCount,
  href = `/student/course/${id}`,
  featured = false,
}: CourseCardProps) {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-lg hover:-translate-y-1",
        featured && "border-primary/50 bg-primary/5"
      )}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <FallbackImage
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          fallbackSrc={`https://placehold.co/600x400/1a1b26/a9b1d6?text=${encodeURIComponent(title)}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className="absolute left-3 top-3 bg-primary/90 hover:bg-primary">{level}</Badge>
      </div>
      
      <div className="p-5">
        <h3 className="mb-2 text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{studentsCount} étudiants</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{lessonsCount} leçons</span>
          </div>
        </div>
        
        <Link 
          href={href} 
          className="inline-flex items-center text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Voir le cours
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
