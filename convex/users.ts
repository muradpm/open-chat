import { getAuthUserId, getAuthSessionId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const getAuthenticatedUser = query({
  args: {},
  handler: async (ctx) => {
    const [userId, sessionId] = await Promise.all([
      getAuthUserId(ctx),
      getAuthSessionId(ctx),
    ]);

    if (!userId || !sessionId) {
      return null;
    }

    const [user, session] = await Promise.all([
      ctx.db.get(userId),
      ctx.db.get(sessionId),
    ]);

    if (!user || !session) {
      throw new ConvexError("User or session not found");
    }

    return {
      session,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    };
  },
});

export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return user;
  },
});
