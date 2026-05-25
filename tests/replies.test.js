import assert from "node:assert/strict";
import test from "node:test";

import { EMPTY_MENTION_REPLY } from "../src/persona/replies.js";

test("empty mention reply asks user to put the problem on the table", () => {
  assert.equal(
    EMPTY_MENTION_REPLY,
    "我在。有什么问题，摆到桌面上来。问题不怕大，只怕不分析。"
  );
});
