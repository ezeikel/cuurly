import { db } from "@cuurly/db";
import { authenticatedProcedure } from "../trpc";

export default {
  current: authenticatedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return null;

    return db.user.findUnique({
      where: { id: ctx.userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        profile: {
          select: {
            picture: {
              select: {
                url: true,
              },
            },
          },
        },
      },
    });
  }),
};
