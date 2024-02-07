const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/users/dashboard");
});

router.get("/dashboard", (req, res) => {
    res.send("Dashboard");
});

router.get("/getentries/:count", (req, res) => {

});

router.get("/search/:search", (req, res) => {

});

router.get("/getid/:id", (req, res) => {
    res.send(`Get user With ID ${req.params.id}`);
});

router.get("/getorg/:org", (req, res) => {
    res.send(`Get user With ORG ${req.params.org}`);
});

module.exports = router;