"use client";
import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { registerUser } from "@/lib/utils/user";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    password: "",
    location: "Greater Accra",
  });

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      dispatch(registerUser(user));
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const ghanaRegions = [
    "Greater Accra",
    "Ashanti",
    "Western",
    "Eastern",
    "Central",
    "Volta",
    "Northern",
    "Upper East",
    "Upper West",
    "Bono",
    "Ahafo",
    "Bono East",
    "North East",
    "Savannah",
    "Oti",
    "Western North",
  ];

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-[#0080ff] hover:text-[#0060cc] mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="max-w-md mx-auto bg-[#1a1a1a] rounded-xl border border-gray-800 p-8">
          <div className="flex justify-center mb-6">
            <Shield className="h-12 w-12 text-[#0080ff]" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-6">
            Create Your SecureScanX Account
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  type="text"
                  value={user.fullname}
                  onChange={(e) =>
                    setUser({ ...user, fullname: e.target.value })
                  }
                  required
                  className="bg-[#212121] border-gray-700 focus:border-[#0080ff] focus:ring-[#0080ff] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                  className="bg-[#212121] border-gray-700 focus:border-[#0080ff] focus:ring-[#0080ff] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  placeholder="Create a secure password"
                  required
                  className="bg-[#212121] border-gray-700 focus:border-[#0080ff] focus:ring-[#0080ff] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  className="bg-[#212121] border-gray-700 focus:border-[#0080ff] focus:ring-[#0080ff] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region (Optional)</Label>
                <Select>
                  <SelectTrigger className="bg-[#212121] border-gray-700 focus:ring-[#0080ff] text-white">
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#212121] border-gray-700 text-white">
                    {ghanaRegions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0080ff] hover:bg-[#0060cc] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0080ff] hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
