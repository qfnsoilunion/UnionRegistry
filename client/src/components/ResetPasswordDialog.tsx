import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Shield, Copy, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface ResetPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  dealerId: string;
  dealerName: string;
}

export default function ResetPasswordDialog({
  open,
  onClose,
  dealerId,
  dealerName,
}: ResetPasswordDialogProps) {
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const { toast } = useToast();

  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/reset-dealer-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-auth": sessionStorage.getItem("adminAuth") || "",
        },
        body: JSON.stringify({ dealerId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reset password");
      }
      
      return response.json();
    },
    onSuccess: (data: any) => {
      setNewPassword(data.newPassword);
      toast({
        title: "Success",
        description: "Password reset successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "New password copied to clipboard",
    });
  };

  const handleClose = () => {
    setNewPassword(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Dealer Password</DialogTitle>
          <DialogDescription>
            Generate a new temporary password for {dealerName}
          </DialogDescription>
        </DialogHeader>

        {!newPassword ? (
          <div className="space-y-4">
            <Alert className="bg-amber-50 border-amber-200">
              <Shield className="h-4 w-4 text-amber-600" />
              <AlertDescription>
                This will generate a new temporary password that the dealer must change on first login.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={() => resetPasswordMutation.mutate()}
                disabled={resetPasswordMutation.isPending}
                className="bg-accent hover:bg-accent/90"
              >
                {resetPasswordMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate New Password"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Alert className="bg-green-50 border-green-200">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription>
                New temporary password generated successfully!
              </AlertDescription>
            </Alert>

            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-sm mb-1">New Password:</h4>
                  <p className="font-mono text-lg bg-white px-3 py-2 rounded border">
                    {newPassword}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(newPassword)}
                  className="ml-2"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <strong>Important:</strong> Share this password securely with the dealer. 
                They will be required to change it on their next login.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <Button onClick={handleClose}>
                Done
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}