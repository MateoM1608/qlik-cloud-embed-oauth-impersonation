/*
 * Config file: This file no longer requires manual updates to values,
 * as they are now managed through environment variables.
 */
import { config } from "dotenv";
import path from "path";

// Load environment variables from .env file
// const nodeEnv = process.env.NODE_ENV || "";
// config({
//   path: path.resolve(process.cwd(), `.env${nodeEnv ? "." + nodeEnv : ""}`),
// });

const process = {
  env: {
    "PORT" : "5173",
    "OAUTH_BACKEND_CLIENT_ID" : "e55e98c511fe13666d32d1e2fa1c6dff",
    "OAUTH_BACKEND_CLIENT_SECRET" : "785dff78de9d2157f1b98c7789cee5ab31022745ad8a7875b7deb7e6422a2e97",
    "OAUTH_FRONTEND_CLIENT_ID" : "e55e98c511fe13666d32d1e2fa1c6dff",
    "OAUTH_FRONTEND_CLIENT_SECRET" : "785dff78de9d2157f1b98c7789cee5ab31022745ad8a7875b7deb7e6422a2e97",
    "SESSION_SECRET" : "12345",
    "TENANT_URI" : "fga.us.qlikcloud.com",
    "APP_ID" : "d496e34e-d5e4-4950-8881-dd936eabe16e",
    "SHEET_ID" : "BfUaP",
    "OBJECT_ID" : "BfUaP",
    "FIELD_ID" : "City",
  }
}



const getBackendConfig = async function (email) {
  console.log('-------------------------------CONFIG -- getBackendConfig')
  /*
    This function should:
    - Accept a user or customer identifier (such as email)
    - Look up the correct Qlik Cloud tenant for that customer
    - Retrieve the corresponding OAuth client details for the backend activity (review guiding
      principles for OAuth M2M impersonation: https://qlik.dev/authenticate/oauth/guiding-principles-oauth-impersonation/)

    For purposes of making this demo as simple as possible, the values are hardcoded
    in this project via a .env file. Do not do this in production.

    */

  // Build app settings

  const appSettings = {
    secret: process.env.SESSION_SECRET,
    port: process.env.PORT
  };
  // Build qlik/api backend config
  const configBackend = {
    authType: "oauth2",
    host: process.env.TENANT_URI,
    clientId: process.env.OAUTH_BACKEND_CLIENT_ID,
    clientSecret: process.env.OAUTH_BACKEND_CLIENT_SECRET,
    noCache: true,
  };

  // Build qlik/api frontend config
  const configFrontend = {
    authType: "oauth2",
    host: process.env.TENANT_URI,
    clientId: process.env.OAUTH_FRONTEND_CLIENT_ID,
    clientSecret: process.env.OAUTH_FRONTEND_CLIENT_SECRET,
    noCache: true,
  };

  return { configBackend, configFrontend, appSettings };
};

const getFrontendConfig = async function (email) {
  console.log('-------------------------------CONFIG -- getFrontendConfig')
  /*
    This function should:
    - Accept a user or customer identifier (such as email)
    - Look up the correct Qlik Cloud tenant for that customer
    - Retrieve the corresponding impersonation OAuth client for the qlik-embed tag (review guiding
      principles for OAuth M2M impersonation: https://qlik.dev/authenticate/oauth/guiding-principles-oauth-impersonation/)

    For purposes of making this demo as simple as possible, the values are hardcoded
    in this project via a .env file. Do not do this in production.

    */

  // This is a cut-down config without the client secret for use in the qlik-embed HEAD tag.
  const myParamsConfig = {
    tenantUri: process.env.TENANT_URI,
    oAuthFrontEndClientId: process.env.OAUTH_FRONTEND_CLIENT_ID,
    appId: process.env.APP_ID,
    sheetId: process.env.SHEET_ID,
    objectId: process.env.OBJECT_ID,
    fieldId: process.env.FIELD_ID
  };

  return { myParamsConfig };
};

export { getFrontendConfig, getBackendConfig };
