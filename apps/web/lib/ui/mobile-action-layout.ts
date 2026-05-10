/**
 * Tailwind patterns for primary/secondary actions: full-width column on small
 * screens, horizontal row from `sm` (matches journal list “Public page” /
 * “View details” behavior).
 */
export const mobileStackActionsEnd =
  'flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-3';

/** Same as `mobileStackActionsEnd` with a tighter gap next to small icons. */
export const mobileStackActionsEndTight =
  'flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-1.5';

export const mobileStackActionsBetween =
  'flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-3';

export const actionBtnFullMobile = 'w-full sm:w-auto';
