const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

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

      this.app.get("/api/data", async (req, res) => {
        try {
          const db = this.mongoClient.db("my_database");
          const collection = db.collection("my_collection");
          const data = await collection.find().toArray();
          res.json(data);
        } catch (error) {
          console.error("Error fetching data from MongoDB:", error);
          res.status(500).send("Internal Server Error");
        }
      });

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
