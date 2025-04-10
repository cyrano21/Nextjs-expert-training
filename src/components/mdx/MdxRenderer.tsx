"use client";

import React, { useEffect, useState } from "react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

// Pour le moment, n'importons que les composants qui existent réellement
import { Quiz } from "@/components/mdx/Quiz";
import { mdxComponents } from "@/lib/mdx";

interface MdxRendererProps {
  content: string;
  className?: string;
}

// Définir les composants à utiliser dans MDX
const components = {
  // N'incluez que les composants qui existent réellement
  Quiz,
  // Inclure les composants partagés définis dans @/lib/mdx
  ...mdxComponents,
  // Implémentations temporaires pour les composants manquants
  pre: (props: any) => <div {...props} className="not-prose" />,
  code: (props: any) => {
    const isInline = !props.className;
    return isInline ? (
      <code
        {...props}
        className="bg-muted px-1.5 py-0.5 rounded-sm font-mono text-sm"
      />
    ) : (
      <pre
        {...props}
        className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto"
      />
    );
  },
};

export default function MdxRenderer({ content, className }: MdxRendererProps) {
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prepareMdx = async () => {
      try {
        if (!content) {
          throw new Error("Contenu MDX non disponible");
        }

        console.log(
          "Préparation du contenu MDX:",
          content.substring(0, 100) + "..."
        );

        const mdxSource = await serialize(content, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
          parseFrontmatter: true,
        });

        setMdxSource(mdxSource);
        console.log("MDX compilé avec succès");
      } catch (err) {
        console.error("Erreur de rendu MDX:", err);
        setError(
          "Impossible de charger le contenu: " +
            (err instanceof Error ? err.message : String(err))
        );
      }
    };

    prepareMdx();
  }, [content]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
        <h3 className="font-bold mb-2">Erreur de rendu</h3>
        <p>{error}</p>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm">
            Voir le contenu brut
          </summary>
          <pre className="mt-2 p-2 bg-gray-100 overflow-auto text-xs rounded">
            {content
              ? content.slice(0, 500) + (content.length > 500 ? "..." : "")
              : "Contenu vide"}
          </pre>
        </details>
      </div>
    );
  }

  if (!mdxSource) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div
      className={`prose prose-slate dark:prose-invert max-w-none ${
        className || ""
      }`}
    >
      <MDXRemote {...mdxSource} components={components as any} />
    </div>
  );
}
