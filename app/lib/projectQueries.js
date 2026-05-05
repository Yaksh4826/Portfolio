import { connectDB } from "@/app/lib/db";
import projectModel from "@/app/models/projectModel";

/** Same projection as `/api/projects` cards. */
export const PROJECT_CARD_SELECT =
  "title slug summary thumbnail tags completedDate createdAt";

const SORT = { completedDate: -1, createdAt: -1 };

/** Strip BSON / ObjectId / Date prototypes for Server → Client props (e.g. `ProjectCard`). */
function mongoLeanPlain(docs) {
  return JSON.parse(JSON.stringify(docs ?? []));
}

export async function getProjectCardsPaged(page, pageSize) {
  await connectDB();
  const p = Math.max(1, Math.floor(Number(page)) || 1);
  const ps = Math.min(Math.max(Math.floor(Number(pageSize)) || 12, 1), 48);
  const skip = (p - 1) * ps;
  const [projects, total] = await Promise.all([
    projectModel
      .find()
      .select(PROJECT_CARD_SELECT)
      .sort(SORT)
      .skip(skip)
      .limit(ps)
      .lean(),
    projectModel.countDocuments(),
  ]);
  const list = mongoLeanPlain(projects ?? []);
  return {
    projects: list,
    total,
    page: p,
    pageSize: ps,
    totalPages: Math.max(1, Math.ceil(total / ps)),
  };
}

export async function getProjectCardsLimited(limit) {
  await connectDB();
  const lim = Math.min(Math.max(Math.floor(Number(limit)) || 4, 1), 50);
  const [projects, total] = await Promise.all([
    projectModel.find().select(PROJECT_CARD_SELECT).sort(SORT).limit(lim).lean(),
    projectModel.countDocuments(),
  ]);
  return { projects: mongoLeanPlain(projects ?? []), total };
}

export async function getProjectCardsAll() {
  await connectDB();
  const [projects, total] = await Promise.all([
    projectModel.find().select(PROJECT_CARD_SELECT).sort(SORT).lean(),
    projectModel.countDocuments(),
  ]);
  return { projects: mongoLeanPlain(projects ?? []), total };
}
