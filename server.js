import { express } from "express";

const app = express();
const port = 5000;

app.post("/scrapper", (req, res) => {});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
