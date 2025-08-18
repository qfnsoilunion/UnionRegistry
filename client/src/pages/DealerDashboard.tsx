import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users,
  Building,
  Search,
  Plus,
  UserPlus,
  UserMinus,
  Truck,
  AlertCircle,
} from "lucide-react";

import { api, type HomeMetrics, type Dealer, type Person, type Client, type EmploymentRecord } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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
  const [currentDealerId, setCurrentDealerId] = useState<string>("");
  const [searchParams, setSearchParams] = useState({
    aadhaar: "",
    name: "",
    mobile: "",
    clientPan: "",
    clientName: "",
    clientVehicle: "",
  });
  const [employeeSearchResults, setEmployeeSearchResults] = useState<any[]>([]);
  const [clientSearchResults, setClientSearchResults] = useState<Client[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: metrics } = useQuery<HomeMetrics>({
    queryKey: ["/api/metrics/home"],
    refetchInterval: 30000,
  });

  const { data: dealers } = useQuery<Dealer[]>({
    queryKey: ["/api/admin/dealers"],
  });

  // Set the first dealer as the current dealer (in a real app, this would come from login)
  useEffect(() => {
    if (dealers && dealers.length > 0 && !currentDealerId) {
      setCurrentDealerId(dealers[0].id);
    }
  }, [dealers, currentDealerId]);

  // Employee search function
  const handleEmployeeSearch = async () => {
    try {
      let searchUrl = "/api/employees/search?";
      const params = new URLSearchParams();
      
      if (searchParams.aadhaar) params.append("aadhaar", searchParams.aadhaar);
      if (searchParams.name) params.append("name", searchParams.name);
      if (searchParams.mobile) params.append("mobile", searchParams.mobile);
      
      if (params.toString()) {
        const response = await api.searchEmployees(params.toString());
        setEmployeeSearchResults(response);
        if (response.length === 0) {
          toast({
            title: "No Results",
            description: "No employees found matching your search criteria.",
          });
        }
      } else {
        toast({
          title: "Search Error",
          description: "Please enter at least one search criteria.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search employees. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Client search function
  const handleClientSearch = async () => {
    try {
      let searchUrl = "/api/clients/search?";
      const params = new URLSearchParams();
      
      if (searchParams.clientPan) params.append("pan", searchParams.clientPan);
      if (searchParams.clientName) params.append("name", searchParams.clientName);
      if (searchParams.clientVehicle) params.append("vehicleNumber", searchParams.clientVehicle);
      
      if (params.toString()) {
        const response = await api.searchClients(params.toString());
        setClientSearchResults(response);
        if (response.length === 0) {
          toast({
            title: "No Results",
            description: "No clients found matching your search criteria.",
          });
        }
      } else {
        toast({
          title: "Search Error",
          description: "Please enter at least one search criteria.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search clients. Please try again.",
        variant: "destructive",
      });
    }
  };

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
                      <p className="text-2xl font-bold text-slate-900">{metrics?.activeEmployees || 0}</p>
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
                      <p className="text-2xl font-bold text-slate-900">{metrics?.activeClients || 0}</p>
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
                      <p className="text-sm font-medium text-slate-600">Today's Joiners</p>
                      <p className="text-2xl font-bold text-slate-900">{metrics?.todaysJoins || 0}</p>
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
                      <p className="text-sm font-medium text-slate-600">Today's Separations</p>
                      <p className="text-2xl font-bold text-slate-900">{metrics?.todaysSeparations || 0}</p>
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
                  <Input 
                    type="text" 
                    placeholder="Aadhaar Number" 
                    value={searchParams.aadhaar}
                    onChange={(e) => setSearchParams({ ...searchParams, aadhaar: e.target.value })}
                  />
                  <Input 
                    type="text" 
                    placeholder="Name" 
                    value={searchParams.name}
                    onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
                  />
                  <Input 
                    type="text" 
                    placeholder="Mobile Number" 
                    value={searchParams.mobile}
                    onChange={(e) => setSearchParams({ ...searchParams, mobile: e.target.value })}
                  />
                </div>
                <Button className="mt-4" onClick={handleEmployeeSearch}>
                  <Search className="w-4 h-4 mr-2" />
                  Search Employee
                </Button>
              </CardContent>
            </Card>

            {/* Employees List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {employeeSearchResults.length > 0 ? "Search Results" : "Current Employees"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {employeeSearchResults.length > 0 ? (
                  <div className="space-y-4">
                    {employeeSearchResults.map((person) => (
                      <div key={person.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{person.name}</h3>
                            <p className="text-sm text-slate-600">Aadhaar: {person.aadhaar}</p>
                            <p className="text-sm text-slate-600">Mobile: {person.mobile || "N/A"}</p>
                            <p className="text-sm text-slate-600">Email: {person.email || "N/A"}</p>
                            {person.employments && person.employments.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Employment History:</p>
                                {person.employments.map((emp: any) => (
                                  <div key={emp.id} className="ml-4 mt-1">
                                    <Badge variant={emp.currentStatus === "ACTIVE" ? "default" : "secondary"}>
                                      {emp.currentStatus}
                                    </Badge>
                                    <span className="text-xs text-slate-600 ml-2">
                                      Joined: {new Date(emp.dateOfJoining).toLocaleDateString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">
                    No employees found. Add your first employee or search to find existing ones.
                  </p>
                )}
              </CardContent>
            </Card>

            <AddEmployeeForm
              open={showAddEmployee}
              onClose={() => {
                setShowAddEmployee(false);
                queryClient.invalidateQueries({ queryKey: ["/api/metrics/home"] });
              }}
              dealerId={currentDealerId}
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

            {/* Search Clients */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Search Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input 
                    type="text" 
                    placeholder="PAN Number" 
                    value={searchParams.clientPan}
                    onChange={(e) => setSearchParams({ ...searchParams, clientPan: e.target.value })}
                  />
                  <Input 
                    type="text" 
                    placeholder="Name" 
                    value={searchParams.clientName}
                    onChange={(e) => setSearchParams({ ...searchParams, clientName: e.target.value })}
                  />
                  <Input 
                    type="text" 
                    placeholder="Vehicle Number" 
                    value={searchParams.clientVehicle}
                    onChange={(e) => setSearchParams({ ...searchParams, clientVehicle: e.target.value })}
                  />
                </div>
                <Button className="mt-4" onClick={handleClientSearch}>
                  <Search className="w-4 h-4 mr-2" />
                  Search Client
                </Button>
              </CardContent>
            </Card>

            {/* Clients Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {clientSearchResults.length > 0 ? "Search Results" : "Active Clients"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {clientSearchResults.length > 0 ? (
                  <div className="space-y-4">
                    {clientSearchResults.map((client) => (
                      <div key={client.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{client.name}</h3>
                            <Badge variant={client.clientType === "PRIVATE" ? "default" : "secondary"}>
                              {client.clientType}
                            </Badge>
                            <p className="text-sm text-slate-600 mt-2">PAN: {client.pan || "N/A"}</p>
                            <p className="text-sm text-slate-600">Contact: {client.contactPerson || "N/A"}</p>
                            <p className="text-sm text-slate-600">Mobile: {client.mobile || "N/A"}</p>
                            <p className="text-sm text-slate-600">GSTIN: {client.gstin || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No clients found. Add your first client or search to find existing ones.</p>
                )}
              </CardContent>
            </Card>

            <AddClientForm
              open={showAddClient}
              onClose={() => {
                setShowAddClient(false);
                queryClient.invalidateQueries({ queryKey: ["/api/metrics/home"] });
              }}
              dealerId={currentDealerId}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Employee Search */}
              <Card>
                <CardHeader>
                  <CardTitle>Employee Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input 
                      type="text" 
                      placeholder="Search by Aadhaar" 
                      value={searchParams.aadhaar}
                      onChange={(e) => setSearchParams({ ...searchParams, aadhaar: e.target.value })}
                    />
                    <Input 
                      type="text" 
                      placeholder="Search by Name" 
                      value={searchParams.name}
                      onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
                    />
                    <Input 
                      type="text" 
                      placeholder="Search by Mobile" 
                      value={searchParams.mobile}
                      onChange={(e) => setSearchParams({ ...searchParams, mobile: e.target.value })}
                    />
                    <Button className="w-full" onClick={handleEmployeeSearch}>
                      <Search className="w-4 h-4 mr-2" />
                      Search Employees
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Client Search */}
              <Card>
                <CardHeader>
                  <CardTitle>Client Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input 
                      type="text" 
                      placeholder="Search by PAN" 
                      value={searchParams.clientPan}
                      onChange={(e) => setSearchParams({ ...searchParams, clientPan: e.target.value })}
                    />
                    <Input 
                      type="text" 
                      placeholder="Search by Name" 
                      value={searchParams.clientName}
                      onChange={(e) => setSearchParams({ ...searchParams, clientName: e.target.value })}
                    />
                    <Input 
                      type="text" 
                      placeholder="Search by Vehicle Number" 
                      value={searchParams.clientVehicle}
                      onChange={(e) => setSearchParams({ ...searchParams, clientVehicle: e.target.value })}
                    />
                    <Button className="w-full" onClick={handleClientSearch}>
                      <Search className="w-4 h-4 mr-2" />
                      Search Clients
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search Results */}
            {(employeeSearchResults.length > 0 || clientSearchResults.length > 0) && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {employeeSearchResults.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg mb-3">Employees</h3>
                      <div className="space-y-3">
                        {employeeSearchResults.map((person) => (
                          <div key={person.id} className="border rounded-lg p-3">
                            <p className="font-medium">{person.name}</p>
                            <p className="text-sm text-slate-600">Aadhaar: {person.aadhaar}</p>
                            <p className="text-sm text-slate-600">Mobile: {person.mobile || "N/A"}</p>
                            {person.employments && person.employments.length > 0 && (
                              <div className="mt-2">
                                {person.employments.map((emp: any) => (
                                  <Badge key={emp.id} variant={emp.currentStatus === "ACTIVE" ? "default" : "secondary"} className="mr-2">
                                    {emp.currentStatus}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {clientSearchResults.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Clients</h3>
                      <div className="space-y-3">
                        {clientSearchResults.map((client) => (
                          <div key={client.id} className="border rounded-lg p-3">
                            <p className="font-medium">{client.name}</p>
                            <Badge variant={client.clientType === "PRIVATE" ? "default" : "secondary"} className="mb-2">
                              {client.clientType}
                            </Badge>
                            <p className="text-sm text-slate-600">PAN: {client.pan || "N/A"}</p>
                            <p className="text-sm text-slate-600">Mobile: {client.mobile || "N/A"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
