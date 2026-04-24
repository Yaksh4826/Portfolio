import { STRING_LITERAL_DROP_BUNDLE } from "next/dist/shared/lib/constants";
import { connectDB } from "../lib/db";
import mongoose from "mongoose";


await connectDB()


const profileSchema = mongoose.Schema({
    name: String,
    tagLine: String,
    bio: String,
    avatar: String,
    socials: { github: String, linkedin: String, email: String }

})



// Check if the model exists, otherwise create it
const Profile = mongoose.models.profile || mongoose.model("profile", profileSchema);

export default Profile;