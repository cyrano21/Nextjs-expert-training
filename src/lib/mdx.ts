import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import React from 'react';

/**
 * Fonction pour compiler le contenu MDX côté serveur
 */
export async function getCompiledMdx(moduleId: string, lessonId: string) {
  try {
    // Simuler la récupération du contenu MDX
    // Dans une implémentation réelle, récupérer depuis fichier ou API
    const mockMdxContent = `
# Leçon sur ${moduleId}: ${lessonId}

Ceci est un exemple de contenu MDX pour tester le rendu.

## Points importants

- Premier point
- Deuxième point
- Troisième point

\`\`\`js
// Exemple de code
function hello() {
  return "Hello, world!";
}
\`\`\`
    `;

    // Compiler le MDX
    const mdxSource = await serialize(mockMdxContent, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
      parseFrontmatter: true,
    });

    return {
      compiledSource: mdxSource.compiledSource,
      frontmatter: mdxSource.frontmatter || {},
      scope: mdxSource.scope || {}
    };
  } catch (error) {
    console.error(`Erreur lors de la compilation MDX pour ${moduleId}/${lessonId}:`, error);
    return null;
  }
}

// Composants MDX partagés
export const mdxComponents = {
  // Définir ici vos composants personnalisés pour MDX
  h1: (props: any) => {
    return React.createElement('h1', { className: "text-2xl font-bold mt-6 mb-4", ...props });
  },
  h2: (props: any) => {
    return React.createElement('h2', { className: "text-xl font-semibold mt-5 mb-3", ...props });
  },
  
  // Autres composants typographiques
  h3: (props: any) => {
    return React.createElement('h3', { className: "text-lg font-semibold mt-4 mb-2", ...props });
  },
  p: (props: any) => {
    return React.createElement('p', { className: "mb-4 leading-relaxed", ...props });
  },
  a: (props: any) => {
    return React.createElement('a', { className: "text-primary hover:underline", ...props });
  },
  ul: (props: any) => {
    return React.createElement('ul', { className: "list-disc pl-6 mb-4", ...props });
  },
  ol: (props: any) => {
    return React.createElement('ol', { className: "list-decimal pl-6 mb-4", ...props });
  },
  li: (props: any) => {
    return React.createElement('li', { className: "mb-1", ...props });
  },
  blockquote: (props: any) => {
    return React.createElement('blockquote', { className: "border-l-4 border-gray-200 pl-4 py-2 italic mb-4", ...props });
  },
  
  // Vous pouvez également ajouter des composants spécialisés pour le contenu technique
  inlineCode: (props: any) => {
    return React.createElement('code', { className: "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono", ...props });
  },
  
  // Et d'autres composants spécifiques pour votre plateforme d'apprentissage...
};
