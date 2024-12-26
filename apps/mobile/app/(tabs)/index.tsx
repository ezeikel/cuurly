import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Sentry from "@sentry/react-native";

const HomeScreen = () => (
    <SafeAreaView>
      <Text>Home</Text>
      <Button
        title="Try error!"
        onPress={() => {
          Sentry.captureException(new Error("First error"));
        }}
      />
    </SafeAreaView>
  );

export default HomeScreen;
