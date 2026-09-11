<div align="center">

<br/>

# 🏷️ DealDrop — Price Tracker

**Never miss a price drop again.**

Track prices from any e-commerce site, get instant email alerts when prices fall, and visualize price history with beautiful charts.

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firecrawl](https://img.shields.io/badge/Firecrawl-AI%20Scraping-FF5733?style=for-the-badge)](https://firecrawl.dev/)
[![Resend](https://img.shields.io/badge/Resend-Email%20Alerts-000000?style=for-the-badge)](https://resend.com/)

<br/>

[✨ Features](#-features) · [🏗️ Architecture](#️-architecture) · [🚀 Getting Started](#-getting-started) · [⚙️ Environment Variables](#️-environment-variables) · [📡 API Reference](#-api-reference) · [🗂️ Project Structure](#️-project-structure)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **AI-Powered Scraping** | Uses Firecrawl to extract product name, price, currency, and image from any URL |
| 📈 **Price History Charts** | Interactive Recharts visualizations of historical price trends |
| 🔔 **Instant Email Alerts** | Get notified via Resend when a tracked product drops in price |
| 🔐 **Auth with Supabase** | Secure user authentication — only see and manage your own tracked products |
| ⏱️ **Automated Cron Jobs** | Scheduled price checks via a secured POST endpoint |
| 🌗 **Clean, Modern UI** | Built with shadcn/ui, Lucide icons, and Sonner toasts |
| ⚡ **Next.js Server Actions** | Fast, type-safe server mutations without API boilerplate |

---

## 🏗️ Architecture

```
Browser / User
     │
     ▼
┌─────────────────────────────────────────────────┐
│                 Next.js 16 App                  │
│                                                 │
│  ┌─────────────┐    ┌──────────────────────┐   │
│  │  page.jsx   │    │   Server Actions      │   │
│  │  (SSR)      │───▶│   actions.js          │   │
│  └─────────────┘    │  • addProduct()       │   │
│                     │  • deleteProduct()    │   │
│  ┌─────────────┐    │  • getProducts()      │   │
│  │  Components │    │  • getPriceHistory()  │   │
│  │  ProductCard│    └──────────┬───────────┘   │
│  │  PriceChart │               │                │
│  │  AuthButton │               ▼                │
│  └─────────────┘    ┌──────────────────────┐   │
│                     │   lib/firecrawl.js    │   │
│  ┌─────────────┐    │   scrapeProduct()     │   │
│  │  Cron Route │    └──────────┬───────────┘   │
│  │  /api/cron/ │               │                │
│  │  check-     │    ┌──────────▼───────────┐   │
│  │  prices     │───▶│   lib/email.js        │   │
│  └─────────────┘    │  sendPriceDropAlert() │   │
│                     └──────────────────────┘   │
└─────────────────────────────────────────────────┘
     │                        │
     ▼                        ▼
┌──────────┐          ┌──────────────┐
│ Supabase │          │   Resend     │
│  • Auth  │          │  (Emails)    │
│  • DB    │          └──────────────┘
└──────────┘
     │
     ▼
┌──────────────────┐
│   Firecrawl AI   │
│  (Web Scraping)  │
└──────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18`
- A [Supabase](https://supabase.com) project
- A [Firecrawl](https://firecrawl.dev) API key
- A [Resend](https://resend.com) account for email alerts

### 1. Clone the repository

```bash
git clone https://github.com/harshiit112/price_tracker.git
cd price_tracker/trackerprice
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file at the root (see [Environment Variables](#️-environment-variables) below):

```bash
cp .env .env.local
# then fill in your values
```

### 4. Set up Supabase tables

Run the following SQL in your Supabase SQL editor:

```sql
-- Products table
create table products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  name text,
  current_price numeric,
  currency text default 'USD',
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, url)
);

-- Price history table
create table price_history (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  price numeric not null,
  currency text default 'USD',
  checked_at timestamptz default now()
);

-- Row-level security
alter table products enable row level security;
alter table price_history enable row level security;

create policy "Users can manage their own products"
  on products for all using (auth.uid() = user_id);

create policy "Users can view their own price history"
  on price_history for select
  using (product_id in (select id from products where user_id = auth.uid()));
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

## ⚙️ Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (used in cron) | ✅ |
| `FIRECRAWL_API_KEY` | Firecrawl API key for scraping | ✅ |
| `RESEND_API_KEY` | Resend API key for sending emails | ✅ |
| `RESEND_FROM_EMAIL` | The "from" address for alert emails | ✅ |
| `CRON_SECRET` | Secret token to authorize cron job calls | ✅ |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL (used in email links) | ✅ |

---

## 📡 API Reference

### `POST /api/cron/check-prices`

Triggers a full price-check cycle across all tracked products. Protected by a bearer token.

**Headers:**
```
Authorization: Bearer <CRON_SECRET>
```

**Response:**
```json
{
  "success": true,
  "message": "Price check completed",
  "results": {
    "total": 12,
    "updated": 11,
    "failed": 1,
    "priceChanges": 3,
    "alertsSent": 2
  }
}
```

> 💡 You can trigger this endpoint on a schedule using [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs), [GitHub Actions](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule), or any cron service.

---

## 🗂️ Project Structure

```
trackerprice/
├── app/
│   ├── actions.js              # Next.js Server Actions (add/delete/get products)
│   ├── page.jsx                # Home page (SSR)
│   ├── layout.js               # Root layout
│   ├── globals.css             # Global styles
│   ├── api/
│   │   └── cron/
│   │       └── check-prices/
│   │           └── route.js    # Cron endpoint for automated price checks
│   └── auth/                   # Supabase auth routes
├── components/
│   ├── AddProductForm.jsx      # Form to add a new product URL
│   ├── ProductCard.jsx         # Card displaying product + price + actions
│   ├── PriceChart.jsx          # Recharts price history visualization
│   ├── AuthButton.jsx          # Sign in / Sign out button
│   ├── AuthModal.js            # Authentication modal
│   └── ui/                     # shadcn/ui primitives (Button, Card, Badge, ...)
├── lib/
│   ├── firecrawl.js            # Firecrawl scraping logic
│   ├── email.js                # Resend email alert templates
│   └── utils.js                # Utility helpers
├── utils/
│   └── supabase/               # Supabase client helpers (server & browser)
├── public/
│   └── dealdrop-logo.png       # App logo
├── next.config.mjs
├── package.json
└── .env                        # Environment variable template
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions) |
| **UI** | [React 19](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security) |
| **Web Scraping** | [Firecrawl](https://firecrawl.dev/) (AI-powered structured extraction) |
| **Email** | [Resend](https://resend.com/) |
| **Toasts** | [Sonner](https://sonner.emilkowal.ski/) |

---

## 📸 Screenshots

> Add your screenshots here after deploying!

| Dashboard | Price Chart | Email Alert |
|---|---|---|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by **Harshit**

⭐ Star this repo if you find it useful!

</div>
