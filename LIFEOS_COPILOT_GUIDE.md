# LifeOS Finance — GitHub Copilot Improvement Guide

> **Stack:** React + Vite + Tailwind CSS (Frontend) · Node.js + Express + MongoDB + Featherless AI (Backend)  
> **Tool:** GitHub Copilot (Chat + Inline suggestions)  
> **Goal:** Transform LifeOS Finance into a professional, corporate-grade financial dashboard

---

## Table of Contents

1. [Project Audit — What Exists, What's Broken, What's Missing](#1-project-audit)
2. [Design System Overhaul — Corporate UI Tokens](#2-design-system-overhaul)
3. [Fix: UI Inconsistencies](#3-fix-ui-inconsistencies)
4. [Fix: Remove Dead Navigation Items](#4-fix-remove-dead-navigation-items)
5. [New Feature: Income & Profile Settings](#5-new-feature-income--profile-settings)
6. [New Feature: Budget Module](#6-new-feature-budget-module)
7. [New Feature: Expense Filtering, Search & Edit](#7-new-feature-expense-filtering-search--edit)
8. [New Feature: Toast Notification System](#8-new-feature-toast-notification-system)
9. [New Feature: CSV Export](#9-new-feature-csv-export)
10. [New Feature: Category Color System](#10-new-feature-category-color-system)
11. [Dashboard Improvements](#11-dashboard-improvements)
12. [Backend: Add Budget & User Routes](#12-backend-add-budget--user-routes)
13. [Sidebar Redesign — Corporate Style](#13-sidebar-redesign--corporate-style)
14. [Header Cleanup](#14-header-cleanup)
15. [Mobile Responsiveness](#15-mobile-responsiveness)
16. [Copilot Workflow Tips](#16-copilot-workflow-tips)

---

## 1. Project Audit

### What Exists
| Module | File | Status |
|---|---|---|
| Dashboard | `Dashboard.jsx` | ✅ Working — needs UI polish |
| Expense Manager | `ExpenseManager.jsx` | ✅ Working — missing edit, filter, search |
| AI Assistant | `AIAssistant.jsx` | ✅ Working — UI uses wrong hardcoded colors |
| Spend Chart | `SpendChart.jsx` | ✅ Working — needs styling consistency |
| Sidebar | `Sidebar.jsx` | ⚠️ Budget tab present but leads nowhere |
| Budget Module | — | ❌ Missing entirely |
| User / Income Settings | — | ❌ API exists, UI missing |
| Auth | — | ❌ User model exists, no auth flow |
| Notifications / Toasts | — | ❌ No feedback on add/delete |
| CSV Export | — | ❌ Missing |

### What Must Be Removed
- The broken **"New Entry"** button in the top header (redundant with sidebar nav)
- The **"Budget"** sidebar tab until the module is built (or build it — see Section 6)
- Unused `react.svg` and `vite.svg` assets
- The `bg-grid-white/[0.02]` Tailwind arbitrary class in `AIAssistant.jsx` that Tailwind's JIT can't resolve reliably
- "Powered by LifeOS Financial Neural Engine v1.0" footer text in AI chat (unprofessional)

### Corporate UI Problems
- `AIAssistant.jsx` uses hardcoded `bg-slate-*` / `text-slate-*` Tailwind classes instead of CSS variables — breaks on theme switch
- Theme toggle icon logic is inverted (shows Moon on dark theme, should show Sun to hint at switching *to* light)
- Card padding is inconsistent — some use `p-6`, some use `p-8`
- No uniform border treatment across cards

---

## 2. Design System Overhaul — Corporate UI Tokens

### What to tell Copilot

Open `frontend/src/index.css` and use Copilot Chat:

```
@workspace Replace the existing CSS variable system with a corporate, clean design system. 
Keep the existing --accent: #FFD400 yellow and --bg dark/warm variants. 
Add border tokens, radius tokens, and a consistent card shadow. 
Remove the heavy neumorphic shadows — replace with a single subtle border + soft drop shadow for a flat-corporate look.
```

### Target CSS to produce

```css
/* index.css — Corporate Design Tokens */

[data-theme="dark"] {
  --bg:           #09090B;   /* Zinc-950 */
  --surface:      #111113;   /* Card background */
  --surface-2:    #18181B;   /* Elevated surface */
  --text:         #FAFAFA;
  --muted:        #A1A1AA;   /* Zinc-400 */
  --border:       #27272A;   /* Zinc-800 */
  --accent:       #FFD400;
  --accent-dark:  #B78F00;
  --accent-ring:  rgba(255,212,0,0.15);
  --danger:       #EF4444;
  --success:      #22C55E;
  --warning:      #F59E0B;
  --radius:       8px;
  --radius-lg:    12px;
  --shadow:       0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md:    0 4px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3);
}

[data-theme="warm"] {
  --bg:           #FAFAF9;
  --surface:      #FFFFFF;
  --surface-2:    #F5F5F4;
  --text:         #0C0A09;
  --muted:        #78716C;
  --border:       #E7E5E4;
  --accent:       #D97706;   /* Amber-600 — better contrast on white */
  --accent-dark:  #B45309;
  --accent-ring:  rgba(217,119,6,0.15);
  --danger:       #DC2626;
  --success:      #16A34A;
  --warning:      #D97706;
  --radius:       8px;
  --radius-lg:    12px;
  --shadow:       0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md:    0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05);
}

/* Replace .neumorph with a flat corporate card */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.5rem;
}

.card-sm {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1rem;
}
```

> **Copilot tip:** After updating CSS, use Copilot's **"Find All References"** to replace every `.neumorph` with `.card` across all components — open Copilot Chat and say: `@workspace Replace all className occurrences of "neumorph" with "card" and "neumorph-sm" with "card-sm" across all JSX files.`

---

## 3. Fix: UI Inconsistencies

### 3a. Fix AIAssistant.jsx — Hardcoded Colors

Open `AIAssistant.jsx` and use Copilot Chat:

```
Replace all hardcoded Tailwind color classes (bg-slate-*, border-slate-*, text-slate-*) 
in this file with inline styles using CSS variables (--surface, --border, --text, --muted, --accent). 
The component must render correctly on both dark and warm themes.
```

**Expected diff — Assistant message bubble:**

```jsx
// BEFORE
<div className="bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none">

// AFTER
<div
  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }}
  className="rounded-tl-none"
>
```

**Expected diff — Input area:**

```jsx
// BEFORE
<form className="p-6 bg-slate-900/80 border-t border-slate-800 backdrop-blur-md">

// AFTER
<form
  className="p-6 border-t"
  style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
>
```

**Expected diff — Remove promotional footer:**

```jsx
// BEFORE
<p className="text-[10px] text-slate-600 mt-3 text-center uppercase tracking-widest font-bold">
  Powered by LifeOS Financial Neural Engine v1.0
</p>

// AFTER — DELETE this element entirely
```

### 3b. Fix Theme Toggle — Inverted Icon Logic

In `App.jsx`, the icon logic currently shows `Moon` when in dark mode. The correct UX is to show the icon representing what you'll *switch to*.

Open `App.jsx` and tell Copilot:

```
The theme toggle currently shows a Moon icon when in dark mode. 
Fix the icon: show a Sun icon when in dark mode (click to go light), 
and show a Moon icon when in warm/light mode (click to go dark).
```

```jsx
// AFTER — correct logic
{theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
```

---

## 4. Fix: Remove Dead Navigation Items

The **Budget** tab in the sidebar leads to a "module under construction" fallback. Until it is built, it must be removed from production nav. Open `Sidebar.jsx`:

```
@workspace In Sidebar.jsx, remove the Budget tab from the tabs array. 
Add a Reports tab with the FileBarChart icon from lucide-react.
```

```jsx
// AFTER — clean tabs array in Sidebar.jsx
import { BarChart2, PieChart, Cpu, Settings, FileBarChart } from 'lucide-react';

const tabs = [
  { id: 'dashboard',    label: 'Dashboard',    Icon: BarChart2 },
  { id: 'expenses',     label: 'Expenses',     Icon: PieChart },
  { id: 'budget',       label: 'Budget',       Icon: FileBarChart },  // Add after building Section 6
  { id: 'ai-assistant', label: 'AI Assistant', Icon: Cpu },
  { id: 'settings',     label: 'Settings',     Icon: Settings },
];
```

---

## 5. New Feature: Income & Profile Settings

**Why:** The backend has `updateIncome` in `api.js` and a `User` model, but there is zero UI to use it. The AI analysis currently falls back to a hardcoded `$5000` income.

### 5a. Create `Settings.jsx`

Create a new file `frontend/src/components/Settings.jsx` and open Copilot Chat:

```
Create a Settings.jsx React component for a corporate finance app.
It should contain:
1. A "Financial Profile" card with a monthly income input (number, in USD).
   On save, call updateIncome(value) from '../services/api'.
2. A "Preferences" card with a theme selector (Dark / Light) that calls setTheme prop.
3. Use CSS variables for all colors. Use the .card className for containers.
4. Show a success/error message after saving (use a local state string, not a library).
5. No hardcoded colors. No inline Tailwind color classes.
```

### 5b. Wire Settings to App.jsx

```jsx
// In App.jsx — add to imports
import Settings from './components/Settings';

// In JSX — add to section
{activeTab === 'settings' && <Settings theme={theme} setTheme={setTheme} />}
```

### 5c. Add Settings to Sidebar

```jsx
// In Sidebar.jsx tabs array
{ id: 'settings', label: 'Settings', Icon: Settings }
```

---

## 6. New Feature: Budget Module

### 6a. Backend — Budget Model

Create `backend/models/Budget.js`:

```
Create a Mongoose schema called Budget with fields:
- category: String, enum same as Expense model categories, required, unique
- limit: Number, required (monthly spending limit in USD)
- userId: ObjectId ref User
- timestamps: true
Export as Budget model.
```

```js
// Expected output from Copilot
import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Travel', 'Other'],
    unique: true,
  },
  limit: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Budget', budgetSchema);
```

### 6b. Backend — Budget Controller

Create `backend/controllers/budgetController.js`:

```
Create an Express controller with:
- getBudgets: GET all budgets
- setBudget: POST/PATCH upsert a budget by category (findOneAndUpdate with upsert: true)
- deleteBudget: DELETE by id
Import Budget model. Use try/catch and standard JSON responses.
```

### 6c. Backend — Budget Routes

Create `backend/routes/budgetRoutes.js`:

```
Create Express router for Budget controller.
GET /  → getBudgets
POST / → setBudget
DELETE /:id → deleteBudget
```

Register in `backend/index.js`:

```js
import budgetRoutes from './routes/budgetRoutes.js';
app.use('/api/budgets', budgetRoutes);
```

### 6d. Frontend — Budget API calls

Add to `frontend/src/services/api.js`:

```js
// Budget Services
export const getBudgets = () => api.get('/budgets');
export const setBudget = (data) => api.post('/budgets', data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);
```

### 6e. Frontend — Budget.jsx Component

Create `frontend/src/components/Budget.jsx` and prompt Copilot:

```
Create a Budget.jsx React component for a corporate finance dashboard.
Features:
1. A grid of category budget cards — one per Expense category.
   Each card shows: category name, budget limit input, current month's spend (calculated from expenses prop), 
   and a horizontal progress bar (spend/limit %). 
   Bar is green if under 75%, amber if 75-99%, red if 100%+.
2. An "Update" button per card that calls setBudget from api.js.
3. Fetch both getBudgets() and getExpenses() on mount.
4. All colors via CSS variables. Use --success, --warning, --danger tokens.
5. No hardcoded colors.
```

---

## 7. New Feature: Expense Filtering, Search & Edit

Open `ExpenseManager.jsx` and use Copilot Chat step-by-step:

### 7a. Add Search and Filter Bar

```
Add a filter bar above the expense table in ExpenseManager.jsx.
Include:
- A text search input that filters expenses by note (case-insensitive).
- A category dropdown filter (All + each category).
- A date range: month picker (default: current month).
All filtering is done client-side on the expenses state array.
Use CSS variables for input styling.
```

### 7b. Add Edit Expense Functionality

```
Add edit functionality to ExpenseManager.jsx.
- Add an Edit button next to Delete in the table.
- Clicking Edit populates the form at the top with that expense's data and changes the submit button to "Update".
- On update, call a new api function updateExpense(id, data) that does api.patch('/expenses/:id', data).
- After update, reset the form to "add" mode.
```

**Backend addition needed in `expenseController.js`:**

```
Add an updateExpense controller function:
PATCH /api/expenses/:id
Accepts: amount, category, date, note in req.body.
Uses findByIdAndUpdate with { new: true }.
Add the route to expenseRoutes.js.
Add export const updateExpense to api.js: (id, data) => api.patch('/expenses/${id}', data).
```

### 7c. Pagination

```
Add simple client-side pagination to the expense table in ExpenseManager.jsx.
Show 10 rows per page. Add Previous / Next buttons below the table.
Show "Showing X–Y of Z transactions" label.
```

---

## 8. New Feature: Toast Notification System

Currently no feedback is shown on success or failure. This is critical for professional UX.

### 8a. Create `useToast.js` Hook

Create `frontend/src/hooks/useToast.js`:

```
Create a custom React hook called useToast.
It manages a list of toast notifications.
Each toast has: id, message, type ('success' | 'error' | 'info'), duration (default 3500ms).
Expose: toasts array, addToast(message, type) function, removeToast(id) function.
Auto-remove toasts after their duration using setTimeout.
```

### 8b. Create `ToastContainer.jsx`

Create `frontend/src/components/ToastContainer.jsx`:

```
Create a ToastContainer React component that receives a toasts array and removeToast function.
Position: fixed bottom-right (bottom-6 right-6), z-50.
Each toast is a small card with:
- A colored left border (green for success, red for error, blue for info) using CSS variables --success, --danger, --accent.
- Icon (CheckCircle for success, XCircle for error, Info for info) from lucide-react.
- Message text.
- A close button.
- Animate in from the right (use a CSS class or inline transition).
No external libraries.
```

### 8c. Wire Toast into App.jsx

```jsx
// App.jsx
import { useToast } from './hooks/useToast';
import ToastContainer from './components/ToastContainer';

const { toasts, addToast, removeToast } = useToast();

// Pass addToast down as prop to ExpenseManager, Budget, Settings
// At bottom of JSX:
<ToastContainer toasts={toasts} removeToast={removeToast} />
```

### 8d. Use Toast in ExpenseManager

Replace all silent `console.error` calls:

```jsx
// BEFORE
} catch (error) {
  console.error('Error adding expense:', error);
}

// AFTER
} catch (error) {
  addToast('Failed to add expense. Please try again.', 'error');
}

// On success
addToast('Expense logged successfully.', 'success');
```

---

## 9. New Feature: CSV Export

### 9a. Add Export Utility

Create `frontend/src/utils/exportCSV.js`:

```
Create a utility function exportToCSV(data, filename).
It accepts an array of expense objects and a filename string.
Converts to CSV: columns are Date, Category, Amount, Note.
Triggers a browser download using a Blob and URL.createObjectURL.
No external libraries.
```

### 9b. Add Export Button to ExpenseManager

```
In ExpenseManager.jsx, add an "Export CSV" button in the table header row (right side, next to the record count).
On click, call exportToCSV(expenses, 'expenses.csv').
Style it as a secondary outlined button using .btn-outline className.
```

---

## 10. New Feature: Category Color System

Create `frontend/src/utils/categoryColors.js`:

```
Create a JS object CATEGORY_COLORS mapping each expense category to a hex color:
Food: #F59E0B (amber)
Transport: #3B82F6 (blue)
Entertainment: #8B5CF6 (purple)
Shopping: #EC4899 (pink)
Bills: #EF4444 (red)
Health: #10B981 (emerald)
Travel: #06B6D4 (cyan)
Other: #6B7280 (gray)
Export as default.
Also export a getCategoryColor(category) helper that returns the color or gray fallback.
```

### Apply Category Colors

Use Copilot to apply them across:

1. **ExpenseManager.jsx** — color-coded dot before category name in table:

```jsx
import { getCategoryColor } from '../utils/categoryColors';

// In table cell
<td className="px-4 py-3">
  <div className="flex items-center gap-2">
    <span
      className="w-2 h-2 rounded-full flex-shrink-0"
      style={{ background: getCategoryColor(expense.category) }}
    />
    {expense.category}
  </div>
</td>
```

2. **SpendChart.jsx** — pass category colors to the chart library instead of default colors.
3. **Budget.jsx** — category card header accent border.

---

## 11. Dashboard Improvements

### 11a. Add Month Comparison KPI Card

Open `Dashboard.jsx` and tell Copilot:

```
Add a 4th KPI card after the existing three called "vs Last Month".
It should compare total spending of the current calendar month vs the previous month.
Calculate both totals from the expenses array (already fetched).
Show the delta as a percentage with a green ▼ if spending decreased or a red ▲ if increased.
```

```jsx
// Logic to generate (have Copilot complete)
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const thisMonthTotal = expenses
  .filter(e => new Date(e.date).getMonth() === currentMonth && new Date(e.date).getFullYear() === currentYear)
  .reduce((sum, e) => sum + e.amount, 0);

const lastMonthTotal = expenses
  .filter(e => {
    const d = new Date(e.date);
    const lm = currentMonth === 0 ? 11 : currentMonth - 1;
    const ly = currentMonth === 0 ? currentYear - 1 : currentYear;
    return d.getMonth() === lm && d.getFullYear() === ly;
  })
  .reduce((sum, e) => sum + e.amount, 0);

const delta = lastMonthTotal === 0 ? 0 : ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1);
```

### 11b. Replace "Recent History" with a Proper Recent Transactions Panel

```
In Dashboard.jsx, add a "Recent Transactions" panel below the chart that shows 
the 5 most recent expenses as a clean list (not a full table).
Each row: category dot (using getCategoryColor), description, date, amount.
Add a "View All" link that calls setActiveTab('expenses') — accept setActiveTab as a prop.
```

**Wire setActiveTab prop through App.jsx → Dashboard:**

```jsx
// App.jsx
{activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
```

### 11c. KPI Card Redesign

Replace `p-6 neumorph` with the new `.card` class and a consistent structure:

```
Refactor the 4 KPI cards in Dashboard.jsx to use a consistent layout:
- Top: icon + label row
- Middle: large primary value
- Bottom: secondary context text
Use the .card className. Add a colored top-border (3px) using the --accent CSS variable.
Use TrendingUp, DollarSign, Brain, Shield icons from lucide-react.
```

---

## 12. Backend: Add Budget & User Routes

### 12a. User Profile Route

The `User` model exists but no route is registered. Open `backend/index.js`:

```
Add user routes to the Express app.
Create backend/routes/userRoutes.js with:
- GET /api/users/profile  → returns User.findOne()
- PATCH /api/users/income → updates monthlyIncome: req.body.monthlyIncome via findOneAndUpdate with upsert:true
Import and register in index.js.
```

### 12b. Expense Update Route

In `backend/routes/expenseRoutes.js`:

```
Add: router.patch('/:id', updateExpense) 
Import updateExpense from expenseController.
```

In `backend/controllers/expenseController.js`:

```
Add updateExpense controller:
PATCH /api/expenses/:id
Body: { amount, category, date, note }
Use Expense.findByIdAndUpdate(req.params.id, { amount, category, date, note }, { new: true, runValidators: true })
Return 404 if not found, 200 with updated doc.
```

---

## 13. Sidebar Redesign — Corporate Style

Open `Sidebar.jsx` and prompt Copilot:

```
Redesign Sidebar.jsx for a corporate finance application.
Requirements:
- Fixed width 240px, full height, no neumorphic shadows.
- Background: var(--surface), right border: 1px solid var(--border).
- Logo area at top: app name "LifeOS Finance" with a small square accent-colored logo icon.
- Navigation items: full-width buttons, left-aligned, with icon + label.
- Active item: background var(--accent), text var(--bg), rounded-md (8px), no full-width highlight — use padding to create inset appearance.
- Inactive item: transparent background, text var(--muted), hover shows surface-2 background.
- Bottom section: user avatar placeholder, "Account" label, "Pro Plan" subtitle. No User icon — use initials "U" in a small circle with accent background.
- Remove "Premium" text — replace with a small green dot + "Connected" status.
All colors via CSS variables only.
```

---

## 14. Header Cleanup

Open `App.jsx` and tell Copilot:

```
Refactor the main header in App.jsx:
1. Remove the "New Entry" button entirely.
2. Keep only the theme toggle button on the right.
3. Fix the icon logic: show Sun when dark theme is active, Moon when warm/light is active.
4. Add a breadcrumb-style subtitle under the page title: for 'dashboard' show 'Overview · April 2026', for other tabs show the tab name.
5. Header background: var(--surface), border-bottom: 1px solid var(--border). Remove backdrop-blur.
6. Remove rounded-b-md from header.
```

---

## 15. Mobile Responsiveness

The current sidebar is always visible and takes 256px — unusable on mobile.

### 15a. Add Mobile Sidebar Toggle

Tell Copilot Chat:

```
Add mobile sidebar support to App.jsx and Sidebar.jsx.
Requirements:
- Add a hamburger MenuIcon button in the header (visible only on mobile: md:hidden).
- On mobile, sidebar is hidden by default (translate-x-full or hidden).
- Clicking the hamburger toggles a sidebarOpen state in App.jsx.
- Sidebar accepts an isOpen prop and a onClose prop.
- When open on mobile, show a semi-transparent overlay behind the sidebar that closes it on click.
- On desktop (md+), sidebar is always visible as a static left column.
Use Tailwind responsive prefixes (md:) for breakpoints.
```

---

## 16. Copilot Workflow Tips

### Effective Prompting Patterns

| Situation | Prompt Pattern |
|---|---|
| Full component creation | `Create a [ComponentName].jsx for a corporate finance app. Requirements: [numbered list]. Use CSS variables. No hardcoded colors.` |
| Refactoring colors | `@workspace Replace all hardcoded Tailwind color classes with CSS variable inline styles across [filename].` |
| Adding a feature to existing file | `In [filename], add [feature]. Keep existing code intact. Add only what's needed.` |
| Backend route + controller | `Create an Express controller and router for [resource]. Endpoints: [list]. Use async/await + try/catch. Return standard JSON.` |
| Bug fix | `This function [paste code] is doing [X]. It should do [Y]. Fix it.` |

### File-by-File Copilot Order

Work in this order to avoid cascading errors:

```
1. index.css          — Design tokens first (everything depends on these)
2. Budget.js          — Backend model
3. budgetRoutes.js    — Backend routes
4. budgetController.js — Backend controller
5. userRoutes.js      — Backend user routes
6. api.js             — Add new API calls
7. categoryColors.js  — Utility
8. exportCSV.js       — Utility
9. useToast.js        — Hook
10. ToastContainer.jsx — Component
11. Sidebar.jsx        — Layout component
12. App.jsx            — Layout shell
13. Settings.jsx       — New page
14. Budget.jsx         — New page
15. Dashboard.jsx      — Updated page
16. ExpenseManager.jsx — Updated page
17. AIAssistant.jsx    — Fix colors last
```

### Using Copilot Chat `@workspace`

For global refactors, the `@workspace` keyword gives Copilot full project context:

```
@workspace List all places where hardcoded color values (hex or Tailwind color classes 
like bg-slate-*, text-gray-*) are used instead of CSS variables, and suggest replacements.
```

```
@workspace Find all console.error calls in the frontend and replace them with 
addToast() calls. Assume addToast is available as a prop named addToast.
```

### Inline Copilot Shortcuts

- Press `Tab` to accept the full Copilot suggestion
- Press `Alt+]` / `Alt+[` to cycle through alternative suggestions  
- Write a comment describing what you want, then press `Enter` — Copilot generates the code
- Highlight code + open Copilot Chat → type `/fix` for quick error resolution

---

## Summary Checklist

```
□ CSS design tokens updated — flat corporate style, remove neumorphism
□ AIAssistant.jsx — hardcoded slate colors replaced with CSS variables  
□ Theme toggle icon — fixed (Sun in dark, Moon in light)
□ "New Entry" header button — removed
□ Dead "Budget" sidebar tab — removed (until module is built)
□ Promotional AI footer text — removed
□ Settings.jsx — income input + theme selector
□ Budget.jsx + backend model/routes — full module
□ ExpenseManager.jsx — search, filter, edit, pagination added
□ Toast notification system — useToast + ToastContainer
□ CSV export — exportToCSV utility + button
□ Category color system — categoryColors.js applied across app
□ Dashboard KPI cards — redesigned, month comparison card added
□ Dashboard recent transactions panel — added
□ Budget backend routes — /api/budgets registered
□ User profile route — /api/users/profile + /income registered
□ Expense update route — PATCH /api/expenses/:id added
□ Sidebar — corporate redesign, Connected status, initials avatar
□ Header — cleaned up, correct theme icon, border style
□ Mobile responsive sidebar — hamburger toggle + overlay
```

---

*Guide prepared for LifeOS Finance · FSWD Project · April 2026*
