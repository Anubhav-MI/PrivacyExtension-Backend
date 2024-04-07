import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { spawn } from "child_process";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
// app.use(
//   cors({ origin: "chrome-extension://kononjgdbhcopjggloggobpbfldhaemn" })
// );
const PORT = process.env.PORT || 5000;

app.use(express.json());

// console.log(process.env.GOOGLE_API_KEY);

// const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_API_KEY}`);

// const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// const generationConfig = { temperature: 0.5, maxTokens: 100 };

app.post("/summarize", async (req, res) => {
  const { text } = req.body;
  console.log("requested");
  // const pythonProcess = exec("scrap.py", (error, stdout, stderr) => {
  //   if (error) {
  //     console.error("Error executing Python script:", error);
  //     return;
  //   }
  //   console.log("Python script output:", stdout);
  // });

  // pythonProcess.stdout.on("data", (data) => {
  //   console.log(`stdout: ${data}`);
  // });

  // pythonProcess.stderr.on("data", (data) => {
  //   console.error(`stderr: ${data}`);
  // });

  // pythonProcess.on("close", (code) => {
  //   console.log(`child process exited with code ${code}`);
  // });
  try {
    // const { spawn } = require("child_process");
    const pythonProcess = spawn("python", ["scrap.py"]); // Pass text as an argument

    let pythonOutput = "";
    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
      // Handle errors as needed
    });

    await new Promise((resolve, reject) => {
      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python script exited with code ${code}`));
        } else {
          resolve(pythonOutput);
        }
      });
    });

    const summary = pythonOutput.trim(); // Get the final summary
    res.json({ summary });
  } catch (error) {
    console.error("Error executing Python script:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});
// res.status(200).send();
// try {
//   const prompt = `Give the summarized points from the following terms and conditions and privacy policy. In short points 10 words each. ${text}.Without astriks and dashes.`;
//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   const generatedText = await response.text();
//   // console.log(generatedText);

//   res.status(200).send(generatedText);
// } catch (error) {
//   console.error("Error generating text:", error);
//   res.status(500).json({ error: "Internal Server Error" });
// }

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
