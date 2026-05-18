# Pennywise - Personal Finance Management App

## Overview

Pennywise is a modern, feature-rich mobile application built with React Native and Expo that helps you take control of your personal finances. Whether you're tracking daily expenses, setting financial goals, or planning budgets, Pennywise provides an intuitive and beautiful interface to manage all aspects of your financial life.

## Key Features

### 💰 Transaction Management
- **Add & Track Transactions**: Easily record income and expenses with detailed information
- **Transaction History**: View all your transactions in an organized list with filtering and search capabilities
- **Transaction Details**: Access comprehensive details about any transaction including date, amount, category, and notes
- **Multiple Accounts**: Manage transactions across different bank accounts and payment methods

### 📊 Budget Planning & Tracking
- **Create Budgets**: Set spending limits for different categories
- **Budget Monitoring**: Track your spending against budgets with visual progress indicators
- **Budget Insights**: See how much you've spent and remaining budget for each category
- **Budget Management**: Edit or delete existing budgets as your needs change

### 🎯 Financial Goals
- **Goal Setting**: Create and track financial goals with target amounts and timelines
- **Progress Tracking**: Visualize your progress toward goals with progress circles and indicators
- **Goal Details**: View detailed information about each goal including current savings and target amount
- **Goal Management**: Update or delete goals as circumstances change

### 📈 Reports & Analytics
- **Financial Reports**: Generate comprehensive reports on your spending patterns and financial activity
- **Charts & Visualizations**: View data through intuitive charts and graphs
- **Spending Analysis**: Understand where your money is going with category-based breakdowns
- **Financial Insights**: Get actionable insights based on your transaction data

### ⚙️ Settings & Configuration
- **Account Management**: Manage multiple bank accounts and payment methods
- **Category Management**: Create custom spending categories tailored to your needs
- **Recurring Transactions**: Set up recurring expenses or income that repeat automatically
- **Backup & Restore**: Back up your financial data for safety and restore when needed
- **Account Settings**: Manage your profile and app preferences

### 🔐 Security & Authentication
- **Secure Authentication**: User login and registration with secure password protection
- **Session Management**: Automatic session handling with secure token storage
- **Data Encryption**: Sensitive financial data is securely stored and encrypted

### 🎨 User Experience
- **Clean & Intuitive UI**: Modern glassmorphism design with smooth animations
- **Tab-based Navigation**: Easy navigation between different sections of the app
- **Responsive Design**: Optimized for various mobile screen sizes
- **Dark & Light Themes**: Theme support for comfortable viewing in any lighting condition

## Technology Stack

### Frontend
- **React Native** - Cross-platform mobile app framework
- **Expo** - React Native development platform
- **TypeScript** - Type-safe JavaScript development
- **React Router** - Navigation and routing (via Expo Router)
- **Context API** - State management for global app data

### Backend
- **Supabase** - Backend-as-a-Service for authentication and database
- **PostgreSQL** - Relational database for storing financial data
- **SQL Migrations** - Version-controlled database schema

### UI/Components
- Custom React components for:
  - Forms (Budget, Transaction entry)
  - Charts and visualizations
  - Cards and UI elements
  - Category icons and indicators

### Utilities & Libraries
- **Secure Storage** - Safe storage of sensitive credentials
- **Currency Utilities** - Proper handling of currency formatting and calculations
- **Date Helpers** - Time and date manipulation for transactions
- **Theme Management** - Consistent styling throughout the app

## App Structure

```
pennywise/
├── app/                    # App routes and screens
│   ├── (auth)/            # Authentication screens (login, register)
│   ├── (tabs)/            # Main app screens
│   │   ├── budgets/       # Budget management
│   │   ├── goals/         # Financial goals
│   │   ├── reports/       # Analytics and reports
│   │   ├── settings/      # App configuration
│   │   └── transactions/  # Transaction tracking
│   └── index.tsx          # Home screen
├── components/            # Reusable UI components
├── context/              # Global state management
├── database/             # Database configuration
├── hooks/                # Custom React hooks
├── lib/                  # Third-party library configurations
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── supabase/             # Database migrations
```

## Getting Started

### Prerequisites
- Node.js and npm/yarn installed
- Expo CLI installed (`npm install -g expo-cli`)
- An active Supabase project for backend services

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pennywise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Set up your Supabase credentials in the appropriate configuration files
   - Configure secure storage for API keys

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on mobile**
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Or scan QR code with Expo Go app

## Main Screens

| Screen | Purpose |
|--------|---------|
| **Login/Register** | User authentication |
| **Home** | Dashboard and quick access |
| **Transactions** | View, add, and manage transactions |
| **Budgets** | Create and monitor spending budgets |
| **Goals** | Set and track financial objectives |
| **Reports** | View financial analytics and insights |
| **Settings** | Configure accounts, categories, backups, and preferences |

## Data Models

### Accounts
Multiple bank accounts or payment methods that users can manage

### Transactions
Individual income or expense entries with amounts, dates, categories, and notes

### Budgets
Monthly or custom-period spending limits for different categories

### Goals
Long-term financial objectives with target amounts and progress tracking

### Categories
User-defined or pre-defined spending categories for organization

### Recurring Transactions
Automatically generated transactions that repeat on a schedule

## Security Features

- Secure user authentication with Supabase
- Encrypted storage of sensitive credentials
- Secure API communication
- User session management
- Data backup and restore functionality

## Future Enhancements

Potential features for future versions:
- Bill reminders and notifications
- Multi-currency support
- Advanced analytics with machine learning
- Bill splitting with other users
- Export to CSV/PDF
- Bank account integration for automatic transaction import
- Mobile app notifications

## Support

For issues, feature requests, or questions about the app, please contact the development team or submit an issue in the project repository.

## License

[Add appropriate license information]

---

**Pennywise** - Taking the complexity out of personal finance management.
