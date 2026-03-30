# SaaS Tenant POS System - Frontend

This repository contains the frontend application for the **SaaS Tenant Point of Sale (POS) System**. Built with a modern, high-performance tech stack, it provides role-based interfaces ranging from an advanced administrative dashboard to a fast, streamlined cashier POS terminal and an e-commerce-style customer shopping catalog.

## ✨ Features

- **Role-Based Access Control (RBAC):** Distinct specialized interfaces and access levels for:
  - `Super Admin` & `Store Admin`
  - `Store Manager` & `Branch Manager`
  - `Branch Cashier`
  - `Customer`
- **Multi-Tenant Dashboard:** Comprehensive management interface for tracking overview metrics, managing products, stores, inventory, orders, staff, and system settings.
- **Dedicated POS Terminal:** A high-speed, streamlined Point of Sale interface designed specifically for cashiers to process transactions efficiently.
- **Customer Portal:** Dedicated interfaces for end-customers to browse the catalog (`/shop`) and manage their personal accounts (`/my-dashboard`).
- **Dark/Light Mode Support:** Implemented global theme toggling.
- **Internationalization (i18n):** Multi-language support enabled through `react-i18next`.
- **Responsive Design:** Fully responsive layouts tailored for web, tablet, and mobile displays using modern Tailwind CSS v4.

## 🛠️ Tech Stack

- **Core Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts & Data Viz:** [Recharts](https://recharts.org/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **API Client:** [Axios](https://axios-http.com/)
- **Localization:** [i18next](https://www.i18next.com/)
- **Containerization:** Docker & Nginx
- **Orchestration:** Kubernetes (K3s manifests included)

## 📂 Project Structure

```text
src/
├── assets/         # Static assets like images and global CSS
├── components/     # Reusable UI components & Layouts (Dashboard, POS, Auth)
├── lib/            # Utility functions and API configurations
├── locales/        # JSON translation files for i18n
├── pages/          # Application views categorized by domain
│   ├── auth/       # Login and Registration pages
│   ├── customer/   # Customer Catalog and Dashboard
│   ├── dashboard/  # Admin and Manager control panels
│   └── pos/        # Cashier Point of Sale terminal
├── routes/         # Router configuration & Protected Route wrapper (RBAC)
└── store/          # Zustand state stores (Auth, Cart, UI Themes)
k8s/                # Kubernetes Deployment & Service configurations
Dockerfile          # Multi-stage Docker build for Nginx deployment
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed to run the local environment:

- **Node.js:** v20+ recommended
- **Package Manager:** `pnpm` (highly recommended, matching Docker build) or `npm`

### Installation

1. Clone the repository and navigate to the root directory.
2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

### Development Server

Run the local Vite development server:

```bash
pnpm dev
# or
npm run dev
```

The application will launch with Hot Module Replacement (HMR). The Vite server is typically configured to run on `http://localhost:5173` while proxying `/msp/api` requests to a backend server running on `http://localhost:5000`.

## 📦 Building for Production

To create an optimized production build:

```bash
pnpm build
# or
npm run build
```

This will output the static files to the `dist` directory, ready to be served by any static file host.

## 🐳 Docker Deployment

The application includes a multi-stage `Dockerfile` which builds the Vite project and serves it statically using Nginx.

1. **Build the Docker Image:**
   ```bash
   docker build -t saas-pos-fe:latest .
   ```

2. **Run the Container:**
   ```bash
   docker run -p 80:80 saas-pos-fe:latest
   ```

## ☸️ Kubernetes (K3s) Deployment

Kubernetes manifests are located in the `k8s/` directory.

To deploy the frontend to your Kubernetes cluster:

```bash
kubectl apply -f k8s/deployment.yaml
# Optionally apply the backend or frontend services
kubectl apply -f k8s/backend-service.yaml
```

*Note: You may need to update the image tag or add an ingress configuration depending on your specific infrastructure.*

## 🔐 State Management & Authentication Flow

- **Authentication:** Managed via `useAuthStore`. The router checks `.isAuthenticated` and user `role` to restrict access to various domain layouts via the `<ProtectedRoute>` component.
- **Cart Context:** The POS and Customer Shopping Cart state is universally managed using `useCartStore` to ensure synchronized data when navigating.
- **Theme/UI:** Dark mode and system-level interface preferences are controlled by `useUIStore`.
