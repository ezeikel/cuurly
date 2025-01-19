import { z } from "zod";
import { db } from "@cuurly/db";
import admin from "../lib/firebase";
import { authenticatedProcedure, publicProcedure } from "../trpc";

export default {
  register: authenticatedProcedure
    .input(
      z.object({
        fcmToken: z.string(),
        oldFcmToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

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

  sendTestNotification: publicProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // get all device tokens from the database
      const devices = await db.device.findMany({
        select: {
          token: true,
        },
      });

      const tokens = devices.map((device) => device.token);

      if (tokens.length === 0) {
        throw new Error("No device tokens found in the database");
      }

      try {
        // send notification to all tokens
        const response = await admin.messaging().sendEachForMulticast({
          notification: {
            title: input.title,
            body: input.body,
          },
          tokens,
        });

        return {
          success: true,
          successCount: response.successCount,
          failureCount: response.failureCount,
          results: response.responses,
        };
      } catch (error) {
        console.error("Error sending notifications:", error);
        throw new Error("Failed to send notifications");
      }
    }),
};
