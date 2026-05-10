import { signOut } from '@/auth';
import { SignOutSubmit } from '@/components/auth/sign-out-submit';

export function SignOutButton({ label, className }: { label: string; className?: string }) {
  return (
    <form
      className="inline-flex"
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/en' });
      }}
    >
      <SignOutSubmit label={label} className={className} />
    </form>
  );
}
