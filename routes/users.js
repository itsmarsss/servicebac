/*
All user related API requests reside on this file.

The department that set this website up will allow users to create accounts:
- email
- name
- password

All users will be treated equal; no hierarchy.
NOTE: server admin/console user can perform higher permission activities.
*/

const { executePython } = require("../pythonExecutor");
const express = require('express');

const router = express.Router();

/*
Users dashboard will allow the following:
- partner searching
- partner service searching
- editing user profile
*/
router.get("/", (req, res) => {
    res.send("/dashboard");
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
router.post("/signup", async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    if(!(firstName && lastName && email && password)) {
        res.status(400).json({ error: "Insufficient data" });
        return;
    }

    try {
        const result = await executePython('./workers/signup.py', [firstName, lastName, email, password]);

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
router.post("/signin", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!(email && password)) {
        res.status(400).json({ error: "Insufficient data" });
        return;
    }

    try {
        const result = await executePython('./workers/signin.py', [email, password]);

        res.json({ result: result });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

/*
Get user/query user, must provide at least 1:
- ID
- name
- email
*/
router.get("/get/", (req, res) => {
    const id = req.query.id;
    const name = req.query.name;
    const email = req.query.email;

    console.log(id);
    console.log(name);
    console.log(email);

    if (id) {
        res.send(`Get user With ID ${id}`);
    } else if (name) {
        res.send(`Get user With NAME ${org}`);
    } else if (email) {
        res.send(`Get user With EMAIL ${org}`);
    }
});

module.exports = router;