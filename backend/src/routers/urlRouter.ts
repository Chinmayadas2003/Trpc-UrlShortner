import {z} from "zod";
import {tRPC} from "../context";
import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();
//key-procedure and value-implementation in the router object
export const urlRouter = tRPC.router({
    //using trpc procedure object to define an endpoint
    getShortUrl: tRPC.procedure
        .input(z.object({shortCode: z.string()}))
        .query(async ({input}) => {
            return await prisma.url.findUnique({
                where: {
                    shortCode: input.shortCode
                }
            });
        }),

    createShortUrl: tRPC.procedure
        .input(z.object({
            originalUrl: z.string().url(),}))
            .mutation(async ({input}) => {
                const shortCode = Math.random().toString(36).substring(2, 8);
                return await prisma.url.create({
                    data: {
                        originalUrl: input.originalUrl,
                        shortCode: shortCode,
                    },
                });
            })

});


export type AppRouter = typeof urlRouter;