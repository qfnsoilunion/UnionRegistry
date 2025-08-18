import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { roleManager, type Role } from "./lib/role";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MinimalistHome from "./pages/MinimalistHome";
import About from "./pages/About";
import ChooseRole from "./pages/ChooseRole";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import DealerDashboard from "./pages/DealerDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const [role, setRole] = useState<Role>(roleManager.get());

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(roleManager.get());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateRole = (newRole: Role) => {
    roleManager.set(newRole);
    setRole(newRole);
  };

  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdminAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = () => {
    setAdminAuthenticated(true);
    setRole("ADMIN");
    window.location.href = "/admin";
  };

  const [location] = useState(window.location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {location !== "/" && location !== "/about" && <Navbar role={role} onRoleChange={updateRole} />}
      <main className="flex-1">
        <Switch>
          <Route path="/" component={MinimalistHome} />
          <Route path="/about" component={About} />
          <Route path="/role">
            <ChooseRole onRoleSelect={updateRole} />
          </Route>
          <Route path="/admin/login">
            <AdminLogin onSuccess={handleAdminLogin} />
          </Route>
          <Route path="/admin">
            {adminAuthenticated ? <AdminDashboard /> : <AdminLogin onSuccess={handleAdminLogin} />}
          </Route>
          <Route path="/dealer">
            {role === "DEALER" ? <DealerDashboard /> : <ChooseRole onRoleSelect={updateRole} />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
