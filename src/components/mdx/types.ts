import { ComponentType, ReactNode } from 'react';

export type MDXComponentProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

export type MDXComponentType = ComponentType<MDXComponentProps> & { 
  default?: ComponentType<MDXComponentProps> 
};
