import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { spawn } from "child_process";
import fs from "fs";
import mammoth from "mammoth";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
// app.use(cors({ origin: "http://localhost:3000" }));
app.use(
  cors({ origin: "chrome-extension://iagemkonmacdmhomkmhhbkdppjjdoaln" })
);
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post("/summarize", async (req, res) => {
  const url = req.body.currentPageUrl; // Get URL from request body
  console.log("URL:", url);

  try {
    const pythonProcess = spawn("python", ["scrap2.py", url]); // Execute Python script with URL as argument

    let summarizedText = ""; // Variable to store summarized text

    // Capture output from Python script
    pythonProcess.stdout.on("data", (data) => {
      summarizedText += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Summarized text:", summarizedText);
        res.send(summarizedText); // Send summarized text as response
      } else {
        console.error(`Python process exited with code ${code}`);
        res.status(500).json({ error: "Failed to summarize text" });
      }
    });
  } catch (error) {
    console.error("Error executing Python script:", error);
    res.status(500).json({ error: "Failed to summarize text" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
