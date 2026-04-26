import { signOut } from '@/auth';

export function SignOutButton({ label }: { label: string }) {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/en' });
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
      >
        {label}
      </button>
    </form>
  );
}
