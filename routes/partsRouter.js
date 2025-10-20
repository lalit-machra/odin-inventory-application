import { Router } from "express";
import { getParts, postParts } from "../controllers/parts.js";

const partsRouter = Router();

partsRouter.get("/", (req, res) => {
  res.redirect("/");
});
partsRouter.get("/:part", getParts);
partsRouter.post("/", postParts);

export { partsRouter };