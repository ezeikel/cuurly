type Environment = "development" | "preview" | "beta" | "production";

interface EnvironmentConfig {
  apiUrl: string;
  websiteUrl: string;
}

const ENV_CONFIG: Record<Environment, EnvironmentConfig> = {
  development: {
    apiUrl: "http://localhost:3000",
    websiteUrl: "http://localhost:3000",
  },
  preview: {
    apiUrl: "https://www.cuurly.co",
    websiteUrl: "https://www.cuurly.co",
  },
  beta: {
    apiUrl: "https://www.cuurly.co",
    websiteUrl: "https://www.cuurly.co",
  },
  production: {
    apiUrl: "https://www.cuurly.co",
    websiteUrl: "https://www.cuurly.co",
  },
};

export const getEnvironment = (): Environment => {
  if (__DEV__) {
    return "development";
  }

  const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;

  if (
    !environment ||
    !["preview", "beta", "production"].includes(environment)
  ) {
    throw new Error(`Invalid environment: ${environment}`);
  }

  return environment as Environment;
};

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const environment = getEnvironment();
  return ENV_CONFIG[environment];
};
