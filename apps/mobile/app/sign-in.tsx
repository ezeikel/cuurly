import { Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useAuthContext } from "@/contexts/auth";
import { useEffect, useState } from "react";

const AuthScreen = () => {
  const { signIn } = useAuthContext();
  const { getAuthToken } = useAuthContext();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getAuthToken();
      setAuthToken(token);
    };

    checkToken();
  }, []);

  const handleSignIn = async () => {
    try {
      await signIn();
      router.replace("/");
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Standard}
          color={GoogleSigninButton.Color.Light}
          onPress={handleSignIn}
        />
        <Text>Current auth token: {authToken}</Text>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;
