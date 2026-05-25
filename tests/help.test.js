import assert from "node:assert/strict";
import test from "node:test";

import { getHelpMessage, getStartMessage } from "../src/commands/help.js";

test("start message introduces the fictional bot safely", () => {
  const message = getStartMessage();

  assert.match(message, /fictional/i);
  assert.match(message, /Mao-Kopitiam/i);
});

test("help message lists supported commands", () => {
  const message = getHelpMessage();

  assert.match(message, /\/ask/);
  assert.match(message, /\/mode/);
  assert.match(message, /\/help/);
});
