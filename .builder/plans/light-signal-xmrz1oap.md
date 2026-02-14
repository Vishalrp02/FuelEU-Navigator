# Fuel EU Compliance Dashboard Implementation Plan

## Overview
Build a modern, production-ready Fuel EU Compliance Dashboard using React + TypeScript + TailwindCSS following hexagonal architecture principles. The app will have 4 tabs (Routes, Compare, Banking, Pooling) with data management and compliance tracking.

## Architecture Approach

**Hexagonal Architecture Structure:**
```
client/
  core/
    domain/          # Business logic entities & types
    application/     # Use-cases and business logic
    ports/           # Interfaces for adapters (outbound)
  adapters/
    ui/
      pages/         # Route pages: Routes.tsx, Compare.tsx, Banking.tsx, Pooling.tsx
      components/    # Reusable UI components (global + tab-specific)
      hooks/         # React hooks implementing inbound ports
    infrastructure/  # Mock API services implementing outbound ports
  shared/            # Utils, types
  App.tsx            # Routing + DashboardNav wrapper
  global.css
```

**Key Decisions:**
- Use existing Radix UI components (table, chart, card, tabs) from `client/components/ui/`
- Mock API responses initially (prepared for real API integration)
- Leverage existing TailwindCSS setup with custom theme colors if needed
- React Router for tab-based navigation (either as routes or React state with tab component)

## Phase 1: Project Structure & Theming

### 1.1 Create Core Domain & Application Layer
- **core/domain/routes.ts** - Route entity types and business rules
- **core/domain/compliance.ts** - Compliance, banking, pooling entity types
- **core/ports/routesPort.ts** - Interface for routes data fetching
- **core/ports/compliancePort.ts** - Interface for banking/pooling operations
- **core/application/routeService.ts** - Use-cases for route operations
- **core/application/complianceService.ts** - Use-cases for banking/pooling

### 1.2 Create Infrastructure Adapters
- **adapters/infrastructure/mockRoutesApi.ts** - Mock implementation of routes port
- **adapters/infrastructure/mockComplianceApi.ts** - Mock implementation of compliance port
- **adapters/infrastructure/types.ts** - API response types

### 1.3 Update Global Theme
- Update `client/global.css` - Add CSS variables for dashboard brand colors (blues, greens for compliance status)
- Update `tailwind.config.ts` - Extend with compliance-specific color scheme if needed

## Phase 2: Data & State Management

### 2.1 Create Custom Hooks
- **adapters/ui/hooks/useRoutes.ts** - Get routes and handle filtering/baseline operations
- **adapters/ui/hooks/useComparison.ts** - Calculate and retrieve comparison data
- **adapters/ui/hooks/useBanking.ts** - Manage banking operations with state
- **adapters/ui/hooks/usePooling.ts** - Manage pooling operations with state

### 2.2 Mock Data Setup
- Hardcode mock data based on provided sample data in adapters/infrastructure/
- Simulate API responses with realistic delays using setTimeout (optional)
- Return data in shapes expected by UI components
- Include representative test cases (boundary conditions for CB values, compliance states)

## Phase 3: UI Components

### 3.1 Shared/Global Components
- **DashboardNav.tsx** - Top navigation bar with links to /routes, /compare, /banking, /pooling
  - Active route highlighting
  - Consistent across all pages
- **StatusBadge.tsx** - Compliance status indicator (✅/❌)
- **ComplianceIndicator.tsx** - Visual CB status (red/green) for banking/pooling
- **Container.tsx** - Page wrapper with consistent padding and max-width

### 3.2 Routes Tab Components
- **RoutesTable.tsx** - Main table display with columns: routeId, vesselType, fuelType, year, ghgIntensity, fuelConsumption, distance, totalEmissions
- **RoutesFilters.tsx** - Filter controls (vesselType, fuelType, year dropdowns)
- **SetBaselineButton.tsx** - Action button for POST /routes/:routeId/baseline

### 3.3 Compare Tab Components
- **ComparisonTable.tsx** - Baseline vs comparison data with ghgIntensity, % difference, compliance status
- **ComparisonCharts.tsx** - Switchable bar and line charts comparing ghgIntensity values (using Chart.tsx component)
- **ChartTypeToggle.tsx** - Toggle between bar/line chart views
- **ComplianceMetrics.tsx** - Target (89.3368) vs actual display

### 3.4 Banking Tab Components
- **BankingStatus.tsx** - Display current CB from GET /compliance/cb?year=YYYY
- **BankingActions.tsx** - Buttons for POST /banking/bank and POST /banking/apply
- **BankingKpis.tsx** - Display cb_before, applied, cb_after metrics
- **ActionValidator.tsx** - Disable/error handling when CB ≤ 0

### 3.5 Pooling Tab Components
- **PoolMembersList.tsx** - Display members with before/after CBs
- **PoolSumIndicator.tsx** - Red/green indicator for Sum(adjustedCB) ≥ 0
- **CreatePoolForm.tsx** - Form to create pool with member selection
- **PoolingRules.tsx** - Display validation rules and current state

### 3.6 Main Pages
- **Dashboard.tsx** - Main page combining all tabs and layout

## Phase 4: Integration & Routing

