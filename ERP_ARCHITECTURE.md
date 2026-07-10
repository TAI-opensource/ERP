# ERP System Architecture

## Overview
A modern ERP system built with Next.js 16, TypeScript, shadcn/ui, and Drizzle ORM.
Superior to ERPNext with faster performance, better UX, and modern tech stack.

## Modules (14)

### 1. Core Setup
- Company management
- Fiscal Year
- Currency & Exchange Rates
- Users & Roles (RBAC)
- Settings

### 2. Accounting
- Chart of Accounts (tree)
- Journal Entry
- Payment Entry
- Sales Invoice
- Purchase Invoice
- Cost Center
- Budget
- Financial Reports

### 3. Banking
- Bank accounts
- Bank transactions
- Bank reconciliation
- Payment reconciliation

### 4. Accounts Receivable
- Customer management
- Quotation → Sales Order → Delivery Note → Sales Invoice
- Credit control
- Dunning

### 5. Accounts Payable
- Supplier management
- Request for Quotation → Purchase Order → Purchase Invoice
- Payment processing

### 6. Stock / Inventory
- Item master
- Warehouse management
- Stock Entry
- Purchase Receipt
- Delivery Note
- Batch & Serial tracking
- Stock Reconciliation
- Price Lists

### 7. Selling
- Customer management
- Quotation
- Sales Order
- Product Bundles
- Sales Team

### 8. Buying
- Supplier management
- Request for Quotation
- Supplier Quotation
- Purchase Order
- Supplier Scorecard

### 9. Manufacturing
- Bill of Materials (BOM)
- Work Order
- Job Card
- Production Plan
- Operation & Workstation
- Routing

### 10. Projects
- Project management
- Task management
- Timesheet
- Activity tracking

### 11. HR & Payroll
- Employee management
- Department & Designation
- Attendance
- Leave management
- Salary structure
- Payslip

### 12. CRM
- Lead management
- Opportunity tracking
- Campaign management
- Contract management
- Appointment booking

### 13. Assets
- Asset lifecycle
- Depreciation
- Asset Maintenance
- Asset Movement

### 14. Quality Management
- Quality Procedure
- Quality Goal
- Quality Review
- Non-conformance

## Tech Stack
- **Frontend:** Next.js 16, React 19, TypeScript, shadcn/ui, Tailwind CSS v4
- **Backend:** Next.js API Routes, Drizzle ORM
- **Database:** PostgreSQL
- **Auth:** NextAuth.js v5
- **State:** TanStack Query, Zustand
- **Charts:** Recharts

## Performance vs ERPNext
- <1s page load (vs 3-5s)
- Client-side navigation
- Optimistic UI updates
- Serverless deployment
- Full TypeScript
