'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ClientMDXRenderer = dynamic(() => import('./ClientMDXRenderer'), {
  loading: () => <div>Loading MDX...</div>,
});

export interface MDXClientRendererProps {
  compiledMdx: string;
}

export default function MDXClientRenderer({ compiledMdx }: MDXClientRendererProps) {
  return (
    <Suspense fallback={<div>Loading MDX...</div>}>
      <ClientMDXRenderer compiledMdx={compiledMdx} />
    </Suspense>
  );
}
