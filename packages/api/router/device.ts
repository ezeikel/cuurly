import { z } from "zod";
import { publicProcedure } from "../trpc";

export default {
  register: publicProcedure
    .input(
      z.object({
        fcmToken: z.string(),
        // TODO for testing purposes only - remove this
        testUserId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId || input.testUserId;

      if (!userId) {
        throw new Error("No user ID provided");
      }

      const existingDevice = await ctx.db.device.findFirst({
        where: {
          userId,
          token: input.fcmToken,
        },
      });

      if (existingDevice) {
        return existingDevice;
      }

      return ctx.db.device.create({
        data: {
          token: input.fcmToken,
          userId,
        },
      });
    }),
};
