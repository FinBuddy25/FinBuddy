# FinBuddy - Financial Management System

FinBuddy is a comprehensive financial management system for invoicing, expense tracking, and financial reporting. Built with Next.js and Supabase, it provides a modern, responsive interface for managing your business finances.

## Features

- **Invoice Management**: Create, edit, and manage performa and tax invoices
- **GST Calculation**: Automatic calculation of GST based on item prices and tax rates
- **Customer Management**: Track customer information and transaction history
- **Expense Tracking**: Categorize and monitor business expenses
- **Financial Reporting**: Generate reports on sales, expenses, and taxes
- **Document Extraction**: Extract data from financial documents
- **Inventory Management**: Track product inventory and stock levels
- **Reconciliation**: Match transactions with bank statements

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **UI Components**: shadcn/ui, Magic UI components
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Form Handling**: React Hook Form, Zod validation
- **Data Visualization**: Recharts

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fin-sync.git
cd fin-sync
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:

Copy the `.env.example` file to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Schema

The application uses the following main tables in Supabase:

- **invoices**: Stores invoice header information
- **invoice_items**: Stores line items for each invoice
- **state_codes**: Lookup table for state codes
- **supply_types**: Lookup table for supply types

## Deployment

### Build for Production

To build the application for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project into Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy

### Deploy on Other Platforms

You can also deploy the application on other platforms like Netlify, AWS, or your own server. Make sure to set up the environment variables correctly.

## Security Considerations

- Never expose your Supabase service key in client-side code
- Implement Row Level Security (RLS) policies in Supabase
- Use proper authentication with JWT validation
- Test your security implementation to verify that users only access their own data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
