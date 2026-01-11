import express from "express"
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";
import { app } from "./socket";


app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use("/api", routes);
app.use(errorHandler);
