import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Users, Building, History, ArrowRightLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dealerId: string;
  dealerName?: string;
  status: string;
  dateRegistered: string;
  transferHistory?: Array<{
    fromDealerId: string;
    toDealerId: string;
    date: string;
    reason: string;
  }>;
}

export default function GlobalClientSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    enabled: isSearchActive && searchQuery.length > 0,
  });

  const { data: searchResults } = useQuery<{ clients: Client[] }>({
    queryKey: ["/api/search", { type: "clients", query: searchQuery }],
    enabled: isSearchActive && searchQuery.length > 2,
  });

  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      setIsSearchActive(true);
    }
  };

  const filteredClients = searchResults?.clients?.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  ) || clients?.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  ) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Client Search
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Search for clients across all dealers to check registration history and current assignments
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

        {isSearchActive && filteredClients.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredClients.map((client) => (
              <Card key={client.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{client.name}</h4>
                      <p className="text-sm text-muted-foreground">{client.address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{client.dealerName || `Dealer ID: ${client.dealerId}`}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <History className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Registered: {new Date(client.dateRegistered).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={client.status === "ACTIVE" ? "default" : "secondary"}
                  >
                    {client.status}
                  </Badge>
                </div>
                <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                  <p>Email: {client.email}</p>
                  <p>Phone: {client.phone}</p>
                </div>
                {client.transferHistory && client.transferHistory.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Transfer History</span>
                    </div>
                    <div className="space-y-1">
                      {client.transferHistory.slice(0, 3).map((transfer, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          {new Date(transfer.date).toLocaleDateString()}: {transfer.reason}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {isSearchActive && searchQuery && filteredClients.length === 0 && !isLoading && (
          <div className="text-center py-4 text-muted-foreground">
            No clients found matching "{searchQuery}"
          </div>
        )}
      </CardContent>
    </Card>
  );
}