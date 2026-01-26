import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    kindeId: v.string(),
    email: v.string(),
    name: v.string(),
    businessName: v.optional(v.string()),
    businessEmail: v.optional(v.string()),
    businessPhone: v.optional(v.string()),
    businessAddress: v.optional(v.string()),
    preferredCurrency: v.optional(v.string()),
    theme: v.string(),
    createdAt: v.number(),
  }).index("by_kinde_id", ["kindeId"]),

  invoices: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  settings: defineTable({
    userId: v.string(),
    invoicePrefix: v.string(),
    nextInvoiceNumber: v.number(),
    defaultCurrency: v.string(),
    defaultTax: v.number(),
    paymentTerms: v.string(),
    signature: v.optional(v.string()),
  }).index("by_user", ["userId"]),
});
