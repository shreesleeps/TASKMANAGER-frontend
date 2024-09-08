"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logIn } from "@/services/authServices";
import Link from "next/link";

export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setIsLoading(true); // Show loading state

    try {
      const data = await logIn({ email, password }); // Call the logIn API

      console.log("Login successful. Token:", data.token);

      localStorage.setItem("token", data.token); // Store the JWT token
      localStorage.setItem("firstName", data.firstName);
      localStorage.setItem("lastName", data.lastName);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);
      localStorage.setItem("id", data.id);
      router.push("/"); // Redirect to dashboard or other protected page
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to logIn to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* <div className="space-y-4"> */}
            {error && <p className="text-red-500">{error}</p>}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="flex flex-row">
                <CardDescription>Don't have an account? </CardDescription>
                <Label htmlFor="email" className="pt-1">
                  <Link href="/signup">Sign-up</Link>
                </Label>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
