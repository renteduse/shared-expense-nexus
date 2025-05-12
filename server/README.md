
# BudgetSplit API Server

This is the backend API server for the BudgetSplit expense sharing application.

## Setup Instructions

1. Install dependencies:
```
npm install
```

2. Configure environment variables:
- Create a `.env` file in the server root directory
- Add the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/budgetsplit
JWT_SECRET=your_jwt_secret_key_change_in_production
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EXCHANGE_RATE_API_KEY=your_api_key
```

3. Start the development server:
```
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth` - Get authenticated user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `PUT /api/users/password` - Update password

### Groups
- `POST /api/groups` - Create a new group
- `GET /api/groups` - Get all groups for current user
- `GET /api/groups/:id` - Get group by ID
- `POST /api/groups/join` - Join a group by invite code
- `GET /api/groups/:id/balances` - Get balances for a group
- `GET /api/groups/:id/settlements` - Get settlement plan for a group
- `GET /api/groups/:id/export` - Export group expenses as CSV

### Expenses
- `POST /api/expenses` - Create a new expense
- `GET /api/expenses/group/:groupId` - Get all expenses for a group
- `GET /api/expenses/:id` - Get expense by ID

### Currencies
- `GET /api/currencies/rates` - Get current exchange rates
- `POST /api/currencies/convert` - Convert amount between currencies
