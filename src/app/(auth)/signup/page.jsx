"use client";
import { signUp } from "@/services/authServices";
import { useRouter } from "next/navigation";
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
import { useState } from "react";
import Link from "next/link";

export default function SignUpComponent() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  // Function to check if passwords match and toggle button
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setIsButtonDisabled(
      value !== confirmPassword ||
        email === "" ||
        firstName === "" ||
        lastName === ""
    );
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setIsButtonDisabled(
      value !== password || email === "" || firstName === "" || lastName === ""
    );
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsButtonDisabled(
      password !== confirmPassword ||
        value === "" ||
        firstName === "" ||
        lastName === ""
    );
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstName(value);
    setIsButtonDisabled(
      password !== confirmPassword ||
        email === "" ||
        value === "" ||
        lastName === ""
    );
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setLastName(value);
    setIsButtonDisabled(
      password !== confirmPassword ||
        email === "" ||
        firstName === "" ||
        value === ""
    );
  };

  // Handle form submission for signUp
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    setSuccess(""); // Clear previous success message
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await signUp({ firstName, lastName, email, password });
      setSuccess("Account created successfully!");
      console.log("User registered:", response);
      router.push("/login"); // Redirect to the login page
    } catch (err) {
      setError(err.message || "Failed to create account");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign-up</CardTitle>
          <CardDescription>
            Enter your email and password to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
              {/* <div className="space-y-4"> */}

              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={handleLastNameChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Confirm Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={handleConfirmPasswordChange}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isButtonDisabled}
              >
                Create Account
              </Button>
              <div className="flex flex-row">
                <CardDescription>Don't have an account? </CardDescription>
                <Label htmlFor="email" className="pt-1">
                  <Link href="/login">Login</Link>
                </Label>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
