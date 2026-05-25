# Design Notes

## MVP Scope

The MVP is a Telegram group bot that only responds when explicitly addressed by mention, reply, `/ask`, or supported commands. This keeps group chats quiet by default and avoids the bot taking over normal conversation.

## Architecture

- `src/index.js` loads configuration and starts the bot.
- `src/bot.js` wires Telegraf middleware, commands, message routing, and graceful shutdown.
- `src/commands/*` contains command handlers and in-memory mode state.
- `src/persona/*` loads the persona prompt, builds mode-specific system prompts, and applies pre-LLM safety rules.
- `src/llm/*` isolates model-provider logic so Gemini works now and OpenAI can be added later. `src/llm/modelRouter.js` selects the default, fast, or reasoning Gemini model based on message complexity and mode.
- `src/utils/*` keeps message-routing and logging helpers separate from bot orchestration.

## Safety Boundary

The bot performs first-person Mao Zedong roleplay for entertainment, study help, coding help, and historical-style conversation. Normal roleplay is allowed, including answering "我是毛泽东" in character. It must not claim the historical Mao is literally alive today, scam users, issue real orders, produce extremist propaganda, encourage violence, promote hatred, harass people, or glorify or deny historical suffering.

## Storage

Mode state is in memory per chat for the MVP. A restart resets all modes to `DEFAULT_MODE`.
