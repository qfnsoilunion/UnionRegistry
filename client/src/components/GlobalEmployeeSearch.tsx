import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, User, Building, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  dealerId: string;
  dealerName?: string;
  status: string;
  dateJoined: string;
}

export default function GlobalEmployeeSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
    enabled: isSearchActive && searchQuery.length > 0,
  });

  const { data: searchResults } = useQuery<{ persons: Employee[] }>({
    queryKey: ["/api/search", { type: "persons", query: searchQuery }],
    enabled: isSearchActive && searchQuery.length > 2,
  });

  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      setIsSearchActive(true);
    }
  };

  const filteredEmployees = searchResults?.persons?.filter(emp => 
    emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || employees?.filter(emp => 
    emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Employee Search
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Search for employees across all dealers to check employment history and current status
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-4">Searching...</div>
        )}

        {isSearchActive && filteredEmployees.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">
                        {employee.firstName} {employee.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{employee.dealerName || `Dealer ID: ${employee.dealerId}`}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <History className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Joined: {new Date(employee.dateJoined).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={employee.status === "ACTIVE" ? "default" : "secondary"}
                  >
                    {employee.status}
                  </Badge>
                </div>
                <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                  <p>Email: {employee.email}</p>
                  <p>Phone: {employee.phone}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {isSearchActive && searchQuery && filteredEmployees.length === 0 && !isLoading && (
          <div className="text-center py-4 text-muted-foreground">
            No employees found matching "{searchQuery}"
          </div>
        )}
      </CardContent>
    </Card>
  );
}