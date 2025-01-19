import { router } from "../trpc";
import userRouter from "./user";
import deviceRouter from "./device";
import authRouter from "./auth";
import postRouter from "./post";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  device: deviceRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
