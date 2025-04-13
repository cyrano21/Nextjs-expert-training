"use client";

import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AppError, ErrorType } from "@/lib/error/errorHandler";
import {
  AlertCircle,
  Wifi,
  Lock,
  Server,
  FileQuestion,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface ErrorMessageProps {
  error: unknown;
  retry?: () => void;
  className?: string;
}

export function ErrorMessage({ error, retry, className }: ErrorMessageProps) {
  // Convertir l'erreur en AppError si ce n'est pas déjà le cas
  const appError: AppError =
    typeof error === "object" && error !== null && "type" in error
      ? (error as AppError)
      : {
          type: ErrorType.UNKNOWN,
          message: String(error) || "Une erreur inattendue s'est produite.",
        };

  const canRetry =
    retry && (!("retry" in appError) || appError.retry !== false);

  const getIcon = () => {
    switch (appError.type) {
      case ErrorType.NETWORK:
        return <Wifi className="h-5 w-5" />;
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        return <Lock className="h-5 w-5" />;
      case ErrorType.SERVER:
        return <Server className="h-5 w-5" />;
      case ErrorType.NOT_FOUND:
        return <FileQuestion className="h-5 w-5" />;
      case ErrorType.VALIDATION:
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getVariant = () => {
    switch (appError.type) {
      case ErrorType.NETWORK:
        return "warning";
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        return "default";
      case ErrorType.SERVER:
        return "destructive";
      case ErrorType.VALIDATION:
        return "warning";
      default:
        return "destructive";
    }
  };

  const getTitle = () => {
    switch (appError.type) {
      case ErrorType.NETWORK:
        return "Problème de connexion";
      case ErrorType.AUTHENTICATION:
        return "Authentification requise";
      case ErrorType.AUTHORIZATION:
        return "Accès refusé";
      case ErrorType.SERVER:
        return "Erreur serveur";
      case ErrorType.NOT_FOUND:
        return "Ressource non trouvée";
      case ErrorType.VALIDATION:
        return "Données invalides";
      default:
        return "Erreur";
    }
  };

  // Sécuriser le rendu conditionnel des détails techniques
  let technicalDetails: React.ReactNode = null;
  if (
    process.env.NODE_ENV !== "production" &&
    "details" in appError &&
    appError.details
  ) {
    const detailsContent =
      typeof appError.details === "string"
        ? appError.details
        : JSON.stringify(appError.details, null, 2);

    technicalDetails = (
      <details className="mt-2 text-xs text-muted-foreground">
        <summary className="cursor-pointer">Détails techniques</summary>
        <pre className="mt-2 whitespace-pre-wrap bg-muted p-2 rounded">
          {detailsContent}
        </pre>
      </details>
    );
  }

  return (
    <Alert variant={getVariant()} className={className}>
      <div className="flex items-start">
        {getIcon()}
        <div className="ml-4 w-full">
          <AlertTitle>{getTitle()}</AlertTitle>
          <AlertDescription>{String(appError.message)}</AlertDescription>

          {canRetry && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 flex items-center"
              onClick={retry}
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Réessayer
            </Button>
          )}

          {technicalDetails}
        </div>
      </div>
    </Alert>
  );
}
