# 🏥 Hospital Management System – Backend

A scalable backend system for managing hospital operations, built using **NestJS**, **TypeORM**, and **PostgreSQL**. This project provides APIs for handling administrative tasks such as appointments, billing, and overall hospital workflow management.

---

## 🚀 Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** TypeORM
* **Authentication:** JWT (via @nestjs/jwt)
* **Validation:** class-validator & class-transformer
* **Mailing:** Nodemailer
* **Other Tools:** ESLint, Prettier, Jest

---

## 📁 Project Structure

```
src/
│
├── admin/                # Admin module (core business logic)
│   ├── dto/              # Data Transfer Objects
│   ├── admin.controller.ts
│   ├── admin.service.ts
│   └── admin.module.ts
│
├── app.controller.ts     # Root controller
├── app.service.ts        # Root service
├── app.module.ts         # Main module
└── main.ts               # Application entry point
```

---

## ⚙️ Features

* 👤 Admin management
* 📅 Appointment handling
* 💳 Billing system
* 📧 Email notifications (via Nodemailer)
* 🔐 JWT-based authentication (configurable)
* 🧾 DTO-based validation and data integrity
* 🗄️ PostgreSQL database integration

---

## 🛠️ Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate into the project
cd Hospital-Management-System-Backend

# Install dependencies
npm install
```

---

## ▶️ Running the Application

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

---

## 🧪 Running Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

---

## 🔧 Environment Configuration

Create a `.env` file in the root directory and configure:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database

JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

## 📦 API Design

The backend follows a **modular architecture**:

* Controllers handle HTTP requests
* Services contain business logic
* DTOs enforce validation and structure
* Modules encapsulate domain features

---

## 🧱 Future Improvements

* Role-based access control (RBAC)
* Patient & doctor modules
* Medical records management
* File uploads (reports, prescriptions)
* API documentation (Swagger)
* Docker support

---

## 📄 License

This project is currently **unlicensed**.

---

## 👨‍💻 Author

Developed as part of a Hospital Management System backend using NestJS.

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

---
