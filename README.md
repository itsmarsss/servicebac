# ServiceBac

## Overview

ServiceBac is a versatile website template and framework designed to facilitate the creation of platforms for service advertising and search. It provides functionality for two types of accounts: company and department. A company account enables businesses to showcase their services with detailed descriptions and markdown support, while a department account allows regular users to search for these services using advanced semantic search capabilities.

## Technologies Used

- **Frontend:** Vite, React with TypeScript
- **Backend:** Node.js, Express.js, Python
- **Database:** MongoDB
- **Semantic Search:** CohereAI for generating embeddings
- **Stack:** Essentially a MERN (MongoDB, Express.js, React, Node.js) stack

## Key Features

- **Semantic Search:** Utilizes advanced semantic search powered by CohereAI to enhance service discovery.
- **Scalability:** Built on the MERN stack, ServiceBac offers scalability and flexibility for handling growing amounts of data and users.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/itsmarsss/servicebac.git
```

To start website

1. Setup the backend:

   ```bash
   cd servicebac/back-end
   npm install
   npm run devStart
   ```

2. Make sure `.env` file contains MongoDB URI and CohereAI API key.

   > Check `.env.example` to see formatting

3. Access the website at [http://localhost:3000](http://localhost:3000).
   > The back-end already contains a front-end prebuild version

To update ServiceBac `front-end`

1. Setup the frontend:

   ```bash
   cd servicebac/front-end
   npm install
   npm run build
   ```

   > If you're in `/back-end` do:
   >
   > ```bash
   > cd ..
   > cd front-end
   > npm install
   > npm run build
   > ```

2. Move the built frontend assets to the backend:
   ```bash
   mv dist/* ../back-end/build/
   ```
   > This should include an `assets` folder and `index.html` file

## Documentation

Refer to the documentation for the ServiceBac API in the `docs` directory or on the [GitHub live page](https://itsmarsss.github.io/servicebac/docs).

## Contributing

Contributions to ServiceBac should aim to maintain its flexibility and general-purpose nature. Updates that narrow the focus of ServiceBac may be rejected.

## License

ServiceBac is licensed under the Apache-2.0 License.

## Support

For support or inquiries, please open an issue on GitHub or join our [Discord Server](https://discord.gg/K8hgFHWeJQ).
