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
  }).index("email", ["email"]),

  chats: defineTable({
    title: v.string(),
    visibility: v.union(v.literal("public"), v.literal("private")),
    createdAt: v.number(),
    userId: v.id("users"),
  }).index("userId", ["userId"]),

  models: defineTable({
    id: v.id("models"),
    label: v.string(),
    apiIdentifier: v.string(),
    description: v.string(),
  }),
});

export default schema;
