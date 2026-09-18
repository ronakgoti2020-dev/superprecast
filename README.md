# Super Precast website

Full website for Super Precast, Ankleshwar (Bharuch, Gujarat): public catalogue plus an admin panel where you can add, edit, and remove products.

## Run locally

```bash
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

- Username: `admin`
- Password: `SuperPrecast@2015`

Change these in `.env` (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `AUTH_SECRET`), then run `npm run db:setup` again so the admin login is recreated.

## What is included

- Home, About, Products, product detail, and Contact pages
- Quote / enquiry forms stored in the admin panel
- Admin login
- Add / edit / delete products, with optional photo upload
- Add categories
- Enquiry inbox with status
- Company settings (phone, email, WhatsApp, address, GST)

Catalogue data is seeded from the Super Precast IndiaMART listing (concrete jali, kerb stones, pavers, and cover blocks).
