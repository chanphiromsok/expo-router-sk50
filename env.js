const z = require("zod");
const packageJSON = require("./package.json");
const APP_ENV = process.env.APP_ENV;
if (!APP_ENV) {
  console.info("Skip NODE_ENV is not set");
  return;
}
if (APP_ENV !== "production" && APP_ENV !== "development") {
  console.info(
    "Skip NODE_ENV is not valid value must be production | development | test"
  );
  return;
}
const NAME = packageJSON.name; // app name
const VERSION = packageJSON.version; // app version
const BUILD_CODE_IOS = packageJSON["build-code-ios"];
const BUILD_CODE_ANDROID = packageJSON["build-code-android"];
const BUNDLE_ID = packageJSON.bundleId; // ios bundle id
const PACKAGE = packageJSON.package; // android package name

const withEnvSuffix = (name) => {
  return APP_ENV === "production" ? name : `${name}.${APP_ENV}`;
};

const client = z.object({
  APP_ENV: z.enum(["development", "production"]),
  NAME: z.string(),
  BUNDLE_ID: z.string(),
  PACKAGE: z.string(),
  VERSION: z.string(),
  BUILD_CODE_IOS: z.string().refine((value) => /^\d+$/.test(value), {
    message: " BUILD_CODE_IOS Must be a numeric string e.g 123",
  }),
  BUILD_CODE_ANDROID: z.coerce
    .number()
    .int()
    .positive("BUILD_CODE_ANDROID must be a positive integer"),
});

const buildTime = z.object({
  // ADD YOUR BUILD TIME ENV VARS HERE
  PHX_SOCKET_URL: z.string(),
  EXPO_PUBLIC_API_URL: z.string(),
});

// refer to client for manage version only
const _clientEnv = {
  APP_ENV: APP_ENV,
  NAME: NAME,
  BUNDLE_ID: withEnvSuffix(BUNDLE_ID),
  PACKAGE: withEnvSuffix(PACKAGE),
  VERSION: VERSION,
  BUILD_CODE_IOS: BUILD_CODE_IOS,
  BUILD_CODE_ANDROID: BUILD_CODE_ANDROID,
};

// refer to buildTime for manage API URL ,WS URL, etc
const _buildTimeEnv = {
  // ADD YOUR ENV VARS HERE TOO
  PHX_SOCKET_URL: process.env.PHX_SOCKET_URL,
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
};

const _env = {
  ..._clientEnv,
  ..._buildTimeEnv,
};

const merged = buildTime.merge(client);
const parsed = merged.safeParse(_env);

if (parsed.success === false) {
  console.error(
    `\n❌ Invalid environment variables.`,
    parsed.error.flatten().fieldErrors,
    `\n❌ Missing variables in \n${__dirname + `/.env.${APP_ENV}`} \nOr ${
      __dirname + `/package.json`
    } file, Make sure all required variables are defined in the .env.${APP_ENV} file.`,
    `\n💡 Tip: If you recently updated the .env.${APP_ENV} or package.json file and the error still persists, try restarting the server with the -cc flag to clear the cache.`
  );
  // throw new Error(
  //   "Invalid environment variables, Check terminal for more details "
  // );
}

const Env = parsed.data;
const ClientEnv = client.parse(_clientEnv);

module.exports = { Env, ClientEnv, withEnvSuffix };
