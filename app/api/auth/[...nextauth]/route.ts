import NextAuth, { type NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Credentials validation schema
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const config = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate input
          const { email, password } = credentialsSchema.parse(credentials);

          // Find user in database
          const result = await sql`
            SELECT id, email, password_hash, name 
            FROM users 
            WHERE email = ${email} AND deleted_at IS NULL
          `;

          if (result.rows.length === 0) {
            throw new Error('Invalid email or password');
          }

          const user = result.rows[0];

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password_hash);
          if (!isPasswordValid) {
            throw new Error('Invalid email or password');
          }

          // Return user object for session
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/register',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
