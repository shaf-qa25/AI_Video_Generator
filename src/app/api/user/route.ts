import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        const email = user?.primaryEmailAddress?.emailAddress;

        if (!email) {
            return NextResponse.json({ error: "Unauthorized: No email found" }, { status: 401 });
        }

        const users = await db.select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (users.length === 0) {
            const fallbackName = user?.fullName || email.split('@')[0] || "AI User";

            const newUser = await db.insert(usersTable).values({
                email: email,
                name: fallbackName,
            }).returning();

            return NextResponse.json(newUser[0]);
        }

        return NextResponse.json(users[0]);

    } catch (error: any) {
        console.error("User Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}