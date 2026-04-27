import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import projectModel from "@/app/models/projectModel";

// UPDATE a specific project
export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = await params; // Await params in newer Next.js versions
        const body = await req.json();

        const updated = await projectModel.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE a specific project
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        await projectModel.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Project deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}