import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createChat = mutation({
  args: {
    title: v.string(),
    userId: v.id("users"),
    visibility: v.union(v.literal("private"), v.literal("public")),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const chat = await ctx.db.insert("chats", {
      title: args.title,
      userId,
      visibility: args.visibility,
      createdAt: args.createdAt,
    });

    return chat;
  },
});

export const removeChat = mutation({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    await ctx.db.delete(args.id);
  },
});

export const publishChat = mutation({
  args: {
    id: v.id("chats"),
    visibility: v.union(v.literal("private"), v.literal("public")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const chat = await ctx.db.patch(args.id, {
      visibility: args.visibility,
    });

    return chat;
  },
});

export const getAllChats = query({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const chat = await ctx.db.get(args.id);

    if (!chat) {
      return null;
    }

    return chat;
  },
});

export const getUserChats = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const chats = await ctx.db
      .query("chats")
      .withIndex("userId", (query) => query.eq("userId", userId))
      .order("desc")
      .collect();

    return chats;
  },
});
