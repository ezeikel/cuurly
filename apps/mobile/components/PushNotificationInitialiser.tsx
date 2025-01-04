import usePushNotifications from "@/hooks/usePushNotifications";

export default function PushNotificationInitializer() {
  const { isInitialised } = usePushNotifications();

  if (!isInitialised) {
    return null;
  }

  return null;
}
