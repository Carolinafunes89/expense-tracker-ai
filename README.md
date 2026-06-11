# Expense Tracker

> App de seguimiento de gastos personales con Next.js e IA

A modern, responsive personal expense tracking app built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Recharts**. All data is stored locally in your browser via `localStorage`.

## Features

- **Add / edit / delete expenses** — date, amount, category, and description with full form validation
- **Dashboard** — summary cards (total spending, this month, transactions, top category) plus charts
- **Charts** — spending by category (donut) and monthly spending over the last 6 months (bar)
- **Expense list** — searchable and filterable by category and date range; responsive table / card layout
- **Categories** — Food, Transportation, Entertainment, Shopping, Bills, Other (color-coded)
- **CSV export** — export the currently filtered expenses
- **Currency & date formatting** — `Intl.NumberFormat` and `date-fns`
- **Polish** — loading states, toast notifications, confirm dialogs, empty states, and a "load sample data" shortcut

## Tech stack

| Concern        | Choice                          |
| -------------- | ------------------------------- |
| Framework      | Next.js 14 (App Router)         |
| Language       | TypeScript                      |
| Styling        | Tailwind CSS                    |
| Charts         | Recharts                        |
| Icons          | lucide-react                    |
| Dates          | date-fns                        |
| State          | React Context + hooks           |
| Persistence    | Browser `localStorage`          |

## Getting started

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**.

### Other scripts

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # run ESLint
```

## How to test the features

1. **Load sample data** — on a fresh dashboard, click **Load sample data** to populate ~15 expenses across the last few months.
2. **Add an expense** — click **Add expense**, fill in the form. Try submitting an empty/zero amount or a future date to see validation.
3. **Dashboard** — confirm the summary cards and both charts update.
4. **Expenses page** — use the left nav to open **Expenses**. Search by description, filter by category, and set a date range.
5. **Edit / delete** — use the row actions (hover on desktop). Deleting asks for confirmation.
6. **Export CSV** — click **Export CSV** to download the currently filtered rows.
7. **Responsive** — resize to mobile width; the sidebar collapses into a drawer and the list becomes cards.
8. **Persistence** — refresh the page; your data is restored from `localStorage`.

## Project structure

```
app/
  layout.tsx           # Root layout: providers + app shell
  page.tsx             # Dashboard
  expenses/page.tsx    # Expense list + filters + CRUD
components/
  AppShell.tsx         # Responsive sidebar / mobile drawer
  ExpenseForm.tsx      # Add/edit modal with validation
  ExpenseList.tsx      # Table (desktop) / cards (mobile)
  ExpenseFilters.tsx   # Search + category + date range
  SummaryCards.tsx
  PageHeader.tsx
  CategoryBadge.tsx
  charts/              # Recharts pie + bar
  ui/                  # Modal, ConfirmDialog, Toast, Loading
context/
  ExpenseProvider.tsx  # State, persistence, CRUD actions
lib/
  types.ts  categories.ts  utils.ts  storage.ts  sampleData.ts
```
