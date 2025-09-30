import { Router } from "express";
import { getCategories, postCategories } from "../controllers/categories.js";

const indexRouter = Router();

indexRouter.get("/", getCategories);
indexRouter.post("/", postCategories);

export { indexRouter }