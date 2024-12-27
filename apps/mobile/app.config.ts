export default {
  expo: {
    name: "Cuurly",
    slug: "cuurly",
    owner: "chewybytes",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    icon: "./assets/images/icon.png",
    scheme: "cuurly",
    updates: {
      url: "https://u.expo.dev/682b1d91-8787-4e46-a507-1f543707fc9d",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    ios: {
      bundleIdentifier: "com.chewybytes.cuurly",
      supportsTablet: true,
      googleServicesFile: "./GoogleService-Info.plist",
    },
    android: {
      package: "com.chewybytes.cuurly",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: "./google-services.json",
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
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            deploymentTarget: "15.1",
          },
          android: {
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            buildToolsVersion: "34.0.0",
            enableProguardInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true,
          },
        },
      ],
      "@react-native-firebase/app",
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
