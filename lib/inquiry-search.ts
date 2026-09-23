import { Prisma } from "@prisma/client";

export function inquirySearchWhere(q?: string): Prisma.InquiryWhereInput | undefined {
  const query = q?.trim();
  if (!query) return undefined;
  const digits = query.replace(/\D/g, "");
  return {
    OR: [
      { name: { contains: query } },
      { phone: { contains: query } },
      ...(digits && digits !== query ? [{ phone: { contains: digits } }] : []),
    ],
  };
}
