import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users,
  Building,
  Search,
  Plus,
  UserPlus,
  UserMinus,
  Truck,
} from "lucide-react";

import { api, type HomeMetrics } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddEmployeeForm from "../components/Forms/AddEmployeeForm";
import AddClientForm from "../components/Forms/AddClientForm";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "employees", label: "Employees", icon: Users },
  { id: "clients", label: "Clients", icon: Building },
  { id: "search", label: "Search", icon: Search },
];

export default function DealerDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);

  const { data: metrics } = useQuery<HomeMetrics>({
    queryKey: ["/api/metrics/home"],
    refetchInterval: 30000,
  });

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
          <h2 className="font-semibold text-lg text-slate-900">Dealer Portal</h2>
          <p className="text-sm text-slate-600">Hilal Petroleum, Srinagar</p>
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
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
              <p className="text-slate-600">Manage your dealership operations</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Active Employees</p>
                      <p className="text-2xl font-bold text-slate-900">24</p>
                    </div>
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Active Clients</p>
                      <p className="text-2xl font-bold text-slate-900">156</p>
                    </div>
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Recent Joiners</p>
                      <p className="text-2xl font-bold text-slate-900">3</p>
                    </div>
                    <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Recent Separations</p>
                      <p className="text-2xl font-bold text-slate-900">1</p>
                    </div>
                    <div className="w-12 h-12 bg-neutral rounded-lg flex items-center justify-center">
                      <UserMinus className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Employee Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">System ready for employee management</p>
                        <p className="text-xs text-slate-600">Add your first employee to get started</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Client Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Building className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">System ready for client management</p>
                        <p className="text-xs text-slate-600">Add your first client to get started</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {activeSection === "employees" && (
          <motion.div 
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Employee Management</h1>
                <p className="text-slate-600">Manage your dealership employees</p>
              </div>
              <Button onClick={() => setShowAddEmployee(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </div>

            {/* Search Employees */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Search Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    placeholder="Aadhaar Number" 
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input 
                    type="text" 
                    placeholder="Name" 
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input 
                    type="text" 
                    placeholder="Mobile Number" 
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <Button className="mt-4">
                  <Search className="w-4 h-4 mr-2" />
                  Search Employee
                </Button>
              </CardContent>
            </Card>

            {/* Employees List */}
            <Card>
              <CardHeader>
                <CardTitle>Current Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 text-center py-8">No employees found. Add your first employee to get started.</p>
              </CardContent>
            </Card>

            <AddEmployeeForm
              open={showAddEmployee}
              onClose={() => setShowAddEmployee(false)}
            />
          </motion.div>
        )}

        {activeSection === "clients" && (
          <motion.div 
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Client Management</h1>
                <p className="text-slate-600">Manage your dealership clients</p>
              </div>
              <Button onClick={() => setShowAddClient(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </div>

            {/* Clients Table */}
            <Card>
              <CardHeader>
                <CardTitle>Active Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 text-center py-8">No clients found. Add your first client to get started.</p>
              </CardContent>
            </Card>

            <AddClientForm
              open={showAddClient}
              onClose={() => setShowAddClient(false)}
            />
          </motion.div>
        )}

        {activeSection === "search" && (
          <motion.div 
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Search Registry</h1>
              <p className="text-slate-600">Search for employees and clients across the system</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <p className="text-slate-500 text-center">Search interface coming soon...</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
