**Order Analytics
1. Get total orders at a particular table
    GET /api/orders/table/:tableId
    Query parameters: date (optional), month (optional).

2. Get total orders for the day/month/custom date
    GET /api/orders/daily
    Query parameters: date (default: today).


**Revenue Analytics
1. Get total revenue for the day
    GET /api/revenue/daily
    Query parameters: date (default: today).


**Table Management
1. Get occupancy status for all tables
    GET /api/tables/status
    Response includes: table IDs, occupancy status, time since occupied.


**Menu Management
1. Get all menu items
    GET /api/menu

2. Add a new menu item
    POST /api/menu
    Request body: { name, price, category }.

3. Update a menu item
    PATCH /api/menu/:itemId
    Request body: { name, price, category }.

4. Delete a menu item
    DELETE /api/menu/:itemId


**Reports and Analytics
1. Query parameters: month, year.
    Generate custom reports
    GET /api/reports/custom
    Query parameters: startDate, endDate.

**Authentication and Authorization
1. User login
    POST /api/auth/login
    Request body: { username, password }.

2. User registration (if needed)
    POST /api/auth/register
    Request body: { username, password, role }.

3. Logout
    POST /api/auth/logout

4. Refresh token
    POST /api/auth/refresh