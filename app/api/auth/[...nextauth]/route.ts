// imports
import NextAuth from "next-auth";

// importing providers
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.github_id as string,
      clientSecret: process.env.github_secret as string,
    }),
  ],
  // https://stackoverflow.com/questions/69068495/how-to-get-the-provider-access-token-in-next-auth
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token = Object.assign({}, token, {
          access_token: account.access_token,
        });
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        session = Object.assign({}, session, {
          access_token: token.access_token,
        });
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
