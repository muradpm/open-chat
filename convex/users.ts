import { getAuthUserId, getAuthSessionId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const getAuthenticatedUser = query({
  args: {},
  handler: async (ctx) => {
    const [userId, sessionId] = await Promise.all([
      getAuthUserId(ctx),
      getAuthSessionId(ctx),
    ]);

    if (!userId || !sessionId) {
      throw new Error("Not authenticated");
    }

    const [user, session] = await Promise.all([
      ctx.db.get(userId),
      ctx.db.get(sessionId),
    ]);

    if (!user || !session) {
      throw new Error("User or session not found");
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
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});
