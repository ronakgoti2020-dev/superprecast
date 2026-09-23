import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { InquiryStatus } from "@/components/admin/InquiryStatus";
import { InquirySearch } from "@/components/admin/InquirySearch";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

function inquirySearchWhere(q?: string): Prisma.InquiryWhereInput | undefined {
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

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const where = inquirySearchWhere(q);
  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Enquiries</h1>
      <p className="mt-2 text-ink-soft">Leads from the website quote forms.</p>
      <div className="mt-6">
        <InquirySearch initialQ={q ?? ""} />
      </div>
      <div className="mt-8 space-y-4">
        {inquiries.map((item) => (
          <article key={item.id} className="border border-ink/10 bg-paper p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl">{item.name}</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  {item.phone}
                  {item.email ? ` · ${item.email}` : ""}
                  {item.city ? ` · ${item.city}` : ""}
                </p>
                <p className="mt-1 text-sm">
                  {item.product?.name || "General enquiry"} · {formatDate(item.createdAt)}
                </p>
              </div>
              <InquiryStatus id={item.id} status={item.status} />
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7">{item.message}</p>
          </article>
        ))}
        {inquiries.length === 0 ? (
          <p className="border border-ink/10 bg-paper p-8 text-ink-soft">
            {q?.trim()
              ? `No enquiries match “${q.trim()}”.`
              : "No enquiries yet."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
