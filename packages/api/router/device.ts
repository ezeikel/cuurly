import { z } from "zod";
import { db } from "@cuurly/db";
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .mutation(async ({ ctx, input }) => {
      // TODO: add userId to trpc context
      // const userId = ctx.userId || input.testUserId;
      const userId = input.testUserId;

      if (!userId) {
        throw new Error("No user ID provided");
      }

      const existingDevice = await db.device.findFirst({
        where: {
          userId,
          token: input.fcmToken,
        },
      });

      if (existingDevice) {
        return existingDevice;
      }

      return db.device.create({
        data: {
          token: input.fcmToken,
          userId,
        },
      });
    }),
};
