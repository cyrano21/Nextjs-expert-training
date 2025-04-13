// src/components/mdx/ClientMDXRenderer.tsx
"use client";
import React from "react";
// Utiliser la bonne importation pour MDXRemote
import { MDXRemote } from "next-mdx-remote";
// Importer également le bon type pour le sérialiseur MDX
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

export interface ClientMDXRendererProps {
  // Typer correctement la source comme résultat de sérialisation MDX
  source: MDXRemoteSerializeResult;
  components?: Record<string, React.ComponentType<unknown>>;
}

export function ClientMDXRenderer({
  source,
  components = {},
}: ClientMDXRendererProps) {
  if (!source) {
    console.error("ClientMDXRenderer: source prop is missing or invalid.");
    return (
      <div className="text-destructive">Erreur: Contenu MDX non chargé.</div>
    );
  }

  try {
    // Passer le résultat de sérialisation directement à MDXRemote
    return (
      <div className="prose dark:prose-invert lg:prose-lg max-w-none">
        <MDXRemote {...source} components={components} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering MDX:", error);
    return (
      <div className="text-destructive">Erreur lors du rendu du contenu.</div>
    );
  }
}
