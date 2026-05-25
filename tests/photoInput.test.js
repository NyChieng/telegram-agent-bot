import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPhotoPrompt,
  getLargestTelegramPhoto,
  hasPhoto
} from "../src/utils/photoInput.js";

test("detects Telegram photo messages", () => {
  assert.equal(hasPhoto({ message: { photo: [{ file_id: "a" }] } }), true);
  assert.equal(hasPhoto({ message: { text: "no photo" } }), false);
});

test("selects the largest Telegram photo by file size first", () => {
  const photo = getLargestTelegramPhoto({
    message: {
      photo: [
        { file_id: "small", width: 100, height: 100, file_size: 500 },
        { file_id: "large", width: 200, height: 200, file_size: 2000 }
      ]
    }
  });

  assert.equal(photo.file_id, "large");
});

test("selects the largest Telegram photo by pixel area when file size is missing", () => {
  const photo = getLargestTelegramPhoto({
    message: {
      photo: [
        { file_id: "small", width: 100, height: 100 },
        { file_id: "large", width: 300, height: 200 }
      ]
    }
  });

  assert.equal(photo.file_id, "large");
});

test("builds a default image prompt when there is no caption", () => {
  assert.match(buildPhotoPrompt(""), /Describe this image/i);
  assert.match(buildPhotoPrompt(""), /Chinese/i);
  assert.match(buildPhotoPrompt(""), /Mao Zedong/i);
});

test("builds an image prompt from the provided caption", () => {
  assert.equal(buildPhotoPrompt("用中文解释这张图"), "用中文解释这张图");
});
