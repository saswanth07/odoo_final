# Cafe POS - Point of Sale Management System

A full-stack web application for managing cafe operations including orders, inventory, employees, customers, payments, and reporting.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure Details](#project-structure-details)
- [Configuration](#configuration)
- [Database](#database)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The **Cafe POS System** is a comprehensive point-of-sale and management platform designed for coffee shops and cafes. It provides real-time order management, inventory tracking, customer management, employee oversight, and detailed reporting and analytics.

The system is built using modern technologies with a Spring Boot backend and a React + TypeScript frontend, ensuring scalability, maintainability, and user-friendly interactions.

---

## 🛠 Tech Stack

### Backend
- **Framework:** Spring Boot 3.5.15
- **Language:** Java 17
- **Database:** MySQL 8.0+
- **Authentication:** JWT (JSON Web Tokens)
- **Build Tool:** Maven
- **Additional Libraries:**
  - Spring Data JPA (ORM)
  - Spring Security
  - Spring Mail (Email notifications)
  - Validation

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI Components:** Radix UI with Shadcn/ui
- **Styling:** Tailwind CSS
- **State Management:** TanStack React Query (data fetching)
- **Form Management:** React Hook Form
- **HTTP Client:** Axios
- **Date Handling:** date-fns

---

## 📁 Project Structure

```
s:/33/
├── backend 1/                          # Backend application
│   └── backend/                        # Spring Boot project
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   └── com/ps2/       # Main application package
│       │   │   │       ├── controller/  # REST API endpoints
│       │   │   │       ├── service/     # Business logic
│       │   │   │       ├── repository/  # Data access layer
│       │   │   │       ├── entity/      # JPA entities
│       │   │   │       ├── dto/         # Data Transfer Objects
│       │   │   │       ├── exception/   # Custom exceptions
│       │   │   │       ├── security/    # Security configuration
│       │   │   │       └── config/      # Application configuration
│       │   │   └── resources/
│       │   │       └── application.properties  # Configuration
│       │   └── test/                 # Unit and integration tests
│       ├── pom.xml                  # Maven configuration
│       └── target/                  # Compiled classes and artifacts
│
└── project/                            # Frontend application
    ├── src/
    │   ├── components/
    │   │   ├── auth/                  # Authentication components
    │   │   ├── layout/                # Layout components (Navbar, Sidebar)
    │   │   └── ui/                    # Reusable UI components (buttons, dialogs, etc.)
    │   ├── pages/                     # Page components
    │   │   ├── Dashboard.tsx          # Dashboard
    │   │   ├── Login.tsx              # Login page
    │   │   ├── POS.tsx                # Point of Sale interface
    │   │   ├── Orders.tsx             # Order management
    │   │   ├── Products.tsx           # Product management
    │   │   ├── Categories.tsx         # Category management
    │   │   ├── Customers.tsx          # Customer management
    │   │   ├── Employees.tsx          # Employee management
    │   │   ├── Tables.tsx             # Table management
    │   │   ├── Payments.tsx           # Payment processing
    │   │   ├── Receipts.tsx           # Receipt history
    │   │   ├── Reports.tsx            # Analytics and reports
    │   │   ├── Settings.tsx           # Application settings
    │   │   ├── Kitchen.tsx            # Kitchen display system
    │   │   └── ... (other pages)
    │   ├── hooks/
    │   │   ├── use-toast.ts           # Toast notification hook
    │   │   └── usePermission.ts       # Permission checking hook
    │   ├── lib/
    │   │   ├── api.ts                 # Axios API client configuration
    │   │   ├── auth.tsx               # Authentication utilities
    │   │   ├── roles.ts               # Role definitions
    │   │   ├── theme.tsx              # Theme configuration
    │   │   └── utils.ts               # Utility functions
    │   ├── App.tsx                    # Main app component
    │   └── main.tsx                   # Entry point
    ├── package.json                   # NPM dependencies
    ├── tsconfig.json                  # TypeScript configuration
    ├── vite.config.ts                 # Vite configuration
    └── tailwind.config.js             # Tailwind CSS configuration
```

---

## ✨ Features

### Core Features
- **Authentication & Authorization**
  - JWT-based login/logout
  - Role-based access control (RBAC)
  - Password reset functionality
  - Secure token management

- **Point of Sale (POS)**
  - Real-time order creation
  - Multiple payment methods support
  - QR code generation for orders
  - Kitchen display system (KDS)
  - Table management
  - Order tracking

- **Order Management**
  - Create, update, and cancel orders
  - Order history and receipts
  - Order status tracking
  - Customer order history

- **Inventory Management**
  - Product catalog management
  - Category organization
  - Stock tracking
  - Product pricing

- **Customer Management**
  - Customer profiles
  - Order history
  - Loyalty tracking
  - Customer feedback

- **Employee Management**
  - Employee profiles
  - Role assignment
  - Permission management
  - Employee activity tracking

- **Payment Processing**
  - Multiple payment methods
  - Payment history
  - Refund management
  - Transaction tracking

- **Reporting & Analytics**
  - Sales reports
  - Revenue analytics
  - Product performance
  - Customer insights
  - Employee performance metrics

- **Additional Features**
  - Promotional campaigns
  - Coupon management
  - Feedback collection
  - Floor/table organization
  - Email notifications
  - Data export functionality

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or higher
- **Node.js 16+** and npm
- **MySQL 8.0+**
- **Git**
- **Maven 3.6+** (for building backend)

### Optional
- **Postman** (for API testing)
- **Docker** (for containerized deployment)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd s:\33
```

### 2. Backend Setup

#### a. Database Configuration
Ensure MySQL is running and create the database (or let Hibernate auto-create it):

```bash
# Navigate to backend directory
cd "backend 1\backend"

# Update database credentials in application.properties if needed
# Default credentials:
# - Database: PS2CAFE
# - Username: root
# - Password: saswanth1710
```

#### b. Install Backend Dependencies & Build

```bash
# Build with Maven (handles dependency installation)
mvn clean install

# Or run directly with Maven
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd project

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## 🎮 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd "backend 1\backend"
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd project
npm run dev
```

Then open your browser and navigate to `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd "backend 1\backend"
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd project
npm run build
npm run preview
```

---

## 📚 API Documentation

The backend API is RESTful and uses JWT authentication. Base URL: `http://localhost:8080/api`

### Authentication Endpoints
- `POST /auth/login` - User login (returns JWT token)
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Request password reset

### Main API Endpoints

**Products:** `/products`
- GET, POST, PUT, DELETE operations for product management

**Orders:** `/orders`
- Create orders, view order history, update order status

**Customers:** `/customers`
- Manage customer profiles and information

**Employees:** `/employees`
- Employee management and permissions

**Payments:** `/payments`
- Process payments and view payment history

**Reports:** `/dashboard`
- Analytics and reporting endpoints

**Feedback:** `/feedback`
- Customer feedback management

**Coupons:** `/coupons`
- Coupon and promotion management

**Categories:** `/categories`
- Product category management

**Tables/Floors:** `/floors`, `/tables`
- Restaurant layout management

**Kitchen:** `/kitchen`
- Kitchen display system endpoints

For complete API details, refer to the included **Postman Collection**: `Cafe_POS_Full_Postman_Collection.json`

---

## ⚙️ Configuration

### Backend Configuration

Edit `backend 1/backend/src/main/resources/application.properties`:

```properties
# Server
server.port=8080
spring.application.name=backend

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/PS2CAFE
spring.datasource.username=root
spring.datasource.password=saswanth1710

# JWT
jwt.secret=<your-secret-key>
jwt.expiration=86400000

# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=<your-email>
spring.mail.password=<your-app-password>
```

### Frontend Configuration

Create or update `.env` file in `project/` directory:

```env
VITE_API_URL=http://localhost:8080/api
```

---

## 💾 Database

### Database Name
- `PS2CAFE`

### Key Tables
- `users` - User accounts
- `products` - Product catalog
- `orders` - Order information
- `order_items` - Order line items
- `customers` - Customer profiles
- `employees` - Employee information
- `payments` - Payment records
- `coupons` - Promotional coupons
- `feedback` - Customer feedback
- `tables` - Table/floor management

The schema is automatically created/updated by Hibernate (DDL: `update`)

---

## 🔐 Authentication

The application uses **JWT (JSON Web Tokens)** for authentication:

1. User logs in with credentials
2. Backend returns JWT token valid for 24 hours
3. Frontend stores token in localStorage
4. All API requests include token in `Authorization: Bearer <token>` header
5. If token expires or is invalid, user is redirected to login

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📝 License

This project is proprietary and confidential. All rights reserved.

---

## 📞 Support & Contact

For questions or issues, please contact the development team.

---

## 🔄 Project Workflow

```
User Interface (React + TypeScript)
         ↓
    Axios API Client
         ↓
Spring Boot Backend (Java 17)
         ↓
Spring Data JPA
         ↓
MySQL Database
```

---

## 📋 Checklist for First Run

- [ ] MySQL server is running
- [ ] Java 17 is installed: `java -version`
- [ ] Node.js 16+ is installed: `node -v`
- [ ] Maven is installed: `mvn -version`
- [ ] Dependencies are installed: `npm install` and `mvn clean install`
- [ ] Database is created: `PS2CAFE`
- [ ] Environment variables are set correctly
- [ ] Backend starts successfully on port 8080
- [ ] Frontend starts successfully on port 5173
- [ ] You can log in with valid credentials

---

## 🐛 Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify database credentials in `application.properties`
- Check if port 8080 is available
- Run `mvn clean install` to rebuild

### Frontend shows blank screen
- Clear browser cache and localStorage
- Check browser console for errors
- Verify VITE_API_URL is set correctly
- Ensure backend is running and accessible

### API requests failing
- Check if JWT token is valid
- Verify backend is running on correct port
- Check CORS configuration
- Review browser network tab for detailed errors

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [Vite Guide](https://vitejs.dev)
- [Maven Guide](https://maven.apache.org)

---

**Last Updated:** 2026-06-21
