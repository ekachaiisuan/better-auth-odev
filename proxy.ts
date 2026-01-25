import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const data = await auth.api.getSession({
        headers: request.headers,
    });

    if (!data) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    const isOrgCreator =
        data.user.email === process.env.ORG_CREATOR_EMAIL;

    const hasActiveOrg =
        !!data.session.activeOrganizationId;

    if (!isOrgCreator && !hasActiveOrg) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard"],
};