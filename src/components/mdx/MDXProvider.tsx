import React from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import * as MdxComponents from "@/components/mdx";

interface MDXProviderProps {
  source: string;
}

export async function MDXProvider({ source }: MDXProviderProps) {
  try {
    // Utiliser compileMDX pour compiler le contenu MDX
    const { content } = await compileMDX({
      source,
      components: MdxComponents,
      options: {
        parseFrontmatter: true,
      },
    });

    return (
      <article className="prose prose-gray dark:prose-invert max-w-none">
        {content}
      </article>
    );
  } catch (error) {
    console.error("Error rendering MDX: ", error);
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
        <h3 className="font-bold">Erreur de rendu MDX</h3>
        <p>Le contenu MDX n'a pas pu être rendu correctement.</p>
      </div>
    );
  }
}
