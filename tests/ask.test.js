import assert from "node:assert/strict";
import test from "node:test";

import { extractAskText, formatAskUsage } from "../src/commands/ask.js";

test("extracts ask text from direct and bot-targeted commands", () => {
  assert.equal(extractAskText("/ask explain recursion"), "explain recursion");
  assert.equal(extractAskText("/ask@MaoKopitiamBot explain recursion"), "explain recursion");
});

test("returns an empty string when ask command has no message", () => {
  assert.equal(extractAskText("/ask"), "");
  assert.equal(extractAskText("/ask@MaoKopitiamBot"), "");
});

test("formats ask usage as a short Telegram-friendly hint", () => {
  assert.match(formatAskUsage(), /\/ask/);
  assert.match(formatAskUsage(), /question|message/i);
});
