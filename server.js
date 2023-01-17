const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from CodeX!",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    console.log(prompt);

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Des valeurs plus élevées signifient que le modèle prendra plus de risques.
      max_tokens: 1000, // Le nombre maximum de jetons à générer dans la complétion. La plupart des modèles ont une longueur de contexte de 2048 jetons (à l'exception des modèles les plus récents, qui prennent en charge 4096).
      top_p: 1, // alternative à l'échantillonnage avec la température, appelé échantillonnage de noyau
      frequency_penalty: 0.5, // Nombre compris entre -2,0 et 2,0. Les valeurs positives pénalisent les nouveaux jetons en fonction de leur fréquence existante dans le texte jusqu'à présent, ce qui réduit la probabilité que le modèle répète la même ligne textuellement.
      presence_penalty: 0, // Nombre compris entre -2,0 et 2,0. Les valeurs positives pénalisent les nouveaux jetons en fonction de leur apparition dans le texte jusqu'à présent, ce qui augmente la probabilité que le modèle parle de nouveaux sujets.
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || "3002");

server.listen(port, () => {
  console.log("Listening on " + port);
});
