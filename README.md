# Mao Zedong Roleplay Telegram Bot

A Telegram group chatbot that roleplays Mao Zedong in first person for entertainment, study help, coding help, and historical-style conversation. It is built for group chats where homework delays become “主要矛盾”, bugs require “调查研究”, and an empty error log has no speaking rights.

The bot replies only when addressed directly, supports photo prompts, and keeps safety boundaries against violence, hatred, extremist propaganda, harassment, scams, and historical denial or glorification of suffering.

Short description:

> A first-person Mao Zedong roleplay bot for Telegram groups: stern about logs, poetic about deadlines, and always suspicious of uninvestigated bugs.

## Group Chat Flavor

The bot is designed for useful banter, not dry assistant speak:

- “没有 error log，就没有发言权。”
- “枪毙不必，奶茶可以。”
- “Deadline 是纸老虎，空白文档不是。”
- “反动不反动，不能凭一句话定案；先看事实。”
- “主要矛盾不是代码太难，是你还没贴报错。”

## Features

- Replies when mentioned, replied to, `/ask` is used, or a supported command is used.
- Can respond to photos when sent in private chat, replied to the bot, mentioned in the caption, or sent with `/ask` in the caption.
- First-person Mao Zedong roleplay prompt with default Chinese responses.
- Handles joking group accusations with harmless satire: self-criticism, task lists, deadlines, or buying drinks.
- In-memory chat modes: `normal`, `study`, `spicy`, `silent`.
- Gemini provider abstraction with model routing.
- Pre-LLM safety filter for high-risk requests.

## Create a Telegram Bot

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot`.
3. Follow BotFather's prompts for bot name and username.
4. Copy the bot token BotFather gives you.
5. For group mentions and photo captions, use `/setprivacy` in BotFather and disable privacy mode if the bot does not see tagged messages.

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
GEMINI_FAST_MODEL=gemini-3.1-flash-lite
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

For photos in groups, mention the bot in the caption, reply to the bot with a photo, or use `/ask <question>` in the photo caption. Private chats can send a photo directly.

In group chats, users can talk to the bot naturally by mentioning it:

```text
@MaoZeDong1bot <message>
```

Example:

```text
@MaoZeDong1bot 你好
```

This behaves like `/ask@MaoZeDong1bot 你好`; the mention is stripped before the message is sent to the model. For plain `@mentions` to work in groups, Telegram Group Privacy Mode should be disabled in BotFather, or the bot should be added as an admin.

## Commands

- `/start` - introduce the bot.
- `/help` - show commands and group behavior.
- `/ask <message>` - ask a direct question.
- `/mode normal` - balanced roleplay replies.
- `/mode study` - clearer explanations and examples.
- `/mode spicy` - sharper judgment, still safe.
- `/mode silent` - shortest useful replies.

Photo examples:

- Send a photo with caption `/ask 用中文解释这张图`.
- Reply to the bot with a photo and caption `同志，这是什么 bug?`.
- In a group caption, write `@MaoZeDong1bot describe this`.

Banter examples:

```text
@MaoZeDong1bot Kelvin 是国民党的走狗
```

```text
@MaoZeDong1bot 这种情况是不是要枪毙？
```

The bot should redirect that style into harmless jokes like investigation, criticism, self-criticism, task assignment, deadlines, or buying drinks.

## Model Routing

Gemini routing is implemented in `src/llm/modelRouter.js`:

- Default casual replies: `GEMINI_MODEL`
- Very lightweight normal/spicy replies: `GEMINI_FAST_MODEL`
- Code blocks, stack traces, debugging, assignments, architecture, explain, and summarize requests: `GEMINI_REASONING_MODEL`
- If a routed model is unavailable or quota-limited, the bot retries with `GEMINI_MODEL` before showing an error.

## Safety Limitations

The safety filter is a simple MVP keyword/rule filter before the LLM call. It reduces obvious high-risk requests but is not a complete moderation system. Gemini safety settings are also enabled at the provider layer.

Normal first-person Mao Zedong roleplay is allowed. The bot should not claim that the historical Mao is literally alive today, scam users, issue real orders, encourage violence, promote hatred, produce extremist propaganda, harass people, or glorify or deny historical suffering.

## Future Improvements

- Persistent group memory.
- User nickname memory.
- Daily quote or study reminder.
- Group chat summaries.
- Database-backed mode and settings.
- Admin-only mode changes.
- Deployment guide for a VPS, Render, Railway, or Fly.io.
