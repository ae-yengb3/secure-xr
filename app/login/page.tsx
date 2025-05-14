"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/lib/utils/user";
import { useAppDispatch, useAppSelector } from "../../lib/hook";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { token } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
      setIsLoading(false);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const credentials = {
      email,
      password,
    };

    dispatch(loginUser(credentials));
  };

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
            Login to SecureScanX
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#212121] border-gray-700 focus:border-[#0080ff] focus:ring-[#0080ff] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#212121] border-gray-700 focus:border-[#0080ff] focus:ring-[#0080ff] text-white"
                />
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#0080ff] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0080ff] hover:bg-[#0060cc] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#0080ff] hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
