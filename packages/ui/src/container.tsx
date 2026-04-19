import * as React from 'react';
import { cn } from './utils.js';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'main' | 'section';
}

/**
 * Max-width layout shell for calm, readable line lengths.
 */
export function Container({ className, as: Comp = 'div', ...props }: ContainerProps) {
  return (
    <Comp
      className={cn('mx-auto w-full max-w-3xl px-4 sm:px-6', className)}
      {...props}
    />
  );
}
