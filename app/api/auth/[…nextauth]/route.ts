// imports
import NextAuth from "next-auth"

// importing providers
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          })
    ],
    callbacks: {
        async jwt({ token, account }) {      
          if (account) {
            token = Object.assign({}, token, { access_token: account.access_token });
          };
          return token;
        },
        async session({ session, token }) {
          if (session) {
            session = Object.assign({}, session, { access_token: token.access_token })
          };
          return session;
        }
      }
})

export { handler as GET, handler as POST }