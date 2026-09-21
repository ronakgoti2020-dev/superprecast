const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;
const MAX_ORIGINAL_BYTES = 25 * 1024 * 1024;

export async function compressImage(file: File): Promise<File> {
  if (file.size > MAX_ORIGINAL_BYTES) {
    throw new Error("Photo is larger than 25MB. Please choose a smaller file.");
  }
  if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|gif)$/i.test(file.name)) {
    throw new Error("Use JPG, PNG, WEBP, or GIF.");
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    if (file.size > 8 * 1024 * 1024) {
      throw new Error("Could not shrink this photo. Save it as a JPG under 8MB.");
    }
    return file;
  }
}
