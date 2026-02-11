# Combined Loading Chart Exercise

An interactive web application for calculating and visualizing allowable tension curves for pipes under combined torsion and tension loading.

## Installation

```bash
# Install dependencies
npm install

# Requires Node.js v20+ and npm v10+
nvm use 20
```

## Quick Start

**Development Server:**
```bash
npm run dev
```
Opens at `http://localhost:5173`

**Production Build:**
```bash
npm run build
```
Outputs optimized files to `dist/`

**Preview Production Build:**
```bash
npm run preview
```

## Testing

```bash
# Run tests once
npm test -- --run

# Watch mode
npm test

# UI dashboard
npm test:ui

# Coverage report
npm test:coverage
```

**Test Suite:** 26 tests across 2 files covering all calculation functions

## App Architecture

### Directory Structure
```
src/
├── calc/              # Mathematical calculations
│   ├── conversions.ts # Unit conversion functions
│   ├── tensions.ts    # Stress & tension calculations
│   └── *.test.ts      # Test files
├── ui/                # User interface
│   ├── chart.ts       # Chart.js visualization
│   ├── dom.ts         # DOM element management
│   ├── handlers.ts    # Event handlers
│   └── index.ts       # UI initialization
├── index.ts           # App entry point
├── store.ts           # State management
├── specs.ts           # Pipe specifications
└── types.ts           # TypeScript types
```

### Module Breakdown

**`calc/`** - Pure calculation layer
- `insideDiameter()`, `area()`, `inertia()` - Geometric calculations
- `torsionalStress()`, `maxTension()` - Stress analysis under combined loading
- `applySafetyFactor()` - Safety factor reduction
- `calculateTensions()` - Generate full tension curves
- `convertTorque()`, `convertTension()` - Unit conversions

**`ui/`** - Presentation layer
- `chart.ts` - Renders dual plots (with/without safety factor) using Chart.js
- `dom.ts` - Cached DOM element references & dropdowns
- `handlers.ts` - Pipe selection, unit changes, calculation trigger
- `index.ts` - Wires everything together

**`store.ts`** - Simple state holder for selected pipe, weight, safety factor, etc.

**`types.ts`** - Shared TypeScript interfaces (PipeSpec, TensionPoint, Units)

### Data Flow
```
User Input
    ↓
[handlers.ts] → Update store
    ↓
[calculateTensions()] → Compute curve with/without SF
    ↓
[convertTorque/Tension()] → Format for display units
    ↓
[renderChart()] → Dual plot visualization
```

### Key Features
- **Dual Plots:** Simultaneous visualization of tension curves with and without safety factor
- **Multiple Units:** kftlb/kNm for torque, klb/mT for tension
- **Pipe Database:** JSON specs with yield strength and wall thickness options
- **Safety Factor:** Configurable 0-90% in 5% increments
- **Responsive Chart:** Real-time updates on input changes

## Technology Stack
- **Frontend:** TypeScript, HTML5, CSS3
- **Charting:** Chart.js
- **Build Tool:** Vite
- **Testing:** Vitest
- **Type Safety:** TypeScript strict mode

## Development Notes
- All calculations in `calc/` are pure functions (no side effects)
- Chart is reused and updated rather than recreated
- Binary search or memoization could optimize large-scale calculations
- Test coverage focuses on calculation accuracy and edge cases
