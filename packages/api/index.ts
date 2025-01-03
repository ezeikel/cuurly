import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./router";

export { appRouter } from "./router";
export { createTRPCContext } from "./context";
export type { AppRouter };
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
