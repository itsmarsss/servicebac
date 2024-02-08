/*
All partner related API requests reside on this file.
*/

const express = require("express");
const { executePython } = require("../pythonExecutor");
const { mongoClient } = require("../mongodb");

require("dotenv").config();

const router = express.Router();

router.use(authorization);

const partnerDatabase = process.env.PARTNER_DATABASE;
const partnerCollection = process.env.PARTNER_COLLECTION;

// Create users collection
router.post("/create-partners-collection", async (req, res) => {
  try {
    const db = mongoClient.db(partnerDatabase);
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((collection) => collection.name);
    
    if (!collectionNames.includes(partnerCollection)) {
      await db.createCollection(partnerCollection);
      return res.json({
        success: true,
        message: "Partners collection created successfully",
      });
    }

    res.json({
      success: false,
      message: "Partners collection already exists",
    });
  } catch (error) {
    console.error("Error creating partners collection:", error);
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
    const result = await executePython("./workers/dashboard.py", [
      req.headers["authorization"].split(" ")[1],
    ]);

    res.json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error });
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
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const accountType = req.body.accountType;

  if (!(firstName && lastName && email && password && accountType)) {
    res.json({
      success: false,
      message: "Insufficient data",
    });
    return;
  }

  try {
    const db = mongoClient.db(partnerDatabase);
    const collection = db.collection(partnerCollection);

    const existingUser = await collection.findOne({
      email: req.body.email,
    });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User with the same email already exists",
      });
    }

    const user_data = await executePython("./workers/signup.py", []);
    const result = await collection.insertOne({ ...user_data, ...req.body });
    res.json({
      success: true,
      ...user_data,
      ...req.body,
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
    const db = mongoClient.db(partnerDatabase);
    const collection = db.collection(partnerCollection);

    const user = await collection.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!user) {
      return res.json({
        success: false,
        message: "Unauthorized access",
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
router.post("/update-profile", async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  if (!(firstName && lastName && email && password)) {
    res.json({
      success: false,
      message: "Insufficient data",
    });
    return;
  }

  try {
    const db = mongoClient.db(partnerDatabase);
    const collection = db.collection(partnerCollection);

    const existingUser = await collection.findOne({
      email: req.body.email,
    });

    const userToken = req.headers["authorization"].split(" ")[1];
    if (existingUser && existingUser.userToken !== userToken) {
      return res.json({
        success: false,
        message: "User with the same email already exists",
      });
    }

    const result = await collection.updateOne(
      { userToken: userToken },
      { $set: req.body }
    );
    res.json({
      success: true,
      userToken: userToken,
      userId: existingUser.userId,
      ...req.body,
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
router.post("/delete-profile", async (req, res) => {
  const userToken = req.headers["authorization"].split(" ")[1];

  try {
    const db = mongoClient.db(partnerDatabase);
    const collection = db.collection(partnerCollection);

    const result = await collection.deleteOne({ userToken: userToken });

    if (result.deletedCount === 0) {
      return res.json({ message: "User not found" });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error("Error querying token:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Query user by email
router.get("/email/:email", async (req, res) => {
  try {
    const db = mongoClient.db(partnerDatabase);
    const collection = db.collection(partnerCollection);

    const user = await collection.findOne({ email: req.params.email });

    if (!user) {
      return res.json({
        success: false,
        message: "Accounts not found",
      });
    }

    res.json({
      success: true,
      email: user.accountType === "partner" ? user.email : "[REDACTED]",
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      accountType: user.accountType,
    });
  } catch (error) {
    console.error("Error querying user by email:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Query user by id
router.get("/id/:id", async (req, res) => {
  try {
    const db = mongoClient.db(partnerDatabase);
    const collection = db.collection(partnerCollection);

    const user = await collection.findOne({ userId: parseInt(req.params.id) });

    if (!user) {
      return res.json({
        success: false,
        message: "Accounts not found",
      });
    }

    res.json({
      success: true,
      email: user.accountType === "partner" ? user.email : "[REDACTED]",
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      accountType: user.accountType,
    });
  } catch (error) {
    console.error("Error querying user by id:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function authorization(req, res, next) {
  console.log(req.originalUrl);
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

    try {
      const db = mongoClient.db(partnerDatabase);
      const collection = db.collection(partnerCollection);

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
      console.error("Error querying token:", error);
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
