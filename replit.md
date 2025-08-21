# Union Registry - Kashmir Valley Tank Owners & Petroleum Dealers Association

## Overview

Union Registry is a full-stack web application serving as a management portal for the Kashmir Valley Tank Owners & Petroleum Dealers Association. The system provides comprehensive management of dealers, employees, clients, and business operations with advanced security features including password-protected admin access (Union@2025) and 2-factor authentication with QR codes.

The application uses a role-based system where users can access either ADMIN or DEALER portals. The system maintains a unified registry of petroleum dealers and their employees across the Kashmir Valley, providing tools for employee management, client registration, transfer processing (admin-only), compliance tracking (both admin and dealer), and audit logging. The homepage features an intelligent oil price tracking system with global location search capabilities and uses the uploaded fuel pump image with sophisticated animations.

## Recent Changes (August 21, 2025)

- ✓ Replaced Google Maps with OpenStreetMap/Leaflet for fuel station map (completely free, no API key needed)
- ✓ Integrated Overpass API to find real fuel stations from OpenStreetMap data
- ✓ Added free geocoding with Nominatim for location search
- ✓ Shows nearby petrol pumps within 5km radius with simulated real-time prices
- ✓ Displays fuel station amenities like shop, car wash, restrooms from OSM data
- ✓ User location detection with distance calculations to each station
- ✓ Interactive map with station markers and detailed popup information
- ✓ Fixed role management for Admin/Dealer panels ensuring proper API authentication
- ✓ Resolved employee and client creation issues with x-actor header requirement
- ✓ Comprehensive testing of all CRUD operations across both panels

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend Architecture**
- Built with React 18 + Vite for modern development workflow
- Styled using Tailwind CSS with shadcn/ui components for consistent UI
- Framer Motion provides smooth animations and transitions
- Advanced interactive globe with rotating fuel price markers
- Recharts integration for sophisticated price analytics and historical data visualization
- Real-time data fetching with auto-refresh capabilities
- Advanced search interfaces with location-based fuel price intelligence
- Responsive design with mobile-first approach and touch-optimized interactions
- Client-side routing using Wouter for lightweight navigation

**Backend Architecture**
- Express.js server with TypeScript for type safety
- RESTful API design with structured route handling
- Advanced fuel price search simulation mimicking Google search results
- Global fuel price data aggregation with realistic regional pricing
- Real-time market analysis including volatility, supply/demand metrics
- Password-protected admin authentication with bcrypt hashing
- 2-factor authentication using TOTP with QR code generation
- Comprehensive audit logging system for tracking all administrative actions
- Request/response logging middleware for debugging
- Error handling with standardized JSON responses

**Data Management**
- Drizzle ORM with PostgreSQL database (Neon serverless)
- Comprehensive schema covering dealers, persons, employment records, clients, vehicles, and audit logs
- Type-safe database operations with Drizzle-Zod integration
- Structured data validation using Zod schemas on both client and server

**State Management**
- TanStack React Query for server state management and caching
- Local state management with React hooks
- Role persistence in localStorage for admin/dealer portal selection
- Live metrics updates every 5 seconds for system capabilities demonstration

**UI/UX Design**
- Professional business application interface
- Dark/light theme support with CSS custom properties
- Accessibility-first component design using Radix UI primitives
- Data tables with search, filtering, and pagination
- Modal-based forms for data entry and management

**Development Workflow**
- Development server with hot module replacement
- TypeScript configuration for strict type checking
- ESLint and Prettier for code quality
- Vite build system for optimized production bundles

## External Dependencies

**Database & ORM**
- Neon Database (Serverless PostgreSQL) for data persistence
- Drizzle ORM for type-safe database operations
- Connection pooling via @neondatabase/serverless

**UI Framework & Styling**
- Tailwind CSS for utility-first styling
- Radix UI for accessible component primitives
- Framer Motion for animations and micro-interactions
- Lucide React for consistent iconography

**Data Fetching & Validation**
- TanStack React Query for server state management
- Zod for runtime type validation and schema definition
- React Hook Form with Zod resolver for form management

**Development Tools**
- Vite for build tooling and development server
- TypeScript for static type checking
- PostCSS with Autoprefixer for CSS processing
- Replit-specific plugins for development environment integration

**Fonts & Assets**
- Google Fonts integration (DM Sans, Fira Code, Geist Mono, Architects Daughter)
- Custom CSS variables for theme management
- Canvas API for custom oil flow animations