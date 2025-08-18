import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInView } from "react-intersection-observer";
import { Parallax } from "react-parallax";
import { useSpring, animated } from "@react-spring/web";
import Lottie from "lottie-react";
import { 
  Fuel, 
  Users, 
  Shield, 
  Briefcase, 
  ArrowRight,
  ChevronDown,
  Award,
  Target,
  Zap,
  Globe,
  TrendingUp,
  Building2,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

gsap.registerPlugin(ScrollTrigger);

// Animated counter component
function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// Particle background canvas
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 68, 68, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// Floating oil drops animation
function FloatingOilDrops() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(239, 68, 68, 0.3), transparent)`,
            filter: "blur(40px)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function UltraModernHome() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.9]);

  const { data: metrics } = useQuery<{
    activeDealers: number;
    activeEmployees: number;
    activeClients: number;
    pendingTransfers: number;
  }>({
    queryKey: ["/api/metrics/home"],
    refetchInterval: 30000,
  });

  const titleAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 120, friction: 14 },
    delay: 200,
  });

  const subtitleAnimation = useSpring({
    from: { opacity: 0, transform: "translateX(-50px)" },
    to: { opacity: 1, transform: "translateX(0px)" },
    config: { tension: 120, friction: 14 },
    delay: 400,
  });

  useEffect(() => {
    // GSAP animations for sections
    gsap.fromTo(
      ".feature-card",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      ".service-card",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".services-section",
          start: "top 70%",
        },
      }
    );
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <ParticleBackground />
      <FloatingOilDrops />

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center px-4 z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-slate-950/80" />
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center z-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-block"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Fuel className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          <animated.h1 style={titleAnimation} className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-white">
            Union Registry
          </animated.h1>

          <animated.p style={subtitleAnimation} className="text-xl md:text-3xl mb-4 text-slate-300">
            Kashmir Valley Tank Owners
          </animated.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl mb-12 text-slate-400 max-w-3xl mx-auto"
          >
            Petroleum Dealers Association - Empowering Excellence Since 1985
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/role">
              <Button size="lg" className="group bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                Access Portal
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#about">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary/50 hover:bg-primary/10">
                Learn More
                <ChevronDown className="ml-2 animate-bounce" />
              </Button>
            </a>
          </motion.div>

          {/* Live Stats */}
          {metrics && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  <AnimatedCounter end={metrics.activeDealers} />+
                </div>
                <div className="text-slate-400 mt-2">Active Dealers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  <AnimatedCounter end={metrics.activeEmployees} />+
                </div>
                <div className="text-slate-400 mt-2">Employees</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  <AnimatedCounter end={metrics.activeClients} />+
                </div>
                <div className="text-slate-400 mt-2">Clients Served</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  <AnimatedCounter end={38} />+
                </div>
                <div className="text-slate-400 mt-2">Years of Service</div>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-primary animate-pulse" />
        </motion.div>
      </motion.section>

      {/* About Section */}
      <section id="about" className="relative py-24 px-4 z-10">
        <Parallax
          blur={0}
          bgImage="/api/placeholder/1920/1080"
          bgImageAlt="Kashmir Valley"
          strength={200}
          bgClassName="opacity-20"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 text-lg px-4 py-2 bg-primary/20 text-primary border-primary">
                Est. 1985
              </Badge>
              <h2 className="text-5xl font-bold mb-6">Powering Kashmir's Progress</h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                For nearly four decades, we've been the backbone of Kashmir Valley's petroleum industry,
                ensuring reliable fuel supply and maintaining the highest standards of service.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 features-section">
              {[
                {
                  icon: Shield,
                  title: "Trusted Network",
                  description: "A unified registry of certified petroleum dealers across the valley",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Users,
                  title: "Professional Excellence",
                  description: "Supporting thousands of employees with training and development",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  icon: Briefcase,
                  title: "Business Growth",
                  description: "Facilitating partnerships and expansion opportunities",
                  color: "from-orange-500 to-red-500",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="feature-card bg-slate-800/50 backdrop-blur-lg border-slate-700 p-8 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </Parallax>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-24 px-4 z-10 services-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">Our Services</h2>
            <p className="text-xl text-slate-400">Comprehensive solutions for the petroleum industry</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, title: "Dealer Registration", color: "bg-gradient-to-br from-blue-600 to-blue-800" },
              { icon: Users, title: "Employee Management", color: "bg-gradient-to-br from-green-600 to-green-800" },
              { icon: TrendingUp, title: "Business Analytics", color: "bg-gradient-to-br from-purple-600 to-purple-800" },
              { icon: Globe, title: "Network Expansion", color: "bg-gradient-to-br from-orange-600 to-orange-800" },
              { icon: Award, title: "Quality Certification", color: "bg-gradient-to-br from-red-600 to-red-800" },
              { icon: Target, title: "Compliance Support", color: "bg-gradient-to-br from-indigo-600 to-indigo-800" },
              { icon: Zap, title: "Digital Solutions", color: "bg-gradient-to-br from-yellow-600 to-yellow-800" },
              { icon: Shield, title: "Security & Safety", color: "bg-gradient-to-br from-teal-600 to-teal-800" },
            ].map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className={`service-card ${service.color} p-6 rounded-2xl cursor-pointer transform transition-all duration-300`}
              >
                <service.icon className="w-12 h-12 text-white mb-4" />
                <h3 className="text-xl font-bold text-white">{service.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="relative py-24 px-4 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">Our Leadership</h2>
            <p className="text-xl text-slate-400">Guiding the industry with vision and integrity</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Abdul Rahman Shah", position: "President", years: "2020-Present" },
              { name: "Mohammad Yousuf", position: "Vice President", years: "2021-Present" },
              { name: "Tariq Ahmad", position: "Secretary General", years: "2019-Present" },
            ].map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-16 h-16 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{leader.name}</h3>
                <p className="text-primary text-lg mb-1">{leader.position}</p>
                <p className="text-slate-500">{leader.years}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-24 px-4 z-10 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">Get In Touch</h2>
            <p className="text-xl text-slate-400">Connect with us for partnership opportunities</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8"
            >
              <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-slate-400">+91 194 2450123</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8"
            >
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-slate-400">info@kvtopda.org</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8"
            >
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-slate-400">Lal Chowk, Srinagar, J&K</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}