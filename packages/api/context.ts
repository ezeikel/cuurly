import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface CreateContextOptions {
  headers: Headers;
}

export const createTRPCContext = async (opts: CreateContextOptions) => {
  const { headers } = opts;
  const authHeader = headers.get("Authorization");

  let userId: string | undefined;

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    try {
      const decoded = verify(token, JWT_SECRET) as { userId: string };
      userId = decoded.userId;
    } catch (error) {
      console.error("Failed to verify JWT token:", error);
    }
  }

  return {
    headers,
    userId,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
