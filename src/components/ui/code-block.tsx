import React, { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Check, Copy, Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './button';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { Language } from 'prism-react-renderer';
import type { HighlightProps } from 'prism-react-renderer';


interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  title?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = true,
  highlightLines = [],
  title,
  className
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `code-snippet.${language}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={cn("rounded-lg overflow-hidden border", className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="text-sm font-medium">{title}</div>
          <div className="w-16" />
        </div>
      )}
      <div className="relative">
      <Highlight
  theme={isDarkMode ? themes.nightOwl : themes.github}
  code={code.trim()}
  language={language as Language}
>
{({
  className,
  style,
  tokens,
  getLineProps,
  getTokenProps
}: Parameters<HighlightProps['children']>[0]) => (
  <pre
    className={cn(
      className,
      "overflow-x-auto p-4 text-sm",
      !title && "rounded-t-lg"
    )}
    style={style}
  >
    {tokens.map((line, i) => {
      const lineNumber = i + 1;
      const isHighlighted = highlightLines.includes(lineNumber);

      return (
        <div
          key={i}
          {...getLineProps({ line, key: i })}
          className={cn(
            "table-row",
            isHighlighted && "bg-primary/10"
          )}
        >
          {showLineNumbers && (
            <span className="table-cell text-right pr-4 select-none text-muted-foreground w-[40px]">
              {lineNumber}
            </span>
          )}
          <span className="table-cell">
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token, key })} />
            ))}
          </span>
        </div>
      );
    })}
  </pre>
)}

</Highlight>

        <div className="absolute top-2 right-2 flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={handleCopy}
            title="Copier le code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={handleDownload}
            title="Télécharger le code"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
