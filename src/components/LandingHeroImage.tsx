// src/components/LandingHeroImage.tsx
"use client";

import Image from "next/image";

export default function LandingHeroImage() {
  return (
    <Image
      src="/images/landing-hero.svg"
      alt="Illustration Expert Academy"
      fill
      className="object-contain drop-shadow-lg"
      priority
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
