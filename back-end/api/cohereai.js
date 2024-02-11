const { CohereClient } = require("cohere-ai");

require("dotenv").config();

let cohereClient = null;

const cohereKEY = process.env.COHERE_KEY;
console.log(cohereKEY);

const initialize = async () => {
    cohereClient = new CohereClient({
        token: cohereKEY,
    });
    console.log("Created Cohere instance");
};

initialize();

module.exports = { cohereClient, initialize };
