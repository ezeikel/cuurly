import { useEffect, useState } from "react";
import { Alert, Platform, PermissionsAndroid, Clipboard } from "react-native";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notifee from "@notifee/react-native";
import logger from "@/utils/logger";
import { api } from "@/utils/api";

const FCM_TOKEN_STORAGE_KEY = "@fcm_token";
// TODO: remove this after authentication is implemented
const TEST_USER_ID = "873e5b41-825a-410b-852c-7384994c5dd8";

const usePushNotifications = () => {
  const [isInitialised, setisInitialised] = useState(false);
  const registerDevice = api.device.register.useMutation();

  const requestIOSPermissions = async (): Promise<boolean> => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  };

  const requestAndroidPermissions = async () => {
    if (Number(Platform.Version) >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        logger.error(
          "Failed to request Android notifications permission",
          error as Error,
          {
            additionalContext: {
              error,
            },
          },
        );
        return false;
      }
    }
    return true; // auto granted for Android API < 33 (Android < 13)
  };

  const onMessageReceived = async (
    message: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    await notifee.displayNotification({
      title: message.notification?.title ?? "",
      body: message.notification?.body ?? "",
      android: {
        channelId: "default",
        actions: [
          {
            title: "Mark as read",
            pressAction: {
              id: "read",
            },
          },
        ],
      },
    });
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const cachedToken = await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);
        if (cachedToken) {
          await registerDevice.mutateAsync({
            fcmToken: cachedToken,
            testUserId: TEST_USER_ID,
          });
        }
      } catch (error) {
        logger.error("Failed to load cached FCM token", error as Error, {
          additionalContext: {
            error,
          },
        });
      }

      // handle permissions based on platform
      if (Platform.OS === "ios") {
        const enabled = await requestIOSPermissions();
        if (!enabled) return false;
      } else if (Platform.OS === "android") {
        const enabled = await requestAndroidPermissions();
        if (!enabled) return false;
      }

      try {
        const token = await messaging().getToken();

        await registerDevice.mutateAsync({
          fcmToken: token,
          testUserId: TEST_USER_ID,
        });

        // TODO: remove this after api is implemented to register device in db
        Alert.alert("FCM Token", token, [
          {
            text: "Copy Token",
            onPress: async () => {
              await Clipboard.setString(token);
              Alert.alert("Copied!", "Token has been copied to clipboard");
            },
          },
          {
            text: "OK",
            style: "cancel",
          },
        ]);

        await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
        await registerDevice.mutateAsync({
          fcmToken: token,
          testUserId: TEST_USER_ID,
        });
      } catch (error) {
        logger.error("Failed to get FCM token", error as Error, {
          additionalContext: {
            error,
          },
        });
        setisInitialised(false);
        return false;
      }

      try {
        messaging().setBackgroundMessageHandler(async (message) => {
          await onMessageReceived(message);
        });

        const unsubscribeForeground = messaging().onMessage(async (message) => {
          await onMessageReceived(message);
        });

        const unsubscribeTokenRefresh = messaging().onTokenRefresh(
          async (newToken) => {
            try {
              const oldToken = await AsyncStorage.getItem(
                FCM_TOKEN_STORAGE_KEY,
              );
              await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, newToken);
              await registerDevice.mutateAsync({
                fcmToken: newToken,
                oldFcmToken: oldToken ?? undefined,
              });
            } catch (error) {
              logger.error("Failed to update device token", error as Error, {
                additionalContext: {
                  error,
                },
              });
            }
          },
        );

        setisInitialised(true);

        return () => {
          unsubscribeForeground();
          unsubscribeTokenRefresh();
        };
      } catch (error) {
        logger.error("Failed to set up message handlers", error as Error, {
          additionalContext: {
            error,
          },
        });
        setisInitialised(false);
        return false;
      }
    };

    initialize();
  }, []);

  return { isInitialised };
};

export default usePushNotifications;
