// src/components/mdx/MDXRendererWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import type { ClientMDXRendererProps } from './ClientMDXRenderer';

const ClientMDXRenderer = dynamic(() => import('./ClientMDXRenderer'), {
  ssr: false,
});

export default function MDXRendererWrapper(props: ClientMDXRendererProps) {
  return <ClientMDXRenderer {...props} />;
}
