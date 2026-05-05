/**
 * One-time: create/update admin user for JWT login.
 * Usage (Node 20+):
 *   node --env-file=.env.local scripts/seed-admin.mjs
 *
 * Requires: MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD or ADMIN_PASS (plain → bcrypt)
 *
 *   npm run seed:admin
 *   (loads `.env` via Node --env-file)
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI?.trim();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password =
  process.env.ADMIN_PASSWORD?.trim() || process.env.ADMIN_PASS?.trim();

if (!uri || !email || !password) {
  console.error(
    "Set MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD (or ADMIN_PASS) in .env",
  );
  process.exit(1);
}

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

const hash = await bcrypt.hash(password, 12);
await mongoose.connect(uri);
await Admin.findOneAndUpdate(
  { email },
  { $set: { email, passwordHash: hash } },
  { upsert: true, returnDocument: "after" },
);
console.log("Admin upserted:", email);
await mongoose.disconnect();
