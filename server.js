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

/*
Sign up user, must provide:
- email
- name
- password

Response:
- Device token
- Redirect to Dashboard
*/
app.post("/signup", async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const accountType = req.body.accountType;

  if (!(firstName && lastName && email && password && accountType)) {
    res.status(400).json({ error: "Insufficient data" });
    return;
  }

  try {
    const result = await executePython("./workers/signup.py", [
      firstName,
      lastName,
      email,
      password,
      accountType,
    ]);

    res.json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

/*
Sign in user, must provide:
- email
- password

Response:
- Device token
- Redirect to Dashboard
*/
app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!(email && password)) {
    res.status(400).json({ error: "Insufficient data" });
    return;
  }

  try {
    const result = await executePython("./workers/signin.py", [
      email,
      password,
    ]);

    res.json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const userRouter = require("./routes/user");
const dataRouter = require("./routes/datas");

function logger(req, res, next) {
  console.log(req.originalUrl);
  next();
}

app.use("/user", userRouter);
app.use("/datas", dataRouter);

app.listen(3000);
