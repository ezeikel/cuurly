import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import * as Sentry from "@sentry/react-native";
import Providers from "@/providers";

// TODO: use sentry config
Sentry.init({
  dsn: "https://4f3906d863f4d9b3399c4c306abb7f12@o358156.ingest.us.sentry.io/4508534369615872",
});

// prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Providers>
      <Slot />
    </Providers>
  );
};

export default RootLayout;
