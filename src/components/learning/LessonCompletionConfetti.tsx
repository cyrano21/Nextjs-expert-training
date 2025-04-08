import React, { useState } from 'react';
import Confetti from 'react-dom-confetti';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';

interface LessonCompletionConfettiProps {
  onContinue: () => void;
  lessonTitle: string;
  points?: number;
}

export function LessonCompletionConfetti({
  onContinue,
  lessonTitle,
  points = 50,
}: LessonCompletionConfettiProps) {
  const [isConfettiActive, setIsConfettiActive] = useState(true);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const confettiConfig = {
    spread: isDesktop ? 360 : 180,
    startVelocity: isDesktop ? 40 : 30,
    elementCount: isDesktop ? 70 : 50,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: '10px',
    height: '10px',
    perspective: '500px',
    colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-6 text-center fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <Confetti active={isConfettiActive} config={confettiConfig} />
      
      <motion.h2 
        className="text-2xl font-bold mb-4 text-green-600"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Lesson Completed: {lessonTitle}
      </motion.h2>
      
      <motion.p 
        className="text-lg mb-6 text-gray-700"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Congratulations! You earned {points} points
      </motion.p>
      
      <Button 
        onClick={() => {
          setIsConfettiActive(false);
          onContinue();
        }}
        className="mt-4"
      >
        Continue Learning
      </Button>
    </motion.div>
  );
}
