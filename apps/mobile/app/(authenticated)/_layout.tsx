import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthContext } from "@/contexts/auth";
import PushNotificationInitialiser from "@/components/PushNotificationInitialiser";

const AppLayout = () => {
  const { isAuthenticated, isLoading, user } = useAuthContext();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      <PushNotificationInitialiser userId={user?.id} />
    </>
  );
};

export default AppLayout;
