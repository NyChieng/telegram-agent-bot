import assert from "node:assert/strict";
import test from "node:test";

import {
  SUPPORTED_MODES,
  createModeStore,
  formatModeHelp,
  parseModeCommand
} from "../src/commands/mode.js";

test("stores chat modes in memory and falls back to the default mode", () => {
  const store = createModeStore("normal");

  assert.equal(store.getMode(-100), "normal");
  assert.equal(store.setMode(-100, "study"), "study");
  assert.equal(store.getMode(-100), "study");
});

test("rejects unsupported modes", () => {
  const store = createModeStore("normal");

  assert.throws(() => store.setMode(-100, "chaos"), /Unsupported mode/);
});

test("parses valid and invalid mode command arguments", () => {
  assert.deepEqual(parseModeCommand("spicy"), { ok: true, mode: "spicy" });
  assert.deepEqual(parseModeCommand("chaos"), {
    ok: false,
    error: "unsupported_mode",
    requestedMode: "chaos"
  });
});

test("formats help with every supported mode", () => {
  const help = formatModeHelp();

  for (const mode of SUPPORTED_MODES) {
    assert.match(help, new RegExp(`/mode ${mode}`));
  }
});
