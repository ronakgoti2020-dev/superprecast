import { prisma } from "./prisma";
import { formFiles, saveUpload } from "./upload";

export async function collectProductImages(form: FormData) {
  const files = formFiles(form, "images");
  let raw: unknown = [];
  try {
    raw = JSON.parse(String(form.get("keepImages") || "[]"));
  } catch {
    raw = [];
  }
  const slots = Array.isArray(raw) ? raw.map((value) => String(value || "")) : [];
  const urls: string[] = [];
  let fileIndex = 0;

  if (slots.length > 0) {
    for (const slot of slots) {
      if (slot) {
        urls.push(slot);
      } else if (files[fileIndex]) {
        urls.push(await saveUpload(files[fileIndex]));
        fileIndex += 1;
      }
    }
    return urls;
  }

  for (const file of files) {
    urls.push(await saveUpload(file));
  }
  return urls;
}

export async function replaceProductImages(productId: string, urls: string[]) {
  await prisma.productImage.deleteMany({ where: { productId } });
  if (urls.length === 0) {
    await prisma.product.update({ where: { id: productId }, data: { image: null } });
    return;
  }
  await prisma.productImage.createMany({
    data: urls.map((url, sortOrder) => ({ url, sortOrder, productId })),
  });
  await prisma.product.update({
    where: { id: productId },
    data: { image: urls[0] },
  });
}

export function galleryUrls(product: {
  image?: string | null;
  images?: { url: string }[];
}) {
  if (product.images && product.images.length > 0) {
    return product.images.map((item) => item.url);
  }
  return product.image ? [product.image] : [];
}
