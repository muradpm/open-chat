import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
  }).index("by_email", ["email"]),

  chats: defineTable({
    title: v.string(),
    userId: v.id("users"),
    visibility: v.union(v.literal("public"), v.literal("private")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_visibility", ["visibility"]),

  messages: defineTable({
    chatId: v.id("chats"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("tool")),
    content: v.any(),
    createdAt: v.number(),
  })
    .index("by_chat", ["chatId"])
    .index("by_created", ["createdAt"]),

  votes: defineTable({
    chatId: v.id("chats"),
    messageId: v.id("messages"),
    isUpvoted: v.boolean(),
  }).index("by_chat_message", ["chatId", "messageId"]),

  documents: defineTable({
    createdAt: v.number(),
    title: v.string(),
    content: v.optional(v.string()),
    kind: v.union(v.literal("text"), v.literal("code")),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"]),

  suggestions: defineTable({
    documentId: v.id("documents"),
    originalText: v.string(),
    suggestedText: v.string(),
    description: v.optional(v.string()),
    isResolved: v.boolean(),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_document", ["documentId"])
    .index("by_user", ["userId"])
    .index("by_resolved", ["isResolved"]),
});

export default schema;
