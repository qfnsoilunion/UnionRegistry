import { sql } from 'drizzle-orm';
import { db } from './db';

export async function initializeDatabase() {
  try {
    // Create the database tables by executing the DDL statements directly
    await db.execute(sql`
      -- Create enums
      DO $$ BEGIN
        CREATE TYPE role AS ENUM ('ADMIN', 'DEALER');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE dealer_status AS ENUM ('ACTIVE', 'INACTIVE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE employment_status AS ENUM ('ACTIVE', 'INACTIVE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE separation_type AS ENUM ('RESIGNED', 'PERFORMANCE', 'CONDUCT', 'REDUNDANCY', 'OTHER');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE client_type AS ENUM ('PRIVATE', 'GOVERNMENT');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE link_status AS ENUM ('ACTIVE', 'INACTIVE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE transfer_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create the main tables
    await db.execute(sql`
      -- Admin auth table
      CREATE TABLE IF NOT EXISTS admin_auth (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        totp_secret TEXT,
        totp_enabled BOOLEAN DEFAULT false NOT NULL,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      -- Dealers table
      CREATE TABLE IF NOT EXISTS dealers (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        legal_name TEXT NOT NULL,
        outlet_name TEXT NOT NULL,
        location TEXT NOT NULL,
        status dealer_status DEFAULT 'ACTIVE' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      -- Dealer profiles table
      CREATE TABLE IF NOT EXISTS dealer_profiles (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        dealer_id VARCHAR NOT NULL UNIQUE,
        username VARCHAR NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        email TEXT NOT NULL,
        mobile VARCHAR(15) NOT NULL,
        totp_secret TEXT,
        totp_enabled BOOLEAN DEFAULT false NOT NULL,
        temporary_password BOOLEAN DEFAULT true NOT NULL,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      -- Persons table
      CREATE TABLE IF NOT EXISTS persons (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        aadhaar VARCHAR(12) UNIQUE NOT NULL,
        name TEXT NOT NULL,
        mobile VARCHAR(15),
        email TEXT,
        address TEXT,
        date_of_birth TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      -- Employment records table
      CREATE TABLE IF NOT EXISTS employment_records (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        person_id VARCHAR NOT NULL,
        dealer_id VARCHAR NOT NULL,
        date_of_joining TIMESTAMP NOT NULL,
        date_of_resignation TIMESTAMP,
        current_status employment_status DEFAULT 'ACTIVE' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      -- Separation events table
      CREATE TABLE IF NOT EXISTS separation_events (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        employment_id VARCHAR NOT NULL,
        separation_date TIMESTAMP NOT NULL,
        separation_type separation_type NOT NULL,
        remarks TEXT NOT NULL,
        recorded_by_label TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      -- Clients table
      CREATE TABLE IF NOT EXISTS clients (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        client_type client_type NOT NULL,
        pan VARCHAR(10) UNIQUE,
        gov_client_id VARCHAR UNIQUE,
        name TEXT NOT NULL,
        contact_person TEXT,
        mobile VARCHAR(15),
        email TEXT,
        address TEXT,
        gstin VARCHAR(15),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      -- Vehicles table
      CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id VARCHAR NOT NULL,
        registration_number VARCHAR UNIQUE NOT NULL,
        fuel_type TEXT,
        notes TEXT
      );

      -- Client dealer links table
      CREATE TABLE IF NOT EXISTS client_dealer_links (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id VARCHAR NOT NULL,
        dealer_id VARCHAR NOT NULL,
        status link_status DEFAULT 'ACTIVE' NOT NULL,
        date_of_onboarding TIMESTAMP NOT NULL,
        date_of_offboarding TIMESTAMP,
        offboarding_reason TEXT,
        remarks TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      -- Transfer requests table
      CREATE TABLE IF NOT EXISTS transfer_requests (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id VARCHAR NOT NULL,
        from_dealer_id VARCHAR NOT NULL,
        to_dealer_id VARCHAR NOT NULL,
        status transfer_status DEFAULT 'PENDING' NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        decided_at TIMESTAMP
      );

      -- Audit logs table
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        actor TEXT NOT NULL,
        action TEXT NOT NULL,
        entity TEXT NOT NULL,
        entity_id VARCHAR NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log('✅ Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    return false;
  }
}