# E-Commerce Project - Comprehensive Documentation

## 📋 Project Overview

**EcoCart** is a full-stack e-commerce web application built with Node.js/Express backend and vanilla HTML/CSS/JavaScript frontend. The application provides a complete e-commerce platform with user authentication, product management, shopping cart, order processing, and admin dashboard functionality.

**Technology Stack:**
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **Frontend**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript
- **Payment**: PayPal SDK
- **Image Storage**: Cloudinary
- **Testing**: Mocha, Chai, Supertest

---

## 🏗️ Project Structure

```
e-commerce/
├── client/                          # Frontend Application
│   ├── dashboard.html              # User dashboard/home page
│   ├── admin/                      # Admin panel pages
│   │   ├── admin-dashboard.html   # Admin dashboard with metrics
│   │   ├── admin-login.html       # Admin authentication
│   │   ├── order.html             # Admin order management
│   │   └── products.html          # Admin product management
│   ├── order/                      # Order management pages
│   │   └── all-orders.html        # View all user orders
│   ├── product/                    # Product pages
│   │   └── view-product.html      # Detailed product view
│   └── user/                       # User authentication pages
│       ├── login.html             # User login
│       ├── signup.html            # User registration
│       └── verify-email.html      # Email verification
│
└── server/                          # Backend API & Configuration
    ├── app.js                       # Express app setup & route mounting
    ├── server.js                    # Server entry point
    ├── package.json                 # Dependencies & scripts
    ├── vercel.json                  # Deployment config
    │
    ├── add-to-cart-mgmt/           # Shopping Cart Module
    │   ├── controller/
    │   │   └── addToCart.js        # Cart operations (add, retrieve)
    │   ├── model/
    │   │   └── cartProduct.js      # Cart schema with items
    │   └── route/
    │       └── CartRoute.js        # Cart endpoints
    │
    ├── address-mgmt/               # Address Management Module
    │   ├── controller/
    │   │   └── addressController.js # CRUD operations for addresses
    │   ├── model/
    │   │   └── addressSchema.js    # Address schema with user references
    │   └── route/
    │       └── addressRoute.js     # Address endpoints
    │
    ├── admin-mgmt/                 # Admin Module
    │   ├── controller/
    │   │   └── login.js            # Admin authentication
    │   ├── middleware/
    │   │   └── adminAuth.js        # Admin-only access control
    │   └── route/
    │       ├── auth.js             # Admin auth routes
    │       └── serveHTMLfile.js    # Serve admin HTML pages
    │
    ├── order-mgmt/                 # Order Management Module
    │   ├── controller/
    │   │   └── order.js            # Order CRUD & status updates
    │   ├── model/
    │   │   └── order.js            # Order schema with products
    │   └── route/
    │       └── order.js            # Order endpoints
    │
    ├── product-mgmt/               # Product Management Module
    │   ├── controller/
    │   │   └── product.js          # Product CRUD operations
    │   ├── model/
    │   │   └── product.js          # Product schema
    │   └── route/
    │       └── product.js          # Product endpoints
    │
    ├── user-mgmt/                  # User Management Module
    │   ├── config/
    │   │   └── db.js               # MongoDB connection
    │   ├── controller/
    │   │   ├── user.js             # User registration/login
    │   │   └── passwdReset.js      # Password reset logic
    │   ├── middleware/
    │   │   └── auth.js             # JWT verification & role authorization
    │   ├── models/
    │   │   └── user.js             # User schema with auth methods
    │   ├── router/
    │   │   └── auth.js             # User auth routes
    │   └── utils/
    │       ├── sendVerificationMail.js     # Email verification
    │       ├── sendPasswdResetEmail.js     # Password reset emails
    │       └── verifyToken.js              # JWT token verification
    │
    └── serveHTMLfile/              # Frontend Static Files
        └── user.js                  # Serve user HTML pages
```

---

## 🔐 Authentication & Authorization

### User Authentication Flow

1. **Registration** (`POST /api/auth/register`)
   - User provides: name, email, password
   - Password is hashed using bcryptjs (10-round salt)
   - Verification email sent with unique token
   - Account status: unverified until email confirmation

