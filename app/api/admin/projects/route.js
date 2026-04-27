import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import projectModel from "@/app/models/projectModel";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        
        // This handles adding new projects like "Stitch"
        const inserted = await projectModel.create(body);

        return NextResponse.json({ 
            success: true, 
            data: inserted 
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}