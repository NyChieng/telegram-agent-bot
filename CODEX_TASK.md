# Codex Task: Build Mao-Kopitiam Telegram Agent Bot MVP

Build a Node.js Telegram group chatbot using Telegraf.

## Goal

Create a Telegram bot with a fictional Mao-inspired Malaysian Chinese personality.
The bot should be funny, dramatic, useful, and safe for group chat.

## Tech Stack

- Node.js
- Telegraf
- dotenv
- Gemini API as the first LLM provider
- Provider abstraction so OpenAI can be added later

## Required Features

### 1. Telegram Bot

Create a bot that connects using TELEGRAM_BOT_TOKEN from .env.

The bot should reply only when:
- The bot is mentioned.
- A user replies to the bot.
- The user uses /ask.
- The user uses supported commands.

Do not reply to every group message.

### 2. Commands

Implement:

- /start
- /help
- /ask <message>
- /mode normal
- /mode study
- /mode spicy
- /mode silent

Store mode in memory for now.

### 3. Persona Prompt

Load the system prompt from:

prompts/mao-kopitiam-system-prompt.md

The bot should combine:
- Mao-inspired rhetorical style
- Malaysian Chinese slang
- Humor
- Practical help
- Safety boundaries

### 4. LLM Provider

Create provider abstraction:

src/llm/provider.js

Support Gemini first:

src/llm/gemini.js

Use environment variables:

GEMINI_API_KEY
GEMINI_MODEL

Default model:
gemini-2.5-flash

### 5. Safety Filter

Create:

src/persona/safetyRules.js

Before sending a message to the LLM, check for high-risk content.
The filter should block or redirect:
- explicit sexual content
- sexual content involving minors
- hate speech
- harassment
- calls for violence
- political extremism
- requests to impersonate Mao as the real person
- requests to generate propaganda

If blocked, reply with a short, funny but safe refusal.

### 6. Message Filter

Create:

src/utils/messageFilter.js

Detect:
- bot mention
- reply to bot
- /ask command
- commands

### 7. Project Quality

- Do not hardcode secrets.
- Use .env.example.
- Add useful comments only where needed.
- Use clean modular code.
- Add error handling.
- Add README setup guide.
- Add npm scripts:
  - npm start
  - npm run dev

## Expected File Structure

Follow this structure:

src/
  index.js
  bot.js
  config.js
  llm/
    provider.js
    gemini.js
    openai.js
  persona/
    maoKopitiam.js
    safetyRules.js
  commands/
    mode.js
    ask.js
    help.js
  utils/
    messageFilter.js
    logger.js

prompts/
  mao-kopitiam-system-prompt.md
  safety-policy.md
  examples.md

docs/
  persona-research.md
  design-notes.md

## After Implementation

Update README.md with:

1. How to create Telegram bot using BotFather.
2. How to set .env.
3. How to install dependencies.
4. How to run locally.
5. How to add bot to Telegram group.
6. Supported commands.
7. Safety limitations.
8. Future improvements.
