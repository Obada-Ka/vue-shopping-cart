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

- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Routing**: Vue Router
- **Data Validation**: Zod
- **Testing**: Vitest & Vue Test Utils
- **Linting**: ESLint
- **Formatting**: Prettier
- **Containerization**: Docker & Docker Compose

## Project Structure

The project uses a **layered, feature-based architecture** loosely inspired by Feature-Sliced Design (FSD). Rather than implementing FSD's full layer stack, it takes a pragmatic subset suited to this project's size: logic is organized by business domain rather than technical concern, with a strict one-directional dependency rule enforced between layers.

```
src
├── assets/ # Global styles and assets
├── components/ # Reusable, shared UI components (e.g., BaseButton)
├── domain/ # Core business entities and schemas (e.g., Product)
├── features/ # Self-contained feature modules
│ ├── cart/ # Logic for cart items and totals
│ ├── products/ # Logic for fetching, adding, and removing products
│ └── shipping/ # Logic for calculating shipping costs
├── pages/ # Top-level page components that compose features
├── router/ # Vue Router configuration
└── main.ts # Application entry point
```

**Dependency rule:** higher layers may import lower layers, never the reverse — `pages → features → components → composables/domain`. Features never import from other features directly; cross-feature composition happens only at the page level. These boundaries are enforced by ESLint (`import/no-restricted-paths`), not just convention — an import that violates a boundary fails the lint step, not just a code review.

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm
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

3.  **Set up environment variables:**

```bash
    cp .env.example .env
```

    See [Environment Variables](#environment-variables) below for details.

4. **Run the development server:**

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

Copy `.env.example` to `.env` and adjust as needed:

```env
VITE_PRODUCTS_API_URL=https://fakestoreapi.com/products
```

| Variable                | Description                                     | Default                             |
| ----------------------- | ----------------------------------------------- | ----------------------------------- |
| `VITE_PRODUCTS_API_URL` | Base URL for the FakeStoreAPI products endpoint | `https://fakestoreapi.com/products` |
