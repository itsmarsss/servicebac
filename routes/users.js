const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send("/dashboard");
});

router.post("/signup", (req, res) => {

});

router.post("/signin", (req, res) => {

});

router.get("/get/", (req, res) => {
    const id = req.query.id;
    const org = req.query.org;

    console.log(id);
    console.log(org);

    if(id) {
        res.send(`Get user With ID ${id}`);
    } else if(org){
        res.send(`Get user With ORG ${org}`);
    } else{
        res.redirect("/users");
    }
});

module.exports = router;