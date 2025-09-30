import { express } from "express";
import { indexRouter } from "./routes/indexRouter.js";
import { partsRouter } from "./routes/partsRouter.js";

const app = express();
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/parts", partsRouter);

const PORT = 8080;
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log("Server running on http://localhost:8080");
})