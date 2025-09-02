export const logger = {
  info: (message: string, meta?: object) => {
    console.log(`[INFO] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error?.stack || error);
  },
  warn: (message: string, meta?: object) => {
    console.warn(`[WARN] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  debug: (message: string, meta?: object) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, meta ? JSON.stringify(meta) : '');
    }
  },
};
