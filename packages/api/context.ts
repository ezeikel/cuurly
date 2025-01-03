interface CreateContextOptions {
  headers: Headers;
}

export const createTRPCContext = (opts: CreateContextOptions) => {
  const { headers } = opts;
  return {
    headers,
  };
};

export type Context = ReturnType<typeof createTRPCContext>;
