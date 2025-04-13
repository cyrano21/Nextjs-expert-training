// src/components/mdx/ServerMDXRenderer.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { compile, run } from "@mdx-js/mdx";
import matter from "gray-matter";
import NextImage from "next/image"; // Renommer pour éviter les conflits

// Commented out unused imports
// import Image from "next/image";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Alert } from "@/components/ui/alert";

// --- Import des Composants MDX ---
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { AchievementUnlocked } from "@/components/mdx/AchievementUnlocked";
import { BrowserInteractionGuide } from "@/components/mdx/BrowserInteractionGuide";
import { FileTree } from "@/components/mdx/FileTree";
import { InfoTip } from "@/components/mdx/InfoTip";
import { ProjectStep } from "@/components/mdx/ProjectStep";
import { Quiz } from "@/components/mdx/Quiz";
import { TerminalOutput } from "@/components/mdx/TerminalOutput";
// Skeleton import removed as it's not used

// --- Interface Props ---
export interface ServerMDXRendererProps {
  rawSource: string;
  scope?: Record<string, unknown>;
  mdxComponents?: Record<string, unknown>;
}

// --- Types pour le frontmatter ---
interface MDXFrontmatter {
  title?: string;
  description?: string;
  tags?: string[];
  estimatedTimeMinutes?: number;
  objectives?: string[];
  prev?: string;
  next?: string;
  [key: string]: unknown;
}

// --- Interface pour les props des composants MDX (Optionnel mais bon pour la clarté) ---
interface MDXComponentProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

// --- Composant Renderer ---
export default function ServerMDXRenderer({
  rawSource,
  scope = {},
  mdxComponents = {},
}: ServerMDXRendererProps) {
  const [mdxResult, setMdxResult] = useState<{
    content: React.ReactNode | null;
    frontmatter: MDXFrontmatter;
    error: string | null;
    isLoading: boolean;
  }>({
    content: null,
    frontmatter: {},
    error: null,
    isLoading: true,
  });

  // --- Définir les composants MDX disponibles ---
  // Les composants importés sont constants et ne changent jamais, donc un tableau de dépendances vide est approprié ici
  const defaultMdxComponents = useCallback(() => ({
    CodeBlock,
    AchievementUnlocked,
    BrowserInteractionGuide,
    FileTree,
    InfoTip,
    ProjectStep,
    Quiz,
    TerminalOutput,
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6"
        {...props}
      />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 my-5"
        {...props}
      />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className="scroll-m-20 text-2xl font-semibold tracking-tight my-4"
        {...props}
      />
    ),
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
    ),
    a: (props: React.HTMLAttributes<HTMLAnchorElement>) => (
      <a
        className="font-medium text-primary underline underline-offset-4"
        {...props}
      />
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => {
      // Assurer que les enfants ont des clés uniques
      const children = React.Children.map(props.children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { key: `ul-item-${index}` });
        }
        return child;
      });
      return (
        <ul
          className="my-6 ml-6 list-disc [&>li]:mt-2"
          {...props}
        >
          {children}
        </ul>
      );
    },
    ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => {
      // Assurer que les enfants ont des clés uniques
      const children = React.Children.map(props.children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { key: `ol-item-${index}` });
        }
        return child;
      });
      return (
        <ol
          className="my-6 ml-6 list-decimal [&>li]:mt-2"
          {...props}
        >
          {children}
        </ol>
      );
    },
    li: (props: React.HTMLAttributes<HTMLLIElement>) => <li {...props} />,
    blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote className="mt-6 border-l-2 pl-6 italic" {...props} />
    ),
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      // Fallback pour les images sans source
      if (!props.src) {
        return (
          <NextImage 
            src="/placeholder-image.png" 
            alt={props.alt || "Image sans description"} 
            width={800}
            height={450}
            className={`rounded-md border my-6 ${props.className || ''}`}
            layout="responsive"
            loading="lazy"
          />
        );
      }

      return (
        <NextImage
          className="rounded-md border my-6"
          src={props.src}
          alt={props.alt || "Image du contenu"}
          width={
            props.width 
              ? (typeof props.width === "string" 
                  ? parseInt(props.width, 10) 
                  : props.width)
              : 800
          }
          height={
            props.height
              ? (typeof props.height === "string"
                  ? parseInt(props.height, 10)
                  : props.height)
              : 450
          }
          layout="responsive"
          loading="lazy"
        />
      );
    },
    hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
      <hr className="my-4 md:my-8" {...props} />
    ),
  }), []);

  // --- Compiler et exécuter le MDX ---
  const processMdx = useCallback(async () => {
    if (
      !rawSource ||
      typeof rawSource !== "string" ||
      rawSource.trim().length === 0
    ) {
      setMdxResult((prev) => ({
        ...prev,
        error: "Aucune source MDX valide fournie.",
        isLoading: false,
      }));
      return;
    }

    try {
      setMdxResult((prev) => ({ ...prev, isLoading: true, error: null }));
      const { content: mdxContentOnly, data: frontmatterData } =
        matter(rawSource);
      
      if (!mdxContentOnly) {
        throw new Error("Contenu MDX vide.");
      }

      const compiledMdx = await compile(mdxContentOnly, {
        outputFormat: "function-body",
        development: process.env.NODE_ENV === "production" ? false : true,
      });

      const evalScope = {
        Fragment: Fragment,
        jsx: jsx,
        jsxs: jsxs,
        jsxDEV: jsx,
        ...scope,
      };

      const runResult = await run(compiledMdx, evalScope);
      const MDXContentComponent = (
        runResult as { default: React.ComponentType<MDXComponentProps> }
      ).default;

      if (typeof MDXContentComponent !== "function") {
        throw new Error(
          "Compilation MDX invalide: le résultat n'est pas une fonction composant."
        );
      }

      // Fusionner les composants par défaut avec les composants personnalisés
      const mergedComponents = { 
        ...defaultMdxComponents(), 
        ...mdxComponents 
      };

      setMdxResult({
        content: <MDXContentComponent components={mergedComponents} />,
        frontmatter: frontmatterData as MDXFrontmatter,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMdxResult((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, [rawSource, scope, mdxComponents, defaultMdxComponents]);

  useEffect(() => {
    processMdx();
  }, [processMdx]);

  // --- Rendu ---
  if (mdxResult.isLoading) {
    /* ... Skeleton ... */
  }
  if (mdxResult.error) {
    /* ... Error Alert ... */
  }
  return (
    <div className="prose dark:prose-invert lg:prose-lg max-w-none">
      {mdxResult.content}
    </div>
  );
}
