// Mock data for expense categories

// Expense categories
export const expenseCategories = [
  {
    id: "fuel",
    name: "Fuel",
    description: "Expenses related to fuel for vehicles and transportation",
    icon: "Fuel",
    totalAmount: 45000,
    transactionCount: 120,
    color: "#FF6B6B",
    trend: 5.2, // 5.2% increase
  },
  {
    id: "salaries",
    name: "Salaries",
    description: "Employee salaries and compensation",
    icon: "Users",
    totalAmount: 250000,
    transactionCount: 48,
    color: "#4ECDC4",
    trend: -2.1, // 2.1% decrease
  },
  {
    id: "electricity",
    name: "Electricity Bill",
    description: "Electricity and power expenses",
    icon: "Zap",
    totalAmount: 32000,
    transactionCount: 24,
    color: "#FFD166",
    trend: 8.7, // 8.7% increase
  },
  {
    id: "rent",
    name: "Rent",
    description: "Office and facility rent expenses",
    icon: "Building",
    totalAmount: 120000,
    transactionCount: 12,
    color: "#6A0572",
    trend: 0, // No change
  },
  {
    id: "internet",
    name: "Internet & Phone",
    description: "Internet, phone, and communication expenses",
    icon: "Wifi",
    totalAmount: 18500,
    transactionCount: 24,
    color: "#1A535C",
    trend: 1.5, // 1.5% increase
  },
  {
    id: "maintenance",
    name: "Maintenance",
    description: "Equipment and facility maintenance",
    icon: "Wrench",
    totalAmount: 35000,
    transactionCount: 42,
    color: "#F46036",
    trend: -3.8, // 3.8% decrease
  },
  {
    id: "supplies",
    name: "Office Supplies",
    description: "Office supplies and stationery",
    icon: "Briefcase",
    totalAmount: 12500,
    transactionCount: 65,
    color: "#2EC4B6",
    trend: -1.2, // 1.2% decrease
  },
  {
    id: "travel",
    name: "Travel",
    description: "Business travel expenses",
    icon: "Plane",
    totalAmount: 28000,
    transactionCount: 32,
    color: "#E71D36",
    trend: 12.5, // 12.5% increase
  },
];

