import { NextResponse } from "next/server";
import profileModel from "@/app/models/profileModel";

export async function POST(req) {
    try {
      
        const body = await req.json();

        // The "Upsert" Strategy: 
        // We look for any existing document and update it with the new body.
        // If no document exists, 'upsert: true' creates it.
        const profile = await profileModel.findOneAndUpdate(
            {}, // Empty filter matches the first document found
            body,
            { 
                new: true, 
                upsert: true,
                runValidators: true 
            }
        );

        return NextResponse.json({ 
            success: true, 
            message: "Profile updated successfully",
            data: profile 
        });

    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}