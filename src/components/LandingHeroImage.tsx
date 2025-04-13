// src/components/LandingHeroImage.tsx
"use client";

import React from "react";
import Image from "next/image";

export default function LandingHeroImage() {
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-background/60 mix-blend-multiply z-10" />

      {/* Image avec fallback en cas d'erreur */}
      <div className="relative w-full h-full">
        <Image
          src="/images/hero-image.jpg"
          alt="Expert Academy - Plateforme d'apprentissage en ligne"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            // Fallback en cas d'erreur de chargement de l'image
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='400' y1='50' x2='400' y2='350'%3E%3Cstop offset='0' stop-color='%23555'/%3E%3Cstop offset='1' stop-color='%23333'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='800' height='400'/%3E%3Cg fill-opacity='0.15'%3E%3Cpolygon fill='%23FFF' points='100 57.1 64 93.1 71.5 100.6 100 72.1'/%3E%3C/g%3E%3C/svg%3E";
          }}
        />
      </div>

      {/* Overlay avec texte */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-background/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg text-center max-w-xs">
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
            Apprentissage interactif
          </h3>
          <p className="text-sm text-muted-foreground">
            Des cours créés par des experts pour vous aider à exceller
          </p>
        </div>
      </div>
    </div>
  );
}
