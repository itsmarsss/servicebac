const express = require("express");
const { executePython } = require("./pythonExecutor");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log("Root");
  res.render("index", { name: "Marsss!" });
});

const userRouter = require("./routes/user");
const partnerRouter = require("./routes/partner");

function logger(req, res, next) {
  console.log(req.originalUrl);
  next();
}

app.use("/api/user", userRouter);
app.use("/api/partner", partnerRouter);

app.listen(3000);
