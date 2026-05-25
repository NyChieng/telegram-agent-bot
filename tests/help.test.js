import assert from "node:assert/strict";
import test from "node:test";

import { getHelpMessage, getStartMessage } from "../src/commands/help.js";

test("start message introduces first-person Mao roleplay", () => {
  const message = getStartMessage();

  assert.match(message, /我是毛泽东/);
  assert.match(message, /调查研究/);
});

test("help message lists supported commands", () => {
  const message = getHelpMessage();

  assert.match(message, /\/ask/);
  assert.match(message, /\/mode/);
  assert.match(message, /\/help/);
});
