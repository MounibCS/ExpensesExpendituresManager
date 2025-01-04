import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTransactions = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const addTransaction = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    amount: v.number(),
    date: v.string(),
    category: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("transactions", args);
  },
});

export const deleteTransaction = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateTransaction = mutation({
  args: {
    id: v.id("transactions"),
    name: v.string(),
    amount: v.number(),
    date: v.string(),
    category: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
}); 