import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind class merge helper (shadcn-style) for app-local components. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
