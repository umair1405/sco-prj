# ✨ Senora & Co - Full-Stack E-Commerce Platform

A luxury boutique e-commerce web application tailored for **Senora & Co** (Calicut, Kerala & Global).

---

## 📁 Project Architecture

```
senora-and-co/
├── backend/                  # Node.js + Express REST API & Serverless Endpoints
│   ├── api/
│   │   └── index.js          # Vercel Serverless Function entry point
│   ├── data/
│   │   └── products.json     # Initial catalog data
│   ├── routes/
│   │   ├── products.js       # CRUD /api/products
│   │   ├── orders.js         # /api/orders
│   │   └── coupons.js        # /api/coupons
│   ├── server.js             # Express app
│   └── package.json
│
├── frontend/                 # React 18 + Vite + Tailwind CSS + Lucide
│   ├── src/
│   │   ├── components/       # UI components (Navbar, Hero, Modals, Feed, etc.)
│   │   ├── context/          # StoreContext (Cart, Wishlist, WhatsApp URL generator)
│   │   ├── data/             # Catalog & Testimonials
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── vercel.json               # Vercel deployment & serverless routing config
├── package.json              # Monorepo root scripts
└── README.md
```

---

## 🚀 Local Development

### 1. Run Frontend
```bash
npm run dev:frontend
```
Storefront runs at `http://localhost:3000/`.

### 2. Run Backend
```bash
npm run dev:backend
```
API runs at `http://localhost:5000/api/`.

---

## ☁️ Deploying to Vercel

### Option 1: Vercel Dashboard (Recommended)
1. Push this repository to **GitHub / GitLab / Bitbucket**.
2. Open [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Vercel will automatically read `vercel.json`:
   - Frontend will build and serve from `frontend/dist`.
   - Backend APIs will automatically deploy as serverless functions under `/api/*`.
5. Click **Deploy**!

### Option 2: Vercel CLI
```bash
npx vercel
```
Follow the prompts to deploy directly.
