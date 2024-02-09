/*
All partner related API requests reside on this file.
*/

const express = require("express");
const { executePython } = require("../pythonExecutor");
const { mongoClient } = require("../api/mongodb");
const { cohereClient } = require("../api/cohereai");

require("dotenv").config();

const router = express.Router();

router.use(authorization);

const userDatabase = process.env.USER_DATABASE;
const userCollection = process.env.USER_COLLECTION;
const partnerDatabase = process.env.PARTNER_DATABASE;
const partnerCollection = process.env.PARTNER_COLLECTION;

const cohereModel = process.env.COHERE_MODEL;

// Create partners collection
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
Service, creates service, requires:
- name
- category
- data...
*/
router.post("/create-service", async (req, res) => {
  const serviceName = req.body.serviceName;
  const category = req.body.category;
  const data = req.body.data;

  if (!(serviceName && category)) {
    res.json({
      success: false,
      message: "Insufficient data",
    });
    return;
  }

  try {
    const db = mongoClient.db(partnerDatabase);
    const collection = db.collection(partnerCollection);

    const userToken = req.headers["authorization"].split(" ")[1];
    const service_data = {
      ownerToken: userToken,
      serviceName: serviceName,
      category: category,
      data: data,
    };

    const service_tokid = await executePython("./workers/createService.py", []);
    const result = await collection.insertOne({
      ...service_tokid,
      ...service_data,
    });

    const dataValues = Object.values(data).join(" ");

    const embed = await cohereClient.embed({
      texts: [serviceName, category, dataValues],
      model: cohereModel,
      inputType: "classification",
    });

    const serviceEmbeddings = embed.embeddings[0];

    await collection.updateOne(
      { _id: result.insertedId },
      { $set: { embeddings: serviceEmbeddings } }
    );

    res.json({
      success: true,
      ...service_tokid,
      ...service_data,
      ...result,
    });
  } catch (error) {
    console.error("Error inserting service:", error);
    res.status(500).send("Internal Server Error");
  }
});

/*
Update service will allow the change of:
- name
- category
- data...
*/
router.put("/update-service", async (req, res) => {
  const serviceId = req.body.serviceId;
  const serviceName = req.body.serviceName;
  const category = req.body.category;
  const data = req.body.data;

  if (!(serviceId && serviceName && category)) {
    res.json({
      success: false,
      message: "Insufficient data",
    });
    return;
  }

  try {
    const db = mongoClient.db(partnerDatabase);
    const collection = db.collection(partnerCollection);

    const userToken = req.headers["authorization"].split(" ")[1];

    const existingService = await collection.findOne({
      ownerToken: userToken,
      serviceId: serviceId,
    });

    if (!existingService) {
      return res.json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const service_data = {
      serviceId: serviceId,
      ownerToken: userToken,
      serviceName: serviceName,
      category: category,
      data: data,
    };

    const result = await collection.updateOne(
      {
        serviceId: serviceId,
        ownerToken: userToken,
      },
      { $set: service_data }
    );

    const dataValues = Object.values(data).join(" ");

    const embed = await cohereClient.embed({
      texts: [serviceName, category, dataValues],
      model: cohereModel,
      inputType: "classification",
    });

    const serviceEmbeddings = embed.embeddings[0];

    await collection.updateOne(
      { serviceId: serviceId },
      { $set: { embeddings: serviceEmbeddings } }
    );

    res.json({
      success: true,
      ...service_data,
      ...result,
    });
  } catch (error) {
    console.error("Error updating service with tokid:", error);
    res.status(500).send("Internal Server Error");
  }
});

/*
Delete service will delete service
*/
router.delete("/delete-service", async (req, res) => {
  const serviceId = req.body.serviceId;

  if (!serviceId) {
    res.json({
      success: false,
      message: "Insufficient data",
    });
    return;
  }

  try {
    const db = mongoClient.db(partnerDatabase);
    const collection = db.collection(partnerCollection);

    const userToken = req.headers["authorization"].split(" ")[1];
    const result = await collection.deleteOne({
      serviceId: serviceId,
      ownerToken: userToken,
    });

    if (result.deletedCount === 0) {
      return res.json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).send("Internal Server Error");
  }
});

/*
Service list provides a list of:
- email
- name
- data...

of service
*/
router.get("/service-list/:pageNumber", async (req, res) => {
  const count = 10;
  try {
    const pageNumber = parseInt(req.params.pageNumber || "1");
    const skipCount = (pageNumber - 1) * count;

    const db = mongoClient.db(partnerDatabase);
    const collection = db.collection(partnerCollection);

    const entries = await collection
      .find()
      .skip(skipCount)
      .limit(count)
      .toArray();

    if (entries.length === 0) {
      return res.json({
        success: false,
        message: "No entries found",
      });
    }

    const sanitizedEntries = entries.map(entry => {
      const { ownerToken, embeddings, ...rest } = entry;
      return rest;
    });

    res.json({ success: true, services: sanitizedEntries });
  } catch (error) {
    console.error(`Error fetching next ${count} entries:`, error);
    res.status(500).send("Internal Server Error");
  }
});

// Query service by id
router.get("/id/:id", async (req, res) => {
  try {
    const db = mongoClient.db(partnerDatabase);
    const collection = db.collection(partnerCollection);

    const service = await collection.findOne({
      serviceId: parseInt(req.params.id),
    });

    if (!service) {
      return res.json({
        success: false,
        message: "Services not found",
      });
    }

    console.log(service)

    const { ownerToken, embeddings, ...sanitizedService } = service;

    res.json({ success: true, service: sanitizedService });
  } catch (error) {
    console.error("Error querying service by id:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Search service by parameters: name/category/data...
router.get("/search", async (req, res) => {
  const category = req.query.category;
  const terms = req.query.terms;

  if (!(category || terms)) {
    res.json({
      success: false,
      message: "Insufficient data",
    });
    return;
  }

  try {
    const embed = await cohereClient.embed({
      texts: [terms],
      model: cohereModel,
      inputType: "classification",
    });

    const queryEmbeddings = embed.embeddings[0];

    const db = mongoClient.db(partnerDatabase);
    const collection = db.collection(partnerCollection);

    const searchResult = await collection.find().toArray();
    const resultsSimilarity = searchResult.map(doc => {
      const documentEmbeddings = doc.embeddings;
      const similarity = calculateCosineSimilarity(queryEmbeddings, documentEmbeddings);
      return { ...doc, similarity };
    });

    resultsSimilarity.sort((a, b) => b.similarity - a.similarity);

    const sanitizedResults = resultsSimilarity.map(({ ownerToken, embeddings, ...rest }) => rest);

    res.json({ success: true, terms: terms, services: sanitizedResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

function calculateCosineSimilarity(vector1, vector2) {
  if (!vector1 || !vector2 || vector1.length !== vector2.length) {
    return 0;
  }

  let dotProduct = 0;
  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
  }

  const magnitude1 = Math.sqrt(vector1.reduce((acc, val) => acc + Math.pow(val, 2), 0));
  const magnitude2 = Math.sqrt(vector2.reduce((acc, val) => acc + Math.pow(val, 2), 0));

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
}


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
