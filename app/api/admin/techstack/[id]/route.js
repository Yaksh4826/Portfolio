import techStackModel from "@/app/models/techStackModel";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";



// updating the tech stack items
export async function POST(req, { params }) {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

   // findOneAndUpdate(filter, update, options)
    const updated = await techStackModel.findOneAndUpdate(
        { _id: id }, 
        body, 
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