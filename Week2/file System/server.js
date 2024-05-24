//   You need to create an express HTTP server in Node.js which will handle the logic of a file server.
//   - Use built in Node.js `fs` module
//   The expected API endpoints are defined below,
//   1. GET /files - Returns a list of files present in `./files/` directory
//     Response: 200 OK with an array of file names in JSON format.
//     Example: GET http://localhost:3000/files
//   2. GET /file/:filename - Returns content of given file by name
//      Description: Use the filename from the request path parameter to read the file from `./files/` directory
//      Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
//      Example: GET http://localhost:3000/file/example.txt
//     - For any other route not defined in the server return 404
//     Testing the server - run `npm run test-fileServer` command in terminal

import express from "express";
import fs from "fs/promises"; // Use fs/promises for async/await
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan"; // Import morgan for logging

const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(morgan("dev")); // Use morgan for logging

app.listen(port, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1); // Exit the process with a failure code
  }
  console.log(`Server running on port ${port}`);
});

app.get("/files", async (req, res) => {
  const directoryPath = path.join(__dirname, "files");

  try {
    const files = await fs.readdir(directoryPath);
    res.status(200).json({ files });
  } catch (err) {
    console.error("Error reading directory:", err);
    res.status(500).send("Unable to scan directory: " + err.message);
  }
});

app.get("/files/:name", async (req, res) => {
  const name = req.params.name;
  const filePath = path.join(__dirname, "files", name);

  try {
    const data = await fs.readFile(filePath, "utf-8");
    res.status(200).json({ msg: data });
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).send("Unable to read file: " + err.message);
  }
});