2. **Email Verification** (`GET /api/auth/verify/:token`)
   - User clicks link in email with verification token
   - Token verified against database
   - Account marked as verified

3. **Login** (`POST /api/auth/login`)
   - User provides: email, password
   - Credentials validated against stored hash
   - JWT token generated (1-hour expiration)
   - Token returned to client

4. **Password Reset**
   - User requests reset: `POST /api/auth/forgot-password`
   - Reset email sent with token (1-hour validity)
   - User submits new password: `POST /api/auth/reset/:token`

### JWT Token Structure
```javascript
{
  user: {
    id: "mongodb_user_id"
  },
  iat: timestamp,
  exp: timestamp + 1 hour
}
```

### Middleware Protection
- **`verifyToken`**: Extracts JWT from request, validates signature
- **`authorizeRoles`**: Checks user role (admin/user), restricts endpoints

### Admin Authentication
- Admin login via `/api/admin/login`
- Verifies role === 'admin' in user document
- Separate admin-only middleware validates admin status
- Token stored in HTTP-only secure cookie

---

## 👤 User Management Module

### User Model (`user-mgmt/models/user.js`)

**Schema Fields:**
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  isVerified: Boolean (default: false),
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  role: String (enum: ['user', 'admin'], default: 'user'),
  date: Date (default: now)
}
```

**Methods:**
- `generateVerificationToken()`: Creates 32-byte hex token for email verification
- `generateResetPasswordToken()`: Creates 20-byte hex token with 1-hour expiry

**Hooks:**
- Pre-save: Hashes password if modified

### User Controllers (`user-mgmt/controller/user.js`)

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| `handleUserRegistration` | POST | `/api/auth/register` | Create new user account |
| `handleUserLogin` | POST | `/api/auth/login` | Authenticate user, return JWT |
| `getUserData` | GET | `/api/auth/user` | Get logged-in user profile |
| `verifyEmail` | GET | `/api/auth/verify/:token` | Confirm user email |

### Routes (`user-mgmt/router/auth.js`)

```
POST   /api/auth/register           - User registration
POST   /api/auth/login              - User login
GET    /api/auth/user               - Get user data (requires auth)
GET    /api/auth/verify/:token      - Email verification
POST   /api/auth/forgot-password    - Request password reset
POST   /api/auth/reset/:token       - Reset password
GET    /api/auth/admin              - Admin access check (admin only)
```

---

## 📦 Product Management Module

### Product Model (`product-mgmt/model/product.js`)

**Schema Fields:**
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  image: String,
  category: String,
  stock: Number (default: 0),
  createdAt: Date (default: now)
}
```

### Product Controllers (`product-mgmt/controller/product.js`)

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| `createProduct` | POST | `/api/product/add` | Add new product (admin only) |
| `getAllProduct` | GET | `/api/product/get-all-products` | Fetch all products |
| `getSingleProduct` | GET | `/api/product/:id` | Get product by ID |
| `getSimilarProducts` | GET | `/api/product/similar/:category` | Get products in same category |
| `updateSingleProduct` | PUT | `/api/product/update/:id` | Update product (admin only) |
| `deleteSingleProduct` | DELETE | `/api/product/delete/:id` | Delete product (admin only) |

### Routes (`product-mgmt/route/product.js`)

```
POST   /api/product/add                    - Create product
PUT    /api/product/update/:id             - Update product
DELETE /api/product/delete/:id             - Delete product
GET    /api/product/get-all-products       - Get all products
GET    /api/product/:id                    - Get single product
GET    /api/product/similar/:category      - Get similar products
```

---

## 🛒 Shopping Cart Module

### Cart Model (`add-to-cart-mgmt/model/cartProduct.js`)

**Schema Structure:**
```javascript
Cart {
  userId: ObjectId (ref: User, required),
  items: [{
    productId: ObjectId (ref: Product, required),
    quantity: Number (required, default: 1)
  }]
}
```

### Cart Controllers (`add-to-cart-mgmt/controller/addToCart.js`)

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| `handleAddToCart` | POST | `/api/cart/add` | Add/update item in cart |
| `getAllCartProductsOfUser` | GET | `/api/cart/:userId` | Get user's cart items |

