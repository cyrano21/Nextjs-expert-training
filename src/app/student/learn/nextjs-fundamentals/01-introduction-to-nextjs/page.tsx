"use client"

import React from 'react';
import { CodeBlock } from '@/components/mdx';

export default function IntroductionToNextJS() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-primary">Introduction to Next.js</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What is Next.js?</h2>
        <p className="text-lg mb-4">
          Next.js is a powerful React framework that enables developers to build full-stack web applications 
          with ease. It provides a comprehensive set of features designed to improve developer productivity 
          and application performance.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Server-Side Rendering (SSR):</strong> Improved performance and SEO by rendering pages on the server
          </li>
          <li>
            <strong>Static Site Generation (SSG):</strong> Pre-render pages at build time for maximum speed
          </li>
          <li>
            <strong>Automatic Code Splitting:</strong> Optimize application load times
          </li>
          <li>
            <strong>TypeScript Support:</strong> First-class TypeScript integration
          </li>
          <li>
            <strong>File-based Routing:</strong> Intuitive routing system based on file structure
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Hello World Example</h2>
        <CodeBlock language="typescript">
{`// pages/index.tsx
function HomePage() {
  return <div>Welcome to Next.js!</div>
}

export default HomePage;`}
        </CodeBlock>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Why Next.js?</h2>
        <p className="text-lg">
          Next.js simplifies React development by providing built-in solutions for common web development 
          challenges, allowing developers to focus on building great user experiences.
        </p>
      </section>
    </div>
  );
}
