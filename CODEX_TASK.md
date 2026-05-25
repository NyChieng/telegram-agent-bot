# Codex Task: Mao Zedong First-Person Telegram Roleplay Bot

Build a Node.js Telegram group chatbot using Telegraf.

## Goal

Create a Telegram bot that roleplays Mao Zedong in first person for entertainment, study help, coding help, and historical-style conversation.

The bot should be dramatic, useful, historically aware, and safe for group chat.

## Tech Stack

- Node.js
- Telegraf
- dotenv
- Gemini API as the first LLM provider
- Provider abstraction so OpenAI can be added later

## Required Features

### 1. Telegram Bot

Create a bot that connects using `TELEGRAM_BOT_TOKEN` from `.env`.

The bot should reply only when:
- The bot is mentioned.
- A user replies to the bot.
- The user uses `/ask`.
- The user uses supported commands.

Do not reply to every group message.

### 2. Commands

Implement:

- `/start`
- `/help`
- `/ask <message>`
- `/mode normal`
- `/mode study`
- `/mode spicy`
- `/mode silent`

Store mode in memory for now.

### 3. Persona Prompt

Load the system prompt from:

`prompts/mao-zedong-system-prompt.md`

The bot should combine:
- first-person Mao Zedong roleplay
- Chinese rhetorical style
- historical awareness
- practical help
- safety boundaries

### 4. LLM Provider

Create provider abstraction:

`src/llm/provider.js`

Support Gemini first:

`src/llm/gemini.js`

Use environment variables:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `GEMINI_FAST_MODEL`
- `GEMINI_REASONING_MODEL`

### 5. Safety Filter

Create:

`src/persona/safetyRules.js`

Before sending a message to the LLM, check for high-risk content.
The filter should block or redirect:
- explicit sexual content
- sexual content involving minors
- hate speech
- harassment
- calls for violence
- political extremism
- deception or scams
- claims that the historical Mao is literally alive today
- requests to generate extremist or harmful propaganda

Normal Mao Zedong roleplay prompts should be allowed.

### 6. Message Filter

Create:

`src/utils/messageFilter.js`

Detect:
- bot mention
- reply to bot
- `/ask` command
- commands
- photo captions that mention or address the bot

### 7. Project Quality

- Do not hardcode secrets.
- Use `.env.example`.
- Add useful comments only where needed.
- Use clean modular code.
- Add error handling.
- Add README setup guide.
- Add npm scripts:
  - `npm start`
  - `npm run dev`

## Expected File Structure

```text
src/
  index.js
  bot.js
  config.js
  llm/
    provider.js
    gemini.js
    openai.js
    modelRouter.js
  persona/
    maoZedong.js
    safetyRules.js
  commands/
    mode.js
    ask.js
    help.js
  utils/
    messageFilter.js
    photoInput.js
    logger.js

prompts/
  mao-zedong-system-prompt.md
  safety-policy.md
  examples.md

docs/
  persona-research.md
  design-notes.md
```
