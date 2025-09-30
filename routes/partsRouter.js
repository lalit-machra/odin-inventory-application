import { Router } from "express";
import { getParts, postParts } from "../controllers/parts";

const partsRouter = Router();

partsRouter.get("/", getParts);
partsRouter.post("/", postParts);

export { partsRouter };