**Add to Cart Logic:**
- Checks if user cart exists, creates if needed
- Searches for product in existing items
- Updates quantity if product exists, adds new item if not
- Saves and returns updated cart

### Routes (`add-to-cart-mgmt/route/CartRoute.js`)

```
POST   /api/cart/add         - Add item to cart
GET    /api/cart/:userId     - Get user's cart
```

---

## 📋 Order Management Module

### Order Model (`order-mgmt/model/order.js`)

**Schema Structure:**
```javascript
Order {
  user: ObjectId (ref: User, required),
  products: [{
    product: ObjectId (ref: Product, required),
    quantity: Number (required),
    price: Number (required)
  }],
  totalAmount: Number (required),
  status: String (enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending'),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

### Order Controllers (`order-mgmt/controller/order.js`)

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| `placeOrder` | POST | `/api/order/place` | Create new order |
| `singleOrder` | GET | `/api/order/:id` | Get order details with populated products |
| `multipleOrder` | GET | `/api/order/user/:userId` | Get all orders for user |
| `getAllOrders` | GET | `/api/order/all` | Get all orders (admin) |
| `updateOrderStatus` | PUT | `/api/order/update/:id` | Update order status (admin) |
| `deleteOrder` | DELETE | `/api/order/delete/:id` | Cancel order |

### Routes (`order-mgmt/route/order.js`)

```
POST   /api/order/place              - Place new order
GET    /api/order/:id                - Get order details
GET    /api/order/user/:userId       - Get user's orders
GET    /api/order/all                - Get all orders (admin)
PUT    /api/order/update/:id         - Update order status
DELETE /api/order/delete/:id         - Delete order
```

---

## 🏠 Address Management Module

### Address Model (`address-mgmt/model/addressSchema.js`)

**Schema Fields:**
```javascript
{
  user: ObjectId (ref: User, required),
  fullName: String (required),
  streetAddress: String (required),
  city: String (required),
  state: String (required),
  zipCode: String (required),
  phoneNumber: String,
  isDefault: Boolean (default: false),
  timestamps: true
}
```

### Address Controllers (`address-mgmt/controller/addressController.js`)

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| `handleNewAddress` | POST | `/api/address/add` | Create new address |
| `getAllAddressOfUser` | GET | `/api/address/:userId` | Get user's addresses |
| `updateAddressExistingAddress` | PUT | `/api/address/:id` | Update address |
| `deleteAddress` | DELETE | `/api/address/:id` | Delete address |

### Routes (`address-mgmt/route/addressRoute.js`)

```
POST   /api/address/add        - Add new address
GET    /api/address/:userId    - Get user's addresses
PUT    /api/address/:id        - Update address
DELETE /api/address/:id        - Delete address
```

---

## 🔧 Admin Management Module

### Admin Authentication (`admin-mgmt/controller/login.js`)

**Flow:**
1. Receives email and password
2. Looks up user in database
3. Verifies user role is 'admin'
4. Validates password hash
5. Generates JWT token
6. Sets HTTP-only, secure cookie with token

### Admin Middleware (`admin-mgmt/middleware/adminAuth.js`)

**Validation Steps:**
- Extracts token from cookies or Authorization header
- Verifies JWT signature using `JWT_SECRET`
- Decodes user ID from token
- Queries database to confirm user is admin
- Rejects if user not found or role !== 'admin'

### Routes (`admin-mgmt/route/auth.js`)

```
POST /api/admin/login - Admin authentication
```

### HTML Routes (`admin-mgmt/route/serveHTMLfile.js`)

```
GET /admin/dashboard  - Serve admin dashboard
GET /admin/products   - Serve products management
GET /admin/orders     - Serve orders management
GET /admin/login      - Serve admin login page
```

---

## 🎨 Frontend Pages

### User Pages

#### Dashboard (`client/dashboard.html`)
- **Purpose**: Main user homepage with product listing
- **Features**:
  - Navigation bar with login/logout
  - User profile dropdown
  - Product grid display
  - Mobile-responsive menu
  - Cart access
- **Styling**: Tailwind CSS, responsive design

#### Login (`client/user/login.html`)
- **Purpose**: User authentication
- **Features**:
  - Email and password form
  - Forgot password link
  - Sign-up link
  - Client-side form submission
  - Response messages

#### Sign Up (`client/user/signup.html`)
- **Purpose**: New user registration
- **Features**:
  - Name, email, password input
  - Password confirmation
  - Terms acceptance checkbox
  - Link to login page

#### Email Verification (`client/user/verify-email.html`)
- **Purpose**: Email verification confirmation
- **Features**:
  - Token-based verification
  - Success/failure messages

#### My Orders (`client/order/all-orders.html`)
- **Purpose**: View user's order history
- **Features**:
  - Order list with status
  - Order details modal
  - Track shipment

#### View Product (`client/product/view-product.html`)
- **Purpose**: Detailed product view
- **Features**:
  - Product images/gallery
  - Description and specifications
  - Price display
  - Quantity selector
  - Add to cart button
  - Similar products carousel

### Admin Pages

#### Admin Login (`client/admin/admin-login.html`)
- **Purpose**: Admin authentication
- **Features**:
  - Email/password form
  - Admin-only access

#### Admin Dashboard (`client/admin/admin-dashboard.html`)
- **Purpose**: Admin metrics and overview
- **Features**:
  - Total sales metric
  - Total orders metric
  - New users metric
  - Sidebar navigation
  - Links to products, orders, users management

#### Products Management (`client/admin/products.html`)
- **Purpose**: CRUD operations for products
- **Features**:
  - Product table with all items
  - Add new product form
  - Edit product modal
  - Delete confirmation
  - Search/filter products

#### Orders Management (`client/admin/order.html`)
- **Purpose**: View and manage orders
- **Features**:
  - Orders table
  - Status update dropdown
  - View order details
  - Cancel order option
  - Order filtering

---

## 📧 Email Services

### Verification Email (`user-mgmt/utils/sendVerificationMail.js`)

**Service**: Gmail via Nodemailer

**Configuration:**
```javascript
{
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}
```

**Email Content:**
- Sender: no-reply@aminuldev.me
- Subject: Email Verification
- Body: Verification link with token

**Verification Link Format:**
```
${process.env.BASE_URL}/user/auth/verify/{token}
```

### Password Reset Email (`user-mgmt/utils/sendPasswdResetEmail.js`)

**Purpose**: Send password reset link with token
**Token Validity**: 1 hour

---

## 🚀 API Route Summary

### Authentication Routes
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/user               (protected)
GET    /api/auth/verify/:token
POST   /api/auth/forgot-password
POST   /api/auth/reset/:token
```

