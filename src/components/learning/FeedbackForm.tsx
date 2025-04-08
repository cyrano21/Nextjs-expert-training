import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, Star, Send, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FeedbackFormProps {
  lessonId: string;
  lessonTitle: string;
  onSubmit: (feedback: {
    rating: number;
    helpful: boolean;
    comment: string;
    lessonId: string;
  }) => Promise<void>;
  className?: string;
}

export function FeedbackForm({
  lessonId,
  lessonTitle,
  onSubmit,
  className
}: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || helpful === null) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        helpful,
        comment,
        lessonId
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Votre avis nous intéresse</CardTitle>
        <CardDescription>
          Aidez-nous à améliorer nos cours en partageant votre expérience avec &quot;{lessonTitle}&quot;
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Notation par étoiles */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Comment évaluez-vous cette leçon ?</label>
                <div className="flex items-center gap-2">
                  {stars.map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setRating(star)}
                      className="rounded-md p-1 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <Star 
                        className={cn(
                          "h-8 w-8",
                          rating >= star 
                            ? "fill-amber-400 text-amber-400" 
                            : "text-muted-foreground"
                        )} 
                      />
                    </motion.button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {rating > 0 ? `${rating}/5` : "Sélectionnez une note"}
                  </span>
                </div>
              </div>

              {/* Boutons utile/pas utile */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Cette leçon vous a-t-elle été utile ?</label>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setHelpful(true)}
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-4 py-2 transition-colors",
                      helpful === true 
                        ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400" 
                        : "border-input bg-background hover:bg-muted"
                    )}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span>Oui</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setHelpful(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-4 py-2 transition-colors",
                      helpful === false 
                        ? "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400" 
                        : "border-input bg-background hover:bg-muted"
                    )}
                  >
                    <ThumbsDown className="h-5 w-5" />
                    <span>Non</span>
                  </motion.button>
                </div>
              </div>

              {/* Commentaire */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Commentaires ou suggestions (optionnel)</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez vos pensées, suggestions ou difficultés rencontrées..."
                  className="min-h-[100px] resize-y"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-medium">Merci pour votre feedback !</h3>
              <p className="mt-2 text-muted-foreground">
                Votre avis est précieux et nous aide à améliorer nos cours.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      
      {!isSubmitted && (
        <CardFooter className="flex justify-end border-t bg-muted/10 px-6 py-4">
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || helpful === null || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Send className="h-4 w-4" />
                </motion.div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Envoyer mon avis
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
