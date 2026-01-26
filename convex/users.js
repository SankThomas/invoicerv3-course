import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    kindeId: v.string(),
    email: v.string(),
    name: v.string(),
    businessName: v.optional(v.string()),
    businessEmail: v.optional(v.string()),
    businessPhone: v.optional(v.string()),
    preferredCurrency: v.optional(v.string()),
    theme: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
    });

    // Create default settings
    await ctx.db.insert("settings", {
      userId: args.kindeId,
      invoicePrefix: "INV",
      nextInvoiceNumber: 1001,
      defaultCurrency: args.preferredCurrency,
      defaultTax: 0,
      paymentTerms: "Net 30",
    });

    return userId;
  },
});

export const getUserByKindeId = query({
  args: { kindeId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_kinde_id", (q) => q.eq("kindeId", args.kindeId))
      .first();

    return user;
  },
});

export const updateUser = mutation({
  args: {
    kindeId: v.string(),
    updates: v.object({
      name: v.optional(v.string()),
      businessName: v.optional(v.string()),
      businessEmail: v.optional(v.string()),
      businessPhone: v.optional(v.string()),
      businessAddress: v.optional(v.string()),
      preferredCurrency: v.optional(v.string()),
      theme: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_kinde_id", (q) => q.eq("kindeId", args.kindeId))
      .first();

    if (user) {
      await ctx.db.patch(user._id, args.updates);
    }
  },
});

export const deleteUser = mutation({
  args: { kindeId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_kinde_id", (q) => q.eq("kindeId", args.kindeId))
      .first();

    if (user) {
      const invoices = await ctx.db
        .query("invoices")
        .withIndex("by_user", (q) => q.eq("userId", args.kindeId))
        .collect();

      for (const invoice of invoices) {
        await ctx.db.delete(invoice._id);
      }

      const settings = await ctx.db
        .query("settings")
        .withIndex("by_user", (q) => q.eq("userId", args.kindeId))
        .first();

      if (settings) {
        await ctx.db.delete(settings._id);
      }

      await ctx.db.delete(user._id);
    }
  },
});
