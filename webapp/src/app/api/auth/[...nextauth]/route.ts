// [DEPRECATED] NextAuth logic removed. This file is no longer used.
// Custom auth endpoints implemented separately.

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.log('Missing credentials');
          return null;
        }

        console.log('Attempting to find user with email:', credentials.email);
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          console.log('User not found or no password set for email:', credentials.email);
          return null;
        }

        console.log('User found:', user.email);
        console.log('Comparing passwords...');
        const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!passwordMatch) {
          console.log('Password mismatch for user:', user.email);
          return null;
        }

        console.log('Authentication successful for user:', user.email);
        // Return user object without the password hash
        return {
          id: user.id,
          email: user.email,
          // Add other user properties you want in the session, e.g., name, role
        };
      }
    })
  ],
  session: {
    strategy: 'jwt', // Using JWT for sessions
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-debugging-purposes-only', // Secret key for signing JWTs
  pages: {
    signIn: '/login', // Redirect users to /login if they need to sign in
    // error: '/auth/error', // Optional: Page to display authentication errors
  },
  // Add callbacks here if needed (e.g., to add more info to the JWT or session)
  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (token && session.user) {
  //       session.user.id = token.id as string;
  //     }
  //     return session;
  //   },
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
