import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Shield, AlertCircle, Key } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const totpSchema = z.object({
  token: z.string().length(6, "Code must be 6 digits").regex(/^\d+$/, "Code must be numeric"),
});

type LoginForm = z.infer<typeof loginSchema>;
type TOTPForm = z.infer<typeof totpSchema>;

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [showTOTP, setShowTOTP] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [setupMode, setSetupMode] = useState(false);
  const [sessionData, setSessionData] = useState<{ username: string; token: string } | null>(null);
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const totpForm = useForm<TOTPForm>({
    resolver: zodResolver(totpSchema),
    defaultValues: {
      token: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/auth/admin/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.requiresTOTP) {
        setShowTOTP(true);
        setSessionData({ username: form.getValues("username"), token: data.token });
        
        if (data.setupRequired) {
          setSetupMode(true);
          setQrCode(data.qrCode);
        }
      } else {
        // Should not happen with 2FA enabled
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("role", "ADMIN");
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const verifyTOTPMutation = useMutation({
    mutationFn: async (data: TOTPForm) => {
      const response = await apiRequest("POST", "/api/auth/admin/verify-totp", {
        ...data,
        username: sessionData?.username,
        sessionToken: sessionData?.token,
        setupMode,
      });
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("role", "ADMIN");
      toast({
        title: "Success",
        description: setupMode ? "2FA setup complete!" : "Login successful!",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid code",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-lg">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center text-white">Admin Portal</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Kashmir Valley Tank Owners & Petroleum Dealers Association
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter username"
                            className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter password"
                            className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Alert className="border-slate-600 bg-slate-700/30">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-slate-300">
                    Protected access. Authorized personnel only.
                  </AlertDescription>
                </Alert>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Verifying..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {/* TOTP Dialog */}
      <Dialog open={showTOTP} onOpenChange={setShowTOTP}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {setupMode ? "Setup Two-Factor Authentication" : "Enter Verification Code"}
            </DialogTitle>
            <DialogDescription>
              {setupMode
                ? "Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)"
                : "Enter the 6-digit code from your authenticator app"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {setupMode && qrCode && (
              <div className="flex justify-center">
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
              </div>
            )}

            <Form {...totpForm}>
              <form onSubmit={totpForm.handleSubmit((data) => verifyTOTPMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={totpForm.control}
                  name="token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="000000"
                          maxLength={6}
                          className="text-center text-2xl tracking-widest"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={verifyTOTPMutation.isPending}
                >
                  {verifyTOTPMutation.isPending ? "Verifying..." : "Verify"}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}