import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TestPushNotification from "@/components/TestPushNotifcation";
import { useAuthContext } from "@/contexts/auth";

const ProfileScreen = () => {
  const { signOut } = useAuthContext();

  return (
    <SafeAreaView>
      <Text>Profile</Text>
      <TestPushNotification />
      <Pressable onPress={() => signOut()}>
        <Text>Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ProfileScreen;
