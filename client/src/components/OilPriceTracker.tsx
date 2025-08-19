import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Fuel,
  Globe,
  Clock,
  IndianRupee,
  DollarSign,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OilPrices {
  location: string;
  currency: string;
  lastUpdated: string;
  prices: {
    petrol: {
      regular: string;
      premium: string;
    };
    diesel: string;
    lpg: string;
  };
  trend: "up" | "down" | "stable";
  changePercent: string;
  government_subsidy?: boolean;
}

export default function OilPriceTracker() {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Fetch local Kashmir prices by default
  const { data: localPrices, isLoading: localLoading } = useQuery<OilPrices>({
    queryKey: ["/api/oil-prices/local"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  // Fetch searched location prices
  const { data: searchPrices, isLoading: searchLoading, refetch } = useQuery<OilPrices>({
    queryKey: ["/api/oil-prices/search", selectedLocation],
    enabled: !!selectedLocation,
    refetchInterval: 300000,
  });

  const handleSearch = () => {
    if (searchLocation.trim()) {
      setSelectedLocation(searchLocation.trim());
      refetch();
    }
  };

  const displayPrices = searchPrices || localPrices;
  const isLoading = searchLoading || localLoading;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCurrencyIcon = (currency: string) => {
    return currency === "INR" ? <IndianRupee className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />;
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Global Oil Price Intelligence
        </h2>
        <p className="text-blue-100 text-lg">
          Real-time petroleum pricing from around the world
        </p>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <Input
                  placeholder="Search prices for any location (e.g., New York, London, Dubai)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-blue-200"
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={!searchLocation.trim() || isLoading}
                className="bg-secondary hover:bg-secondary/90"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Price Display */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        {isLoading ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
              <p className="text-white">Fetching latest prices...</p>
            </CardContent>
          </Card>
        ) : displayPrices ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <CardTitle className="text-white text-xl">
                    {displayPrices.location}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-blue-200">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      Last updated: {new Date(displayPrices.lastUpdated).toLocaleTimeString()}
                    </span>
                  </div>
                  {displayPrices.government_subsidy && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-500/30">
                      Subsidized
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Petrol */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Fuel className="w-5 h-5 text-red-400" />
                    <h3 className="text-white font-semibold">Petrol</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-200 text-sm">Regular</span>
                        <div className="flex items-center gap-1">
                          {getCurrencyIcon(displayPrices.currency)}
                          <span className="text-white font-bold">
                            {displayPrices.prices.petrol.regular}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-200 text-sm">Premium</span>
                        <div className="flex items-center gap-1">
                          {getCurrencyIcon(displayPrices.currency)}
                          <span className="text-white font-bold">
                            {displayPrices.prices.petrol.premium}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diesel */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Fuel className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-white font-semibold">Diesel</h3>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200 text-sm">Per Liter</span>
                      <div className="flex items-center gap-1">
                        {getCurrencyIcon(displayPrices.currency)}
                        <span className="text-white font-bold">
                          {displayPrices.prices.diesel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LPG */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Fuel className="w-5 h-5 text-blue-400" />
                    <h3 className="text-white font-semibold">LPG</h3>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200 text-sm">
                        Per {displayPrices.currency === "INR" ? "Kg" : "Liter"}
                      </span>
                      <div className="flex items-center gap-1">
                        {getCurrencyIcon(displayPrices.currency)}
                        <span className="text-white font-bold">
                          {displayPrices.prices.lpg}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/20" />

              {/* Trend Information */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  {getTrendIcon(displayPrices.trend)}
                  <span className="text-white font-medium">
                    {displayPrices.changePercent}% 
                    {displayPrices.trend === "up" && " increase"}
                    {displayPrices.trend === "down" && " decrease"}
                    {displayPrices.trend === "stable" && " change"}
                  </span>
                </div>
                <span className="text-blue-200 text-sm">from last week</span>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </motion.div>

      {/* Quick Location Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-4">
          <h3 className="text-white font-semibold mb-3">Popular Locations</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {["New York", "London", "Dubai", "Saudi Arabia", "Norway", "Delhi", "Mumbai"].map((location) => (
              <Button
                key={location}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchLocation(location);
                  setSelectedLocation(location);
                }}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {location}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}