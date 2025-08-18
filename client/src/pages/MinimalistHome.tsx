import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  MapPin,
  Phone,
  Mail,
  Clock,
  Fuel,
  Navigation,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

// Sample petrol pump data for Kashmir Valley
const petrolPumps = [
  {
    id: 1,
    name: "Kashmir Fuel Station",
    location: "Srinagar",
    lat: 34.0837,
    lng: 74.7973,
    address: "Lal Chowk, Srinagar 190001",
    phone: "+91-194-2459876",
    hours: "6:00 AM - 10:00 PM",
    services: ["Petrol", "Diesel", "CNG"],
    dealer: "Mohammad Ali"
  },
  {
    id: 2,
    name: "Valley Petroleum",
    location: "Anantnag",
    lat: 33.7311,
    lng: 75.1487,
    address: "NH-44, Anantnag 192101",
    phone: "+91-193-2223456",
    hours: "24/7",
    services: ["Petrol", "Diesel"],
    dealer: "Javid Ahmad"
  },
  {
    id: 3,
    name: "Paradise Fuel Point",
    location: "Baramulla",
    lat: 34.2096,
    lng: 74.3436,
    address: "Main Road, Baramulla 193101",
    phone: "+91-195-2234567",
    hours: "5:00 AM - 11:00 PM",
    services: ["Petrol", "Diesel", "Service Station"],
    dealer: "Bashir Ahmed"
  },
  {
    id: 4,
    name: "Chinar Petroleum",
    location: "Pulwama",
    lat: 33.8744,
    lng: 74.8944,
    address: "Pulwama Town 192301",
    phone: "+91-193-3345678",
    hours: "6:00 AM - 9:00 PM",
    services: ["Petrol", "Diesel"],
    dealer: "Tariq Shah"
  },
  {
    id: 5,
    name: "Dal Lake Fuel Station",
    location: "Srinagar",
    lat: 34.1202,
    lng: 74.8543,
    address: "Boulevard Road, Srinagar 190001",
    phone: "+91-194-2456789",
    hours: "6:00 AM - 10:00 PM",
    services: ["Petrol", "Diesel", "CNG"],
    dealer: "Farooq Abdullah"
  },
  {
    id: 6,
    name: "Gulmarg Petroleum",
    location: "Gulmarg",
    lat: 34.0484,
    lng: 74.3804,
    address: "Gulmarg Road 193403",
    phone: "+91-195-4567890",
    hours: "7:00 AM - 8:00 PM",
    services: ["Petrol", "Diesel"],
    dealer: "Imran Khan"
  }
];

