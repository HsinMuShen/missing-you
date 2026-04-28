import { signOut } from '@/auth';

export function SignOutButton({ label, className }: { label: string; className?: string }) {
  return (
    <form
      className="inline-flex"
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/en' });
      }}
    >
      <button
        type="submit"
        className={`rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted ${className ?? ''}`}
      >
        {label}
      </button>
    </form>
  );
}
