import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import {
  GoogleSignin,
  statusCodes,
  type User,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import logger from "@/utils/logger";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  photo?: string;
} & Partial<User>;

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  getAuthToken: async () => null,
});

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const signInMutation = api.auth.signIn.useMutation();
  const currentUserQuery = api.user.current.useQuery(undefined, {
    enabled: !!authToken,
    retry: false,
  });

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true, // for refresh token
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const authToken = await SecureStore.getItemAsync("authToken");

      if (!authToken) {
        setIsAuthenticated(false);
        router.replace("/sign-in");
        return;
      }

      if (currentUserQuery.isLoading) {
        return;
      }

      if (currentUserQuery.error) {
        throw new Error("Failed to validate token");
      }

      if (currentUserQuery.data) {
        setUser(currentUserQuery.data);
        setIsAuthenticated(true);
        router.replace("/");
      } else {
        throw new Error("User not found");
      }
    } catch (error: unknown) {
      logger.error("Error checking authentication:", error as Error);
      await SecureStore.deleteItemAsync("authToken");
      setIsAuthenticated(false);
      router.replace("/sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // periodic token validation (every 10 minutes)
    const intervalId = setInterval(checkAuth, 10 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [authToken]);

  const signIn = async () => {
    try {
      setIsLoading(true);

      await GoogleSignin.hasPlayServices();
      const googleUser = await GoogleSignin.signIn();

      if (!googleUser?.data?.user?.email) {
        throw new Error("Failed to get Google user email");
      }

      const result = await signInMutation.mutateAsync({
        user: {
          email: googleUser.data.user.email,
          id: googleUser.data.user.id,
          name: googleUser.data.user.name || "",
          photo: googleUser.data.user.photo || undefined,
          familyName: googleUser.data.user.familyName || undefined,
          givenName: googleUser.data.user.givenName || undefined,
        },
      });

      // store token
      await SecureStore.setItemAsync("authToken", result.token);
      setUser(result.user);
      setIsAuthenticated(true);
      router.replace("/");
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === statusCodes.SIGN_IN_CANCELLED
      ) {
        logger.info("User cancelled sign-in");
      } else {
        logger.error("Sign-in error:", error as Error);
      }
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.signOut();
      await SecureStore.deleteItemAsync("authToken");
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/sign-in");

      // clear all queries
      queryClient.clear();
    } catch (error: unknown) {
      logger.error("Sign-out error:", error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthToken = async () => SecureStore.getItemAsync("authToken");

  useEffect(() => {
    const getToken = async () => {
      const token = await getAuthToken();
      setAuthToken(token);
    };
    getToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        signIn,
        signOut,
        getAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