### Product Routes
```
GET    /api/product/get-all-products
GET    /api/product/:id
GET    /api/product/similar/:category
POST   /api/product/add              (admin only)
PUT    /api/product/update/:id       (admin only)
DELETE /api/product/delete/:id       (admin only)
```

### Order Routes
```
POST   /api/order/place              (protected)
GET    /api/order/:id                (protected)
GET    /api/order/user/:userId       (protected)
GET    /api/order/all                (admin only)
PUT    /api/order/update/:id         (admin only)
DELETE /api/order/delete/:id         (protected)
```

### Cart Routes
```
POST   /api/cart/add
GET    /api/cart/:userId
```

### Address Routes
```
POST   /api/address/add              (protected)
GET    /api/address/:userId          (protected)
PUT    /api/address/:id              (protected)
DELETE /api/address/:id              (protected)
```

### Admin Routes
```
POST   /api/admin/login
GET    /api/admin                    (protected, admin only)
```

### Static Routes
```
GET    /admin/dashboard              - Admin pages
GET    /admin/products
GET    /admin/orders
GET    /admin/login
GET    /user/dashboard               - User pages
GET    /user/orders
GET    /user/login
GET    /user/signup
```

---

## ⚙️ Environment Configuration

**Required Environment Variables:**
```
PORT=8000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=mongodb_connection_string
EMAIL_USER=gmail_email@gmail.com
EMAIL_PASS=gmail_app_password
BASE_URL=http://localhost:8000
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
```

