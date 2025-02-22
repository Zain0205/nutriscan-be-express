import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./src/routes";

dotenv.config();

const PORT = 3000
const app = express();

app.use(express.json());
app.use(cors());

app.use(routes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
