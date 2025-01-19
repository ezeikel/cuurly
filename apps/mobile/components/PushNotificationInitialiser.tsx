import usePushNotifications from "@/hooks/usePushNotifications";

type Props = {
  userId?: string;
};

const PushNotificationInitialiser = ({ userId }: Props) => {
  usePushNotifications(userId);

  return null;
};

export default PushNotificationInitialiser;
