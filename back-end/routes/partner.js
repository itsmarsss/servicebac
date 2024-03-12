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

const userDatabase = "userDatabase";
const userCollection = "user";
const partnerDatabase = "partnerDatabase";
const partnerCollection = "partner";

const cohereModel = "embed-english-v3.0";

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

// Query services owned by token
router.get("/service", async (req, res) => {
  try {
    const db = mongoClient.db(partnerDatabase);
    const collection = db.collection(partnerCollection);

    const userToken = req.headers["authorization"].split(" ")[1];

    var service = await collection.find({
      ownerToken: userToken
    }).toArray();

    if (service.length === 0) {
      const service_data = {
        ownerToken: userToken,
        serviceName: "Company Name",
        city: "City",
        country: "Country",
        status: "private",
      };

      const service_tokid = await executePython("./workers/createService.py", []);
      await collection.insertOne({
        ...service_tokid,
        ...service_data
      });
    }

    service = await collection.find({
      ownerToken: userToken
    }).toArray();

    const { ownerToken, embeddings, ...sanitizedService } = service[0];

    res.json({
      success: true,
      service: sanitizedService
    });
  } catch (error) {
    console.error("Error querying services by ownerToken:", error);
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
  const serviceName = req.body.serviceName;
  const marquee = req.body.marquee;
  const icon = req.body.icon;
  const category = req.body.category;
  const city = req.body.city;
  const country = req.body.country;
  const description = req.body.description;
  const markdown = req.body.markdown;
  const status = req.body.status;

  if (!(serviceName && city && country && status)) {
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
    });

    if (!existingService) {
      return res.json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const service_data = {
      serviceName: serviceName,
      marquee: marquee,
      icon: icon,
      category: category,
      city: city,
      country: country,
      description: description,
      markdown: markdown,
      status: status,
    };

    const result = await collection.updateOne(
      {
        ownerToken: userToken,
      },
      { $set: service_data }
    );

    const embed = await cohereClient.embed({
      texts: [serviceName || "", category || "", city || "", country || "", description || ""],
      model: cohereModel,
      inputType: "classification",
    });

    const serviceEmbeddings = embed.embeddings[0];

    await collection.updateOne(
      { ownerToken: userToken },
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
      .find({
        status: "public",
      })
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

    res.json({
      success: true,
      services: sanitizedEntries
    });
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
      status: "public",
    });

    if (!service) {
      return res.json({
        success: false,
        message: "Service not found",
      });
    }

    const { ownerToken, embeddings, ...sanitizedService } = service;

    res.json({
      success: true,
      service: sanitizedService
    });
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

    const searchResult = await collection.find({
      status: "public",
    }).toArray();
    const resultsSimilarity = searchResult.map(doc => {
      const documentEmbeddings = doc.embeddings;
      const similarity = calculateCosineSimilarity(queryEmbeddings, documentEmbeddings);
      return { ...doc, similarity };
    });

    resultsSimilarity.sort((a, b) => b.similarity - a.similarity);

    const pageNumber = isNaN(req.query.page) ? 1 : req.query.page;
    const startIndex = (pageNumber - 1) * 10;
    const sanitizedResults = resultsSimilarity.slice(startIndex, startIndex + 10).map(({ ownerToken, embeddings, ...rest }) => rest);

    console.log(startIndex)

    res.json({
      success: true,
      terms: terms,
      services: sanitizedResults
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
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
