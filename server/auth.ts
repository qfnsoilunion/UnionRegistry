import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { db } from "./db";
import { adminUsers, dealerProfiles, type DealerProfile } from "@shared/schema";
import { eq } from "drizzle-orm";

const ADMIN_PASSWORD = "Union@2025";

export async function initializeAdmin() {
  try {
    // Check if admin exists
    const existingAdmin = await db.select().from(adminUsers).where(eq(adminUsers.username, "admin"));
    
    if (existingAdmin.length === 0) {
      // Create default admin user
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      const secret = speakeasy.generateSecret({
        name: "Union Registry Admin",
        issuer: "Kashmir Valley Tank Owners"
      });

      await db.insert(adminUsers).values({
        username: "admin",
        passwordHash,
        totpSecret: secret.base32,
        totpEnabled: false
      });

      console.log("Default admin user created");
      console.log("Username: admin");
      console.log("Password: Union@2025");
    }
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
}

export async function verifyAdminPassword(username: string, password: string): Promise<boolean> {
  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
  
  if (!admin) {
    return false;
  }

  return bcrypt.compare(password, admin.passwordHash);
}

export async function verifyTOTP(username: string, token: string): Promise<boolean> {
  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
  
  if (!admin || !admin.totpSecret || !admin.totpEnabled) {
    return false;
  }

  return speakeasy.totp.verify({
    secret: admin.totpSecret,
    encoding: 'base32',
    token,
    window: 2
  });
}

export async function generateTOTPQRCode(username: string): Promise<string | null> {
  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
  
  if (!admin || !admin.totpSecret) {
    return null;
  }

  const otpauth = speakeasy.otpauthURL({
    secret: admin.totpSecret,
    label: `Union Registry:${username}`,
    issuer: 'Kashmir Valley Tank Owners',
    encoding: 'base32'
  });

  return QRCode.toDataURL(otpauth);
}

export async function enableTOTP(username: string, token: string): Promise<boolean> {
  const isValid = await verifyTOTP(username, token);
  
  if (isValid) {
    await db.update(adminUsers)
      .set({ totpEnabled: true })
      .where(eq(adminUsers.username, username));
    return true;
  }
  
  return false;
}

export async function createDealerProfile(dealerId: string, data: {
  username: string;
  password: string;
  ownerName: string;
  phoneNumber: string;
  email?: string;
  licenseNumber?: string;
  gstNumber?: string;
  establishedDate?: Date;
}) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  
  const [profile] = await db.insert(dealerProfiles).values({
    dealerId,
    username: data.username,
    passwordHash,
    ownerName: data.ownerName,
    phoneNumber: data.phoneNumber,
    email: data.email,
    licenseNumber: data.licenseNumber,
    gstNumber: data.gstNumber,
    establishedDate: data.establishedDate,
    servicesOffered: ["Petrol", "Diesel", "Lubricants"]
  }).returning();

  return profile;
}

export async function verifyDealerPassword(username: string, password: string): Promise<DealerProfile | null> {
  const [dealer] = await db.select().from(dealerProfiles).where(eq(dealerProfiles.username, username));
  
  if (!dealer) {
    return null;
  }

  const isValid = await bcrypt.compare(password, dealer.passwordHash);
  if (isValid) {
    // Update last login
    await db.update(dealerProfiles)
      .set({ lastLogin: new Date() })
      .where(eq(dealerProfiles.id, dealer.id));
    return dealer;
  }

  return null;
}