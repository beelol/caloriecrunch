import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.optional(v.boolean()),
  }),

  foodEntries: defineTable({
    name: v.string(),
    calories: v.number(),
    date: v.string(), // Format: YYYY-MM-DD
    timestamp: v.number(),
  }).index("by_date", ["date"]),
});
