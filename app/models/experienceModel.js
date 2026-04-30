import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: String,
    duration: String,
    description: [String],
    /** Optional tags for the timeline footer row (e.g. "React", "Node.js") */
    technologies: [String],
  },
  { timestamps: true },
);

export default mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);
