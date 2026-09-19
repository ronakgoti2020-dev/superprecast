"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type WorkValue = {
  id?: string;
  title: string;
  location: string;
  year: string;
  description: string;
  featured: boolean;
  image: string | null;
  images?: { url: string }[];
};

type DraftPhoto = { url: string; file?: File };

export function WorkForm({ project }: { project?: WorkValue }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<DraftPhoto[]>(() => {
    if (project?.images && project.images.length > 0) {
      return project.images.map((item) => ({ url: item.url }));
    }
    return project?.image ? [{ url: project.image }] : [];
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    form.set(
      "keepImages",
      JSON.stringify(photos.map((photo) => (photo.file ? "" : photo.url))),
    );
    for (const photo of photos) {
      if (photo.file) form.append("images", photo.file);
    }
    const url = project?.id ? `/api/admin/work/${project.id}` : "/api/admin/work";
    const method = project?.id ? "PUT" : "POST";
    try {
      const response = await fetch(url, { method, body: form });
      const text = await response.text();
      let data: { error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }
      setSaving(false);
      if (!response.ok) {
        setStatus(data.error || "Could not save this work");
        return;
      }
      router.push("/admin/work");
      router.refresh();
    } catch {
      setSaving(false);
      setStatus("Could not save this work. Check the photo and try again.");
    }
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const next: DraftPhoto[] = [];
    for (const file of Array.from(list)) {
      const type = file.type.toLowerCase();
      const name = file.name.toLowerCase();
      const okType =
        allowed.includes(type) ||
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg") ||
        name.endsWith(".png") ||
        name.endsWith(".webp") ||
        name.endsWith(".gif");
      if (!okType) {
        setStatus("Use JPG, PNG, WEBP, or GIF.");
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        setStatus("Each photo must be under 8MB.");
        continue;
      }
      next.push({ url: URL.createObjectURL(file), file });
    }
    if (next.length) setPhotos((current) => [...current, ...next]);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-ink-soft">Project / site name</span>
          <input name="title" required defaultValue={project?.title} className="admin-input" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">Location</span>
          <input name="location" defaultValue={project?.location} placeholder="Ankleshwar, Gujarat" className="admin-input" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">Year</span>
          <input name="year" defaultValue={project?.year} placeholder="2024" className="admin-input" />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-ink-soft">What was delivered</span>
          <textarea name="description" rows={4} defaultValue={project?.description} className="admin-input" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={project?.featured} />
          Show on homepage
        </label>
      </div>

      <section className="border border-ink/10 bg-paper p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Site photos</h2>
            <p className="mt-1 text-sm text-ink-soft">Add photos of the delivered work. First photo is the cover.</p>
          </div>
          <label className="cursor-pointer bg-ink px-4 py-2 text-sm text-cream">
            Add photos
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
              multiple
              className="hidden"
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
        </div>
        {photos.length === 0 ? (
          <p className="mt-5 text-sm text-ink-soft">No photos yet.</p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo, index) => (
              <div key={`${photo.url}-${index}`} className="border border-ink/10 bg-cream p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" className="aspect-square w-full object-cover" />
                <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                  <span className="text-ink-soft">{index === 0 ? "Cover" : `Photo ${index + 1}`}</span>
                  <div className="flex gap-2">
                    {index > 0 ? (
                      <button
                        type="button"
                        className="text-ink"
                        onClick={() =>
                          setPhotos((current) => {
                            const next = [...current];
                            const [item] = next.splice(index, 1);
                            next.unshift(item);
                            return next;
                          })
                        }
                      >
                        Make cover
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="text-terracotta"
                      onClick={() => setPhotos((current) => current.filter((_, i) => i !== index))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {status ? <p className="text-sm text-terracotta">{status}</p> : null}
      <button disabled={saving} className="bg-terracotta px-6 py-3 text-sm text-cream disabled:opacity-60">
        {saving ? "Saving..." : project ? "Update work" : "Add work"}
      </button>
    </form>
  );
}
