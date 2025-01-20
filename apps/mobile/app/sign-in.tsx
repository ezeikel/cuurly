import { View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useAuthContext } from "@/contexts/auth";
import logger from "@/utils/logger";

const AuthScreen = () => {
  const { signIn } = useAuthContext();

  const handleSignIn = async () => {
    try {
      await signIn();
      router.replace("/");
    } catch (error: unknown) {
      logger.error("Sign in error:", error as Error);
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
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;
