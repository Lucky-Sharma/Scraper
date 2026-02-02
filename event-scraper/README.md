# Event Scraper & Listing Application

A full-stack web application that scrapes events from the web and displays them in a modern, premium user interface. Built with **React**, **Node.js**, **TypeScript**, and **PostgreSQL**.

## 🚀 Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Font**: [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts)
- **HTTP Client**: Native Fetch API

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: TypeScript
- **ORM**: [Prisma](https://www.prisma.io/) (v5)
- **Database**: PostgreSQL (Neon Tech)
- **Scraping**: [Cheerio](https://cheerio.js.org/) & [Axios](https://axios-http.com/)
- **Authentication**: Passport.js (Google OAuth 2.0)

---

## 📂 Project Structure

```bash
event-scraper/
├── client/                 # Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI components (EventCard.tsx)
│   │   ├── pages/          # Page views (PublicEvents.tsx)
│   │   ├── services/       # API integration (api.ts)
│   │   ├── types.ts        # TypeScript interfaces
│   │   ├── App.tsx         # Main Component
│   │   └── index.css       # Global Styles & Tailwind Config
│   ├── package.json
│   └── vite.config.ts
│
└── server/                 # Backend Application
    ├── src/
    │   ├── services/       # Business logic (scraper.ts, prisma service)
    │   └── index.ts        # Server entry point & API routes
    ├── prisma/             # Database schema and migrations
    ├── .env                # Environment variables
    └── package.json
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm

### 1. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Create a `.env` file in the `server` directory.
   - Add the following configuration (adjust as needed):
     ```env
     PORT=5000
     # Database Connection (PostgreSQL)
     DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>/<DATABASE>?sslmode=require"
     
     # OAuth Credentials (Required for Login features)
     GOOGLE_CLIENT_ID="<YOUR_GOOGLE_CLIENT_ID>"
     GOOGLE_CLIENT_SECRET="<YOUR_GOOGLE_CLIENT_SECRET>"
     COOKIE_KEY="<YOUR_COOKIE_SECRET>"
     
     # Frontend URL (For CORS)
     CLIENT_URL="http://localhost:5174"
     ```

4. Initialize the Database:
   ```bash
   npx prisma generate
   # Push schema to Neon Tech (Cloud Postgres)
   npx prisma db push
   ```

5. Start the Server:
   ```bash
   npm run dev
   ```
   *The server runs on http://localhost:5000*

### 2. Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Development Server:
   ```bash
   npm run dev
   ```
   *The frontend runs on http://localhost:5174*

---

## ✨ Features

- **Live Event Scraping**: Fetches real-time event data from external sources (e.g., *What's On Sydney*).
- **Cloud Database**: Events are stored in a Neon PostgreSQL database.
- **Modern UI**: "Portrait-mode" centered layout with glassmorphism, gradients, and micro-interactions.
- **Responsive Design**: Optimized for mobile and desktop viewing.
- **REST API**: robust backend API for fetching and triggering scrapes.

## 📝 Usage

1. Open the frontend URL.
2. Click **"Refresh Feed"** to trigger the backend scraper.
3. Watch as new events are fetched, saved to the database, and displayed instantly on the grid.
