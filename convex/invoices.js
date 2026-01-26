import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createInvoice = mutation({
  args: {
    userId: v.string(),
    invoiceNumber: v.string(),
    clientName: v.string(),
    clientEmail: v.string(),
    clientAddress: v.string(),
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        rate: v.number(),
        amount: v.number(),
      }),
    ),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    currency: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("cancelled"),
    ),
    dueDate: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const invoiceId = await ctx.db.insert("invoices", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return invoiceId;
  },
});

export const updateInvoice = mutation({
  args: {
    id: v.id("invoices"),
    updates: v.object({
      invoiceNumber: v.optional(v.string()),
      clientName: v.optional(v.string()),
      clientEmail: v.optional(v.string()),
      clientAddress: v.optional(v.string()),
      items: v.optional(
        v.array(
          v.object({
            description: v.string(),
            quantity: v.number(),
            rate: v.number(),
            amount: v.number(),
          }),
        ),
      ),
      subtotal: v.optional(v.number()),
      tax: v.optional(v.number()),
      total: v.optional(v.number()),
      currency: v.optional(v.string()),
      status: v.optional(
        v.union(
          v.literal("draft"),
          v.literal("sent"),
          v.literal("paid"),
          v.literal("cancelled"),
        ),
      ),
      dueDate: v.optional(v.string()),
      notes: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      ...args.updates,
      updatedAt: Date.now(),
    });
  },
});

export const getInvoices = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return invoices;
  },
});

export const getInvoice = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateInvoiceStatus = mutation({
  args: {
    id: v.id("invoices"),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const deleteInvoice = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
