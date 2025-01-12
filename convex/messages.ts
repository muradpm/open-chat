import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMessageById = query({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const message = await ctx.db.get(args.id);
    if (!message) return null;

    const chat = await ctx.db.get(message.chatId);
    if (!chat) return null;

    if (chat.visibility === "public" || chat.userId === userId) {
      return message;
    }
    return null;
  },
});

export const getMessagesByChatId = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();
  },
});

export const deleteMessagesByChatId = mutation({
  args: {
    chatId: v.id("chats"),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== userId) {
      throw new ConvexError("Unauthorized");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .filter((q) => q.gte(q.field("createdAt"), args.timestamp))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  },
});

export const saveMessages = mutation({
  args: {
    messages: v.array(
      v.object({
        chatId: v.id("chats"),
        content: v.any(),
        role: v.union(v.literal("user"), v.literal("assistant")),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const chat = await ctx.db.get(args.messages[0].chatId);
    if (!chat) throw new ConvexError("Chat not found");
    if (chat.userId !== userId) throw new ConvexError("Unauthorized");

    const timestamp = Date.now();
    const messageIds = await Promise.all(
      args.messages.map((message) =>
        ctx.db.insert("messages", {
          ...message,
          createdAt: timestamp,
        })
      )
    );

    return messageIds;
  },
});

export const voteMessage = mutation({
  args: {
    chatId: v.id("chats"),
    messageId: v.id("messages"),
    isUpvoted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const [chat, message] = await Promise.all([
      ctx.db.get(args.chatId),
      ctx.db.get(args.messageId),
    ]);

    if (!chat || !message) throw new ConvexError("Chat or message not found");
    if (message.chatId !== args.chatId)
      throw new ConvexError("Message does not belong to chat");

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_chat_message", (q) =>
        q.eq("chatId", args.chatId).eq("messageId", args.messageId)
      )
      .unique();

    if (existingVote) {
      return await ctx.db.patch(existingVote._id, {
        isUpvoted: args.isUpvoted,
      });
    }

    return await ctx.db.insert("votes", {
      chatId: args.chatId,
      messageId: args.messageId,
      isUpvoted: args.isUpvoted,
    });
  },
});

export const getVotesByChatId = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const chat = await ctx.db.get(args.chatId);
    if (!chat) throw new ConvexError("Chat not found");
    if (chat.visibility !== "public" && chat.userId !== userId) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db
      .query("votes")
      .withIndex("by_chat_message", (q) => q.eq("chatId", args.chatId))
      .collect();
  },
});
