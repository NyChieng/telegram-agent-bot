export const logger = {
  info(message, meta = {}) {
    console.log(formatLog("info", message, meta));
  },

  warn(message, meta = {}) {
    console.warn(formatLog("warn", message, meta));
  },

  error(message, meta = {}) {
    console.error(formatLog("error", message, meta));
  }
};

function formatLog(level, message, meta) {
  const timestamp = new Date().toISOString();
  const suffix = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] ${level.toUpperCase()} ${message}${suffix}`;
}
