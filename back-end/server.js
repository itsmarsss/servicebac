const express = require("express");
const cors = require('cors');

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);
app.use(cors());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    console.log("Root");
    res.render("index", { name: "Marsss!" });
});

const userRouter = require("./routes/user");
const partnerRouter = require("./routes/partner");

function logger(req, res, next) {
    console.log(req.originalUrl);
    console.log(req.socket.remoteAddress);

    next();
}

app.use("/api/user", userRouter);
app.use("/api/partner", partnerRouter);

app.listen(3000);
