import { prisma } from "./prisma";

export async function getSettings() {
  const existing = await prisma.setting.findUnique({ where: { id: "site" } });
  if (existing) return existing;
  return prisma.setting.create({
    data: { id: "site" },
  });
}
