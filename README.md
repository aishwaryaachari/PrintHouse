# 🖨️ Hari Om Print House

A full-stack e-commerce web application for premium corporate gifting and branded merchandise — **custom-printed steel bottles, ceramic mugs, premium diaries, and logo pens**.

Built with a **React + Vite** frontend and a **Django REST Framework** backend.

---

## ✨ Features

- 🛍️ **Product Catalog** — Browse Steel Bottles, Ceramic Mugs, Premium Diaries & Logo Pens
- 🎨 **Live Product Customizer** — Upload your brand logo and preview it on the product using Fabric.js
- 🛒 **Shopping Cart** — Add items, adjust quantities, with real-time price-tier calculations
- 👤 **Authentication** — Sign up / Sign in / Sign out with session-based auth (Django)
- 🌙 **Dark Mode** — Toggleable light/dark theme with smooth transitions
- 📦 **Bulk Inquiry** — Volume-based pricing tiers for corporate B2B orders
- 📍 **Pan-India Delivery** — Order management with next-day dispatch availability

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Fabric.js 7 |
| **Backend** | Django 5.2, Django REST Framework |
| **Auth** | Django Session Authentication |
| **CORS** | `django-cors-headers` |
| **Database** | SQLite (dev) |
| **Styling** | Vanilla CSS, Google Fonts (Cinzel + Outfit) |

---

## 📁 Project Structure

```
PrintHouse/
├── backend/                  # Django backend
│   ├── accounts/             # Auth app (signup, login, logout, /me)
│   ├── core/                 # Django project settings & URLs
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── customization.json
│   ├── manage.py
│   └── db.sqlite3            # Local dev DB (git-ignored)
│
├── frontend/                 # React + Vite frontend
│   ├── public/               # Product images & assets
│   ├── src/
│   │   ├── App.jsx           # Main app, routing, cart & auth state
│   │   ├── ProductDetail.jsx # Product page with color/variant selector
│   │   ├── Customizer.jsx    # Live logo customizer (Fabric.js canvas)
│   │   ├── Cart.jsx          # Slide-out cart drawer
│   │   ├── AuthModal.jsx     # Sign In / Sign Up modal
│   │   ├── data.js           # Product & pricing data
│   │   └── index.css         # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/PrintHouse.git
cd PrintHouse
```

---

### 2. Backend Setup (Django)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install django djangorestframework django-cors-headers

# Run migrations
python manage.py migrate

# Start the development server
python manage.py runserver
```

Backend runs at **http://127.0.0.1:8000**

---

### 3. Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup/` | Register a new user |
| `POST` | `/api/auth/login/` | Log in with email & password |
| `POST` | `/api/auth/logout/` | Log out the current session |
| `GET` | `/api/auth/me/` | Get currently authenticated user |

---

## ⚙️ Environment & Configuration

The backend uses **session-based authentication** with CORS configured for the Vite dev server.

CORS allowed origins (in `backend/core/settings.py`):
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
```

> ⚠️ Before deploying to production, make sure to:
> - Replace `SECRET_KEY` with a secure value (use environment variables)
> - Set `DEBUG = False`
> - Configure a production database (e.g., PostgreSQL)
> - Update `ALLOWED_HOSTS`

---

## 📦 Product Categories

| Product | Variants | Customization |
|---------|----------|---------------|
| Steel Bottles | White, Black, Grey | Wrap print / Laser engraving |
| Ceramic Mugs | White, Black, Grey | Sublimation printing |
| Premium Diaries | White, Black, Grey | Gold foil / Blind embossing |
| Logo Pens | Blue, Black, Grey | Laser engraving |

---

## 📬 Contact

**Hari Om Print House**  
Office no 9, Ground Floor, Mehta Chambers, East,  
Kalyan St, Dana Bandar, Masjid Bandar,  
Mumbai, Maharashtra 400009

---

© 2026 Hari Om Print House. All rights reserved.
