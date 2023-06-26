const express = require("express");
// const OPENAI_API_KEY = "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";
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");
require("dotenv").config()
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());

app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({
    message: "pong",
  });
});
app.post("/chat", (req, res) => {
 
  const question = req.body.question;

  const statmsg = `Give 5 interview questions related to ${question}`

  openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: statmsg,
      max_tokens: 4000,
      temperature: 0,
    })
    .then((response) => {
      console.log({ response });
      return response?.data?.choices?.[0]?.text;
    })
    .then((answer) => {
      console.log({ answer });
      const array = answer
        ?.split("\n")
        .filter((value) => value)
        .map((value) => value.trim());

      return array;
    })
    .then((answer) => {
      res.json({
        answer: answer,
        propt: statmsg,
      });
    });
  console.log({ statmsg });
});


// interview questions
app.post('/interview-question', async (req, res) => {
  try {
    const question = req.body.question;

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: question,
        temperature: 0.5,
        max_tokens: 150,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});