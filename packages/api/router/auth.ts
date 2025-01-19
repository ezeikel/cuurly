import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { sign } from "jsonwebtoken";
import { db } from "@cuurly/db";
import { publicProcedure } from "../trpc";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const signInInput = z.object({
  user: z.object({
    email: z.string(),
    familyName: z.string().optional(),
    givenName: z.string().optional(),
    id: z.string(),
    name: z.string(),
    photo: z.string().optional(),
  }),
});

export default {
  signIn: publicProcedure.input(signInInput).mutation(async ({ input }) => {
    try {
      const existingUser = await db.user.findUnique({
        where: { email: input.user.email },
      });

      if (existingUser) {
        const token = sign(
          {
            userId: existingUser.id,
            email: existingUser.email,
          },
          JWT_SECRET,
          { expiresIn: "7d" },
        );

        return {
          token,
          user: existingUser,
        };
      }

      const newUser = await db.user.create({
        data: {
          email: input.user.email,
          name: input.user.name,
          username: Math.random().toString(36).substring(2, 15), // generate random username
          profile: {
            create: {
              picture: input.user.photo
                ? {
                    create: {
                      url: input.user.photo,
                      publicId: `google_${input.user.id}`,
                    },
                  }
                : undefined,
            },
          },
        },
      });

      const token = sign(
        {
          userId: newUser.id,
          email: newUser.email,
        },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      return {
        token,
        user: newUser,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to sign in user",
        cause: error,
      });
    }
  }),
};
