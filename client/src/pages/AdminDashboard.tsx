import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Store,
  Users,
  Building,
  ArrowRightLeft,
  FileText,
  Plus,
  TrendingUp,
  UserPlus,
  Check,
  X,
  Shield,
} from "lucide-react";

import { api, type HomeMetrics, type Dealer, type TransferRequest } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from "../components/DataTable";
import AddDealerForm from "../components/Forms/AddDealerForm";
import AdminLogin from "../components/AdminLogin";
import CreateDealerProfile from "../components/CreateDealerProfile";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "dealers", label: "Dealers", icon: Store },
  { id: "employees", label: "Employees", icon: Users },
  { id: "clients", label: "Clients", icon: Building },
  { id: "transfers", label: "Transfers", icon: ArrowRightLeft },
  { id: "audit", label: "Audit Logs", icon: FileText },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [showAddDealer, setShowAddDealer] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDealerProfile, setShowDealerProfile] = useState(false);
  const [selectedDealerForProfile, setSelectedDealerForProfile] = useState<string | null>(null);

  const { data: metrics } = useQuery<HomeMetrics>({
    queryKey: ["/api/metrics/home"],
    refetchInterval: 30000,
  });

  const { data: dealers } = useQuery<Dealer[]>({
    queryKey: ["/api/admin/dealers"],
  });

  const { data: transfers } = useQuery<TransferRequest[]>({
    queryKey: ["/api/transfers"],
  });

  const pendingTransfers = transfers?.filter(t => t.status === "PENDING") || [];

  // Check if admin is authenticated
  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <motion.div 
        className="w-64 bg-white shadow-sm border-r border-slate-200"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 border-b border-slate-200">
          <h2 className="font-semibold text-lg text-slate-900">Admin Portal</h2>
          <p className="text-sm text-slate-600">System Administration</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <Button
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection(item.id)}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeSection === "overview" && (
          <motion.div 
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">System Overview</h1>
              <p className="text-slate-600">Monitor and manage the entire union registry</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Active Dealers</p>
                      <p className="text-2xl font-bold text-slate-900">{metrics?.activeDealers || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="secondary" className="text-accent bg-accent/10">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Employees</p>
                      <p className="text-2xl font-bold text-slate-900">{metrics?.activeEmployees || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="secondary" className="text-accent bg-accent/10">
                      +{metrics?.todaysJoins || 0} today
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Active Clients</p>
                      <p className="text-2xl font-bold text-slate-900">{metrics?.activeClients || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="secondary" className="text-accent bg-accent/10">
                      Active registrations
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Pending Transfers</p>
                      <p className="text-2xl font-bold text-slate-900">{pendingTransfers.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-neutral rounded-lg flex items-center justify-center">
                      <ArrowRightLeft className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    {pendingTransfers.length > 0 ? (
                      <Badge variant="destructive">Requires attention</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-accent bg-accent/10">
                        All clear
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <UserPlus className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">System initialized</p>
                      <p className="text-xs text-slate-600">Union registry system is now operational</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeSection === "dealers" && (
          <motion.div 
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Dealer Management</h1>
                <p className="text-slate-600">Manage registered petroleum dealers</p>
              </div>
              <Button onClick={() => setShowAddDealer(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Dealer
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Dealers</CardTitle>
              </CardHeader>
              <CardContent>
                {dealers && (
                  <DataTable
                    data={dealers}
                    columns={[
                      {
                        header: "Dealer",
                        accessorKey: "outletName",
                        cell: ({ row }) => (
                          <div>
                            <div className="font-medium">{row.original.outletName}</div>
                            <div className="text-sm text-slate-500">{row.original.legalName}</div>
                          </div>
                        ),
                      },
                      {
                        header: "Location",
                        accessorKey: "location",
                      },
                      {
                        header: "Status",
                        accessorKey: "status",
                        cell: ({ row }) => (
                          <Badge variant={row.original.status === "ACTIVE" ? "default" : "secondary"}>
                            {row.original.status}
                          </Badge>
                        ),
                      },
                      {
                        header: "Actions",
                        id: "actions",
                        cell: ({ row }) => (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDealerForProfile(row.original.id);
                              setShowDealerProfile(true);
                            }}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Create Profile
                          </Button>
                        ),
                      },
                    ]}
                  />
                )}
              </CardContent>
            </Card>

            <AddDealerForm
              open={showAddDealer}
              onClose={() => setShowAddDealer(false)}
            />
            
            {selectedDealerForProfile && (
              <CreateDealerProfile
                open={showDealerProfile}
                onClose={() => {
                  setShowDealerProfile(false);
                  setSelectedDealerForProfile(null);
                }}
                dealerId={selectedDealerForProfile}
                dealerName={dealers?.find(d => d.id === selectedDealerForProfile)?.outletName || ""}
              />
            )}
          </motion.div>
        )}

        {activeSection === "transfers" && (
          <motion.div 
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Transfer Requests</h1>
              <p className="text-slate-600">Review and approve client transfer requests</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingTransfers.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No pending transfer requests</p>
                ) : (
                  <div className="space-y-4">
                    {pendingTransfers.map((transfer) => (
                      <div key={transfer.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-slate-900">Transfer Request</h4>
                            <p className="text-sm text-slate-600">ID: {transfer.id}</p>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-slate-700">From:</p>
                            <p className="text-sm text-slate-600">Dealer ID: {transfer.fromDealerId}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">To:</p>
                            <p className="text-sm text-slate-600">Dealer ID: {transfer.toDealerId}</p>
                          </div>
                        </div>
                        {transfer.reason && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-slate-700">Reason:</p>
                            <p className="text-sm text-slate-600">{transfer.reason}</p>
                          </div>
                        )}
                        <div className="flex space-x-3">
                          <Button 
                            size="sm" 
                            className="bg-accent hover:bg-accent/90"
                            onClick={() => {
                              // TODO: Implement approve transfer
                              console.log("Approve transfer:", transfer.id);
                            }}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => {
                              // TODO: Implement reject transfer
                              console.log("Reject transfer:", transfer.id);
                            }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Other sections can be implemented similarly */}
        {activeSection === "employees" && (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Employee Management</h1>
            <p className="text-slate-600 mb-6">View all employees across the system</p>
            <Card>
              <CardContent className="p-6">
                <p className="text-slate-500 text-center">Employee management interface coming soon...</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === "clients" && (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Client Management</h1>
            <p className="text-slate-600 mb-6">View all clients across the system</p>
            <Card>
              <CardContent className="p-6">
                <p className="text-slate-500 text-center">Client management interface coming soon...</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === "audit" && (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Audit Logs</h1>
            <p className="text-slate-600 mb-6">View system activity and changes</p>
            <Card>
              <CardContent className="p-6">
                <p className="text-slate-500 text-center">Audit log interface coming soon...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