// Monthly expenses by category for the current year
export const monthlyExpensesByCategory = [
  // Fuel
  { month: "Jan", categoryId: "fuel", amount: 3500 },
  { month: "Feb", categoryId: "fuel", amount: 3800 },
  { month: "Mar", categoryId: "fuel", amount: 3600 },
  { month: "Apr", categoryId: "fuel", amount: 3900 },
  { month: "May", categoryId: "fuel", amount: 4200 },
  { month: "Jun", categoryId: "fuel", amount: 4100 },
  { month: "Jul", categoryId: "fuel", amount: 3800 },
  { month: "Aug", categoryId: "fuel", amount: 3700 },
  { month: "Sep", categoryId: "fuel", amount: 3500 },
  { month: "Oct", categoryId: "fuel", amount: 3600 },
  { month: "Nov", categoryId: "fuel", amount: 3800 },
  { month: "Dec", categoryId: "fuel", amount: 3500 },

  // Salaries
  { month: "Jan", categoryId: "salaries", amount: 20000 },
  { month: "Feb", categoryId: "salaries", amount: 20000 },
  { month: "Mar", categoryId: "salaries", amount: 20000 },
  { month: "Apr", categoryId: "salaries", amount: 21000 },
  { month: "May", categoryId: "salaries", amount: 21000 },
  { month: "Jun", categoryId: "salaries", amount: 21000 },
  { month: "Jul", categoryId: "salaries", amount: 21500 },
  { month: "Aug", categoryId: "salaries", amount: 21500 },
  { month: "Sep", categoryId: "salaries", amount: 21500 },
  { month: "Oct", categoryId: "salaries", amount: 21500 },
  { month: "Nov", categoryId: "salaries", amount: 21000 },
  { month: "Dec", categoryId: "salaries", amount: 20000 },

  // Electricity
  { month: "Jan", categoryId: "electricity", amount: 2200 },
  { month: "Feb", categoryId: "electricity", amount: 2100 },
  { month: "Mar", categoryId: "electricity", amount: 2300 },
  { month: "Apr", categoryId: "electricity", amount: 2500 },
  { month: "May", categoryId: "electricity", amount: 2800 },
  { month: "Jun", categoryId: "electricity", amount: 3200 },
  { month: "Jul", categoryId: "electricity", amount: 3500 },
  { month: "Aug", categoryId: "electricity", amount: 3400 },
  { month: "Sep", categoryId: "electricity", amount: 3000 },
  { month: "Oct", categoryId: "electricity", amount: 2600 },
  { month: "Nov", categoryId: "electricity", amount: 2300 },
  { month: "Dec", categoryId: "electricity", amount: 2100 },

  // Rent
  { month: "Jan", categoryId: "rent", amount: 10000 },
  { month: "Feb", categoryId: "rent", amount: 10000 },
  { month: "Mar", categoryId: "rent", amount: 10000 },
  { month: "Apr", categoryId: "rent", amount: 10000 },
  { month: "May", categoryId: "rent", amount: 10000 },
  { month: "Jun", categoryId: "rent", amount: 10000 },
  { month: "Jul", categoryId: "rent", amount: 10000 },
  { month: "Aug", categoryId: "rent", amount: 10000 },
  { month: "Sep", categoryId: "rent", amount: 10000 },
  { month: "Oct", categoryId: "rent", amount: 10000 },
  { month: "Nov", categoryId: "rent", amount: 10000 },
  { month: "Dec", categoryId: "rent", amount: 10000 },

  // Internet & Phone
  { month: "Jan", categoryId: "internet", amount: 1500 },
  { month: "Feb", categoryId: "internet", amount: 1500 },
  { month: "Mar", categoryId: "internet", amount: 1500 },
  { month: "Apr", categoryId: "internet", amount: 1550 },
  { month: "May", categoryId: "internet", amount: 1550 },
  { month: "Jun", categoryId: "internet", amount: 1550 },
  { month: "Jul", categoryId: "internet", amount: 1600 },
  { month: "Aug", categoryId: "internet", amount: 1600 },
  { month: "Sep", categoryId: "internet", amount: 1600 },
  { month: "Oct", categoryId: "internet", amount: 1550 },
  { month: "Nov", categoryId: "internet", amount: 1500 },
  { month: "Dec", categoryId: "internet", amount: 1500 },

  // Maintenance
  { month: "Jan", categoryId: "maintenance", amount: 2800 },
  { month: "Feb", categoryId: "maintenance", amount: 3200 },
  { month: "Mar", categoryId: "maintenance", amount: 2500 },
  { month: "Apr", categoryId: "maintenance", amount: 3000 },
  { month: "May", categoryId: "maintenance", amount: 2700 },
  { month: "Jun", categoryId: "maintenance", amount: 3500 },
  { month: "Jul", categoryId: "maintenance", amount: 2900 },
  { month: "Aug", categoryId: "maintenance", amount: 3100 },
  { month: "Sep", categoryId: "maintenance", amount: 2800 },
  { month: "Oct", categoryId: "maintenance", amount: 3200 },
  { month: "Nov", categoryId: "maintenance", amount: 2800 },
  { month: "Dec", categoryId: "maintenance", amount: 2500 },

  // Office Supplies
  { month: "Jan", categoryId: "supplies", amount: 1200 },
  { month: "Feb", categoryId: "supplies", amount: 900 },
  { month: "Mar", categoryId: "supplies", amount: 1100 },
  { month: "Apr", categoryId: "supplies", amount: 950 },
  { month: "May", categoryId: "supplies", amount: 1050 },
  { month: "Jun", categoryId: "supplies", amount: 1200 },
  { month: "Jul", categoryId: "supplies", amount: 950 },
  { month: "Aug", categoryId: "supplies", amount: 1000 },
  { month: "Sep", categoryId: "supplies", amount: 1150 },
  { month: "Oct", categoryId: "supplies", amount: 1000 },
  { month: "Nov", categoryId: "supplies", amount: 1100 },
  { month: "Dec", categoryId: "supplies", amount: 900 },

  // Travel
  { month: "Jan", categoryId: "travel", amount: 1800 },
  { month: "Feb", categoryId: "travel", amount: 2200 },
  { month: "Mar", categoryId: "travel", amount: 2500 },
  { month: "Apr", categoryId: "travel", amount: 2000 },
  { month: "May", categoryId: "travel", amount: 2300 },
  { month: "Jun", categoryId: "travel", amount: 2700 },
  { month: "Jul", categoryId: "travel", amount: 3000 },
  { month: "Aug", categoryId: "travel", amount: 2800 },
  { month: "Sep", categoryId: "travel", amount: 2500 },
  { month: "Oct", categoryId: "travel", amount: 2200 },
  { month: "Nov", categoryId: "travel", amount: 2000 },
  { month: "Dec", categoryId: "travel", amount: 2000 },
];

