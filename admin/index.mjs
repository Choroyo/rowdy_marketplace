import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { readdirSync } from "fs";
import "dotenv/config"

dotenv.config();

const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesPath = path.resolve(__dirname, "./routes");
const routeFiles = readdirSync(routesPath);

routeFiles.map(async (file) => {
  const routeModule = await import(`./routes/${file}`);
  const routePath = `/${file.replace(".mjs", "")}`;
  app.use(routePath, routeModule.default);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/questions-ui", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "questions.html"));
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});