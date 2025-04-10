declare module 'gray-matter' {
  export interface GrayMatterFile<T = string> {
    data: Record<string, unknown>;
    content: T;
  }

  export default function matter<T = string>(
    file: string | Buffer,
    options?: Record<string, unknown>
  ): GrayMatterFile<T>;
}

declare module 'next-mdx-remote/rsc' {
  import { MDXComponents } from 'mdx/types';
  import { ReactElement } from 'react';

  export interface CompileMDXOptions {
    source: string;
    components?: MDXComponents;
    options?: {
      parseFrontmatter?: boolean;
    };
  }

  export function compileMDX(
    options: CompileMDXOptions
  ): Promise<{
    content: ReactElement;
    frontmatter?: Record<string, unknown>;
  }>
}
