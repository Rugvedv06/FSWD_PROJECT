# LifeOS Finance

A full-stack personal finance management dashboard with AI-powered spending analysis, multi-user authentication, budget tracking, and actionable financial intelligence.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Design System](#design-system)

---

## Overview

LifeOS Finance is a full-stack web application that helps users track expenses, manage category budgets, and receive AI-generated financial advice — all scoped to individual authenticated accounts. Each user's data is fully isolated: expenses, budgets, and income settings belong exclusively to the logged-in user.

The application ships with a corporate-styled dark/light theme, a real-time financial health score, savings rate tracking, CSV export, and an interactive AI chat assistant connected to your actual spending history.

---

## Features

### Authentication & Accounts
- JWT-based registration and login with bcrypt password hashing
- Tokens expire after 7 days; expired sessions redirect to login automatically
- Per-user data isolation — no user can access another user's records
- Profile management: update name, email, currency, and password from Settings

### Dashboard
- **5 KPI cards** — Monthly Income, Current Spend, Saved This Month, AI Forecast, vs Last Month delta
- **Income Breakdown bar** — visual split of spent vs remaining budget for the month
- **Financial Health Score** (0–100) — calculated from savings rate, AI risk level, and data completeness
- **Spending Allocation chart** — category doughnut chart with live totals
- **Recent Activity panel** — last 5 transactions with category color dots
- **AI Intelligence panel** — spending personality, behavioral advice, risk level
- **Onboarding prompt** — guides new users to set income if not yet configured

### Expense Manager
- Log, edit, and delete transactions (with confirm-before-delete modal)
- Filter by category, search by note keyword
- Paginated table — 10 rows per page
- CSV export of filtered results

### Budget Planner
- Set monthly spending limits per category
- Real-time progress bars — green (under 75%), amber (75–99%), red (100%+)
- Summary header showing total budgeted vs total spent for the month

### AI Assistant
- Conversational chat interface connected to your live expense data
- **Affordability Quick Check** — enter an amount and category, get an instant YES / NO / CAUTION verdict
- Context-aware advice based on your actual income and spending history

### Settings
- Update profile (name, email)
- Set monthly income and preferred currency (INR, USD, EUR, GBP)
- Change password securely (requires current password verification)
- Switch between Dark and Warm interface themes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Charts | Chart.js 4, react-chartjs-2 |
| Icons | Lucide React |
| HTTP Client | Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose 9 |
| Authentication | JWT (jsonwebtoken), bcryptjs |
| AI Engine | Featherless AI (OpenAI-compatible) — Llama 3 8B |

---

## Project Structure

```
FSWD_PROJECT/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login
│   │   ├── userController.js      # Profile, income, password
│   │   ├── expenseController.js   # CRUD expenses
│   │   ├── budgetController.js    # CRUD budgets
│   │   └── aiController.js        # AI analysis, chat, affordability
│   ├── middleware/
│   │   └── protect.js             # JWT verification middleware
│   ├── models/
│   │   ├── User.js                # name, email, password, monthlyIncome, currency
│   │   ├── Expense.js             # amount, category, date, note, userId
│   │   └── Budget.js              # category, limit, userId
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── budgetRoutes.js
│   │   └── aiRoutes.js
│   ├── services/
│   │   └── aiService.js           # Featherless AI prompts
│   ├── .env.example
│   └── index.js                   # Express app entry point
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── AuthPage.jsx        # Login / Register
    │   │   ├── Dashboard.jsx       # Main overview page
    │   │   ├── ExpenseManager.jsx  # Transaction log
    │   │   ├── Budget.jsx          # Budget planner
    │   │   ├── AIAssistant.jsx     # AI chat + affordability
    │   │   ├── Settings.jsx        # Profile & preferences
    │   │   ├── Sidebar.jsx         # Navigation
    │   │   ├── SpendChart.jsx      # Doughnut chart
    │   │   ├── ToastContainer.jsx  # Notification toasts
    │   │   ├── ConfirmModal.jsx    # Delete confirmation dialog
    │   │   └── Skeleton.jsx        # Loading placeholders
    │   ├── context/
    │   │   └── AuthContext.jsx     # Auth state, login, logout, updateUser
    │   ├── hooks/
    │   │   └── useToast.js         # Toast notification hook
    │   ├── services/
    │   │   └── api.js              # Axios instance + all API calls
    │   ├── utils/
    │   │   ├── categoryColors.js   # Category → hex color map
    │   │   ├── exportCSV.js        # Browser CSV download utility
    │   │   └── formatCurrency.js  # Intl.NumberFormat currency formatter
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css              # CSS design tokens + component classes
    └── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running MongoDB instance (local or MongoDB Atlas)
- A [Featherless AI](https://featherless.ai) API key

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd FSWD_PROJECT
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see Environment Variables below)
npm run dev
```

The API server starts on `http://localhost:5000`.

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

The app opens on `http://localhost:5173`.

### 4. Register an account

Open the app, click **Register**, fill in your name, email, password, and monthly income. You will be logged in automatically and land on the dashboard.

---

## Environment Variables

Create a `.env` file inside the `backend/` directory. Use `.env.example` as the template.

```env
# Server
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>

# JWT — use a long, random string in production
JWT_SECRET=your_super_secret_key_minimum_32_characters

# Featherless AI
FEATHERLESS_API_KEY=your_featherless_api_key
FEATHERLESS_MODEL=meta-llama/Llama-3-8b-instruct
```

To get a Featherless API key, sign up at [featherless.ai](https://featherless.ai). The default model (`Llama-3-8b-instruct`) is free-tier compatible.

For the frontend, create a `.env` file inside `frontend/` if your backend runs on a non-default URL:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Reference

All routes except `/api/auth/*` require a valid JWT in the `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/register` | `name, email, password, monthlyIncome` | Create account, returns token |
| POST | `/api/auth/login` | `email, password` | Login, returns token |

### Users

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/users/profile` | — | Get current user profile |
| PATCH | `/api/users/profile` | `name, email, currency` | Update profile |
| PATCH | `/api/users/income` | `monthlyIncome` | Update monthly income |
| PATCH | `/api/users/password` | `currentPassword, newPassword` | Change password |

### Expenses

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/expenses` | — | Get all user expenses |
| POST | `/api/expenses` | `amount, category, date, note` | Add expense |
| PATCH | `/api/expenses/:id` | `amount, category, date, note` | Update expense |
| DELETE | `/api/expenses/:id` | — | Delete expense |

### Budgets

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/budgets` | — | Get all user budgets |
| POST | `/api/budgets` | `category, limit` | Set or update a category budget |
| DELETE | `/api/budgets/:id` | — | Remove a budget limit |

### AI

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/ai/analysis` | — | Spending personality + risk + forecast |
| POST | `/api/ai/chat` | `query` | Conversational financial advice |
| POST | `/api/ai/afford` | `amount, category` | Affordability verdict (YES / NO / CAUTION) |

---

## Design System

The UI is built on a flat, corporate-styled token system defined in `frontend/src/index.css`. All components use CSS variables — no hardcoded colors anywhere.

### Themes

Two themes are supported and toggled at runtime via `data-theme` on `<html>`:

| Token | Dark | Warm (Light) |
|---|---|---|
| `--bg` | `#09090B` | `#FAFAF9` |
| `--surface` | `#111113` | `#FFFFFF` |
| `--surface-2` | `#18181B` | `#F5F5F4` |
| `--text` | `#FAFAFA` | `#0C0A09` |
| `--muted` | `#A1A1AA` | `#78716C` |
| `--border` | `#27272A` | `#E7E5E4` |
| `--accent` | `#FFD400` | `#D97706` |
| `--success` | `#22C55E` | `#16A34A` |
| `--danger` | `#EF4444` | `#DC2626` |
| `--warning` | `#F59E0B` | `#D97706` |

### Component Classes

| Class | Purpose |
|---|---|
| `.card` | Standard content card — surface background, border, 12px radius, shadow |
| `.card-sm` | Compact card variant — 8px radius, tighter padding |
| `.btn-primary` | Accent-filled action button |
| `.btn-outline` | Ghost button with border |

### Category Colors

Each expense category has a fixed color used consistently across the chart, transaction table, and budget cards:

| Category | Color |
|---|---|
| Food | `#F59E0B` Amber |
| Transport | `#3B82F6` Blue |
| Entertainment | `#8B5CF6` Purple |
| Shopping | `#EC4899` Pink |
| Bills | `#EF4444` Red |
| Health | `#10B981` Emerald |
| Travel | `#06B6D4` Cyan |
| Other | `#6B7280` Gray |

