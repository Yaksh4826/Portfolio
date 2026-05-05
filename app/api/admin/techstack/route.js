import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import techStackModel from "@/app/models/techStackModel";
import { isValidTechStackIconName } from "@/app/lib/techStackIcons";

export async function POST(req) {
    try {
        // 1. Connect to DB
        await connectDB();

        // 2. Await the JSON body
        const body = await req.json();
        const icon = typeof body?.icon === "string" ? body.icon.trim().toLowerCase() : "";

        if (!isValidTechStackIconName(icon)) {
            return NextResponse.json(
                { success: false, error: "Invalid icon key. Pick one from tech-stack-icons search." },
                { status: 400 },
            );
        }

        // 3. Insert into database
        const inserted = await techStackModel.create({ ...body, icon });

        // 4. Return success response
        return NextResponse.json({ 
            success: true, 
            message: "Tech skill added successfully",
            data: inserted 
        }, { status: 201 });

    } catch (error) {
        console.error("Tech Stack POST Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}