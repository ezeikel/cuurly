import { db } from "@cuurly/db";
import { authenticatedProcedure } from "../trpc";

export default {
  feed: authenticatedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    if (!userId) return [];

    const followedUsers = await db.user
      .findUnique({ where: { id: userId } })
      ?.following();
    const followedUserIds = followedUsers?.map((user) => user.id) ?? [];

    return db.post.findMany({
      where: {
        author: { id: { in: [...followedUserIds, userId] } },
        deletedAt: null,
        published: true,
        archived: false,
      },
      select: {
        id: true,
        caption: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            verified: true,
            profile: {
              select: {
                picture: { select: { url: true } },
              },
            },
          },
        },
        media: {
          select: {
            type: true,
            url: true,
          },
        },
        likes: {
          select: {
            id: true,
            user: { select: { id: true, username: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),
};
