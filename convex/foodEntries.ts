import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all food entries for a specific date
export const getByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("foodEntries")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .order("desc")
      .collect();
  },
});

// Get food entries for multiple dates (for viewing previous days)
export const getByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string()
  },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("foodEntries")
      .withIndex("by_date")
      .filter((q) => q.and(
        q.gte(q.field("date"), args.startDate),
        q.lte(q.field("date"), args.endDate)
      ))
      .order("desc")
      .collect();

    // Group by date and calculate totals
    const groupedEntries = entries.reduce((acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = {
          date: entry.date,
          entries: [],
          totalCalories: 0
        };
      }
      acc[entry.date].entries.push(entry);
      acc[entry.date].totalCalories += entry.calories;
      return acc;
    }, {} as Record<string, { date: string; entries: any[]; totalCalories: number }>);

    return Object.values(groupedEntries).sort((a, b) => b.date.localeCompare(a.date));
  },
});

// Add a new food entry
export const add = mutation({
  args: {
    name: v.string(),
    calories: v.number(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const foodEntry = await ctx.db.insert("foodEntries", {
      name: args.name,
      calories: args.calories,
      date: args.date,
      timestamp: Date.now(),
    });
    return foodEntry;
  },
});

// Delete a food entry
export const remove = mutation({
  args: { id: v.id("foodEntries") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get total calories for a specific date
export const getTotalCaloriesByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("foodEntries")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();

    return entries.reduce((total, entry) => total + entry.calories, 0);
  },
});