---

## 🔧 Dependencies & Tools

### Production Dependencies
- **express** (4.19.2): Web framework
- **mongoose** (8.5.3): MongoDB ODM
- **jsonwebtoken** (9.0.2): JWT generation/verification
- **bcryptjs** (2.4.3): Password hashing
- **nodemailer** (6.9.14): Email service
- **cloudinary** (2.4.0): Image storage
- **cookie-parser** (1.4.6): Cookie parsing
- **@paypal/checkout-server-sdk** (1.0.3): PayPal integration
- **otp-generator** (4.0.1): OTP generation
- **bcrypt** (5.1.1): Additional encryption

### Development Dependencies
- **nodemon** (3.1.4): Auto-restart on file changes
- **dotenv** (16.4.5): Environment variable loading
- **mocha** (10.7.3): Testing framework
- **chai** (5.1.1): Assertion library
- **supertest** (7.0.0): HTTP testing
- **nodemailer-mock** (2.0.6): Mock email service

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Create .env file with required variables
# Copy example from Environment Configuration section

# Start development server
npm run dev

# Or start production server
npm start
```

### Running the Application

**Development:**
```bash
npm run dev
```
- Server runs on http://localhost:8000
- Nodemon watches for file changes
- Auto-restarts on code modifications

**Production:**
```bash
npm start
```

---

## 📊 Database Relationships

### Entity Relationships
```
User
├── Has Many: Orders
├── Has Many: Addresses
└── Has One: Cart

Product
├── Belongs to Many: Orders
└── Belongs to Many: Carts

Order
├── Belongs to: User
└── Has Many: Order Items (Products)

Cart
├── Belongs to: User
└── Has Many: Cart Items (Products)

Address
└── Belongs to: User
```

---

## 🔒 Security Measures

1. **Password Security**
   - Bcryptjs hashing with 10-round salt
   - Salted before database storage
   - Never stored in plain text

2. **Authentication**
   - JWT tokens with 1-hour expiration
   - Tokens validated on protected routes
   - Role-based access control

3. **Email Verification**
   - Token-based verification process
   - Tokens only valid until used
   - Unique verification per user

4. **Admin Protection**
   - Admin-only middleware validates role
   - Role check in database on each request
   - Separate admin authentication endpoint

5. **HTTP Security**
   - HTTP-only cookies prevent XSS
   - Secure flag on cookies (production)
   - CORS can be configured

---

## 🎯 Key Features

✅ User Registration with Email Verification
✅ JWT-based Authentication
✅ Role-based Authorization (User/Admin)
✅ Password Reset via Email
✅ Product Management (CRUD)
✅ Shopping Cart Management
✅ Order Placement and Tracking
✅ Order Status Management
✅ Shipping Address Management
✅ Admin Dashboard with Metrics
✅ PayPal Payment Integration
✅ Cloudinary Image Upload
✅ Responsive Design
✅ Email Notifications

---

## 🧪 Testing

The project includes test dependencies (Mocha, Chai, Supertest) for API testing:

```bash
# Run tests (when configured)
npm test
```

---

## 📝 Notes

- **Email Service**: Uses Gmail SMTP with app-specific password
- **Token Expiration**: JWT tokens expire in 1 hour
- **Password Reset**: Tokens expire in 1 hour
- **CORS**: Configure as needed for frontend domain
- **Database**: MongoDB with connection string in environment
- **Static Files**: Client folder served as static assets
- **Deployment**: Vercel configuration included (vercel.json)

---

## 📞 Support

For issues or questions, refer to the modular structure:
- User-related: Check `user-mgmt/` module
- Products: Check `product-mgmt/` module
- Orders: Check `order-mgmt/` module
- Cart: Check `add-to-cart-mgmt/` module
- Admin: Check `admin-mgmt/` module
- Addresses: Check `address-mgmt/` module

---

**Last Updated**: December 23, 2025
**Version**: 1.0.0
**Project Name**: EcoCart E-Commerce Platform
