# News Blog – Performance Optimization Dashboard

A professional client dashboard for tracking, managing, and auditing web performance optimization initiatives across a high-traffic digital news publication platform.

## Overview

The **News Blog Performance Optimization Dashboard** provides engineering and editorial teams with centralized visibility into technical optimizations that drive Core Web Vitals (LCP, CLS, INP/TBT), server response times, and asset delivery efficiency. It offers complete CRUD management of optimization records, responsive filtering, robust client-side persistence, offline resilience, and enterprise-grade accessibility.

## Key Features

- **Performance Metrics Dashboard**: Real-time summary overview tracking Total Initiatives, Completed optimizations, In Progress tasks, and Pending backlog items with instant reactive updates.
- **Optimization Record Management (CRUD)**: Create, inspect, edit, and delete optimization records with fields for title, category, priority, assigned staff member, status, and technical description.
- **Search & Multi-Criteria Filtering**: Fast, case-insensitive title search paired with status and priority filters, with clean empty-state feedback when no records match.
- **Form Validation & Visual Cues**: Comprehensive input validation highlighting invalid fields in red, enforcing minimum character limits, and linking accessible error notices via `aria-describedby` and `aria-invalid`.
- **XSS Sanitization & Security**: Input sanitization strips dangerous HTML elements (`<script>`, `<iframe>`, inline event handlers, `javascript:` URIs) before storing data in state, completely avoiding `dangerouslySetInnerHTML`.
- **LocalStorage Persistence & Error Resilience**: Automatically synchronizes initiatives to browser `localStorage`, gracefully catching storage limits (`QuotaExceededError`) with user-facing alerts.
- **Offline & Connectivity Awareness**: Actively monitors browser connectivity, displays a dedicated offline banner during disconnects, and retains saved records intact while offline.
- **Analytics Event Logging**: Logs standardized interaction events (`[Analytics] User interacted with Performance Optimization`) upon successful primary actions (creation, modification, and deletion).
- **Accessibility (a11y)**: Built with semantic HTML landmarks (`<header>`, `<main>`, `<section>`, `<article>`), ARIA labels, live regions, keyboard navigation support, and high-contrast styling.

## Technologies Used

- **React 19** – UI component library with hooks (`useMemo`, `useCallback`, `useState`)
- **Vite 8** – Fast frontend tooling and dev server
- **JavaScript (ES Modules)** – Modern ECMAScript application code
- **Vitest** – High-performance unit and integration test runner
- **React Testing Library & user-event** – Accessible user-centric component testing
- **jsdom** – DOM simulation environment for headless testing
- **ESLint 9** – Code linting and style verification

## Installation and Setup

### Prerequisites
- Node.js (v20+ recommended)
- npm (v10+)

### Setup
```bash
# Clone the repository and navigate to the project directory
cd news-blog-performance

# Install dependencies
npm install

# Start the local development server
npm run dev
```

## Testing & Quality Assurance

```bash
# Run the complete Vitest test suite (38 tests)
npm test

# Run ESLint to verify code quality and compliance
npm run lint

# Build the production bundle
npm run build
```

## Project Structure

```
news-blog-performance/
├── src/
│   ├── __tests__/                         # Comprehensive Vitest test suite
│   │   ├── analytics.test.jsx             # Analytics logging tests
│   │   ├── dashboard.test.jsx             # Dashboard metrics and rendering tests
│   │   ├── performanceAndAccessibility.test.jsx # a11y landmarks & React memoization
│   │   ├── persistenceAndConnectivity.test.jsx  # Storage & offline behavior
│   │   ├── recordManagement.test.jsx      # CRUD operations and form validation
│   │   ├── searchAndFilter.test.jsx       # Search & multi-parameter filter tests
│   │   └── security.test.jsx              # XSS sanitization tests
│   ├── components/                        # UI Components
│   │   ├── DashboardHeader.jsx            # Semantic header & top-level actions
│   │   ├── EmptyState.jsx                 # Friendly empty data view
│   │   ├── LoadingIndicator.jsx           # Accessible loading spinner
│   │   ├── MetricsOverview.jsx            # Metric summary cards
│   │   ├── OfflineBanner.jsx              # Network disconnection banner
│   │   ├── OptimizationCard.jsx           # Individual record card
│   │   ├── OptimizationForm.jsx           # Create/Edit modal form
│   │   ├── OptimizationList.jsx           # Records grid layout
│   │   ├── SearchAndFilters.jsx           # Title search and dropdown filters
│   │   └── StorageAlert.jsx               # Storage failure notification alert
│   ├── data/
│   │   └── demoRecords.js                 # Realistic seed data for demo loading
│   ├── utils/                             # Utility modules
│   │   ├── analytics.js                   # Interaction analytics logger
│   │   ├── security.js                    # Input sanitization against XSS
│   │   ├── storage.js                     # LocalStorage persistence wrapper
│   │   └── validation.js                  # Field validation rules
│   ├── App.jsx                            # Root application component
│   ├── App.css                            # Monochromatic enterprise styles
│   ├── index.css                          # Base reset and typography
│   ├── main.jsx                           # Application entry point
│   └── setupTests.js                      # Test environment setup
├── eslint.config.js                       # ESLint configuration
├── vite.config.js                         # Vite & Vitest configuration
├── package.json                           # Scripts and dependencies
├── PROMPTS.md                             # Sequence of development prompts
└── README.md                              # Project documentation
```
