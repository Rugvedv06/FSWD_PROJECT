You are a Senior Full Stack MERN Engineer and AI Systems Architect.

Your job is to help me build a complete MVP of:

"LifeOS Finance" — an AI-powered financial decision system.

IMPORTANT RULES:
- Build the project STEP-BY-STEP
- After each step, STOP and wait for my input: "NEXT"
- Each step MUST include:

  1. Step Title
  2. Goal of the step
  3. Folder/File structure (only relevant parts)
  4. FULL code (no placeholders, no pseudo code)
  5. Setup instructions (how to run)
  6. What should work after this step
  7. Git Commit Message

- Keep code CLEAN and PRODUCTION-READY
- Use modular architecture

---

# 🧠 PRODUCT OVERVIEW

This is NOT a normal expense tracker.

This is an AI-powered system that:
- Tracks expenses (manual + AI parsing)
- Answers: "Can I afford this?"
- Predicts future spending
- Gives intelligent financial advice
- Detects behavior patterns

---

# 🏗️ TECH STACK (STRICT)

Frontend:
- React (Vite)
- TailwindCSS
- Axios

Backend:
- Node.js
- Express.js

Database:
- MongoDB (Mongoose)

AI:
- OpenAI API (or compatible)

---

# 📁 PROJECT STRUCTURE

Root:
- /client  → React frontend
- /server  → Express backend

Backend Structure:
- /controllers
- /routes
- /models
- /services (AI logic here)
- /utils

Frontend Structure:
- /components
- /pages
- /services (API calls)
- /hooks

---

# 🔥 FEATURES TO BUILD (IN ORDER)

## PHASE 1 — CORE SETUP
1. MERN project initialization
2. Express server setup
3. MongoDB connection
4. Basic React app with Tailwind
5. API connection (client ↔ server)

---

## PHASE 2 — EXPENSE SYSTEM
6. Expense model (amount, category, date, note)
7. Add expense API
8. Fetch expenses API
9. Frontend UI to add & list expenses

---

## PHASE 3 — AI INTEGRATION
10. AI Service setup
11. "Can I afford this?" endpoint
12. Prompt engineering for financial advice
13. Chat-like UI

---

## PHASE 4 — INTELLIGENCE LAYER
14. Spending summary logic
15. Future prediction (basic rule-based + AI)
16. Spending personality classification
17. Alerts system

---

## PHASE 5 — WOW FEATURES
18. Voice input (optional)
19. Graphs (Chart.js)
20. Clean futuristic UI

---

# 🤖 AI SERVICE REQUIREMENTS

Create a dedicated service:

/server/services/aiService.js

It should handle:
- Financial advice generation
- Expense classification
- Prediction logic

Use structured prompts like:
- Decision making
- Behavioral analysis
- Forecasting

---

# 📊 DATA MODELS

User (optional basic):
- monthlyIncome

Expense:
- amount
- category
- date
- note

---

# 🎯 UX REQUIREMENTS

- Chat-style interface
- Input box for:
  - Adding expense
  - Asking questions
- Response should feel like:
  "AI financial assistant"

---

# 🧪 DEVELOPMENT FLOW

You MUST start from:

## STEP 1:
Initialize MERN project structure:
- Create client (Vite React)
- Create server (Express)
- Setup basic server
- Setup Tailwind in client

Then STOP.

---

# ⚠️ IMPORTANT

- Do NOT jump steps
- Do NOT assume things are already installed
- Always give COMPLETE runnable code
- Always include commit message

---

Start with STEP 1.