const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const userDatabase = process.env.USER_DATABASE;
const userCollection = process.env.USER_COLLECTION;

class MongoDBServer {
  constructor(port) {
    this.port = port;
    this.app = express();
    this.mongoClient = null;
    this.initialize();
  }

  async initialize() {
    try {
      const mongoURI = process.env.MONGO_URI;
      console.log(mongoURI);

      this.mongoClient = new MongoClient(mongoURI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      await this.mongoClient.connect();
      console.log("Connected to MongoDB");

      this.app.use(express.json());
      this.app.use(logger);

      // Create users collection
      this.app.post("/api/create-users-collection", async (req, res) => {
        try {
          const db = this.mongoClient.db(userDatabase);
          const collections = await db.listCollections().toArray();
          const collectionNames = collections.map(
            (collection) => collection.name
          );
          if (!collectionNames.includes(userCollection)) {
            await db.createCollection(userCollection);
            res.json({ message: "Users collection created successfully" });
          } else {
            res.json({ message: "Users collection already exists" });
          }
        } catch (error) {
          console.error("Error creating users collection:", error);
          res.status(500).send("Internal Server Error");
        }
      });

      // Query user by email
      this.app.get("/api/user/email/:email", async (req, res) => {
        try {
          const db = this.mongoClient.db(userDatabase);
          const collection = db.collection(userCollection);
          const user = await collection.findOne({ email: req.params.email });
          res.json(user);
        } catch (error) {
          console.error("Error querying user by email:", error);
          res.status(500).send("Internal Server Error");
        }
      });

      // Query user by token
      this.app.get("/api/user/token/:token", async (req, res) => {
        try {
          const db = this.mongoClient.db(userDatabase);
          const collection = db.collection(userCollection);
          const user = await collection.findOne({ token: req.params.token });
          res.json(user);
        } catch (error) {
          console.error("Error querying user by token:", error);
          res.status(500).send("Internal Server Error");
        }
      });

      // Query user by id
      this.app.get("/api/user/id/:id", async (req, res) => {
        try {
          const db = this.mongoClient.db(userDatabase);
          const collection = db.collection(userCollection);
          const user = await collection.findOne({ id: req.params.id });
          res.json(user);
        } catch (error) {
          console.error("Error querying user by id:", error);
          res.status(500).send("Internal Server Error");
        }
      });

      // Insert user
      // Insert user
      this.app.post("/api/user", async (req, res) => {
        try {
          const db = this.mongoClient.db(userDatabase);
          const collection = db.collection(userCollection);

          const existingUser = await collection.findOne({
            email: req.body.email,
          });
          if (existingUser) {
            return res.json({
              message: "User with the same email already exists",
            });
          }

          const result = await collection.insertOne(req.body);
          res.json(result);
        } catch (error) {
          console.error("Error inserting user:", error);
          res.status(500).send("Internal Server Error");
        }
      });

      // Update user with token
      this.app.put("/api/user/token/:token", async (req, res) => {
        try {
          const db = this.mongoClient.db(userDatabase);
          const collection = db.collection(userCollection);

          const existingUser = await collection.findOne({
            email: req.body.email,
          });
          if (existingUser && existingUser.token !== req.params.token) {
            return res
              .status(409)
              .json({ message: "User with the same email already exists" });
          }

          // If no conflict, proceed with the update
          const result = await collection.updateOne(
            { token: req.params.token },
            { $set: req.body }
          );
          res.json(result);
        } catch (error) {
          console.error("Error updating user with token:", error);
          res.status(500).send("Internal Server Error");
        }
      });

      function logger(req, res, next) {
        console.log(req.originalUrl);
        next();
      }

      this.app.listen(this.port, () => {
        console.log(`MongoDB server listening on port ${this.port}`);
      });
    } catch (error) {
      console.error("Failed to initialize MongoDB server:", error);
    }
  }

  close() {
    if (this.mongoClient) {
      this.mongoClient.close();
      console.log("MongoDB connection closed.");
    }
    this.app.close();
    console.log("MongoDB server stopped.");
  }
}

module.exports = MongoDBServer;
