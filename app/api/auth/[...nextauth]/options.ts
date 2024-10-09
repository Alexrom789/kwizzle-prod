import prisma from "@/prisma/db";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "password",
      name: "Username and Password",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Username...",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { username: credentials!.username },
        });

        if (!user) {
          return null;
        }

        const match = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (match) {
          return { ...user, name: user.name ?? "" };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number; // Explicitly cast token.id as a number
        session.user.role = token.role as string; // Explicitly cast token.role as string
      }
      return session;
    },
  },
};

export default options;
