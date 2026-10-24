import fs from "fs";
import path from "path";

// This file is the ONLY place that touches the data store.
// It currently reads/writes a JSON file so the site runs anywhere with zero
// setup. When you're ready for production, swap the body of readDb/writeDb
// for calls to Postgres/MySQL (e.g. via Prisma) and every page/API route
// that imports from here keeps working unchanged.

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export type Role = "ADMIN" | "MEMBER";

export interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  memberId?: string;
}

export interface DbShape {
  users: DbUser[];
  members: Array<{
    id: string;
    name: string;
    program: string;
    joinedOn: string;
    idCardIssued: boolean;
    appointmentLetterIssued: boolean;
  }>;
  notices: Array<{ id: string; title: string; body: string; date: string; audience: string }>;
  events: Array<{ id: string; title: string; date: string; location: string; description: string }>;
  gallery: Array<{
    id: string;
    caption: string;
    category: string;
    src?: string;
    batchDate?: string;
    location?: string;
    tag?: string;
  }>;
  testimonials: Array<{ id: string; name: string; program: string; quote: string; year: string }>;
  management: Array<{ id: string; name: string; role: string; bio: string; image?: string }>;
  donors: Array<{ id: string; name: string; amount: number; date: string; frequency?: string }>;
  donations: Array<{
    id: string;
    donorName: string;
    email: string;
    amount: number;
    purpose: string;
    date: string;
    receiptNo: string;
  }>;
  membershipApplications: Array<{
    id: string;
    name: string;
    phone: string;
    email: string;
    program: string;
    message: string;
    date: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
  }>;
  contactMessages: Array<{ id: string; name: string; email: string; message: string; date: string }>;
  objectives: string[];
}

let memoryDb: DbShape | null = null;

function readDb(): DbShape {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    memoryDb = JSON.parse(raw) as DbShape;
    return memoryDb;
  } catch {
    if (memoryDb) return memoryDb;
    memoryDb = {
      users: [],
      members: [],
      notices: [],
      events: [],
      gallery: [],
      testimonials: [],
      management: [],
      donors: [],
      donations: [],
      membershipApplications: [],
      contactMessages: [],
      objectives: [],
    };
    return memoryDb;
  }
}

function writeDb(data: DbShape) {
  memoryDb = data;
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn("Database write skipped on read-only filesystem:", e);
  }
}

function newId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

export const db = {
  read: readDb,
  write: writeDb,
  newId,

  findUserByEmail(email: string): DbUser | undefined {
    return readDb().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  addDonation(input: { donorName: string; email: string; amount: number; purpose: string }) {
    const data = readDb();
    const receiptNo = `RCPT-${new Date().getFullYear()}-${String(data.donations.length + 1).padStart(4, "0")}`;
    const record = {
      id: newId("don"),
      date: new Date().toISOString().slice(0, 10),
      receiptNo,
      ...input,
    };
    data.donations.push(record);
    data.donors.push({ id: newId("d"), name: input.donorName, amount: input.amount, date: record.date });
    writeDb(data);
    return record;
  },

  addMembershipApplication(input: {
    name: string;
    phone: string;
    email: string;
    program: string;
    message: string;
  }) {
    const data = readDb();
    const record = {
      id: newId("app"),
      date: new Date().toISOString().slice(0, 10),
      status: "PENDING" as const,
      ...input,
    };
    data.membershipApplications.push(record);
    writeDb(data);
    return record;
  },

  addContactMessage(input: { name: string; email: string; message: string }) {
    const data = readDb();
    const record = { id: newId("msg"), date: new Date().toISOString().slice(0, 10), ...input };
    data.contactMessages.push(record);
    writeDb(data);
    return record;
  },

  addNotice(input: { title: string; body: string; audience: string }) {
    const data = readDb();
    const record = { id: newId("n"), date: new Date().toISOString().slice(0, 10), ...input };
    data.notices.unshift(record);
    writeDb(data);
    return record;
  },

  addGalleryItem(input: {
    caption: string;
    category: string;
    src: string;
    location?: string;
    batchDate?: string;
    tag?: string;
  }) {
    const data = readDb();
    const record = {
      id: newId("gallery"),
      location: input.location || "RDA Training Ground, Betul",
      batchDate: input.batchDate || `UPLOAD // ${new Date().getFullYear()}`,
      tag: input.tag || input.category.toUpperCase(),
      ...input,
    };
    data.gallery.unshift(record);
    writeDb(data);
    return record;
  },
};
