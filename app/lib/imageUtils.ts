export async function normalizeImageFile(
  file: File
): Promise<Blob> {
  const fileName = file.name.toLowerCase();

  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif");

  if (!isHeic) {
    return file;
  }

  if (typeof window === "undefined") {
    throw new Error("HEIC conversion is only available in the browser.");
  }

  const { default: heic2any } = await import("heic2any");

  const result = await heic2any({
    blob: file,
    toType: "image/png",
    quality: 0.95,
  });

  if (Array.isArray(result)) {
    return result[0];
  }

  return result;
}