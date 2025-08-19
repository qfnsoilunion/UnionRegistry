import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { logAudit } from "./utils/audit";
import { generateGovClientId } from "./utils/hash";
import {
  createEmployeeSchema,
  createPrivateClientSchema,
  createGovernmentClientSchema,
  endEmploymentSchema,
  createDealerSchema,
} from "./utils/validators";
import { z } from "zod";
import { 
  initializeAdmin, 
  verifyAdminPassword, 
  verifyAdminTotp,
  createDealerProfile,
  verifyDealerLogin,
  verifyDealerTotp,
  changeDealerPassword,
  resetDealerPassword
} from "./auth";

function getActorFromHeaders(req: any): string {
  const actor = req.headers["x-actor"];
  if (!actor) {
    throw new Error("x-actor header is required");
  }
  return actor as string;
}

// Middleware to check admin authentication
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminAuth = req.headers["x-admin-auth"];
  
  if (adminAuth !== "true") {
    return res.status(401).json({ message: "Admin authentication required" });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize admin account on startup
  await initializeAdmin();

  // Admin authentication routes
  app.post("/api/admin/verify-password", async (req, res) => {
    try {
      const { password } = req.body;
      const result = await verifyAdminPassword(password);
      
      if (result.success) {
        res.json({
          success: true,
          totpEnabled: result.totpEnabled,
          qrCode: result.qrCode,
        });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  app.post("/api/admin/verify-totp", async (req, res) => {
    try {
      const { code, enableTotp } = req.body;
      const verified = await verifyAdminTotp(code, enableTotp);
      
      if (verified) {
        res.json({ success: true });
      } else {
        res.status(401).json({ message: "Invalid 2FA code" });
      }
    } catch (error) {
      res.status(500).json({ message: "2FA verification failed" });
    }
  });

  // Dealer profile management (admin only)
  app.post("/api/admin/dealer-profiles", requireAdmin, async (req, res) => {
    try {
      const { dealerId, username, password, email, mobile } = req.body;
      const result = await createDealerProfile(dealerId, username, password, email, mobile);
      
      if (result.success) {
        res.json({ 
          success: true, 
          qrCode: result.qrCode,
          message: "Dealer profile created successfully" 
        });
      } else {
        res.status(400).json({ message: result.error || "Failed to create profile" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to create dealer profile" });
    }
  });

  // Dealer login routes
  app.post("/api/dealer/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await verifyDealerLogin(username, password);
      
      if (result.success) {
        res.json({
          success: true,
          dealerId: result.dealerId,
          totpEnabled: result.totpEnabled,
          qrCode: result.qrCode,
          temporaryPassword: result.temporaryPassword,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/dealer/verify-totp", async (req, res) => {
    try {
      const { username, code, enableTotp } = req.body;
      const result = await verifyDealerTotp(username, code, enableTotp);
      
      if (result.success) {
        res.json({ success: true, dealerId: result.dealerId });
      } else {
        res.status(401).json({ message: "Invalid 2FA code" });
      }
    } catch (error) {
      res.status(500).json({ message: "2FA verification failed" });
    }
  });

  // Change dealer password
  app.post("/api/dealer/change-password", async (req, res) => {
    try {
      const { username, newPassword } = req.body;
      const result = await changeDealerPassword(username, newPassword);
      
      if (result.success) {
        res.json({ success: true, message: "Password changed successfully" });
      } else {
        res.status(400).json({ message: result.error || "Failed to change password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Password change failed" });
    }
  });

  // Admin reset dealer password
  app.post("/api/admin/reset-dealer-password", requireAdmin, async (req, res) => {
    try {
      const { dealerId } = req.body;
      const result = await resetDealerPassword(dealerId);
      
      if (result.success) {
        res.json({ 
          success: true, 
          newPassword: result.newPassword,
          message: "Password reset successfully" 
        });
      } else {
        res.status(400).json({ message: result.error || "Failed to reset password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Password reset failed" });
    }
  });

  // Get dealer profiles (admin only)
  app.get("/api/admin/dealer-profiles", requireAdmin, async (req, res) => {
    try {
      const profiles = await storage.getDealerProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dealer profiles" });
    }
  });

  // Home metrics
  app.get("/api/metrics/home", async (req, res) => {
    try {
      const metrics = await storage.getHomeMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Dealers
  app.post("/api/admin/dealers", async (req, res) => {
    try {
      const actor = getActorFromHeaders(req);
      const validatedData = createDealerSchema.parse(req.body);
      
      const dealer = await storage.createDealer(validatedData);
      await logAudit(actor, "CREATE", "DEALER", dealer.id, validatedData);
      
      res.json(dealer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create dealer" });
      }
    }
  });

  app.get("/api/admin/dealers", async (req, res) => {
    try {
      const dealers = await storage.getDealers();
      res.json(dealers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dealers" });
    }
  });

  app.get("/api/admin/dealers/:id", async (req, res) => {
    try {
      const dealer = await storage.getDealerById(req.params.id);
      if (!dealer) {
        return res.status(404).json({ message: "Dealer not found" });
      }
      res.json(dealer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dealer" });
    }
  });

  app.patch("/api/admin/dealers/:id", async (req, res) => {
    try {
      const actor = getActorFromHeaders(req);
      const { status } = req.body;
      
      if (!["ACTIVE", "INACTIVE"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const dealer = await storage.updateDealerStatus(req.params.id, status);
      await logAudit(actor, "UPDATE", "DEALER", dealer.id, { status });
      
      res.json(dealer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update dealer" });
    }
  });

  // Employees
  app.post("/api/employees", async (req, res) => {
    try {
      const actor = getActorFromHeaders(req);
      const validatedData = createEmployeeSchema.parse(req.body);
      
      // Check if person exists
      let person = await storage.getPersonByAadhaar(validatedData.aadhaar);
      
      if (person) {
        // Check if already employed elsewhere
        const activeEmployment = await storage.getActiveEmploymentByPersonId(person.id);
        if (activeEmployment && activeEmployment.dealerId !== validatedData.dealerId) {
          const dealer = await storage.getDealerById(activeEmployment.dealerId);
          return res.status(409).json({
            code: "EMPLOYEE_ACTIVE_ELSEWHERE",
            message: "Employee is already active with another dealer",
            dealerName: dealer?.outletName || "Unknown",
            since: activeEmployment.dateOfJoining,
          });
        }
      } else {
        // Create new person
        person = await storage.createPerson({
          aadhaar: validatedData.aadhaar,
          name: validatedData.name,
          mobile: validatedData.mobile || null,
          email: validatedData.email || null,
          address: validatedData.address || null,
          dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        });
      }

      // Create employment record
      const employment = await storage.createEmploymentRecord({
        personId: person.id,
        dealerId: validatedData.dealerId,
        dateOfJoining: new Date(validatedData.dateOfJoining),
        currentStatus: "ACTIVE",
      });

      await logAudit(actor, "CREATE", "EMPLOYMENT", employment.id, validatedData);
      
      res.json({ person, employment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create employee" });
      }
    }
  });

  app.get("/api/employees/search", async (req, res) => {
    try {
      const { aadhaar, name, mobile } = req.query;
      
      if (!aadhaar && !name && !mobile) {
        return res.status(400).json({ message: "At least one search parameter is required" });
      }

      const persons = await storage.searchPersons({
        aadhaar: aadhaar as string,
        name: name as string,
        mobile: mobile as string,
      });

      // Get employment history for each person
      const results = await Promise.all(
        persons.map(async (person) => {
          const employments = await storage.getEmploymentsByPersonId(person.id);
          return { ...person, employments };
        })
      );

      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search employees" });
    }
  });

  app.patch("/api/employments/:id/end", async (req, res) => {
    try {
      const actor = getActorFromHeaders(req);
      const validatedData = endEmploymentSchema.parse(req.body);
      
      await storage.endEmployment(req.params.id, {
        separationDate: new Date(validatedData.separationDate),
        separationType: validatedData.separationType,
        remarks: validatedData.remarks,
        recordedByLabel: actor,
      });

      await logAudit(actor, "END_EMPLOYMENT", "EMPLOYMENT", req.params.id, validatedData);
      
      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to end employment" });
      }
    }
  });

  // Clients
  app.post("/api/clients", async (req, res) => {
    try {
      const actor = getActorFromHeaders(req);
      const { clientType } = req.body;

      let validatedData;
      if (clientType === "PRIVATE") {
        validatedData = createPrivateClientSchema.parse(req.body);
      } else if (clientType === "GOVERNMENT") {
        validatedData = createGovernmentClientSchema.parse(req.body);
      } else {
        return res.status(400).json({ message: "Invalid client type" });
      }

      // Check for existing client
      let existingClient;
      if (clientType === "PRIVATE") {
        const privateData = validatedData as z.infer<typeof createPrivateClientSchema>;
        const existing = await storage.searchClients({ pan: privateData.pan });
        existingClient = existing[0];
      } else {
        const govData = validatedData as z.infer<typeof createGovernmentClientSchema>;
        const govClientId = generateGovClientId(
          govData.orgName,
          govData.officeCode,
          govData.officialEmailOrLetterNo
        );
        const existing = await storage.searchClients({ govClientId });
        existingClient = existing[0];
      }

      if (existingClient) {
        const activeLink = await storage.getActiveClientDealerLink(existingClient.id);
        if (activeLink) {
          return res.status(409).json({
            code: "CLIENT_ACTIVE_ELSEWHERE",
            message: "Client is already active with another dealer",
            dealerName: activeLink.dealers.outletName,
            since: activeLink.client_dealer_links.dateOfOnboarding,
          });
        }
      }

      // Create client
      const clientData: any = {
        clientType: validatedData.clientType,
        name: validatedData.name,
        contactPerson: (validatedData as any).contactPerson || null,
        mobile: validatedData.mobile || null,
        email: validatedData.email || null,
        address: validatedData.address || null,
        gstin: validatedData.gstin || null,
      };

      if (clientType === "PRIVATE") {
        const privateData = validatedData as z.infer<typeof createPrivateClientSchema>;
        clientData.pan = privateData.pan;
      } else {
        const govData = validatedData as z.infer<typeof createGovernmentClientSchema>;
        clientData.govClientId = generateGovClientId(
          govData.orgName,
          govData.officeCode,
          govData.officialEmailOrLetterNo
        );
      }

      const client = existingClient || await storage.createClient(clientData);

      // Create dealer link
      await storage.createClientDealerLink(client.id, validatedData.dealerId, new Date());

      // Create vehicles
      if (validatedData.vehicles && validatedData.vehicles.length > 0) {
        await Promise.all(
          validatedData.vehicles.map((registration: string) =>
            storage.createVehicle({
              clientId: client.id,
              registrationNumber: registration.toUpperCase(),
            })
          )
        );
      }

      await logAudit(actor, "CREATE", "CLIENT", client.id, validatedData);
      
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create client" });
      }
    }
  });

  app.get("/api/clients/search", async (req, res) => {
    try {
      const { pan, govId, vehicle, name, org } = req.query;
      
      if (!pan && !govId && !vehicle && !name && !org) {
        return res.status(400).json({ message: "At least one search parameter is required" });
      }

      const clients = await storage.searchClients({
        pan: pan as string,
        govClientId: govId as string,
        vehicle: vehicle as string,
        name: (name || org) as string,
      });

      // Get additional details for each client
      const results = await Promise.all(
        clients.map(async (client) => {
          const vehicles = await storage.getVehiclesByClientId(client.id);
          const activeLink = await storage.getActiveClientDealerLink(client.id);
          return { ...client, vehicles, activeLink };
        })
      );

      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search clients" });
    }
  });

  app.post("/api/clients/:id/vehicles", async (req, res) => {
    try {
      const actor = getActorFromHeaders(req);
      const { registrationNumber } = req.body;
      
      if (!registrationNumber) {
        return res.status(400).json({ message: "Registration number is required" });
      }

      const vehicle = await storage.createVehicle({
        clientId: req.params.id,
        registrationNumber: registrationNumber.toUpperCase(),
      });

      await logAudit(actor, "ADD_VEHICLE", "CLIENT", req.params.id, { registrationNumber });
      
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to add vehicle" });
    }
  });

  // Transfers
  app.post("/api/transfers", async (req, res) => {
    try {
      const actor = getActorFromHeaders(req);
      const { clientId, fromDealerId, toDealerId, reason } = req.body;
      
      if (!clientId || !fromDealerId || !toDealerId) {
        return res.status(400).json({ message: "Client ID, from dealer ID, and to dealer ID are required" });
      }

      const transfer = await storage.createTransferRequest({
        clientId,
        fromDealerId,
        toDealerId,
        reason: reason || null,
      });

      await logAudit(actor, "CREATE", "TRANSFER", transfer.id, req.body);
      
      res.json(transfer);
    } catch (error) {
      res.status(500).json({ message: "Failed to create transfer request" });
    }
  });

  app.post("/api/transfers/:id/approve", async (req, res) => {
    try {
      const actor = getActorFromHeaders(req);
      
      await storage.approveTransfer(req.params.id);
      await logAudit(actor, "APPROVE", "TRANSFER", req.params.id);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve transfer" });
    }
  });

  app.post("/api/transfers/:id/reject", async (req, res) => {
    try {
      const actor = getActorFromHeaders(req);
      
      await storage.rejectTransfer(req.params.id);
      await logAudit(actor, "REJECT", "TRANSFER", req.params.id);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to reject transfer" });
    }
  });

  app.get("/api/transfers", async (req, res) => {
    try {
      const transfers = await storage.getTransferRequests();
      res.json(transfers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transfers" });
    }
  });

  // Search aliases
  app.get("/api/search/employee", async (req, res) => {
    return app._router.handle({ ...req, url: "/api/employees/search" }, res);
  });

  app.get("/api/search/client", async (req, res) => {
    return app._router.handle({ ...req, url: "/api/clients/search" }, res);
  });

  // Audit logs
  app.get("/api/audit", async (req, res) => {
    try {
      const { entity, id, page = 1 } = req.query;
      const filters: any = {};
      if (entity) filters.entity = entity as string;
      if (id) filters.entityId = id as string;

      const logs = await storage.getAuditLogs(filters);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Oil price search endpoint
  app.get("/api/oil-prices/search", async (req, res) => {
    try {
      const { location } = req.query;
      
      if (!location || typeof location !== 'string') {
        return res.status(400).json({ message: "Location parameter is required" });
      }

      console.log(`Searching oil prices for: ${location}`);
      
      // In a real implementation, you would integrate with:
      // - Energy Information Administration (EIA) API
      // - GasBuddy API 
      // - Local petroleum ministry APIs
      // For demo, we'll simulate realistic prices based on global averages
      
      const mockPrices = {
        location: location,
        currency: "USD",
        lastUpdated: new Date().toISOString(),
        prices: {
          petrol: {
            regular: (Math.random() * 0.5 + 1.2).toFixed(3), // $1.20-$1.70 per liter
            premium: (Math.random() * 0.5 + 1.4).toFixed(3), // $1.40-$1.90 per liter
          },
          diesel: (Math.random() * 0.4 + 1.1).toFixed(3), // $1.10-$1.50 per liter
          lpg: (Math.random() * 0.3 + 0.6).toFixed(3), // $0.60-$0.90 per liter
        },
        trend: Math.random() > 0.5 ? "up" : "down",
        changePercent: (Math.random() * 10 - 5).toFixed(2), // -5% to +5%
      };

      // Add location-specific adjustments for realism
      const locationLower = location.toLowerCase();
      let regionMultiplier = 1.0;
      
      if (locationLower.includes('norway') || locationLower.includes('switzerland')) {
        regionMultiplier = 1.8; // Higher prices in expensive countries
      } else if (locationLower.includes('saudi') || locationLower.includes('venezuela') || locationLower.includes('iran')) {
        regionMultiplier = 0.3; // Lower prices in oil-producing countries
      } else if (locationLower.includes('usa') || locationLower.includes('america')) {
        regionMultiplier = 0.9; // Slightly lower than global average
      } else if (locationLower.includes('india') || locationLower.includes('kashmir')) {
        regionMultiplier = 1.1; // Moderate prices
      }

      // Apply regional multiplier
      mockPrices.prices.petrol.regular = (parseFloat(mockPrices.prices.petrol.regular) * regionMultiplier).toFixed(3);
      mockPrices.prices.petrol.premium = (parseFloat(mockPrices.prices.petrol.premium) * regionMultiplier).toFixed(3);
      mockPrices.prices.diesel = (parseFloat(mockPrices.prices.diesel) * regionMultiplier).toFixed(3);
      mockPrices.prices.lpg = (parseFloat(mockPrices.prices.lpg) * regionMultiplier).toFixed(3);

      res.json(mockPrices);
    } catch (error) {
      console.error("Error fetching oil prices:", error);
      res.status(500).json({ message: "Failed to fetch oil prices" });
    }
  });

  // Get Srinagar local prices (default)
  app.get("/api/oil-prices/local", async (req, res) => {
    try {
      // Generate realistic price variations
      const basePrice = 106.80; // Base petrol price for Srinagar
      const variation = Math.random() * 1.5 - 0.75; // ±0.75 rupee variation
      const currentPrice = basePrice + variation;
      
      const kashmirPrices = {
        location: "Srinagar, Jammu and Kashmir",
        currency: "INR",
        currentPrice: parseFloat(currentPrice.toFixed(2)),
        previousPrice: parseFloat((currentPrice - 0.40).toFixed(2)),
        change: "+0.40",
        changePercent: "+0.37%",
        lastUpdated: new Date().toISOString(),
        marketOpen: true,
        regional: {
          "Srinagar": parseFloat(currentPrice.toFixed(2)),
          "Jammu": parseFloat((currentPrice - 0.50).toFixed(2)),
          "Leh": parseFloat((currentPrice + 1.80).toFixed(2)),
          "Anantnag": parseFloat((currentPrice + 0.30).toFixed(2)),
        }
      };

      res.json(kashmirPrices);
    } catch (error) {
      console.error("Error fetching local prices:", error);
      res.status(500).json({ message: "Failed to fetch local prices" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
