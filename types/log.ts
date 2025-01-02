export const LogLevels = ["info", "error"] as const;
export type LogLevel = (typeof LogLevels)[number];

export type LogFunction = (message: string) => void;

export type Log = {
  level: LogLevel;
  message: string;
  timestamp: Date;
};

export type LogCollector = {
  getAll(): Log[];
} & {
  [K in LogLevel]: LogFunction;
};
