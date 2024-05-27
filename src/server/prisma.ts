import { Prisma, PrismaClient } from "@prisma/client";
import { env } from "@/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "test"
        ? ["query", "warn", "error"]
        : env.NODE_ENV === "development"
          ? ["warn", "error"]
          : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export const dbAdmin = db.$extends(bypassRLS());

// Prisma extension to bypass RLS
function bypassRLS() {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            const [, result] = await prisma.$transaction([
              prisma.$executeRaw`SELECT set_config('app.bypass_rls', 'on', TRUE)`,
              query(args),
            ]);
            return result;
          },
        },
      },
    }),
  );
}
