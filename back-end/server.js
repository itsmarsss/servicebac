const express = require("express");
const cors = require("cors");
const path = require("path");

const { isPythonAvailable } = require("./pythonExecutor");
const startServer = async () => {
    if (!await isPythonAvailable()) {
        console.log("Server needs `python3` (or `python`) to be able to run.");
        return;
    }

    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(logger);
    app.use(cors());

    app.use(express.static(path.join(__dirname, "build")));

    app.set("view engine", "ejs");

    app.get("/", (req, res) => {
        console.log("Root");
        res.render("index", { name: "User!" });
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

    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, "build", "index.html"));
    });

    app.listen(3000);
}

startServer();
