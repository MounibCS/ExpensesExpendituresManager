import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  transactions: defineTable({
    userId: v.string(),
    name: v.string(),
    amount: v.number(),
    date: v.string(),
    category: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
    notes: v.optional(v.string()),
  }).index("by_user", ["userId"]),
}); 