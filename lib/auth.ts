import { betterAuth } from "better-auth";
import { db } from "@/db/drizzle";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import VerifyEmail from "@/components/emails/verify-email";
import { organization } from "better-auth/plugins";
import { ac, admin, member, owner } from "./permissions";
import { getActiveOrganization } from "@/server/organizations";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    databaseHooks: {
        session: {
            create: {
                before: async (session) => {
                    const organization = await getActiveOrganization(session.userId);

                    return {
                        data: {
                            ...session,
                            activeOrganizationId: organization?.id,
                        },
                    };
                },
            },
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }, request) => {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: user.email,
                subject: "Verify your email address",
                react: VerifyEmail({
                    username: user.name,
                    verifyUrl: url,
                })
            });
        },
        sendOnSignUp: true,
        expiresIn: 3600 // 1 hour
    },
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }, request) => {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: user.email,
                subject: "Reset your password",
                react: ForgotPasswordEmail({
                    userEmail: user.email,
                    resetUrl: url,
                    username: user.name,
                })
            });
        },
        requireEmailVerification: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    rateLimit: {
        window: 60,
        max: 100,
        customRules: {
            "/sign-in/email": {
                window: 60,
                max: 5
            },
            "/sign-up/email": {
                window: 3600,
                max: 3
            },
        },
    },
    plugins: [organization({
        ac,
        roles: {
            admin,
            member,
            owner,
        },
        allowUserToCreateOrganization: async (user) => {
            return user.email === process.env.ORG_CREATOR_EMAIL;
        },
        organizationHooks: {

        }
    }), nextCookies()]
});