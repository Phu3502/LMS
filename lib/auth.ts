import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../src/index";
import { nextCookies } from "better-auth/next-js";
import { schema } from "../src/db/schema";

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
    }, 
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema,
    }),
    plugins: [nextCookies()]
});