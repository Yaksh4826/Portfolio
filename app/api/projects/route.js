import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import projectModel from "@/app/models/projectModel";

export async function GET(request){
//  This returns all the projects
await connectDB();

try{

const projects = await projectModel.find().sort({ createdAt: -1 });
if(!projects){
    return NextResponse.json({success:false, message:"Project does not exist"})
}



return NextResponse.json({success:true, projects:projects})


    
}catch(e){
    return NextResponse.json({success:false, error:e})
}



}