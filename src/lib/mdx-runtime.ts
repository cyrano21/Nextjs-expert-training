import * as runtime from 'react/jsx-runtime';
import React from 'react';
import { compile } from '@mdx-js/mdx';
import rehypePrism from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm';

export async function runMDX(code: string): Promise<React.FC> {
  try {
    const fn = new Function('React', 'runtime', `
      const { default: Content } = (function () {
        ${code}
      })();
      return Content;
    `);

    const Content = await fn({ ...runtime }, runtime);

    const MDXContentWrapper = () => {
      if (typeof Content === 'function') {
        return React.createElement(Content);
      }
      return React.createElement('div', { className: 'text-red-500' }, 'Invalid MDX Content');
    };
    MDXContentWrapper.displayName = 'MDXContentWrapper';

    return MDXContentWrapper;
  } catch (err) {
    console.error('Erreur de compilation MDX :', err);
    
    const MDXErrorComponent = () => {
      const ErrorDisplay = () => React.createElement('div', { className: 'text-red-500' }, 'Erreur de contenu MDX');
      ErrorDisplay.displayName = 'MDXErrorDisplay';
      return React.createElement(ErrorDisplay);
    };
    MDXErrorComponent.displayName = 'MDXErrorComponent';

    return MDXErrorComponent;
  }
}

export async function getCompiledMdx(content: string) {
  try {
    const compiledContent = await compile(content, {
      outputFormat: 'function-body',
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrism],
      development: process.env.NODE_ENV === 'development'
    });

    return String(compiledContent);
  } catch (err) {
    console.error('Erreur de compilation MDX :', err);
    return null;
  }
}
