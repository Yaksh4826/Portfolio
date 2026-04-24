// models/experienceModel.js
import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: String,
  duration: String, // e.g., "Jan 2024 - Present"
  description: [String],
});

export default mongoose.models.Resume || mongoose.model('experience', ExperienceSchema);