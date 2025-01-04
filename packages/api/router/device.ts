import { z } from "zod";
import { db } from "@cuurly/db";
import { publicProcedure } from "../trpc";

export default {
  register: publicProcedure
    .input(
      z.object({
        fcmToken: z.string(),
        oldFcmToken: z.string().optional(),
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

      if (input.oldFcmToken) {
        await db.device.deleteMany({
          where: {
            userId,
            token: input.oldFcmToken,
          },
        });
      }

      const existingDevice = await db.device.findFirst({
        where: {
          userId,
          token: input.fcmToken,
        },
      });

      // if a token is already registered to a users device, just return it
      if (existingDevice) {
        return existingDevice;
      }

      // otherwise, create a new device
      return db.device.create({
        data: {
          token: input.fcmToken,
          userId,
        },
      });
    }),
};
