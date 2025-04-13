// src/components/navigation/CompleteLessonButton.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Circle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Utiliser le hook de toast (sonner)
import Confetti from "react-confetti"; // Package installé
import { markLessonCompleteAction } from "@/actions/progress"; // Nom corrigé de la fonction
import { cn } from "@/lib/utils";

interface CompleteLessonButtonProps {
  lessonId: string; // "moduleId/lessonId"
  isCompleted: boolean; // Statut initial passé depuis le serveur
  nextLessonUrl: string | null;
}

export function CompleteLessonButton({
  lessonId,
  isCompleted: initialIsCompleted,
  nextLessonUrl,
}: CompleteLessonButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isCompletedOptimistic, setIsCompletedOptimistic] =
    useState(initialIsCompleted);
  const [showConfetti, setShowConfetti] = useState(false);
  // Hook useTransition pour gérer l'état pendant l'appel de la Server Action
  const [isPending, startTransition] = useTransition();

  const handleCompleteOrNavigate = () => {
    // Si déjà complété (ou marqué comme tel), et qu'il y a une leçon suivante, naviguer
    if (isCompletedOptimistic && nextLessonUrl) {
      router.push(nextLessonUrl);
      return;
    }

    // Si déjà complété et pas de leçon suivante, ne rien faire (ou autre logique)
    if (isCompletedOptimistic) {
      toast({
        content: "Notification",
        description: "Leçon déjà terminée !",
      });
      return;
    }

    // Marquer comme complété via Server Action
    startTransition(async () => {
      // Mise à jour optimiste de l'UI
      setIsCompletedOptimistic(true);

      const result = await markLessonCompleteAction({
        userId: "user-id", // À remplacer par l'ID réel de l'utilisateur
        moduleId: lessonId.split("/")[0],
        lessonId: lessonId,
        completed: true,
      });

      if (result.success) {
        // Afficher feedback positif
        toast({
          content: "Succès",
          description: "Leçon terminée ! Excellent travail !",
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000); // Confettis pendant 4s

        // Si la leçon n'était PAS déjà complétée côté serveur et qu'il y a une suite
        if (nextLessonUrl) {
          // Optionnel : Naviguer automatiquement après un court délai ?
          // setTimeout(() => router.push(nextLessonUrl), 1500);
        }

        // La revalidation de chemin dans l'action devrait rafraîchir les données
        // Mais on garde l'état optimiste pour la fluidité.
      } else {
        // Annuler la mise à jour optimiste en cas d'erreur
        setIsCompletedOptimistic(initialIsCompleted); // Revenir à l'état initial
        toast({
          content: "Erreur",
          description: "Impossible de marquer la leçon comme terminée.",
          type: "error",
        });
      }
    });
  };

  // Déterminer le texte et l'icône du bouton
  let buttonText = "Marquer comme terminé";
  let ButtonIcon = Circle;
  let buttonVariant: "default" | "secondary" = "default"; // Correction du type
  let showNextArrow = false;

  if (isCompletedOptimistic) {
    buttonText = "Terminé";
    ButtonIcon = CheckCircle;
    buttonVariant = "secondary"; // Utiliser un variant valide (secondary au lieu de success)
    if (nextLessonUrl) {
      buttonText = "Leçon Suivante";
      showNextArrow = true;
    }
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={300}
          width={typeof window !== "undefined" ? window.innerWidth : 0}
          height={typeof window !== "undefined" ? window.innerHeight : 0}
        />
      )}
      <Button
        onClick={handleCompleteOrNavigate}
        disabled={isPending} // Désactiver pendant l'appel serveur
        variant={buttonVariant}
        className={cn(
          "min-w-[180px]",
          !isCompletedOptimistic && "animate-pulse"
        )} // Pulse si pas terminé
        size="lg" // Rendre le bouton principal plus grand
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          !showNextArrow && <ButtonIcon className="mr-2 h-4 w-4" />
        )}
        {buttonText}
        {showNextArrow && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </>
  );
}
