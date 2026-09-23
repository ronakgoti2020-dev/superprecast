"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Settings = {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  gst: string;
  owner: string;
  instagram: string;
  mapUrl: string;
  logo: string;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(settings.logo || "/logo.png");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      body: new FormData(event.currentTarget),
    });
    setStatus(response.ok ? "Saved." : "Could not save settings.");
    if (response.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm text-ink-soft">Logo</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="Current logo" className="mb-3 h-16 w-16 object-contain" />
        <input type="hidden" name="logoUrl" value={settings.logo} />
        <input
          name="logo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="admin-input"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
        />
        <span className="mt-2 block text-xs text-ink-soft">
          PNG or JPG works best. Leave empty to keep the current logo.
        </span>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-ink-soft">Phone</span>
        <input name="phone" defaultValue={settings.phone} className="admin-input" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-ink-soft">Email</span>
        <input name="email" type="email" defaultValue={settings.email} className="admin-input" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-ink-soft">WhatsApp number with country code</span>
        <input
          name="whatsapp"
          defaultValue={settings.whatsapp}
          placeholder="9198XXXXXXXX"
          className="admin-input"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-ink-soft">Address</span>
        <textarea name="address" rows={3} defaultValue={settings.address} className="admin-input" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-ink-soft">GST number</span>
        <input name="gst" defaultValue={settings.gst} className="admin-input" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-ink-soft">Owner / contact person</span>
        <input name="owner" defaultValue={settings.owner} className="admin-input" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-ink-soft">Instagram</span>
        <input
          name="instagram"
          defaultValue={settings.instagram}
          placeholder="https://instagram.com/yourpage or @yourpage"
          className="admin-input"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-ink-soft">Google Maps location</span>
        <input
          name="mapUrl"
          defaultValue={settings.mapUrl}
          placeholder="Paste the Google Maps share or embed link"
          className="admin-input"
        />
      </label>
      <button className="bg-terracotta px-6 py-3 text-sm text-cream">Save settings</button>
      {status ? <p className="text-sm text-ink-soft">{status}</p> : null}
    </form>
  );
}
