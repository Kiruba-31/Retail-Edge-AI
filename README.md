# Retail Edge AI Dashboard

A comprehensive, role-based frontend dashboard for managing retail operations. This application provides distinct interfaces and capabilities tailored for different organizational roles including Admin, Store Manager, Inventory Staff, and Operations Manager.

## Features

- **Role-Based Access Control (RBAC):** Tailored dashboard experiences based on user roles.
- **Secure Authentication:** Integrated with Clerk for robust, seamless sign-in and user management.
- **Real-Time Updates:** Powered by `socket.io-client` for live data synchronization.
- **Data Visualization:** Interactive charts and metrics using `recharts`.
- **Modern UI/UX:** Built with React, styled with Tailwind CSS v4, and utilizing Lucide React icons for a clean, responsive interface.
- **Fast Development:** Scaffolded with Vite for instantaneous hot module replacement (HMR) and fast builds.

## Tech Stack

- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4
- **Authentication:** Clerk (`@clerk/react`)
- **Routing:** React Router DOM
- **Charts:** Recharts
- **Networking:** Axios, Socket.io-client

## Getting Started

### Prerequisites

- Node.js (Version specified in `.mise.toml` or generally Node 18+)
- `npm` or `pnpm`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kiruba-31/Retail-Edge-AI.git
   cd Retail-Edge-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   *(or use `pnpm install` / `yarn` based on your preference)*

### Running Locally

Start the development server:

```bash
npm run dev
```

The application will be running at `http://localhost:8443` (or another port if 8443 is in use).

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

- `src/main.tsx`: React entry point.
- `src/App.tsx`: Primary application component containing role-based routing and main dashboard layout.
- `src/index.css`: Global CSS and Tailwind CSS v4 configuration.

## License

This project is proprietary and confidential.
