import express from "express";
import { spawn } from "child_process";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post("/scrapper", (req, res) => {
  const { url } = req.body;
  const pythonProcess = spawn("python", ["scraper.py", url]);

  // Collect data from stdout
  let scrapedTerms = "";
  pythonProcess.stdout.on("data", (data) => {
    scrapedTerms += data.toString();
  });

  // Handle process completion
  pythonProcess.on("close", (code) => {
    if (code === 0) {
      res.status(200).send(scrapedTerms);
    } else {
      res.status(500).send("Error scraping terms and conditions.");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
