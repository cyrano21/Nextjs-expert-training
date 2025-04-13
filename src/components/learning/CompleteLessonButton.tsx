// src/components/learning/CompleteLessonButton.tsx
"use client"; // !! ESSENTIEL : Ce composant gère l'état et une action !!

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@/components/ui/button"; // Importer ButtonProps depuis ui/button
import { ArrowRight, CheckCircle, Circle, Loader2 } from "lucide-react";
import { markLessonCompleteAction, type LessonProgressData } from "@/actions/progress"; // Import du type exact
import { useToast } from "@/components/ui/use-toast"; // !! Vérifiez ce chemin !!
import { cn } from "@/lib/utils"; // Ajustez chemin

// Hérite des props de Button, mais surcharge onClick
interface CompleteLessonButtonProps extends Omit<ButtonProps, "onClick"> {
  lessonId: string; // ID unique (ex: "module-slug/lesson-slug")
  isCompleted: boolean; // Statut initial
  nextLessonUrl: string | null;
}

// Type de retour attendu de la Server Action
interface MarkLessonCompleteResult {
  success: boolean;
  message: string;
  alreadyCompleted?: boolean;
  error?: string;
}

export function CompleteLessonButton({
  lessonId,
  isCompleted: initialIsCompleted,
  nextLessonUrl,
  className,
  children, // Accepter les enfants pour plus de flexibilité si nécessaire
  ...buttonProps // Récupérer les autres props (size, etc.)
}: CompleteLessonButtonProps) {
  // État Optimiste : Suppose que l'action réussira
  const [isCompletedOptimistic, setIsCompletedOptimistic] =
    useState(initialIsCompleted);
  const router = useRouter();
  const { toast } = useToast(); // Hook pour afficher les notifications
  const [isPending, startTransition] = useTransition(); // Gère l'état de chargement de la Server Action

  // Mettre à jour l'état optimiste si la prop initiale change (ex: après navigation retour)
  useEffect(() => {
    setIsCompletedOptimistic(initialIsCompleted);
  }, [initialIsCompleted]);

  const handleCompleteOrNavigate = () => {
    // Si déjà complété et qu'il y a une URL suivante, naviguer
    if (isCompletedOptimistic && nextLessonUrl) {
      // Peut-être ajouter un léger délai avant de naviguer ?
      router.push(nextLessonUrl);
      return;
    }

    // Si déjà complété sans URL suivante, ou si l'action est déjà en cours, ne rien faire
    if ((isCompletedOptimistic && !nextLessonUrl) || isPending) {
      return;
    }

    // Lancer la Server Action pour marquer comme terminé
    startTransition(async () => {
      try {
        // Extraire moduleId et lessonId du format "module-slug/lesson-slug"
        const [moduleId, lessonSlug] = lessonId.includes("/") 
          ? lessonId.split("/") 
          : ["default-module", lessonId];
        
        // Utilisateur hardcodé pour le moment - dans une application réelle,
        // vous récupéreriez l'ID utilisateur de la session
        // Nous devons le hardcoder car TypeScript a besoin qu'il soit non-undefined
        const userId = "current-user-id"; // À remplacer par un vrai ID utilisateur
        
        const params: LessonProgressData = {
          moduleId,
          lessonId: lessonSlug,
          completed: true,
          userId // Obligatoire d'après le schéma
        };
        
        const result = await markLessonCompleteAction(params) as MarkLessonCompleteResult;

        if (result.success) {
          // Mettre à jour l'état local pour refléter le succès
          setIsCompletedOptimistic(true);

          // Afficher le feedback seulement si ce n'était pas déjà marqué comme complété
          // avant le clic (basé sur l'état initial passé en prop)
          if (!initialIsCompleted) {
            toast({
              content: "🎉 Leçon Terminée !",
              description: "Excellent travail !"
            });
          }

          // Naviguer vers la prochaine leçon si disponible
          if (nextLessonUrl) {
            // Naviguer IMMÉDIATEMENT après la confirmation du succès de l'action
            router.push(nextLessonUrl);
          } else if (result.alreadyCompleted && !nextLessonUrl) {
            // Si on clique sur 'Terminé' et qu'il n'y a pas de suite
            toast({
              content: "Information",
              description: "Vous avez déjà validé cette leçon."
            });
          }
        } else {
          // Si l'action serveur retourne une erreur
          toast({
            content: "Erreur",
            description: result.error || "Impossible de marquer la leçon comme terminée."
          });
        }
      } catch (error) {
        // Si l'appel à l'action lui-même échoue (erreur réseau, etc.)
        console.error("Failed to call complete lesson action:", error);
        toast({
          content: "Erreur Réseau",
          description: "Impossible de contacter le serveur."
        });
      }
      // isPending redevient false automatiquement à la fin de la transition
    });
  };

  // Déterminer l'apparence du bouton
  const isDisabled = isPending || (isCompletedOptimistic && !nextLessonUrl);
  let buttonText = "Marquer comme Terminé";
  let Icon = Circle;
  let variant: ButtonProps["variant"] = "default";

  if (isPending) {
    buttonText = "Chargement...";
    Icon = Loader2; // Remplacée par le spinner dans le JSX
  } else if (isCompletedOptimistic) {
    buttonText = nextLessonUrl ? "Leçon Suivante" : "Terminé !";
    Icon = nextLessonUrl ? ArrowRight : CheckCircle;
    variant = "secondary"; // Utilisé au lieu de "success" qui n'existe pas
  }

  return (
    <>
      <Button
        onClick={handleCompleteOrNavigate}
        disabled={isDisabled}
        variant={variant}
        size="sm" // Garder cohérent avec LessonNav
        className={cn(
          "min-w-[160px] transition-all duration-150 ease-in-out", // Transition pour les changements d'état
          className
        )}
        {...buttonProps}
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icon className="mr-2 h-4 w-4" />
        )}
        {children || buttonText}{" "}
        {/* Permet de surcharger le texte si besoin via children */}
      </Button>
    </>
  );
}
