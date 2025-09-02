# Union Registry - Kashmir Valley Tank Owners & Petroleum Dealers Association

## Overview

Union Registry is a comprehensive digital management system for the Kashmir Valley Tank Owners & Petroleum Dealers Association, established in 1995. The platform serves as a centralized registry for dealer management, employee tracking, client registration, and operational oversight within Kashmir's petroleum industry. The system provides role-based access for administrators and dealers, enabling efficient management of employment records, client relationships, vehicle registrations, and industry compliance tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side navigation
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Animations**: Framer Motion for smooth user interactions
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with role-based middleware
- **Validation**: Zod schemas for request/response validation
- **Security**: bcrypt for password hashing, speakeasy for TOTP 2FA
- **Audit System**: Comprehensive logging for all data modifications

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema**: Comprehensive relational design covering dealers, employees, clients, vehicles, and audit trails
- **Migrations**: Drizzle Kit for schema management and version control

### Authentication & Authorization
- **Multi-Factor Authentication**: Password + TOTP for both admin and dealer accounts
- **Role-Based Access**: Distinct admin and dealer user flows with appropriate permissions
- **Session Management**: Secure session handling with temporary password enforcement
- **Password Policy**: Enforced complexity requirements with bcrypt hashing

### Development Environment
- **Build Tool**: Vite for fast development and optimized production builds
- **Development Setup**: Hot module replacement with error overlay
- **TypeScript**: Strict configuration with path mapping for clean imports
- **Code Quality**: ESLint integration with consistent formatting

### Deployment Strategy
- **Platform**: Vercel with optimized configuration for frontend/backend separation
- **Frontend**: Static site generation with client-side routing
- **Backend**: Serverless functions with 30-second timeout limits
- **Environment**: Production-ready with environment variable management

### Data Management
- **Entity Relationships**: Complex many-to-many relationships between dealers, employees, clients, and vehicles
- **Transfer System**: Built-in client transfer workflow between dealers
- **Audit Trail**: Complete activity logging with actor identification and metadata
- **Search Capabilities**: Global search across employees and clients with multiple search criteria

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Vercel**: Deployment platform for both frontend and serverless backend functions

### Authentication Services
- **Speakeasy**: Time-based one-time password (TOTP) generation for 2FA
- **QRCode**: QR code generation for mobile authenticator app setup

### Mapping and Location Services
- **Google Maps API**: Interactive maps for fuel station locations and dealer mapping
- **React Google Maps**: Google Maps integration for location-based features
- **Leaflet**: Alternative open-source mapping solution as fallback

### UI and Experience Libraries
- **Radix UI**: Accessible UI component primitives
- **Lucide React**: Consistent icon library
- **React Hook Form**: Form state management and validation
- **Date-fns**: Date manipulation and formatting utilities

### Development and Build Tools
- **Drizzle Kit**: Database schema management and migration tools
- **PostCSS**: CSS processing with Tailwind CSS integration
- **ESBuild**: Fast JavaScript bundling for production builds

### Monitoring and Analytics
- **Built-in Audit System**: Custom audit logging for compliance tracking
- **Error Handling**: Comprehensive error boundaries and logging mechanisms