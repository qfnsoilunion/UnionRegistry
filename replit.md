# Union Registry - Kashmir Valley Tank Owners & Petroleum Dealers Association

## Overview

Union Registry is a full-stack web application serving as a management portal for the Kashmir Valley Tank Owners & Petroleum Dealers Association. The application enables comprehensive management of dealers, employees, clients, and business operations without requiring authentication. Instead, it uses a role-based system where users select between "ADMIN" or "DEALER" roles stored in localStorage.

The system maintains a unified registry of petroleum dealers and their employees across the Kashmir Valley, providing tools for employee management, client registration, transfer processing, and audit logging. The homepage showcases the association's history, leadership, and provides quick search functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend Architecture**
- Built with React 18 + Vite for modern development workflow
- Styled using Tailwind CSS with shadcn/ui components for consistent UI
- Framer Motion provides smooth animations and transitions
- Canvas-based oil flow animation for the hero section with metaball effects
- Responsive design with mobile-first approach
- Client-side routing using Wouter for lightweight navigation

**Backend Architecture**
- Express.js server with TypeScript for type safety
- RESTful API design with structured route handling
- Request/response logging middleware for debugging
- Error handling with standardized JSON responses
- Audit logging system for tracking all administrative actions

**Data Management**
- Drizzle ORM with PostgreSQL database (Neon serverless)
- Comprehensive schema covering dealers, persons, employment records, clients, vehicles, and audit logs
- Type-safe database operations with Drizzle-Zod integration
- Structured data validation using Zod schemas on both client and server

**State Management**
- TanStack React Query for server state management and caching
- Local state management with React hooks
- Role persistence in localStorage without authentication requirements

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