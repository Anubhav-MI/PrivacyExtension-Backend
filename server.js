import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
const PORT = process.env.PORT || 5000;

app.use(express.json());

// console.log(process.env.GOOGLE_API_KEY);

const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_API_KEY}`);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// const generationConfig = { temperature: 0.5, maxTokens: 100 };

app.post("/summarize", async (req, res) => {
  const { text } = req.body;

  try {
    const prompt = `Give the summarized points from the following terms and conditions and privacy policy. In short points 10 words each. ${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = await response.text();
    console.log(generatedText);

    res.status(200).send(generatedText);
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
