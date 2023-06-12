require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const port = process.env.PORT || 8000;

// additional modules required for this project
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const token = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: token,
});

const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/create/*", async (req, res) => {
  //removing /create/ from the url string
  let prompt = req.url.slice(8).split("-").join("");
  // try-catch block
  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "256x256",
    });
    res.json({
      param: response.data.data[0].url,
    });
  } catch (err) {
    res.send(err.message);
  }
});

app.listen(port, () => {
  console.log(200);
});
