import express from "express";
import { indexRouter } from "./routes/indexRouter.js";
import { partsRouter } from "./routes/partsRouter.js";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/", indexRouter);
app.use("/parts", partsRouter);

const PORT = 8080;
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log("Server running on http://localhost:8080");
})