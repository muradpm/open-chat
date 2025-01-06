import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const saveChat = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("chats", {
      title: args.title,
      userId,
      visibility: "private",
      createdAt: Date.now(),
    });
  },
});

export const getChatById = query({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const chat = await ctx.db.get(args.id);
    if (!chat) return null;

    if (chat.visibility === "public" || chat.userId === userId) {
      return chat;
    }
    return null;
  },
});

export const getChatsByUserId = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    return await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.or(
          q.eq(q.field("visibility"), "public"),
          q.eq(q.field("userId"), currentUserId)
        )
      )
      .order("desc")
      .collect();
  },
});

export const deleteChatById = mutation({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const chat = await ctx.db.get(args.id);
    if (!chat || chat.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db
      .query("votes")
      .withIndex("by_chat_message", (q) => q.eq("chatId", args.id))
      .collect()
      .then((votes) => {
        votes.forEach((vote) => ctx.db.delete(vote._id));
      });

    await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.id))
      .collect()
      .then((messages) => {
        messages.forEach((message) => ctx.db.delete(message._id));
      });

    await ctx.db.delete(args.id);
  },
});

export const updateChatVisibility = mutation({
  args: {
    id: v.id("chats"),
    visibility: v.union(v.literal("private"), v.literal("public")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const chat = await ctx.db.get(args.id);
    if (!chat || chat.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.patch(args.id, {
      visibility: args.visibility,
    });
  },
});
