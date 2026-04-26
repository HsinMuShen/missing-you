import NextAuth from 'next-auth';
import Email from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/client';
import { env, getMissingRequiredEnvForDeployment, isProduction } from '@/lib/config/env';
import { logger } from '@/lib/observability/logger';

const AUTH_EMAIL_SERVER = env.AUTH_EMAIL_SERVER;
const AUTH_EMAIL_FROM = env.AUTH_EMAIL_FROM || 'Missing You <no-reply@missing-you.local>';

const missingEnv = getMissingRequiredEnvForDeployment();
if (isProduction() && missingEnv.length > 0) {
  logger.warn('Missing required production env vars', { missingEnv });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  pages: {
    signIn: '/en/sign-in',
  },
  providers: [
    Email({
      from: AUTH_EMAIL_FROM,
      server: AUTH_EMAIL_SERVER || 'smtp://user:pass@localhost:1025',
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        if (process.env.NODE_ENV !== 'production' && !AUTH_EMAIL_SERVER) {
          console.log(`[auth] magic link for ${identifier}: ${url}`);
          return;
        }

        const { createTransport } = await import('nodemailer');
        const transport = createTransport(provider.server);
        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: 'Sign in to Missing You',
          text: `Sign in to Missing You:\n${url}\n\nIf you did not request this email, ignore this message.`,
          html: `<p>Sign in to Missing You:</p><p><a href="${url}">${url}</a></p>`,
        });
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.defaultPrivacy = (user as { defaultPrivacy?: 'private' | 'share' }).defaultPrivacy ?? 'private';
      }
      return session;
    },
  },
});
