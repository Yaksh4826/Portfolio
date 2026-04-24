import { NextResponse } from "next/server";
import profileModel from "@/app/models/profileModel.js";
import { connectDB } from "@/app/lib/db";

export async function GET(request){
await connectDB()
const profileData = await profileModel.find()
return NextResponse.json({success:true, profileData:profileData})


}