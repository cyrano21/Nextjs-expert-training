'use client';

import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { compile, run } from '@mdx-js/mdx';
import { InfoTip } from './InfoTip';
import { CodeBlock } from './CodeBlock';
import { Quiz } from './Quiz';
import { ProjectStep } from './ProjectStep';
import { TerminalOutput } from './TerminalOutput';

export interface ClientMDXRendererProps {
  compiledMdx: string;
}

// Define prop types for specific components
type InfoTipProps = {
  children?: React.ReactNode;
  type?: "idea" | "info" | "warning" | "success";
  title?: string;
};

type CodeBlockProps = {
  children?: React.ReactNode;
  language?: string;
  title?: string;
  allowCopy?: boolean;
};

type QuizProps = {
  children?: React.ReactNode;
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

type ProjectStepProps = {
  children?: React.ReactNode;
  title: string;
  id: string;
  stepNumber?: number;
};

type TerminalOutputProps = {
  children?: React.ReactNode;
  className?: string;
};

const mdxComponents = {
  InfoTip: ({ children, ...props }: InfoTipProps) => (
    <div className="not-prose">
      <InfoTip {...props}>{children}</InfoTip>
    </div>
  ),
  CodeBlock: ({ children, ...props }: CodeBlockProps) => (
    <div className="not-prose">
      <CodeBlock {...props}>{children}</CodeBlock>
    </div>
  ),
  Quiz: ({ children, ...props }: QuizProps) => (
    <div className="not-prose">
      <Quiz {...props}>{children}</Quiz>
    </div>
  ),
  ProjectStep: ({ children, ...props }: ProjectStepProps) => (
    <div className="not-prose">
      <ProjectStep {...props}>{children}</ProjectStep>
    </div>
  ),
  TerminalOutput: ({ children, ...props }: TerminalOutputProps) => (
    <div className="not-prose">
      <TerminalOutput {...props}>{children}</TerminalOutput>
    </div>
  ),
};

const ClientMDXRenderer: React.FC<ClientMDXRendererProps> = ({ compiledMdx }) => {
  const [Content, setContent] = React.useState<React.ComponentType | null>(null);

  React.useEffect(() => {
    async function renderMDX() {
      try {
        const compiledSource = await compile(compiledMdx, {
          outputFormat: 'function-body',
          providerImportSource: '@mdx-js/react'
        });

        const { default: MDXContent } = await run(compiledSource.toString(), {
          ...React,
          baseUrl: import.meta.url
        });

        setContent(() => MDXContent);
      } catch (error) {
        console.error('MDX Rendering Error:', error);
        setContent(() => () => (
          <div className="text-red-500">
            Erreur de rendu du contenu MDX: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ));
      }
    }

    renderMDX();
  }, [compiledMdx]);

  return (
    <MDXProvider components={mdxComponents}>
      {Content ? <Content /> : <div>Chargement...</div>}
    </MDXProvider>
  );
};

ClientMDXRenderer.displayName = 'ClientMDXRenderer';

export default ClientMDXRenderer;
