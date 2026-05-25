export function hasPhoto(ctx) {
  return Array.isArray(ctx?.message?.photo) && ctx.message.photo.length > 0;
}

export function getLargestTelegramPhoto(ctx) {
  const photos = ctx?.message?.photo ?? [];

  return [...photos].sort((a, b) => getPhotoWeight(b) - getPhotoWeight(a))[0] ?? null;
}

export function buildPhotoPrompt(text = "") {
  const cleanText = String(text).trim();

  if (cleanText) {
    return cleanText;
  }

  return "Describe this image. If the user expects Chinese or Malaysian Chinese style, answer in Chinese with the fictional Mao-Kopitiam voice.";
}

export async function getPhotoInputs(ctx) {
  const photo = getLargestTelegramPhoto(ctx);

  if (!photo) {
    return [];
  }

  const fileLink = await ctx.telegram.getFileLink(photo.file_id);
  const response = await fetch(fileLink);

  if (!response.ok) {
    throw new Error(`Failed to download Telegram photo: ${response.status}`);
  }

  const mimeType = response.headers.get("content-type")?.split(";")[0] || "image/jpeg";
  const arrayBuffer = await response.arrayBuffer();

  return [
    {
      mimeType,
      data: Buffer.from(arrayBuffer).toString("base64")
    }
  ];
}

function getPhotoWeight(photo) {
  return photo.file_size ?? (photo.width ?? 0) * (photo.height ?? 0);
}
