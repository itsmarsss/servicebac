/*
All user related API requests reside on this file.

The department that set this website up will allow users to create accounts:
- email
- name
- password

All users will be treated equal; no hierarchy.
NOTE: server admin/console user can perform higher permission activities.
*/

const express = require("express");
const { executePython } = require("../pythonExecutor");

const router = express.Router();

router.use(authorization);

/*
Users dashboard will allow the following:
- partner searching
- partner service searching
- editing user profile
*/
router.get("/dashboard", async (req, res) => {
  try {
    const result = await executePython("./workers/dashboard.py", [
      req.headers["authorization"].split(" ")[1],
    ]);

    res.json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

/*
Update user profile will allow the change of:
- email
- password
- first name
- last name
*/
router.post("/update-profile", async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  if (!(firstName && lastName && email && password)) {
    res.status(400).json({ error: "Insufficient data" });
    return;
  }

  try {
    const result = await executePython("./workers/updateProfile.py", [
      firstName,
      lastName,
      email,
      password,
    ]);

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

async function authorization(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const userToken = authHeader.split(" ")[1];

    try {
      const result = await executePython("./workers/authorization.py", [
        userToken,
      ]);

      if (result.authorized) {
        next();
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
}

module.exports = router;
