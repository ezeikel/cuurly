import { api } from "@/utils/api";
import { Button } from "react-native";

const TestPushNotification = () => {
  const sendTestNotification = api.device.sendTestNotification.useMutation();

  return (
    <Button
      title="Test Push Notification"
      onPress={async () => {
        await sendTestNotification.mutateAsync({
          title: "Test Push Notification",
          body: "This is a test push notification",
        });
      }}
    />
  );
};

export default TestPushNotification;
