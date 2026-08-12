# vue-shopping-cart

This repository contains a modern, feature-rich shopping cart application built with Vue 3, TypeScript, and Vite. It serves as a practical example of a scalable frontend architecture using a feature-sliced design pattern, with strict type-safety and comprehensive testing.

## Features

- **Product Listing**: Fetches and displays a list of products from a remote API.
- **Dynamic Cart**: Add, remove, and update the quantity of items in the cart.
- **Real-time Calculations**: Cart subtotal, VAT (tax), shipping, and grand total are calculated and updated instantly.
- **Shipping Calculator**: A mock shipping calculator to estimate delivery costs based on user input.
- **State Management**: Centralized and modular state management with Pinia, with dedicated stores for products, cart, and shipping.
- **Responsive Design**: A clean, responsive UI that works seamlessly on both mobile and desktop devices.
- **Loading & Empty States**: UI skeletons for loading and clear empty-cart messages provide a smooth user experience.
- **Containerized**: Fully containerized with Docker for easy setup and deployment.

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (using `<script setup>`)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (with strict mode)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Data Validation**: [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/) & [Vue Test Utils](https://test-utils.vuejs.org/)
- **Linting**: [ESLint](https://eslint.org/)
- **Formatting**: [Prettier](https://prettier.io/)
- **Containerization**: [Docker](https://www.docker.com/) & Docker Compose

## Project Structure

The project follows a feature-sliced design (FSD) to promote scalability and maintainability. Logic is organized by business domains rather than technical concerns.

```
src
├── assets/         # Global styles and assets
├── components/     # Reusable, shared UI components (e.g., BaseButton)
├── domain/         # Core business entities and schemas (e.g., Product)
├── features/       # Self-contained feature modules
│   ├── cart/       # Logic for cart items and totals
│   ├── products/   # Logic for fetching, adding, and removing products
│   └── shipping/   # Logic for calculating shipping costs
├── pages/          # Top-level page components that compose features
├── router/         # Vue Router configuration
└── main.ts         # Application entry point
```

Architectural boundaries between these layers are strictly enforced by ESLint rules to prevent improper dependencies.

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm (or your preferred package manager)
- Docker and Docker Compose (for containerized setup)

### Local Development

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/obada-ka/vue-shopping-cart.git
    cd vue-shopping-cart
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5000`.

### Docker Setup

You can also run the application in a Docker container using Docker Compose.

1.  **Build and run the container:**
    ```bash
    docker-compose up
    ```
    The application will be available at `http://localhost:5000`. The development server supports hot-reloading.

## Available Scripts

- `npm run dev`: Starts the development server with hot-reloading.
- `npm run build`: Compiles and bundles the application for production.
- `npm run preview`: Serves the production build locally for previewing.
- `npm run test`: Runs all unit and integration tests once.
- `npm run test:watch`: Runs tests in interactive watch mode.
- `npm run test:coverage`: Runs tests and generates a code coverage report.
- `npm run lint`: Lints the codebase for errors and style issues.
- `npm run format`: Formats all files using Prettier.
- `npm run typecheck`: Performs a static type-check on the codebase.

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_PRODUCTS_API_URL=https://fakestoreapi.com/products
```
