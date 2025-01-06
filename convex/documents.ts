import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const saveDocument = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    kind: v.union(v.literal("text"), v.literal("code")),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("documents", {
      ...args,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const getUserDocuments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const createSuggestion = mutation({
  args: {
    documentId: v.id("documents"),
    originalText: v.string(),
    suggestedText: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("suggestions", {
      ...args,
      userId,
      isResolved: false,
      createdAt: Date.now(),
    });
  },
});

export const saveSuggestions = mutation({
  args: {
    suggestions: v.array(
      v.object({
        documentId: v.id("documents"),
        originalText: v.string(),
        suggestedText: v.string(),
        description: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify document exists and user has access
    const doc = await ctx.db.get(args.suggestions[0].documentId);
    if (!doc) throw new Error("Document not found");
    if (doc.userId !== userId) throw new Error("Unauthorized");

    // Insert all suggestions
    const timestamp = Date.now();
    const suggestionIds = await Promise.all(
      args.suggestions.map((suggestion) =>
        ctx.db.insert("suggestions", {
          ...suggestion,
          userId,
          isResolved: false,
          createdAt: timestamp,
        })
      )
    );

    return suggestionIds;
  },
});