import { prisma } from "./prisma";
import { collectProductImages } from "./product-images";

export async function collectProjectImages(form: FormData) {
  return collectProductImages(form);
}

export async function replaceProjectImages(projectId: string, urls: string[]) {
  await prisma.projectImage.deleteMany({ where: { projectId } });
  if (urls.length === 0) {
    await prisma.project.update({ where: { id: projectId }, data: { image: null } });
    return;
  }
  await prisma.projectImage.createMany({
    data: urls.map((url, sortOrder) => ({ url, sortOrder, projectId })),
  });
  await prisma.project.update({
    where: { id: projectId },
    data: { image: urls[0] },
  });
}
