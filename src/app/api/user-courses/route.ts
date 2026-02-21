import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { Courses } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { and, eq, desc } from "drizzle-orm";

// 1. GET: 
export async function GET() {
    try {
        const user = await currentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const userEmail = user?.primaryEmailAddress?.emailAddress as string;

        const result = await db.select().from(Courses)
            .where(eq(Courses.userId, userEmail))
            .orderBy(desc(Courses.id));

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 2. POST:
export async function POST(req: Request) {
    try {
        const { prompt, type } = await req.json();
        const user = await currentUser();
        const apiKey = process.env.GROQ_API_KEY;

        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const userEmail = user?.primaryEmailAddress?.emailAddress as string;

        // Duplicate Check
        const existingCourse = await db.select().from(Courses)
            .where(and(eq(Courses.prompt, prompt), eq(Courses.userId, userEmail)));

        if (existingCourse.length > 0) {
            return NextResponse.json(existingCourse[0]);
        }

        // AI Call 
        const slideCount = type === "long" ? 10 : 5;
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: `Output JSON: {"slides": [...]}` },
                    { role: "user", content: `Create ${slideCount} slides for: ${prompt}` }
                ],
                response_format: { type: "json_object" }
            }),
        });

        const data = await response.json();
        const parsedData = JSON.parse(data.choices[0].message.content);

        const result = await db.insert(Courses).values({
            courseId: uuidv4(),
            userId: userEmail,
            prompt: prompt,
            type: type || "quick",
            content: parsedData.slides,
        }).returning();

        return NextResponse.json(result[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 3. DELETE:
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('courseId');
        const user = await currentUser();

        if (!user || !courseId) {
            return NextResponse.json({ error: "Unauthorized or Missing ID" }, { status: 400 });
        }

        const result = await db.delete(Courses)
            .where(and(
                eq(Courses.courseId, courseId),
                eq(Courses.userId, user?.primaryEmailAddress?.emailAddress as string)
            )).returning();

        return NextResponse.json({ success: true, deleted: result });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}