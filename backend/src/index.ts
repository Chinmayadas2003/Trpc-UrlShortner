import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import {tRPC} from "./context";
import {urlRouter} from "./routers/urlRouter";
import * as trpcExpress from "@trpc/server/adapters/express";

const app = express();
app.use(cors());

//client will access trpc endpoints at /trpc->basic entry point
app.use('/trpc', trpcExpress.createExpressMiddleware({
    router: urlRouter,
    createContext: () => ({}),
}));
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});