import { db } from "@cuurly/db";
import { publicProcedure } from "../trpc";

export default {
  current: publicProcedure.query(
    async () =>
      // if (!ctx.userId) return null;

      // TODO: add userId to trpc context
      db.user.findFirst(),

    // return db.user.findFirst({
    //   where: { id: ctx.userId },
    // });
  ),
};
