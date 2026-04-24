
import { NextResponse } from "next/server";
import projectModel from "@/app/models/projectModel";
import { connectDB } from "@/app/lib/db";

export async function GET(req, {params}) {
    connectDB()
    try {
        const { id } = params
        const project = await projectModel.findOne({ _id: id })

        if(!project){
            return NextResponse.json({sucess:false, message:"Project does not exist"})
        }
        
        return NextResponse.json({ success: true, project: project })


    } catch (e) {
        return NextResponse.json({ success: false, error: e })
    }
}