// Forecast data for the next 6 months
export const forecastData = [
  // Fuel
  { month: "Jan", categoryId: "fuel", amount: 3600, isProjected: true },
  { month: "Feb", categoryId: "fuel", amount: 3700, isProjected: true },
  { month: "Mar", categoryId: "fuel", amount: 3800, isProjected: true },
  { month: "Apr", categoryId: "fuel", amount: 4000, isProjected: true },
  { month: "May", categoryId: "fuel", amount: 4200, isProjected: true },
  { month: "Jun", categoryId: "fuel", amount: 4300, isProjected: true },

  // Salaries
  { month: "Jan", categoryId: "salaries", amount: 20500, isProjected: true },
  { month: "Feb", categoryId: "salaries", amount: 20500, isProjected: true },
  { month: "Mar", categoryId: "salaries", amount: 21000, isProjected: true },
  { month: "Apr", categoryId: "salaries", amount: 21000, isProjected: true },
  { month: "May", categoryId: "salaries", amount: 21500, isProjected: true },
  { month: "Jun", categoryId: "salaries", amount: 21500, isProjected: true },

  // Electricity
  { month: "Jan", categoryId: "electricity", amount: 2300, isProjected: true },
  { month: "Feb", categoryId: "electricity", amount: 2200, isProjected: true },
  { month: "Mar", categoryId: "electricity", amount: 2400, isProjected: true },
  { month: "Apr", categoryId: "electricity", amount: 2700, isProjected: true },
  { month: "May", categoryId: "electricity", amount: 3000, isProjected: true },
  { month: "Jun", categoryId: "electricity", amount: 3300, isProjected: true },

  // Rent
  { month: "Jan", categoryId: "rent", amount: 10000, isProjected: true },
  { month: "Feb", categoryId: "rent", amount: 10000, isProjected: true },
  { month: "Mar", categoryId: "rent", amount: 10000, isProjected: true },
  { month: "Apr", categoryId: "rent", amount: 10000, isProjected: true },
  { month: "May", categoryId: "rent", amount: 10000, isProjected: true },
  { month: "Jun", categoryId: "rent", amount: 10000, isProjected: true },

  // Internet & Phone
  { month: "Jan", categoryId: "internet", amount: 1550, isProjected: true },
  { month: "Feb", categoryId: "internet", amount: 1550, isProjected: true },
  { month: "Mar", categoryId: "internet", amount: 1600, isProjected: true },
  { month: "Apr", categoryId: "internet", amount: 1600, isProjected: true },
  { month: "May", categoryId: "internet", amount: 1650, isProjected: true },
  { month: "Jun", categoryId: "internet", amount: 1650, isProjected: true },

  // Maintenance
  { month: "Jan", categoryId: "maintenance", amount: 2700, isProjected: true },
  { month: "Feb", categoryId: "maintenance", amount: 3000, isProjected: true },
  { month: "Mar", categoryId: "maintenance", amount: 2600, isProjected: true },
  { month: "Apr", categoryId: "maintenance", amount: 2900, isProjected: true },
  { month: "May", categoryId: "maintenance", amount: 2800, isProjected: true },
  { month: "Jun", categoryId: "maintenance", amount: 3200, isProjected: true },

  // Office Supplies
  { month: "Jan", categoryId: "supplies", amount: 1100, isProjected: true },
  { month: "Feb", categoryId: "supplies", amount: 950, isProjected: true },
  { month: "Mar", categoryId: "supplies", amount: 1050, isProjected: true },
  { month: "Apr", categoryId: "supplies", amount: 1000, isProjected: true },
  { month: "May", categoryId: "supplies", amount: 1100, isProjected: true },
  { month: "Jun", categoryId: "supplies", amount: 1150, isProjected: true },

  // Travel
  { month: "Jan", categoryId: "travel", amount: 2100, isProjected: true },
  { month: "Feb", categoryId: "travel", amount: 2300, isProjected: true },
  { month: "Mar", categoryId: "travel", amount: 2600, isProjected: true },
  { month: "Apr", categoryId: "travel", amount: 2400, isProjected: true },
  { month: "May", categoryId: "travel", amount: 2700, isProjected: true },
  { month: "Jun", categoryId: "travel", amount: 3000, isProjected: true },
];

// Total expenses by month
export const totalExpensesByMonth = [
  { month: "Jan", amount: 43000 },
  { month: "Feb", amount: 43700 },
  { month: "Mar", amount: 43500 },
  { month: "Apr", amount: 44900 },
  { month: "May", amount: 45600 },
  { month: "Jun", amount: 47250 },
  { month: "Jul", amount: 47250 },
  { month: "Aug", amount: 47100 },
  { month: "Sep", amount: 46050 },
  { month: "Oct", amount: 45650 },
  { month: "Nov", amount: 44500 },
  { month: "Dec", amount: 42500 },
];

// Expense distribution by category (percentage)
export const expenseDistribution = expenseCategories.map(category => ({
  id: category.id,
  name: category.name,
  value: category.totalAmount,
  color: category.color,
}));
