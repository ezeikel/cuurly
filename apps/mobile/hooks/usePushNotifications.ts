/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Alert, Platform, PermissionsAndroid, Clipboard } from "react-native";
import messaging from "@react-native-firebase/messaging";
import logger from "@/utils/logger";

// TODO: Implement AsyncStorage for token persistence
// TODO: Implement TRPC API for device registration

const FCM_TOKEN_STORAGE_KEY = "@fcm_token";

const usePushNotifications = () => {
  const [isInitialised, setisInitialised] = useState(false);
  // TODO: Implement device registration mutation
  // const registerDevice = api.device.register.useMutation();

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

  useEffect(() => {
    const initialize = async () => {
      try {
        // TODO: Implement token caching
        // const cachedToken = await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);
        // if (cachedToken) {
        //   await registerDevice.mutateAsync({ fcmToken: cachedToken });
        // }
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
        console.log("FCM Token", token);
        // TODO: Implement token storage
        // await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
        // await registerDevice.mutateAsync({ fcmToken: token });
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
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
          logger.debug("Background Message", {
            additionalContext: {
              remoteMessage,
            },
          });
        });

        const unsubscribeForeground = messaging().onMessage(
          async (remoteMessage) => {
            // TODO: replace with notifee
            logger.debug("Foreground Message", {
              additionalContext: {
                remoteMessage,
              },
            });
            Alert.alert(
              remoteMessage.notification?.title ?? "",
              remoteMessage.notification?.body,
            );
          },
        );

        const unsubscribeTokenRefresh = messaging().onTokenRefresh(
          async (newToken) => {
            try {
              console.log("New FCM Token:", newToken); // Temporary: log token for testing
              // TODO: Implement token refresh handling
              // const oldToken = await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);
              // await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, newToken);
              // await registerDevice.mutateAsync({
              //   fcmToken: newToken,
              //   oldFcmToken: oldToken ?? undefined,
              // });
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
