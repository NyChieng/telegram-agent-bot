import assert from "node:assert/strict";
import test from "node:test";

import {
  extractCommand,
  getMessageText,
  isAskCommand,
  isBotMentioned,
  isReplyToBot,
  shouldHandleMessage,
  stripBotMention
} from "../src/utils/messageFilter.js";

const botInfo = { id: 12345, username: "MaoKopitiamBot" };

function textCtx(text, overrides = {}) {
  return {
    message: {
      text,
      chat: { type: "group", id: -100 },
      ...overrides
    }
  };
}

test("gets text from normal text and caption messages", () => {
  assert.equal(getMessageText(textCtx("hello")), "hello");
  assert.equal(getMessageText({ message: { caption: "photo caption" } }), "photo caption");
});

test("detects bot mentions and strips them from text", () => {
  const ctx = textCtx("@MaoKopitiamBot help me debug");

  assert.equal(isBotMentioned(ctx, botInfo), true);
  assert.equal(stripBotMention(getMessageText(ctx), botInfo.username), "help me debug");
});

test("detects replies to the bot", () => {
  const ctx = textCtx("what do you think?", {
    reply_to_message: {
      from: { id: 12345, is_bot: true, username: "MaoKopitiamBot" }
    }
  });

  assert.equal(isReplyToBot(ctx, botInfo), true);
});

test("parses commands with and without bot username suffix", () => {
  assert.deepEqual(extractCommand("/ask hello there"), {
    command: "ask",
    target: null,
    args: "hello there"
  });
  assert.deepEqual(extractCommand("/mode@MaoKopitiamBot spicy"), {
    command: "mode",
    target: "MaoKopitiamBot",
    args: "spicy"
  });
});

test("detects ask command", () => {
  assert.equal(isAskCommand(textCtx("/ask explain recursion")), true);
  assert.equal(isAskCommand(textCtx("/ask@MaoKopitiamBot explain recursion")), true);
  assert.equal(isAskCommand(textCtx("/help")), false);
});

test("handles only mentions, replies, ask, and supported commands in groups", () => {
  assert.equal(shouldHandleMessage(textCtx("random group chatter"), botInfo).shouldHandle, false);
  assert.equal(
    shouldHandleMessage({ message: { photo: [{ file_id: "p" }], chat: { type: "group", id: -100 } } }, botInfo)
      .shouldHandle,
    false
  );
  assert.equal(shouldHandleMessage(textCtx("@MaoKopitiamBot ping"), botInfo).reason, "mention");
  assert.equal(shouldHandleMessage(textCtx("/ask ping"), botInfo).reason, "ask");
  assert.equal(shouldHandleMessage(textCtx("/mode spicy"), botInfo).reason, "command");
  assert.equal(shouldHandleMessage(textCtx("/unknown ping"), botInfo).shouldHandle, false);
});

test("handles group messages when someone tags the bot", () => {
  const decision = shouldHandleMessage(textCtx("同志 @MaoKopitiamBot 这个 bug 怎么看"), botInfo);

  assert.equal(decision.shouldHandle, true);
  assert.equal(decision.reason, "mention");
});

test("handles group photo captions when someone tags the bot", () => {
  const decision = shouldHandleMessage(
    {
      message: {
        caption: "@MaoKopitiamBot 用中文解释这张图",
        photo: [{ file_id: "p" }],
        chat: { type: "group", id: -100 }
      }
    },
    botInfo
  );

  assert.equal(decision.shouldHandle, true);
  assert.equal(decision.reason, "mention");
});

test("handles private photo messages even without captions", () => {
  const decision = shouldHandleMessage(
    {
      message: {
        photo: [{ file_id: "p" }],
        chat: { type: "private", id: 1 }
      }
    },
    botInfo
  );

  assert.equal(decision.shouldHandle, true);
  assert.equal(decision.reason, "private");
});
