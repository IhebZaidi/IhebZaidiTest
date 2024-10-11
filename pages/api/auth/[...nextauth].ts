import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email || null;
        token.id = user.id || "";
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: (token.id as string) || "",
        email: token.email || null,
        name: token.name,
        image: null,
      };
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl + "/register";
    },
  },
  session: {
    strategy: "jwt",
  },
});
