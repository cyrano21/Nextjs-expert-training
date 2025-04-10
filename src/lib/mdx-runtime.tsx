'use client';

import { createElement } from 'react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

export async function runMDX(compiledMdx: string) {
  try {
    const { default: Content } = await evaluate(
      compiledMdx, 
      { ...runtime, baseUrl: import.meta.url }
    );

    return createElement(Content);
  } catch (error) {
    console.error('MDX Compilation Error:', error);
    return createElement('div', 'Error rendering MDX content');
  }
}