### 4.1 Update Routes
Add separate routes in `client/App.tsx`:
- `<Route path="/" element={<RoutesTab />} />` - Routes tab (homepage)
- `<Route path="/compare" element={<CompareTab />} />`
- `<Route path="/banking" element={<BankingTab />} />`
- `<Route path="/pooling" element={<PoolingTab />} />`

Create wrapper pages in `client/pages/`:
- Routes.tsx
- Compare.tsx
- Banking.tsx
- Pooling.tsx

Add DashboardNav component for navigation between tabs (shared across all pages)

### 4.2 Hook Integration
- Wire up use-case services to React hooks
- Use mock data directly (hardcoded in adapters)
- Handle loading/error states gracefully

## Phase 5: Styling & Polish

### 5.1 Design System (Corporate Professional)
- Neutral color palette with blue/gray base
- Compliance indicators: Green (#10b981) for compliant, Red (#ef4444) for non-compliant
- Professional typography with clear hierarchy
- Consistent spacing (8px grid)
- Use card/table/badge components from UI library

### 5.2 Visual Enhancements
- Status badges with colored backgrounds (green/red) for compliance
- Navigation bar highlighting current tab/route
- Responsive table design with horizontal scroll on mobile
- Subtle shadows and borders for card hierarchy
- Smooth transitions and hover states on interactive elements
- Clear visual feedback for disabled states (CB ≤ 0)
- Charts with professional color scheme matching theme

## Implementation Order

1. **Step 1** - Create core domain & types (core/domain/*, core/ports/*)
2. **Step 2** - Create mock infrastructure adapters with hardcoded data (adapters/infrastructure/*)
3. **Step 3** - Create application services (core/application/*)
4. **Step 4** - Create React hooks (adapters/ui/hooks/*)
5. **Step 5** - Create shared/global components (DashboardNav, StatusBadge, ComplianceIndicator, Container)
6. **Step 6** - Create Routes tab page and components (pages/Routes.tsx, RoutesTable, RoutesFilters)
7. **Step 7** - Create Compare tab page and components (pages/Compare.tsx, ComparisonTable, ComparisonCharts)
8. **Step 8** - Create Banking tab page and components (pages/Banking.tsx, BankingStatus, BankingActions)
9. **Step 9** - Create Pooling tab page and components (pages/Pooling.tsx, PoolMembersList, CreatePoolForm)
10. **Step 10** - Update App.tsx with all new routes and wrap with DashboardNav
11. **Step 11** - Update theme colors in global.css/tailwind.config.ts for corporate professional look
12. **Step 12** - Test all routes, interactions, calculations, and polish UI

## Key Technical Details

### API Endpoints to Mock
- `GET /routes` - Fetch all routes with optional filters
- `POST /routes/:routeId/baseline` - Set baseline for a route
- `GET /routes/comparison` - Fetch baseline + comparison data
- `GET /compliance/cb?year=YYYY` - Current compliance balance
- `POST /banking/bank` - Bank positive CB
- `POST /banking/apply` - Apply banked surplus
- `GET /compliance/adjusted-cb?year=YYYY` - Adjusted CB per ship
- `POST /pools` - Create pool with members

### Formulas & Business Logic
- **Percent Difference**: `((comparison / baseline) − 1) × 100`
- **Compliance Target**: 89.3368 gCO₂e/MJ (2% below 91.16)
- **Banking Rules**: Disable actions if CB ≤ 0
- **Pooling Rules**: Sum(adjustedCB) ≥ 0; deficit ships can't exit worse; surplus ships can't exit negative

### Data Types & Validation
- Routes: routeId, vesselType, fuelType, year, ghgIntensity, fuelConsumption, distance, totalEmissions
- Comparison: ghgIntensity values, percent difference, compliance boolean
- Banking: cb_before, applied, cb_after
- Pooling: adjustedCB values per ship, pool sum validation

## Testing Considerations
- Mock data should cover normal cases, edge cases (CB = 0, negative values)
- Validation messages should be clear
- All calculations should be verifiable with sample data provided

## Implementation Details

### DashboardNav in App.tsx
```typescript
// Wrap all routes with DashboardNav for consistent navigation
<BrowserRouter>
  <DashboardNav />
  <Routes>
    <Route path="/routes" element={<RoutesPage />} />
    <Route path="/compare" element={<ComparePage />} />
    <Route path="/banking" element={<BankingPage />} />
    <Route path="/pooling" element={<PoolingPage />} />
    <Route path="/" element={<Navigate to="/routes" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Mock Data Strategy
- Store mock data as constants in adapters/infrastructure/
- Each service (routesService, complianceService) returns data directly from functions
- Can later be swapped with actual API fetch calls without changing hook/component code

### Corporate Professional Theme Colors
- Primary: Blue/slate gray (#1e3a8a or #475569)
- Accent: Professional blue (#2563eb)
- Success (Compliant): Green (#10b981)
- Error (Non-compliant): Red (#ef4444)
- Background: White/light gray (#f9fafb)
- Border: Slate (#e5e7eb)

## Notes
- Frontend-only implementation with hardcoded mock data; easily swappable for real APIs
- Hexagonal architecture ensures clean separation of concerns
- Separate routes for each tab provide clear navigation and URL state
- DashboardNav provides consistent navigation across all pages
- Component structure supports future enhancements and testing
- TailwindCSS ensures responsive design without additional media query writing
