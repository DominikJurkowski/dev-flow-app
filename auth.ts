import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { api } from './lib/api';
import { SignInSchema } from './lib/validation';
import bcrypt from 'bcryptjs';
import Credentials from 'next-auth/providers/credentials';
import dbConnect from './lib/mongoose';
import User from './database/user.model';
import Account, { IAccount } from './database/account.model';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          await dbConnect();

          const existingAccount = await Account.findOne({
            provider: 'credentials',
            providerAccountId: email,
          }).lean() as (IAccount & { _id: unknown }) | null;

          if (!existingAccount) {
            return null;
          }

          const existingUser = await User.findById(existingAccount.userId).lean();

          if (!existingUser) return null;

          const isValidPassword = await bcrypt.compare(password, existingAccount.password ?? '');

          if (isValidPassword)
            return {
              id: existingUser._id.toString(),
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image ?? undefined,
            };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        if (account.type === 'credentials' && token.email) {
          await dbConnect();
          const existingAccount = await Account.findOne({
            provider: 'credentials',
            providerAccountId: token.email,
          }).lean() as (IAccount & { _id: unknown }) | null;
          if (existingAccount?.userId) {
            token.sub = existingAccount.userId.toString();
          }
        } else {
          const { data: existingAccount, success } = (await api.accounts.getByProviderAccountId(
            account.providerAccountId
          )) as ActionResponse<{ userId: { toString(): string } }>;
          if (success && existingAccount?.userId) {
            token.sub = existingAccount.userId.toString();
          }
        }
      }

      return token;
    },
    async signIn({ user, profile, account }) {
      if (account?.type === 'credentials') return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username: account.provider === 'github' ? (profile?.login as string) : (user.name?.toLowerCase() as string),
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as 'github' | 'google',
        providerAccountId: account.providerAccountId as string,
      })) as ActionResponse;

      if (!success) return false;

      return true;
    },
  },
});
