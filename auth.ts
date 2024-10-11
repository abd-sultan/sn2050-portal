import bcrypt from 'bcrypt';
import type { UserType, UserResponseType } from "@/types/user";
import NextAuth, { Session } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connect from "@/lib/db";
import User from "@/models/user.model";
import { signInSchema } from '@/lib/zod';
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

declare module "next-auth" {
  interface User extends UserType { }
}

declare module "next-auth/adapters" {
  interface AdapterUser extends UserType { }
}

declare module "next-auth/jwt" {
  interface JWT extends UserType { }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials: any) => {
        await connect();
        const { email, password } = await signInSchema.parseAsync(credentials)
        try {
          const user: UserType | null = await User.findOne({ email: credentials.email });
          console.log("🚀 ~ authorize: ~ user1:", user)
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
            /* if (credentials.password === user.password) {
              console.log("🚀 ~ authorize: ~ user2:", user)
              return user;
            } */
          }

          // Return null if user data could not be retrieved
          return null
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    // error: "/signin",
  },
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user: UserType }) => {
      if (user) {
        token.subId = user?._id
        token.role = user?.role
        token.company = user?.company
        token.sector = user?.sector
        token.email = user?.email
        token.firstName = user?.firstName
        token.lastName = user?.lastName
        token.phone = user?.phone
        token.createdAt = user?.createdAt
        token.updatedAt = user?.updatedAt
      }
      console.log("🚀 ~ jwt: ~ token, user:", token, user)
      return token
    },
    session: async ({ session, token }: {
      session: Session; token: UserType
    }) => {
      const userObject: AdapterUser = {
        id: token?.subId,
        role: token.role,
        email: token?.email || "",
        firstName: token?.firstName,
        lastName: token?.lastName,
        phone: token?.phone,
        sector: token?.sector,
        company: token?.company,
        createdAt: token?.createdAt,
        updatedAt: token?.updatedAt,
        subId: token?.subId,
        emailVerified: null,
        password: ""
      }

      session.user = userObject
      console.log("🚀 ~ session: ~ session, token:", session, token)
      return session
    }
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true, // Rend les cookies non accessibles via JavaScript
        secure: process.env.NODE_ENV === 'production', // Utilise des cookies sécurisés uniquement en production
        sameSite: 'strict', // Protection contre CSRF en restreignant les envois intersites
        path: '/',
      },
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        sameSite: 'lax', // Moins restrictif pour autoriser certaines redirections
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      },
    },
  },
})