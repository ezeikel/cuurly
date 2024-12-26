export default {
  expo: {
    name: "Cuurly",
    slug: "cuurly",
    owner: "chewybytes",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    icon: "./assets/images/icon.png",
    scheme: "cuurly",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.chewybytes.cuurly",
    },
    android: {
      package: "com.chewybytes.cuurly",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          project: "cuurly-app",
          organization: "chewybytes",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "682b1d91-8787-4e46-a507-1f543707fc9d",
      },
    },
  },
};
