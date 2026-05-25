# Mao-Kopitiam Telegram Agent Bot

Node.js Telegram group chatbot built with Telegraf and Gemini. The bot uses a fictional, comedic Malaysian Chinese persona with Mao-inspired rhetorical flavor, while avoiding real-world political propaganda, impersonation, hatred, and violence.

## Features

- Replies only when mentioned, replied to, `/ask` is used, or a supported command is used.
- In-memory chat modes: `normal`, `study`, `spicy`, `silent`.
- Gemini provider abstraction with model routing.
- Pre-LLM safety filter for explicit sexual content, minors, hate, harassment, violence, extremism, real-person impersonation, and propaganda.
- Prompt files under `prompts/` for persona and safety policy.

## Create a Telegram Bot

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot`.
3. Follow BotFather's prompts for bot name and username.
4. Copy the bot token BotFather gives you.
5. Optional for groups: use `/setprivacy` in BotFather. Keep privacy enabled if you only want commands, or disable it if the bot must detect mentions/replies reliably in busy groups.

## Environment Setup

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Fill in your real keys locally:

```env
TELEGRAM_BOT_TOKEN=your-telegram-token
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-3.5-flash
GEMINI_FAST_MODEL=gemini-3.1-flash-lite-preview
GEMINI_REASONING_MODEL=gemini-3.1-pro-preview

OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.5

DEFAULT_MODE=normal
NODE_ENV=development
```

Do not commit `.env`. It is ignored by Git.

## Install

```bash
npm install
```

## Run Locally

```bash
npm start
```

For development reloads:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

## Add to a Group

1. Open the Telegram group.
2. Add your bot by username.
3. Mention the bot, reply to the bot, or use `/ask`.
4. The bot will not respond to every normal group message.

## Commands

- `/start` - introduce the bot.
- `/help` - show commands and group behavior.
- `/ask <message>` - ask a direct question.
- `/mode normal` - balanced helper.
- `/mode study` - clearer explanations and examples.
- `/mode spicy` - stronger jokes, still safe.
- `/mode silent` - shortest useful replies.

## Model Routing

Gemini routing is implemented in `src/llm/modelRouter.js`:

- Default casual replies: `GEMINI_MODEL`
- Very lightweight normal/spicy replies: `GEMINI_FAST_MODEL`
- Code blocks, stack traces, debugging, assignments, architecture, explain, and summarize requests: `GEMINI_REASONING_MODEL`

## Safety Limitations

The safety filter is a simple MVP keyword/rule filter before the LLM call. It reduces obvious high-risk requests but is not a complete moderation system. Gemini safety settings are also enabled at the provider layer.

The persona is fictional parody. It must not impersonate Mao Zedong as a real person, generate real-world propaganda, promote extremism, encourage violence, or target protected groups.

## Future Improvements

- Persistent group memory.
- User nickname memory.
- Group inside jokes with admin controls.
- Daily quote or study reminder.
- Group chat summaries.
- Database-backed mode and settings.
- Admin-only mode changes.
- Deployment guide for a VPS, Render, Railway, or Fly.io.
