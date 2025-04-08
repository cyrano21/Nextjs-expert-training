"use client";

import React, { useState } from 'react';
import { FallbackImage } from '@/components/ui/fallback-image';

interface MentorAvatarProps {
  name: string;
  role: string;
  avatarUrl: string;
  status?: 'online' | 'offline' | 'busy';
  onChat?: () => void;
}

export function MentorAvatar({ 
  name, 
  role, 
  avatarUrl, 
  status = 'online',
  onChat 
}: MentorAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-amber-500'
  };

  return (
    <div 
      className="relative flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className={`relative h-16 w-16 overflow-hidden rounded-full border-2 border-background ${isHovered ? 'ring-2 ring-primary' : ''}`}>
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <FallbackImage
              src={avatarUrl}
              alt={`${name}, ${role}`}
              fill
              className="object-cover"
              fallbackSrc={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}`}
            />
          </div>
        </div>
        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${statusColors[status]} ring-2 ring-background`}></div>
      </div>
      
      <div className="mt-2 text-center">
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
      
      {isHovered && onChat && (
        <button 
          onClick={onChat}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground rounded-md px-3 py-1 text-xs font-medium shadow-sm hover:bg-primary/90 transition-colors"
        >
          Discuter
        </button>
      )}
    </div>
  );
}
