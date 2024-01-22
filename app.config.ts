import { ExpoConfig, ConfigContext } from "expo/config";
// import { Env } from "./env";



export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Ezero",
  slug: "ezero",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "ezero",
  jsEngine: "hermes",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.ezero",
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.ezero",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    [
      "expo-router",
      {
        asyncRoutes: {
          web: true,
          default: "development",
          android: false,
          ios: false,
        },
      },
    ],
    [
      "expo-secure-store",
      {
        faceIDPermission:
          "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
      },
    ],
    [
      "expo-media-library",
      {
        photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
        savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
        isAccessMediaLocationEnabled: true,
      },
    ],
    [
      "expo-font",
      {
        "fonts": ["./assets/fonts/SpaceMono-Regular.ttf"]
      }
    ]
  ],
  experiments: {
    typedRoutes: true,
  },
});
