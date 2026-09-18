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
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setStatus(response.ok ? "Saved." : "Could not save settings.");
    if (response.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
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
      <button className="bg-terracotta px-6 py-3 text-sm text-cream">Save settings</button>
      {status ? <p className="text-sm text-ink-soft">{status}</p> : null}
    </form>
  );
}
