const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log("Root");
    res.render("index", { name: "Marsss!" });
});

const userRouter = require('./routes/users');

app.use('/users', userRouter);

app.listen(3000);