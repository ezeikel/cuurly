import * as Sentry from "@sentry/react-native";

type LogLevel = "debug" | "info" | "warn" | "error";
type LogContext = Record<string, unknown>;

const isDevelopment = __DEV__;

const getSentryLevel = (level: LogLevel) => {
  switch (level) {
    case "debug":
      return "debug";
    case "info":
      return "info";
    case "warn":
      return "warning";
    case "error":
      return "error";
    default:
      return "info";
  }
};

const logToSentry = (
  level: LogLevel,
  message: string,
  error?: Error,
  context?: LogContext,
) => {
  if (error) {
    Sentry.captureException(error, {
      level: getSentryLevel(level),
      extra: context,
    });
  } else {
    Sentry.captureMessage(message, {
      level: getSentryLevel(level),
      extra: context,
    });
  }
};

const log = (
  level: LogLevel,
  message: string,
  error?: Error,
  context?: LogContext,
) => {
  // use normal console in development
  if (isDevelopment) {
    const args = [message];
    if (error) args.push(error.toString());
    if (context) args.push(JSON.stringify(context));

    // eslint-disable-next-line no-console
    console[level](...args);
    return;
  }

  // log to Sentry in production
  logToSentry(level, message, error, context);
};

export default {
  debug: (message: string, context?: LogContext) => {
    log("debug", message, undefined, context);
  },

  info: (message: string, context?: LogContext) => {
    log("info", message, undefined, context);
  },

  warn: (message: string, error?: Error, context?: LogContext) => {
    log("warn", message, error, context);
  },

  error: (message: string, error: Error, context?: LogContext) => {
    log("error", message, error, context);
  },

  addBreadcrumb: (
    message: string,
    category?: string,
    level: LogLevel = "info",
  ) => {
    if (!isDevelopment) {
      Sentry.addBreadcrumb({
        message,
        category,
        level:
          level === "debug" ? "debug" : level === "warn" ? "warning" : level,
      });
    }
  },
};
