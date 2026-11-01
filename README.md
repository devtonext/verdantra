# Verdantra — Nature Conservation & Climate Action Website Template

A complete, sellable React 18 + Vite 5 + React Router 6 + Supabase CMS website template crafted for ecological foundations, climate action initiatives, watershed restoration NGOs, and environmental non-profits.

---

## 1. Included Features

### Website Frontend
- **Exact Bento UI & Editorial Aesthetic**: Neon-lime (`#E2F652`) and obsidian (`#121412`) palette with dynamic `color-mix()` shades, pill navigation, split hero bento cards, floating volunteer card, interactive landscape hotspot pins, 4-pill `"We -> Protect -> [→] -> Nature"` strip, interactive hover-preview initiatives table, and 4 vertical ecological problem cards.
- **6 Multi-Page Routes + Dynamic Detail Views**:
  - `/` — **Home**: Dual bento hero, floating circular nature vignettes, 4-pill mantra strip, interactive initiatives table with tilted photo preview, 4 vertical catastrophe cards, and modals.
  - `/contribution` — **Contribution & Volunteering**: Interactive impact calculator slider, stewardship tiers, live donation pledge form,volunteer expedition signup form, and FAQ accordion.
  - `/mission` — **Our Mission**: Scientific mandate, animated counters, frontline manifesto, field scientist cards, testimonial slider, and partner institutions.
  - `/problems` — **Ecological Problems Hub**: Filterable crisis dossiers (`Ocean Pollution`, `Glacier Melting`, `Forest Clearance`, `GHG Emissions`) with satellite metrics and remediation protocols.
  - `/projects` & `/projects/:slug` — **Field Projects & Dispatches**: Searchable project directory with category filters and full article detail pages with related operations.
  - `/contact` — **Contact Us**: Direct dispatch form with URL parameter pre-fill, headquarters info, and field station map.

### Lazy-Loaded Admin Dashboard (`/admin`)
- Code-split with `React.lazy()` so website visitors never download admin assets.
- Zero-setup **Demo Mode** (`localStorage`) out of the box + seamless **Supabase Driver** when `.env` variables are provided.
- **Page Editor**: Edit every text, image, link, and brand colour (`--primary` and `--accent`) with per-section Save/Discard buttons and unsaved badges.
- **Collection Manager**: Full CRUD, search, reorder up/down, duplicate, Live/Hidden toggle, and featured badges across all 9 collections.
- **Inbox**: Manage `messages`, `donations`, `volunteers`, and `subscribers` with status filters, auto-mark-as-read, `mailto:`/`tel:` actions, and 1-click CSV export.
- **Media Library**: Drag-and-drop image upload, file size display, copy URL, and delete.

---

## 2. Quick Start & Demo Login

```bash
npm install
npm run dev
```

- **Website**: `http://localhost:5173`
- **Admin Dashboard**: `http://localhost:5173/admin`
- **Demo Admin Credentials**: `admin@demo.com` / `demo1234`

---

## 3. Go Live With Supabase in 5 Steps

