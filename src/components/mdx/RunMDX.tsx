'use client';

import { useMDXComponents } from '@mdx-js/react';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from 'mdx/types';
import { runMDX } from '@/lib/mdx-runtime';
import { useState, useEffect } from 'react';
import React from 'react';

type RunMDXProps = {
  compiledMdx: string;
  components?: MDXComponents;
};

const LoadingComponent = () => <div className="text-gray-500">Chargement du contenu…</div>;
LoadingComponent.displayName = 'LoadingComponent';

const ErrorFallbackComponent = () => <div className="text-red-500">Erreur de rendu du contenu MDX</div>;
ErrorFallbackComponent.displayName = 'ErrorFallbackComponent';

export function RunMDX({ compiledMdx, components }: RunMDXProps) {
  const [Content, setContent] = useState<React.ReactNode>(React.createElement(LoadingComponent));
  const [hasError, setHasError] = useState(false);
  const mdxComponents = useMDXComponents(components);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const MDXContentWrapper = await runMDX(compiledMdx);
        setContent(React.createElement(MDXContentWrapper));
      } catch (e) {
        console.error('Erreur de compilation MDX:', e);
        setHasError(true);
      }
    };

    loadContent();
  }, [compiledMdx]);

  if (hasError) {
    return React.createElement(ErrorFallbackComponent);
  }

  return (
    <MDXProvider components={mdxComponents}>
      {Content}
    </MDXProvider>
  );
}