export default function MinimalistHome() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedPump, setSelectedPump] = useState<typeof petrolPumps[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredPump, setHoveredPump] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredPumps = petrolPumps.filter(pump =>
    pump.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pump.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pump.dealer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate position on map (simplified for demo)
  const getMapPosition = (lat: number, lng: number) => {
    // Normalize coordinates to map dimensions
    const mapWidth = 100; // percentage
    const mapHeight = 100; // percentage
    
    // Kashmir Valley approximate bounds
    const minLat = 33.5;
    const maxLat = 34.5;
    const minLng = 74.0;
    const maxLng = 75.5;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth;
    const y = ((maxLat - lat) / (maxLat - minLat)) * mapHeight;
    
    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Union Registry</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-900 hover:text-blue-600 transition-colors">Home</a>
              <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="/role" className="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</a>
              <a href="/admin/login" className="text-gray-600 hover:text-blue-600 transition-colors">Admin</a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="flex flex-col space-y-1 px-4 py-2">
              <a href="/" className="py-2 text-gray-900 hover:text-blue-600">Home</a>
              <a href="/about" className="py-2 text-gray-600 hover:text-blue-600">About</a>
              <a href="/role" className="py-2 text-gray-600 hover:text-blue-600">Dashboard</a>
              <a href="/admin/login" className="py-2 text-gray-600 hover:text-blue-600">Admin</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kashmir Valley Petroleum Network
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Find petrol pumps across Kashmir Valley. Click on any location to view details.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, location, or dealer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 rounded-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Map and List */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <Card className="p-4 bg-white border-gray-200">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Interactive Map</h3>
                <p className="text-sm text-gray-600">Click on markers to view pump details</p>
              </div>
              
              {/* Simplified Kashmir Map */}
              <div 
                ref={mapRef}
                className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-[400px] md:h-[500px] overflow-hidden"
              >
                {/* Map Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="1"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Kashmir Valley Shape (Simplified) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <path
                    d="M 20,30 Q 30,20 50,25 T 80,30 L 75,70 Q 50,75 25,70 Z"
                    fill="rgba(59, 130, 246, 0.1)"
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="0.5"
                  />
                  <text x="50" y="50" textAnchor="middle" className="text-xs fill-gray-600">
                    Kashmir Valley
                  </text>
                </svg>

                {/* Petrol Pump Markers */}
                {filteredPumps.map((pump) => {
                  const position = getMapPosition(pump.lat, pump.lng);
                  return (
                    <motion.div
                      key={pump.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: pump.id * 0.1 }}
                      className="absolute cursor-pointer"
                      style={{ left: position.x, top: position.y, transform: 'translate(-50%, -50%)' }}
                      onClick={() => setSelectedPump(pump)}
                      onMouseEnter={() => setHoveredPump(pump.id)}
                      onMouseLeave={() => setHoveredPump(null)}
                    >
                      <div className={`relative ${selectedPump?.id === pump.id ? 'z-20' : 'z-10'}`}>
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center transition-all
                          ${selectedPump?.id === pump.id 
                            ? 'bg-blue-600 scale-125' 
                            : hoveredPump === pump.id 
                              ? 'bg-blue-500 scale-110'
                              : 'bg-blue-400'
                          }
                        `}>
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        
                        {/* Hover Tooltip */}
                        {hoveredPump === pump.id && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                            {pump.name}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Selected Pump Popup */}
                {selectedPump && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-30"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900">{selectedPump.name}</h4>
                      <button
                        onClick={() => setSelectedPump(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <span className="text-gray-600">{selectedPump.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{selectedPump.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{selectedPump.hours}</span>
                      </div>
                      <div className="flex items-center">
                        <Fuel className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{selectedPump.services.join(", ")}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Dealer: {selectedPump.dealer}</p>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => {
                        // Navigate to dealer details
                        window.location.href = `/dealer?id=${selectedPump.id}`;
                      }}
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </Card>
          </div>

          {/* Pump List */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-white border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Petrol Pumps ({filteredPumps.length})
              </h3>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {filteredPumps.map((pump) => (
                  <motion.div
                    key={pump.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: pump.id * 0.05 }}
                    onClick={() => setSelectedPump(pump)}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedPump?.id === pump.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{pump.name}</h4>
                      <Navigation className={`w-4 h-4 ${
                        selectedPump?.id === pump.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <MapPin className="inline w-3 h-3 mr-1" />
                      {pump.location}
                    </p>
                    <p className="text-xs text-gray-500">
                      Dealer: {pump.dealer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-white border-gray-200 hover:shadow-md transition-shadow">
                <Fuel className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Find Stations</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Locate petrol pumps near you with real-time availability
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Search Now
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-white border-gray-200 hover:shadow-md transition-shadow">
                <Navigation className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Get Directions</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Navigate to any petrol pump with turn-by-turn directions
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Navigate
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-white border-gray-200 hover:shadow-md transition-shadow">
                <Phone className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get help from our 24/7 customer support team
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Us
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-gray-900">Union Registry</h3>
              <p className="text-sm text-gray-600">Kashmir Valley Tank Owners & Petroleum Dealers</p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="/about" className="text-sm text-gray-600 hover:text-blue-600">About</a>
              <a href="/role" className="text-sm text-gray-600 hover:text-blue-600">Dashboard</a>
              <a href="/admin/login" className="text-sm text-gray-600 hover:text-blue-600">Admin</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">© 2025 Union Registry. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}