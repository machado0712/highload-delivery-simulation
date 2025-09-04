import cors from "cors";
import * as dotenv from "dotenv";
import express, { type Application } from "express";

import orderRoutes from "@/routes/orderRoutes";
import restaurantRoutes from "@/routes/restaurantRoutes";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/orders", orderRoutes);
app.use("/restaurants", restaurantRoutes);

export default app;
