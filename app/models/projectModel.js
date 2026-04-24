import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // e.g., 'stitch-design'
  description: { type: String, required: true },       // Main project story
  summary: String,                                     // Short 1-liner for cards
  
  // High-quality images (Base64 or Supabase URLs)
  thumbnail: { type: String, required: true },
  
  // Tech & Classification
  tags: [String],                                      // e.g., ["Next.js", "AI", "MERN"]
  // External Links
  githubUrl: String,
  liveUrl: String,
  
  completedDate: Date
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);