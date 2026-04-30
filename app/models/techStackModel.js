import mongoose from "mongoose";

const TechStackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["Frontend", "Backend", "AI/ML", "Robotics", "Tools"],
    required: true,
  },
  icon: { type: String, required: true },
});

export default mongoose.models.techStack || mongoose.model("techStack", TechStackSchema);
