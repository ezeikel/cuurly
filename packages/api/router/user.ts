import { z } from "zod";
import { publicProcedure } from "../trpc";

export default {
  current: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return null;

    return ctx.db.user.findUnique({
      where: { id: ctx.userId },
    });
  }),
  update: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        username: z.string().optional(),
        email: z.string().email().optional(),
        // ... other fields
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) throw new Error("Not authenticated");

      return ctx.db.user.update({
        where: { id: ctx.userId },
        data: input,
      });
    }),
};
