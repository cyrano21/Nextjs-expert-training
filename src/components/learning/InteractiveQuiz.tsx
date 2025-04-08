import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Quiz } from '@/types/curriculum';

interface InteractiveQuizProps {
  quizItems: Quiz[];
  onComplete: (score: number, totalQuestions: number) => void;
  className?: string;
}

export function InteractiveQuiz({ quizItems, onComplete, className }: InteractiveQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizItems[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizItems.length - 1;
  const isCorrect = selectedOption === currentQuestion?.correctOption;

  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(optionIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    setIsAnswerSubmitted(true);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowResults(true);
      onComplete(correctAnswers + (isCorrect ? 1 : 0), quizItems.length);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    }
  };

  if (showResults) {
    const score = correctAnswers;
    const totalQuestions = quizItems.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Résultats du Quiz</CardTitle>
          <CardDescription>
            Vous avez terminé le quiz !
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative mb-4"
            >
              <div className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center">
                <span className="text-3xl font-bold">{percentage}%</span>
              </div>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(var(--primary) ${percentage}%, transparent 0%)`,
                  maskImage: "radial-gradient(transparent 60%, black 61%)",
                  WebkitMaskImage: "radial-gradient(transparent 60%, black 61%)",
                }}
              />
            </motion.div>
            
            <h3 className="text-xl font-bold mt-4">
              {percentage >= 80 ? "Excellent travail !" : 
               percentage >= 60 ? "Bon travail !" : 
               "Continuez à apprendre !"}
            </h3>
            
            <p className="text-muted-foreground mt-2">
              Vous avez obtenu {score} sur {totalQuestions} questions correctes
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => {
            setCurrentQuestionIndex(0);
            setSelectedOption(null);
            setIsAnswerSubmitted(false);
            setCorrectAnswers(0);
            setShowResults(false);
          }}>
            Réessayer
          </Button>
          <Button onClick={() => onComplete(score, totalQuestions)}>
            Continuer
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quiz</CardTitle>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} sur {quizItems.length}
          </span>
        </div>
        <CardDescription>
          Testez vos connaissances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium">
              {currentQuestion.question}
            </h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option, optionIndex) => (
                <motion.div
                  key={optionIndex}
                  whileHover={{ scale: selectedOption === null ? 1.02 : 1 }}
                  whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
                  className={cn(
                    "relative p-4 rounded-lg border cursor-pointer transition-all",
                    selectedOption === optionIndex && !isAnswerSubmitted && "border-primary",
                    isAnswerSubmitted && optionIndex === currentQuestion.correctOption && "border-green-500 bg-green-50 dark:bg-green-900/20",
                    isAnswerSubmitted && selectedOption === optionIndex && optionIndex !== currentQuestion.correctOption && "border-red-500 bg-red-50 dark:bg-red-900/20",
                    isAnswerSubmitted && selectedOption !== optionIndex && "opacity-60"
                  )}
                  onClick={() => handleOptionSelect(optionIndex)}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5",
                      selectedOption === optionIndex && !isAnswerSubmitted && "border-primary bg-primary/10",
                      isAnswerSubmitted && optionIndex === currentQuestion.correctOption && "border-green-500 bg-green-500/10",
                      isAnswerSubmitted && selectedOption === optionIndex && optionIndex !== currentQuestion.correctOption && "border-red-500 bg-red-500/10"
                    )}>
                      {isAnswerSubmitted ? (
                        optionIndex === currentQuestion.correctOption ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : selectedOption === optionIndex ? (
                          <XCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                        )
                      ) : (
                        selectedOption === optionIndex ? (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                        )
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm",
                        isAnswerSubmitted && optionIndex === currentQuestion.correctOption && "font-medium text-green-700 dark:text-green-300",
                        isAnswerSubmitted && selectedOption === optionIndex && optionIndex !== currentQuestion.correctOption && "font-medium text-red-700 dark:text-red-300"
                      )}>
                        {option}
                      </p>
                    </div>
                  </div>
                  
                  {isAnswerSubmitted && optionIndex === currentQuestion.correctOption && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 pt-2 border-t text-sm text-green-600 dark:text-green-400"
                    >
                      <p>Bonne réponse !</p>
                    </motion.div>
                  )}
                  
                  {isAnswerSubmitted && selectedOption === optionIndex && optionIndex !== currentQuestion.correctOption && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 pt-2 border-t text-sm text-red-600 dark:text-red-400"
                    >
                      <p>Pas tout à fait. La bonne réponse est indiquée ci-dessus.</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex-1">
          {isAnswerSubmitted && (
            <div className="flex items-center text-sm">
              {isCorrect ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 mr-2" />
              )}
              <span className={isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                {isCorrect ? "Correct !" : "Incorrect"}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {!isAnswerSubmitted ? (
            <Button 
              onClick={handleSubmitAnswer} 
              disabled={selectedOption === null}
            >
              Vérifier
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {isLastQuestion ? "Voir les résultats" : "Question suivante"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
