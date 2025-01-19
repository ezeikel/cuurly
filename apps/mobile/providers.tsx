import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";
import { TRPCProvider } from "./utils/api";
import { AuthContextProvider } from "./contexts/auth";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();

  return (
    <TRPCProvider getAuthToken={() => SecureStore.getItemAsync("authToken")}>
      <AuthContextProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          {children}
        </ThemeProvider>
      </AuthContextProvider>
    </TRPCProvider>
  );
};

export default Providers;
