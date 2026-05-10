import { cn } from '@missing-you/ui';

type Props = {
  className?: string;
  /** Shown to screen readers when no separate label is present */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClass = {
  sm: 'h-4 w-4 border-[2px]',
  md: 'h-6 w-6 border-2',
  lg: 'h-9 w-9 border-[3px]',
} as const;

export function Spinner({ className, label = 'Loading', size = 'md' }: Props) {
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center', className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span
        className={cn(
          'inline-block animate-spin rounded-full border-muted-foreground/35 border-t-foreground',
          sizeClass[size]
        )}
        aria-hidden
      />
    </span>
  );
}
