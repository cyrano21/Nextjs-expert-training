import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CodeBlock({
  children,
  language = "javascript",
  title = "",
  allowCopy = false,
}: {
  children: React.ReactNode;
  language?: string;
  title?: string;
  allowCopy?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof children === "string") {
      navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-4 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 group">
      {title && (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          {allowCopy && (
            <button
              onClick={handleCopy}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      )}
      <div className="relative">
        <pre
          className={`p-4 bg-gray-50 dark:bg-gray-900 overflow-x-auto text-sm`}
        >
          <code className={`language-${language}`}>{children}</code>
        </pre>
        {allowCopy && !title && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
