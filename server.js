const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log("Root");
    res.render("index", { name: "Marsss!" });
});

app.get("/dashboard", (req, res) => {
    res.send("Dashboard");
});

const userRouter = require('./routes/users');
const dataRouter = require('./routes/datas');

function logger(req, res, next) {
    console.log(req.originalUrl);
    next();
}

app.use('/users', userRouter);
app.use('/datas', dataRouter);

app.listen(3000);