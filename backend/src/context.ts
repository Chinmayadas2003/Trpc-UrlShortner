import { PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";

export const tRPC = initTRPC.create();


export const t = new PrismaClient();