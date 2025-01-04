import { createContext, useContext, useMemo, useState } from "react";
import Constants from "expo-constants";
import { QueryClient, onlineManager } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { getEnvironmentConfig } from "@/config/environment";
import type { AppRouter } from "@cuurly/api";

export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@cuurly/api";

const getBaseUrl = () => {
  const { apiUrl } = getEnvironmentConfig();

  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost?.split(":")[0];

    if (localhost) {
      return `http://${localhost}:3000`;
    }
  }

  return apiUrl;
};

export const client = (setHeaders: Record<string, string>) =>
  createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === "development" ||
          (opts.direction === "down" && opts.result instanceof Error),
        colorMode: "ansi",
      }),
      httpBatchLink({
        transformer: superjson,
        url: `${getBaseUrl()}/api/trpc`,
        headers() {
          const headers = new Map<string, string>();
          headers.set("x-trpc-source", "expo-react");
          Object.keys(setHeaders).forEach((key) => {
            headers.set(key, setHeaders[key]);
          });
          return Object.fromEntries(headers);
        },
      }),
    ],
  });

interface CustomHeaderContextValues {
  customHeaders: Record<string, string>;
  setCustomHeaders: (key: string, value: string) => void;
}

const CustomHeaderContext = createContext<CustomHeaderContextValues>(
  {} as CustomHeaderContextValues,
);

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
});

onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  }),
);

export const TRPCProvider = (props: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30, // 30 seconds
            networkMode: "online",
          },
        },
      }),
  );
  const trpcClient = useMemo(() => client({}), []);

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <PersistQueryClientProvider
        onSuccess={() =>
          queryClient
            .resumePausedMutations()
            .then(() => queryClient.invalidateQueries())
        }
        persistOptions={{ persister }}
        client={queryClient}
      >
        {props.children}
      </PersistQueryClientProvider>
    </api.Provider>
  );
}

export const useCustomHeaders = () => useContext(CustomHeaderContext);

export const createStandaloneClient = () =>
  createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        transformer: superjson,
        url: `${getBaseUrl()}/api/trpc`,
        headers() {
          const headers = new Map<string, string>();
          headers.set("x-trpc-source", "expo-react");
          return Object.fromEntries(headers);
        },
      }),
    ],
  });
