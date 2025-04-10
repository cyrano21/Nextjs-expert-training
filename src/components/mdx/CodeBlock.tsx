"use client";

import React from "react";

interface CodeBlockProps {
  title?: string;
  language?: string;
  children: React.ReactNode;
}

export function CodeBlock({ title, language, children }: CodeBlockProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      {title && (
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-sm font-medium">
          {title}
        </div>
      )}
      <pre
        className={`p-4 overflow-x-auto ${
          language ? `language-${language}` : ""
        }`}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}
