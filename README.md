# 🍔 2Hungry — Premium Food Delivery App

> *Too Hungry? Order Instantly 😋*

A stunning, production-grade food delivery web application built with React, Tailwind CSS, and Framer Motion.

---

## ✨ Features

- 🔐 **Auth System** — Email/password & Google login (Firebase or demo mode)
- 🍔 **Food Listing** — Beautiful cards with hover animations, ratings, and tags
- 🛒 **Cart System** — Slide-in drawer with qty controls, promo codes, live total
- 🏪 **Restaurant Pages** — Banner, menu categories, food grid
- 📦 **Order Tracking** — Real-time progress: Placed → Cooking → On the Way → Delivered
- ❤️ **Favorites** — Save food and restaurants
- 🔍 **Smart Search** — Live suggestions with food & restaurant results
- 🎁 **Promo Codes** — HUNGRY20, FREEDELIVERY, FEAST50
- ⭐ **Reviews** — Star ratings with emoji reactions
- 🌙 **Dark Mode** — Toggle with system preference detection
- 🎬 **Animations** — Framer Motion throughout, flying cart, page transitions, skeleton loading

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/2hungry.git
cd 2hungry
npm install
```

### 2. Configure Firebase (Optional)

Copy the env example:
```bash
cp .env.example .env
```

Fill in your Firebase credentials in `.env`:
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
...
```

> **Demo mode**: Without Firebase config, the app works with mock auth — just enter any email/password!

### 3. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Project Structure

```
src/
├── components/        # Navbar, CartDrawer, FoodCard, RestaurantCard, etc.
├── pages/             # LoginPage, HomePage, RestaurantPage, FoodDetailPage, OrdersPage, ProfilePage
├── context/           # AuthContext, CartContext, ThemeContext, FavoritesContext, OrdersContext
├── firebase/          # Firebase config
├── data/              # mockData.js (restaurants, food items, promos)
└── index.css          # Global styles with CSS variables
```

---

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Set framework: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables from `.env`

The `vercel.json` handles SPA routing automatically.

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#00BFA6` (Tiya Teal) |
| Background | `#FFFFFF` / `#0a0f0e` dark |
| Font Display | Syne |
| Font Body | Plus Jakarta Sans |

---

## 📦 Tech Stack

- **React 18** + Vite
- **Tailwind CSS** v3
- **Framer Motion** v10
- **Firebase** v10 (optional)
- **React Router** v6
- **React Hot Toast**

---

## 🔑 Demo Promo Codes

| Code | Discount |
|------|----------|
| `HUNGRY20` | 20% off (min ৳299) |
| `FREEDELIVERY` | Free delivery (min ৳199) |
| `FEAST50` | ৳50 off (min ৳499) |

---

Made with 🍔 and lots of hunger
