import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import {
  auth as qlikAuth,
  users as qlikUsers,
  qix as openAppSession,
} from "@qlik/api";
import { fileURLToPath } from "url";
import { getFrontendConfig, getBackendConfig } from "./config/config.js";

// Load config
const { appSettings, configBackend, configFrontend }  = await getBackendConfig();
const { myParamsConfig }  = await getFrontendConfig();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
var app = express();
app.use(express.static("src"));
const PORT = appSettings.port || 3000;

// qlikAuth.setDefaultHostConfig(configFrontend);

// Configure session middleware using environment variable for session secret
app.use(
  session({
    secret: appSettings.secret,
    resave: false,
    saveUninitialized: true,
  })
);

// Configure body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Get Qlik user (via qlik/api: https://github.com/qlik-oss/qlik-api-ts/blob/main/users.js)
async function getQlikUser(userEmail) {

  const { data: user } = await qlikUsers.getUsers(
    {
      filter: `email eq "${userEmail}"`,
    },
    {
      hostConfig: {
        ...configBackend,
        scope: "user_default",
      },
    }
  );
  return user;
}

// Get access token (M2M impersonation) for use in front-end by qlik-embed using qlik/api
app.post("/access-token", async (req, res) => {
  console.log('----------------- post -access-token')
  const userId = "66730798560a90f331360e85";
  // const userId = "674dcd2d894e416c3ce1e686";
    try {
      const accessToken = await qlikAuth.getAccessToken({
        hostConfig: {
          ...configFrontend,
          userId,
          scope: "user_default",
        },
      });
      console.log("Retrieved access token for: ", userId,accessToken);
      res.send(accessToken);
    } catch (err) {
      res.status(401).send("No access");
    }
});

// Get Parameters: userId not needed for the example, but needed in case you want to retrieve per tenant basis parameters
app.post("/config", async (req, res) => {
  console.log('----------------- post -config')
  const userId = req.session.userId;
  const params = await getFrontendConfig(userId);
  res.status(200).send(params.myParamsConfig);
});

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/src/home.html");
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}! Go to http://localhost:${PORT}`
  );
});
