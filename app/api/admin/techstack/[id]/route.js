import techStackModel from "@/app/models/techStackModel";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { isValidTechStackIconName } from "@/app/lib/techStackIcons";



// updating the tech stack items
export async function POST(req, { params }) {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const icon = typeof body?.icon === "string" ? body.icon.trim().toLowerCase() : "";

    if (!isValidTechStackIconName(icon)) {
        return NextResponse.json(
            { success: false, message: "Invalid icon key. Pick one from tech-stack-icons search." },
            { status: 400 },
        );
    }

   // findOneAndUpdate(filter, update, options)
    const updated = await techStackModel.findOneAndUpdate(
        { _id: id }, 
        { ...body, icon }, 
        { new: true } // This returns the updated document instead of the old one
    );

    if (!updated) {
        return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });

}

// Deleting the tech stack items
export async function DELETE(_req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        
        const deleted = await techStackModel.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Skill deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}