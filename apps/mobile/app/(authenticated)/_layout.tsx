import { useEffect, useState } from "react";
import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthContext } from "@/contexts/auth";
import PushNotificationInitialiser from "@/components/PushNotificationInitialiser";

const AppLayout = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { isAuthenticated, isLoading, user, getAuthToken } = useAuthContext();

  useEffect(() => {
    const checkToken = async () => {
      const token = await getAuthToken();
      setAuthToken(token);
    };

    checkToken();
  }, []);

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
      <Text>Current auth token: {authToken}</Text>
    </>
  );
};

export default AppLayout;
