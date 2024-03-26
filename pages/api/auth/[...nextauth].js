const sqlite3 = require('sqlite3').verbose();
import { open } from 'sqlite';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import path from 'path';

export default NextAuth({
    session: {
        strategy: "jwt",
        maxAge: 3 * 24 * 60 * 60, // 30 days
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                //connect to DB
                const db = await open({
                    filename: path.resolve(process.cwd(), 'mall.db'), // This ensures the path is always correct
                    driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
                });
                const user = await db.get(`SELECT * FROM users WHERE email = (?)`, credentials.email); // Use get for a single row
                if (!user) {
                    throw new Error('No user found!');
                }
                const isValid = await verifyPassword(credentials.password, user.password);
                if (!isValid) {
                    throw new Error('Wrong password!');
                }
                // Add isAdmin to the user token for later use
                return { email: user.email, isAdmin: user.isAdmin };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.isAdmin = user.isAdmin;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.isAdmin = token.isAdmin;
            return session;
        },
    },
    // Additional configuration, including secure cookie settings
    useSecureCookies: true,
    // events: {
    //     async signIn(message) { /* on successful sign in */ alert(message) },
    //     async signOut(message) { /* on signout */ alert(message) },
    // },
});