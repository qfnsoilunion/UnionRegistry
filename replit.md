# Union Registry - Kashmir Valley Tank Owners & Petroleum Dealers Association

## Overview

Union Registry is a full-stack web application built for the Kashmir Valley Tank Owners & Petroleum Dealers Association. The system serves as a comprehensive management platform for tracking dealers, employees, clients, and various administrative functions within the petroleum trade industry in Kashmir.

The application features a role-based access system with two primary user types: Administrators (who manage the entire system) and Dealers (who manage their specific operations). The system maintains detailed records of employment history, client relationships, compliance tracking, and audit logs for complete transparency and regulatory compliance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Animation**: Framer Motion for smooth transitions and interactions
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Maps**: Leaflet with OpenStreetMap for fuel station mapping

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: bcryptjs for password hashing, Speakeasy for TOTP 2FA
- **Validation**: Zod schemas for consistent validation across client and server
- **File Structure**: Clean separation of concerns with routes, storage layer, and utilities

### Data Architecture
The system uses a comprehensive relational database schema with the following key entities:
- **Dealers**: Legal entities operating petroleum outlets
- **DealerProfiles**: Authentication credentials and login information for dealers
- **Persons**: Individual employee records with Aadhaar-based identification
- **EmploymentRecords**: Historical employment data linking persons to dealers
- **Clients**: Both private and government entities purchasing petroleum
- **Vehicles**: Vehicle registrations associated with clients
- **TransferRequests**: Client transfer requests between dealers
- **AuditLogs**: Complete audit trail of all system operations

### Authentication System
- **Admin Authentication**: Single admin account with optional TOTP 2FA
- **Dealer Authentication**: Individual dealer profiles with username/password and TOTP
- **Role Management**: Client-side role storage with server-side validation
- **Session Management**: Stateless authentication with request headers

### Key Features
- **Employee Management**: Complete lifecycle tracking from hiring to separation
- **Client Management**: Support for both private (PAN-based) and government clients
- **Transfer System**: Client transfer requests between dealers with approval workflows
- **Compliance Tracking**: Regulatory compliance monitoring and alerts
- **Audit System**: Complete audit trail with actor tracking
- **Price Tracking**: Real-time fuel price monitoring and historical data
- **Map Integration**: Interactive maps showing fuel station locations
- **Search Functionality**: Global search across employees, clients, and dealers

## External Dependencies

### Database
- **Neon Database**: PostgreSQL hosting service accessed via connection pooling
- **Database URL**: Environment variable required for database connectivity

### Third-Party Services
- **Google Maps API**: For enhanced mapping functionality (optional, falls back to Leaflet)
- **Fuel Price APIs**: External APIs for real-time petroleum price data
- **QR Code Generation**: For TOTP setup during authentication

### Key NPM Packages
- **@neondatabase/serverless**: PostgreSQL client for serverless environments
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation integration
- **framer-motion**: Animation library for smooth UI interactions
- **leaflet**: Open-source mapping library
- **speakeasy**: TOTP implementation for two-factor authentication
- **bcryptjs**: Password hashing utility
- **qrcode**: QR code generation for 2FA setup

### Development Tools
- **TypeScript**: Type safety across the entire application
- **ESLint & Prettier**: Code quality and formatting
- **Vite**: Fast build tool with HMR support
- **PostCSS & Autoprefixer**: CSS processing and vendor prefixes