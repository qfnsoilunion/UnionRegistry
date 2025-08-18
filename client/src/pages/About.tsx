import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Fuel, 
  Building2, 
  TrendingUp, 
  UserCheck, 
  UserMinus,
  Award,
  Globe,
  Shield,
  Target
} from "lucide-react";

// Animated counter component
function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  
  return <>{count.toLocaleString()}</>;
}

interface Metrics {
  activeDealers: number;
  activeEmployees: number;
  activeClients: number;
  todaysJoins: number;
  todaysSeparations: number;
}

export default function About() {
  const { data: metrics } = useQuery<Metrics>({
    queryKey: ["/api/metrics/home"],
  });

  const stats = [
    { 
      label: "Active Dealers", 
      value: metrics?.activeDealers || 0, 
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      label: "Active Employees", 
      value: metrics?.activeEmployees || 0, 
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      label: "Active Clients", 
      value: metrics?.activeClients || 0, 
      icon: Fuel,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      label: "Today's Joins", 
      value: metrics?.todaysJoins || 0, 
      icon: UserCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Unified Registry",
      description: "Central database for all petroleum dealers and tank owners across Kashmir Valley."
    },
    {
      icon: Globe,
      title: "Regional Coverage",
      description: "Complete coverage of all districts in Kashmir Valley with real-time data."
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Ensuring highest standards of service and compliance across all members."
    },
    {
      icon: Target,
      title: "Strategic Planning",
      description: "Data-driven insights for better resource allocation and growth planning."
    }
  ];

  const milestones = [
    { year: "1985", event: "Association Founded", description: "Established to unite petroleum dealers" },
    { year: "1995", event: "First Digital Registry", description: "Pioneered computerized record keeping" },
    { year: "2010", event: "Valley-wide Network", description: "Connected all districts digitally" },
    { year: "2025", event: "Modern Platform", description: "AI-powered management system launched" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About Union Registry
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Serving the Kashmir Valley's petroleum industry since 1985, we unite tank owners 
              and dealers to ensure energy security and economic prosperity for our region.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Building2 className="w-4 h-4 mr-2" />
                Established 1985
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Globe className="w-4 h-4 mr-2" />
                Kashmir Valley Wide
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Users className="w-4 h-4 mr-2" />
                500+ Members
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Our Impact in Numbers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="p-6 border-gray-200 hover:shadow-lg transition-shadow">
                      <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        <AnimatedCounter end={stat.value} />
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                The Kashmir Valley Tank Owners & Petroleum Dealers Association is committed to:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Ensuring fair business practices and ethical standards across the petroleum industry
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Facilitating smooth operations and supply chain management for all members
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Providing a unified voice for policy advocacy and regulatory compliance
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Supporting member growth through training, technology, and best practices
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative h-96 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center"
            >
              <div className="text-center">
                <Fuel className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-800">Powering Progress</p>
                <p className="text-gray-600">Since 1985</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full border-gray-200 hover:shadow-lg transition-shadow">
                    <Icon className="w-10 h-10 text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300"></div>
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-8 ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                  <Card className="p-4 border-gray-200">
                    <div className="text-blue-600 font-bold text-lg mb-1">{milestone.year}</div>
                    <div className="font-semibold text-gray-900 mb-1">{milestone.event}</div>
                    <div className="text-sm text-gray-600">{milestone.description}</div>
                  </Card>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Join Our Growing Network
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Be part of Kashmir Valley's premier petroleum dealers association
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/role"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </a>
              <a
                href="/admin/login"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Admin Login
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}