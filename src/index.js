import { createBot, launchBot } from "./bot.js";
import { loadConfig, validateConfig } from "./config.js";
import { createLlmProvider } from "./llm/provider.js";
import { logger } from "./utils/logger.js";

async function main() {
  const config = loadConfig();
  validateConfig(config);

  const llmProvider = createLlmProvider(config);
  const bot = await createBot({ config, llmProvider, logger });

  await launchBot(bot, logger);
}

main().catch((error) => {
  logger.error("Startup failed", { error: error.message });
  process.exitCode = 1;
});
