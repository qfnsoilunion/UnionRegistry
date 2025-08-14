import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Building, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function QuickSearch() {
  const [employeeSearch, setEmployeeSearch] = useState({
    aadhaar: "",
    name: "", 
    mobile: "",
  });

  const [clientSearch, setClientSearch] = useState({
    pan: "",
    vehicle: "",
    name: "",
    org: "",
  });

  const handleEmployeeSearch = () => {
    // TODO: Implement employee search
    console.log("Employee search:", employeeSearch);
  };

  const handleClientSearch = () => {
    // TODO: Implement client search  
    console.log("Client search:", clientSearch);
  };

  return (
    <motion.section 
      className="py-16 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Quick Search
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-50">
            <CardContent className="p-6">
              <Tabs defaultValue="employee" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="employee" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Employee Search</span>
                  </TabsTrigger>
                  <TabsTrigger value="client" className="flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span>Client Search</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="employee" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Aadhaar Number"
                      value={employeeSearch.aadhaar}
                      onChange={(e) => setEmployeeSearch(prev => ({ ...prev, aadhaar: e.target.value }))}
                    />
                    <Input
                      placeholder="Name"
                      value={employeeSearch.name}
                      onChange={(e) => setEmployeeSearch(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Mobile Number"
                      value={employeeSearch.mobile}
                      onChange={(e) => setEmployeeSearch(prev => ({ ...prev, mobile: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleEmployeeSearch} className="w-full md:w-auto">
                    <Search className="w-4 h-4 mr-2" />
                    Search Employee
                  </Button>
                </TabsContent>
                
                <TabsContent value="client" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="PAN Number"
                      value={clientSearch.pan}
                      onChange={(e) => setClientSearch(prev => ({ ...prev, pan: e.target.value }))}
                    />
                    <Input
                      placeholder="Vehicle Registration"
                      value={clientSearch.vehicle}
                      onChange={(e) => setClientSearch(prev => ({ ...prev, vehicle: e.target.value }))}
                    />
                    <Input
                      placeholder="Client Name"
                      value={clientSearch.name}
                      onChange={(e) => setClientSearch(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Organization Name"
                      value={clientSearch.org}
                      onChange={(e) => setClientSearch(prev => ({ ...prev, org: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleClientSearch} className="w-full md:w-auto">
                    <Search className="w-4 h-4 mr-2" />
                    Search Client
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}
