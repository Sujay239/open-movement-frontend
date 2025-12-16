import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Key, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAlert } from "../blocks/AlertProvider";

export default function AccessCodePage() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {showError , showSuccess} = useAlert();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

      const res = await fetch(`${BASE_URL}/auth/use-access-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid access code");
      }

      // Success Sequence
      setSuccess(true);
      showSuccess("Access Granted!");

      // Redirect after a short delay so user sees success state
      setTimeout(() => {
      window.location.href = '/school/dashboard'
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      showError("Activation Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Text */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Unlock Full Access
          </h1>
          <p className="text-muted-foreground">
            Enter your 24-hour trial code provided by the admin.
          </p>
        </div>

        <Card className="border-2 border-slate-100 dark:border-white/5 shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              Enter Access Code
            </CardTitle>
            <CardDescription>
              This will upgrade your account immediately.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Success Message */}
              {success && (
                <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900 dark:text-green-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Code accepted. Redirecting you now...
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="code">Access Code</Label>
                <div className="relative">
                  <Input
                    id="code"
                    placeholder="OM-TRIAL-XXXX"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    disabled={isLoading || success}
                    className="pl-10 font-mono text-lg tracking-wide uppercase placeholder:normal-case"
                    autoComplete="off"
                  />
                  <div className="absolute left-3 top-2.5 text-muted-foreground">
                    <Key className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full mt-3 h-11 text-base font-semibold shadow-lg shadow-blue-500/20"
                disabled={isLoading || !code || success}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : success ? (
                  "Verified"
                ) : (
                  "Activate Code"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