1. **Create a project**: Go to [https://database.new](https://database.new) and create a new Supabase project.
2. **Run Setup SQL**: Open the **SQL Editor** in Supabase, paste the entire contents of `supabase/setup.sql`, and click **Run**. This creates all tables, triggers, RLS policies, the public `media` storage bucket, and seeds the default content.
3. **Configure `.env`**: Copy `.env.example` to `.env` and add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (never use your `service_role` secret key).
4. **Create the first admin**: Visit `/admin` in your browser and create the first account. A PostgreSQL trigger on `auth.users` automatically promotes the very first user who signs up to `admin_users`.
5. **Lock signups**: In your Supabase Dashboard under **Authentication → Providers → Email**, turn off *"Allow new users to sign up"*.

---

## 4. Deploy to Vercel

1. Push this repository to GitHub/GitLab and import it into [Vercel](https://vercel.com).
2. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_SUPABASE_BUCKET=media` under **Environment Variables** *before* deploying.
3. Redeploy after any environment variable changes.
4. In Supabase (**Authentication → URL Configuration**), set your **Site URL** to your live Vercel domain.

---

## 5. Adding or Removing Admins (SQL)

Run these commands in the Supabase SQL Editor:

```sql
-- Add an existing user as an admin by email
insert into public.admin_users (user_id, email)
select id, email from auth.users where email = 'colleague@yourdomain.org'
on conflict (user_id) do nothing;

-- Remove an admin
delete from public.admin_users where email = 'colleague@yourdomain.org';
```

---

## 6. Database Schema Table

| Table | Purpose | Public Read | Public Write | Admin Access |
| :--- | :--- | :--- | :--- | :--- |
| `site_content` | Page sections & global settings | Yes | No | Full CRUD |
| `initiatives` | Annual initiatives table rows | Published only | No | Full CRUD |
| `problems` | Ecological crisis cards & dossiers | Published only | No | Full CRUD |
| `projects` | Field conservation projects & articles | Published only | No | Full CRUD |
| `tiers` | Monthly/annual contribution tiers | Published only | No | Full CRUD |
| `stats` | Animated impact counters | Published only | No | Full CRUD |
| `team` | Field scientists & leadership | Published only | No | Full CRUD |
| `testimonials` | Community & donor quotes | Published only | No | Full CRUD |
| `faqs` | Accordion questions & answers | Published only | No | Full CRUD |
| `partners` | Institutional partner links | Published only | No | Full CRUD |
| `messages` | Contact form submissions | No | INSERT (`unread`) | Full CRUD + CSV |
| `donations` | Contribution pledge submissions | No | INSERT (`pending`) | Full CRUD + CSV |
| `volunteers` | Volunteer expedition applications | No | INSERT (`new`) | Full CRUD + CSV |
| `subscribers` | Newsletter email signups | No | INSERT (`active`) | Full CRUD + CSV |
| `admin_users` | CMS administrator accounts | No | First-user trigger | Full CRUD |

---

## 7. Customizing Sections & Collections

- **Add a new field to a section**:
  1. Add the default key/value inside `defaultContent.<section>` in `src/lib/defaults.js`.
  2. Add `{ name: 'your_field', label: 'Your Label', type: 'text' }` to the corresponding section in `src/admin/schema.js`.
  3. Run `npm run build:sql` to regenerate `supabase/seed.sql` and `supabase/setup.sql`.
- **Add a new column to a collection**:
  1. Add the column definition to `supabase/schema.sql`.
  2. Add the default property to the rows in `defaultCollections.<table>` in `src/lib/defaults.js`.
  3. Add the column name to `collectionColumns.<table>` in `scripts/build-sql.mjs` and the field definition in `src/admin/schema.js`, then run `npm run build:sql`.

### Available Field Types in `src/admin/schema.js`
`text`, `textarea`, `title`, `list`, `tags`, `image`, `number`, `select`, `boolean`, `color`, `date`, `url`, `slug`, `markdown`.

---

## 8. Troubleshooting

| Symptom | Cause & Fix |
| :--- | :--- |
| Dashboard badge still says **Demo Mode** | Ensure `.env` has both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then restart `npm run dev` or redeploy on Vercel. |
| "No Admin Access" after signing in | Either another user signed up first, or `setup.sql` was run after signup. Run the SQL snippet in Section 5 to add your email to `public.admin_users`. |
| Image upload fails in live mode | Verify that `setup.sql` was executed so the public `media` bucket and its storage RLS policies exist. |

---

## 9. Image Credits & Pre-Sale Checklist
- Demo editorial conservation landscapes and portraits are located in `public/images/` (`hero-basin.jpg`, `lagoon-mirror.jpg`, `glacier-ice.jpg`, `canyon-ridge.jpg`, `mountain-mist.jpg`, `volunteer-portrait.jpg`).
- Replace the demo contact address, phone number, and social URLs in `/admin/pages/contact` before publishing to production.
