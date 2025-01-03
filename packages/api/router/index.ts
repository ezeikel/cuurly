import { publicProcedure, router } from "../trpc";
import userRouter from "./user";
import deviceRouter from "./device";

export const appRouter = router({
  greeting: publicProcedure.query(() => "Hello World"),
  user: userRouter,
  device: deviceRouter,
});

export type AppRouter = typeof appRouter;
