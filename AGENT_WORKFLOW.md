# AI Agent Workflow Log

## Agents Used
- **Cascade (Claude Code)**: Primary agent for code analysis and documentation generation
- **File System Tools**: Built-in tools for reading files and directory exploration

## Prompts & Outputs

### Example 1: Initial Codebase Exploration
**Prompt**: "understand the code"

**Process & Output**:
1. Started with `list_dir` to explore project root structure
2. Read key configuration files (`README.md`, `package.json`) to understand project type and dependencies
3. Explored backend and frontend directories to understand architecture
4. Read main entry points (`backend/index.ts`, `frontend/App.tsx`) to understand application structure
5. Examined shared types and core business logic (`shared/api.ts`, `complianceService.ts`)
6. Analyzed frontend page structure (`Routes.tsx`) to understand UI patterns

**Generated Output**: Comprehensive documentation covering:
- Architecture overview (hexagonal pattern)
- Tech stack details
- Project structure breakdown
- API endpoints documentation
- Business logic explanation
- Development setup instructions

### Example 2: Deep Dive into Business Logic
**Prompt**: Self-directed exploration of compliance calculations

**Process & Output**:
- Located compliance calculation formulas in `shared/api.ts`
- Found `COMPLIANCE_TARGET_GCO2E_MJ = 89.3368` constant
- Discovered energy calculation: `fuelConsumptionTonnes × 41000 MJ/tonne`
- Found compliance balance formula in `ComplianceService`

## Validation / Corrections

### Verification Steps:
1. **Cross-referenced API routes** between `backend/index.ts` (route registration) and `README.md` (documentation) to ensure consistency
2. **Validated shared types** by checking `shared/api.ts` usage in both frontend and backend code
3. **Confirmed architecture patterns** by examining directory structure and import patterns
4. **Verified business logic** by tracing compliance calculations from shared utilities through service layer

### Corrections Made:
- Initially assumed standard CRUD patterns, but corrected to understand FuelEU-specific domain logic
- Adjusted understanding from simple React app to hexagonal architecture with clean separation of concerns
- Updated mental model from basic frontend/backend to compliance-focused maritime application

## Observations

### Where Agent Saved Time:
- **Parallel file reading**: Used simultaneous tool calls to read multiple files at once, significantly speeding up exploration
- **Pattern recognition**: Quickly identified hexagonal architecture pattern from directory structure
- **Context building**: Efficiently built understanding by starting high-level (README, package.json) then drilling down
- **Type safety leverage**: Used TypeScript interfaces in `shared/api.ts` to quickly understand data flow

### Where Agent Failed or Hallucinated:
- **Initial assumptions**: Made incorrect assumptions about standard CRUD patterns before understanding domain specifics
- **File path errors**: Encountered missing file paths when exploring backend services, had to adapt exploration strategy
- **Architecture complexity**: Initially oversimplified understanding before recognizing full hexarchical pattern

### How Combined Tools Effectively:
- **Directory exploration** (`list_dir`) + **file reading** (`read_file`) for comprehensive codebase mapping
- **Shared type analysis** to understand frontend-backend communication patterns
- **Service layer examination** to grasp business logic complexity
- **Configuration file analysis** to understand build and deployment setup

## Best Practices Followed

### Code Analysis Approach:
- **Top-down exploration**: Started with project overview, then drilled into specific components
- **Pattern recognition**: Identified architectural patterns from directory structure and naming conventions
- **Context preservation**: Maintained understanding of domain (FuelEU compliance) throughout analysis
- **Type-driven understanding**: Leveraged TypeScript interfaces to understand data flow and API contracts

### Documentation Standards:
- **Structured output**: Used clear headings and bullet points for readability
- **Code examples**: Included specific code snippets and formulas for clarity
- **Practical focus**: Emphasized setup instructions and API usage over theoretical concepts
- **Cross-referencing**: Connected related concepts across different parts of the codebase

### Tool Usage Optimization:
- **Parallel execution**: Maximized efficiency by reading multiple files simultaneously
- **Strategic exploration**: Focused on key files first (entry points, shared types) before diving into details
- **Error handling**: Adapted strategy when encountering missing files or incorrect paths
- **Validation loop**: Cross-referenced information across multiple sources to ensure accuracy

## Original Project Workflow

### Goals
- Keep core isolated from frameworks (hexagonal)
- Validate inputs, compute CB, banking, pooling per spec
- Provide clear logs and verification steps

### Steps Used
- Plan: define tasks and todos
- Implement: ports/adapters, services, shared formulas
- Verify: typecheck, lint (no errors), tests (unit+http)
- Run: dev server, preview URL, check terminal logs

### Prompts & Logs
- Prompts describe intent and constraints
- Dev server logs: start info, errors reported as JSON with messages
- Migration logs use `console.info`

### Validation
- TypeScript strict enabled
- ESLint clean (no errors)
- Tests cover compute, services, and endpoints
- Manual smoke via OpenPreview and HTTP requests
