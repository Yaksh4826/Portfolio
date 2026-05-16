import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  name: String,
  tagLine: String,
  bio: String,
  avatar: String,
  socials: { github: String, linkedin: String, email: String },
  resumeUrl: String,
  resumePublicId: String,
  resumeFormat: String,
});

// Do not connect to DB at import-time; API routes call connectDB().
export default mongoose.models.profile || mongoose.model("profile", profileSchema);