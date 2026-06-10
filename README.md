# Hari Om Print House

A full-stack e-commerce web application for premium corporate gifting and branded merchandise — custom-printed steel bottles, ceramic mugs, premium diaries, and logo pens.

Built with a **React + Vite** frontend and a **Django REST Framework** backend.

---

## Features

- Product catalog with Steel Bottles, Ceramic Mugs, Premium Diaries & Logo Pens
- Live product customizer — upload your brand logo and preview it on the product (Fabric.js canvas)
- Shopping cart with real-time volume-based price tier calculations
- Session-based authentication (Sign up / Sign in / Sign out)
- Light & dark mode toggle
- Bulk inquiry support for B2B corporate orders

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Fabric.js 7 |
| Backend | Django 5.2, Django REST Framework |
| Auth | Django Session Authentication |
| CORS | django-cors-headers |
| Database | SQLite (dev) |
| Styling | Vanilla CSS, Google Fonts (Cinzel + Outfit) |

---

## Project Structure

```
PrintHouse/
├── backend/
│   ├── accounts/             # Auth views (signup, login, logout, me)
│   ├── core/                 # Django project settings & URLs
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── customization.json
│   ├── manage.py
│   └── db.sqlite3            # Local dev DB (git-ignored)
│
├── frontend/
│   ├── public/               # Product images
│   ├── src/
│   │   ├── App.jsx           # Main app, routing, cart & auth state
│   │   ├── ProductDetail.jsx # Product page with variant selector
│   │   ├── Customizer.jsx    # Logo customizer (Fabric.js)
│   │   ├── Cart.jsx          # Slide-out cart drawer
│   │   ├── AuthModal.jsx     # Sign in / Sign up modal
│   │   ├── data.js           # Product & pricing data
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/PrintHouse.git
cd PrintHouse
```

### 2. Backend setup

```bash
cd backend

python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install django djangorestframework django-cors-headers

python manage.py migrate
python manage.py runserver
```

Runs at `http://127.0.0.1:8000`

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup/` | Register a new user |
| POST | `/api/auth/login/` | Log in |
| POST | `/api/auth/logout/` | Log out |
| GET | `/api/auth/me/` | Get current authenticated user |

---

## Configuration Notes

CORS is configured for the Vite dev server in `backend/core/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
```

Before deploying to production:
- Replace `SECRET_KEY` with a secure value stored in environment variables
- Set `DEBUG = False`
- Switch to a production database (e.g. PostgreSQL)
- Update `ALLOWED_HOSTS`

---

## Product Categories

| Product | Variants | Print Method |
|---------|----------|--------------|
| Steel Bottles | White, Black, Grey | Wrap print / Laser engraving |
| Ceramic Mugs | White, Black, Grey | Sublimation printing |
| Premium Diaries | White, Black, Grey | Gold foil / Blind embossing |
| Logo Pens | Blue, Black, Grey | Laser engraving |

---

## Contact

**Hari Om Print House**  
Office no 9, Ground Floor, Mehta Chambers, East,  
Kalyan St, Dana Bandar, Masjid Bandar,  
Mumbai, Maharashtra 400009

---

© 2026 Hari Om Print House. All rights reserved.
