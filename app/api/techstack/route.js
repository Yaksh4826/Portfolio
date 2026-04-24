import techStackModel from "@/app/models/techStackModel";
import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req){
try{
await connectDB()
const techstack =  await techStackModel.find()
if(!techstack){
    return NextResponse.json({success:false , message:"tech stack not found"})
}
return NextResponse.json({success:true, techstack:techstack})


}catch{
return NextResponse.json({success:false, error:e})

}


}