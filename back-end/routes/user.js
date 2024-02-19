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
const { mongoClient } = require("../api/mongodb");

require("dotenv").config();

const router = express.Router();

router.use(authorization);

const userDatabase = process.env.USER_DATABASE;
const userCollection = process.env.USER_COLLECTION;

// Create users collection
router.post("/create-users-collection", async (req, res) => {
  try {
    const db = mongoClient.db(userDatabase);
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((collection) => collection.name);

    if (!collectionNames.includes(userCollection)) {
      await db.createCollection(userCollection);
      return res.json({
        success: true,
        message: "Users collection created successfully",
      });
    }

    res.json({
      success: false,
      message: "Users collection already exists",
    });
  } catch (error) {
    console.error("Error creating users collection:", error);
    res.status(500).send("Internal Server Error");
  }
});

/*
Users dashboard will allow the following:
- partner searching
- partner service searching
- editing user profile
*/
router.get("/dashboard", async (req, res) => {
  try {
    const db = mongoClient.db(userDatabase);
    const collection = db.collection(userCollection);

    const token = req.headers["authorization"].split(" ")[1];

    const user = await collection.findOne({
      userToken: token,
    });
    if (!user) {
      return res.json({
        success: false,
        message: "Token not found",
      });
    }

    const { password, userToken, ...sanitizedUser } = user;

    res.json({
      success: true,
      ...sanitizedUser
    });
  } catch (error) {
    console.error("Error querying token:", error);
    res.status(500).send("Internal Server Error");
  }
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
  const accountType = req.body.accountType;
  const companyName = req.body.companyName;
  const city = req.body.city;
  const country = req.body.country;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  if (!(accountType && email && password)) {
    res.json({
      success: false,
      message: "Insufficient data",
    });
    return;
  }

  if (accountType === "company") {
    if (!(companyName && city && country)) {
      res.json({
        success: false,
        message: "Insufficient data",
      });
      return;
    }
  } else if (accountType === "department") {
    if (!(firstName && lastName)) {
      res.json({
        success: false,
        message: "Insufficient data",
      });
      return;
    }
  } else {
    res.json({
      success: false,
      message: "Invalid account type",
    });
    return;
  }

  try {
    const db = mongoClient.db(userDatabase);
    const collection = db.collection(userCollection);

    const existingUser = await collection.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return res.json({
        success: false,
        message: "Account with the same email already exists",
      });
    }

    const user_data = accountType === "company" ? {
      accountType: accountType,
      companyName: companyName,
      city: city,
      country: country,
      email: email.toLowerCase(),
      password: password,
    } : {
      accountType: accountType,
      firstName: firstName,
      lastName: lastName,
      email: email.toLowerCase(),
      password: password,
    };

    const user_tokid = await executePython("./workers/createUser.py", []);
    const result = await collection.insertOne({ ...user_tokid, ...user_data });
    res.json({
      success: true,
      ...user_tokid,
      ...user_data,
      ...result,
    });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).send("Internal Server Error");
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

  if (!(email && password)) {
    res.json({
      success: false,
      message: "Insufficient data",
    });
    return;
  }

  try {
    const db = mongoClient.db(userDatabase);
    const collection = db.collection(userCollection);

    const user = await collection.findOne({
      email: email.toLowerCase(),
      password: password,
    });
    if (!user) {
      return res.json({
        success: false,
        message: "Incorrect username/password",
      });
    }

    res.json({
      success: true,
      userToken: user.userToken,
      userId: user.userId,
    });
  } catch (error) {
    console.error("Error querying token:", error);
    res.status(500).send("Internal Server Error");
  }
});

/*
Update user profile will allow the change of:
- email
- password
- first name
- last name
*/
router.put("/update-profile", async (req, res) => {
  const accountType = req.body.accountType;
  const companyName = req.body.companyName;
  const city = req.body.city;
  const country = req.body.country;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  if (!(accountType && email && password)) {
    res.json({
      success: false,
      message: "Insufficient data",
    });
    return;
  }

  if (accountType === "company") {
    if (!(companyName && city && country)) {
      res.json({
        success: false,
        message: "Insufficient data",
      });
      return;
    }
  } else if (accountType === "department") {
    if (!(firstName && lastName)) {
      res.json({
        success: false,
        message: "Insufficient data",
      });
      return;
    }
  } else {
    res.json({
      success: false,
      message: "Invalid account type",
    });
    return;
  }

  try {
    const db = mongoClient.db(userDatabase);
    const collection = db.collection(userCollection);

    const existingUser = await collection.findOne({
      email: email.toLowerCase(),
    });

    const userToken = req.headers["authorization"].split(" ")[1];
    if (existingUser && existingUser.userToken !== userToken) {
      return res.json({
        success: false,
        message: "Account with the same email already exists",
      });
    }

    const user_data = accountType === "company" ? {
      accountType: accountType,
      companyName: companyName,
      city: city,
      country: country,
      email: email.toLowerCase(),
      password: password,
    } : {
      accountType: accountType,
      firstName: firstName,
      lastName: lastName,
      email: email.toLowerCase(),
      password: password,
    };

    const result = await collection.updateOne(
      { userToken: userToken },
      { $set: user_data }
    );
    res.json({
      success: true,
      userToken: userToken,
      ...user_data,
      ...result,
    });
  } catch (error) {
    console.error("Error updating user with token:", error);
    res.status(500).send("Internal Server Error");
  }
});

/*
Delete user profile will delete profile
*/
router.delete("/delete-profile", async (req, res) => {
  const userToken = req.headers["authorization"].split(" ")[1];

  try {
    const db = mongoClient.db(userDatabase);
    const collection = db.collection(userCollection);

    const result = await collection.deleteOne({ userToken: userToken });

    if (result.deletedCount === 0) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Query user by email
router.get("/email/:email", async (req, res) => {
  try {
    const db = mongoClient.db(userDatabase);
    const collection = db.collection(userCollection);

    const user = await collection.findOne({ email: req.params.email.toLowerCase() });

    if (!user) {
      return res.json({
        success: false,
        message: "Accounts not found",
      });
    }

    const { password, userToken, ...sanitizedUser } = user;

    res.json({
      success: true,
      ...sanitizedUser
    });
  } catch (error) {
    console.error("Error querying user by email:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Query user by id
router.get("/id/:id", async (req, res) => {
  try {
    const db = mongoClient.db(userDatabase);
    const collection = db.collection(userCollection);

    const user = await collection.findOne({ userId: parseInt(req.params.id) });

    if (!user) {
      return res.json({
        success: false,
        message: "Accounts not found",
      });
    }

    const { password, userToken, ...sanitizedUser } = user;

    res.json({
      success: true,
      ...sanitizedUser
    });
  } catch (error) {
    console.error("Error querying user by id:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function authorization(req, res, next) {
  if (
    req.originalUrl === "/api/user/signup" ||
    req.originalUrl === "/api/user/signin"
  ) {
    next();
    return;
  }

  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const userToken = authHeader.split(" ")[1];

    if (userToken === "admin") {
      next();
      return;
    }

    try {
      const db = mongoClient.db(userDatabase);
      const collection = db.collection(userCollection);

      const user = await collection.findOne({
        userToken: userToken,
      });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      next();
    } catch (error) {
      console.error("Error querying user:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }
}

module.exports = router;
