import express from "express";
import { spawn } from "child_process";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post("/scrapper", (req, res) => {
  const { url } = req.body;

  // Collect data from stdout
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
