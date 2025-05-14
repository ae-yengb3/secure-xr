import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Navigation */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-[#0080ff]" />
            <span className="text-xl font-bold">SecureScanX</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link
              href="#features"
              className="hover:text-[#0080ff] transition-colors"
            >
              Features
            </Link>
            <Link
              href="#regions"
              className="hover:text-[#0080ff] transition-colors"
            >
              Regions
            </Link>
            <Link
              href="#about"
              className="hover:text-[#0080ff] transition-colors"
            >
              About
            </Link>
          </nav>
          <div className="flex space-x-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-[#0080ff] text-[#0080ff] hover:bg-[#0080ff] hover:text-white"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#0080ff] hover:bg-[#0060cc] text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-pattern"></div>
          <div className="absolute inset-0 bg-[url('/ghana-map-outline.svg')] bg-no-repeat bg-center bg-contain opacity-20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#0080ff] to-[#00c3ff]">
              SecureScanX — Ghana's Intelligent Cyber Defense Tool
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Advanced cybersecurity monitoring and protection designed
              specifically for Ghana's digital infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#0080ff] hover:bg-[#0060cc] text-white w-full sm:w-auto"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-800 w-full sm:w-auto"
                >
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Advanced <span className="text-[#0080ff]">Security Features</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#212121] p-8 rounded-xl border border-gray-800 hover:border-[#0080ff] transition-colors">
              <div className="bg-[#0080ff]/10 p-3 rounded-full w-fit mb-6">
                <Zap className="h-8 w-8 text-[#0080ff]" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                Passive and Active Scanning
              </h3>
              <p className="text-gray-400">
                Comprehensive scanning capabilities to detect vulnerabilities
                without disrupting your systems.
              </p>
            </div>
            <div className="bg-[#212121] p-8 rounded-xl border border-gray-800 hover:border-[#0080ff] transition-colors">
              <div className="bg-[#ff3333]/10 p-3 rounded-full w-fit mb-6">
                <Shield className="h-8 w-8 text-[#ff3333]" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                Real-time Threat Detection
              </h3>
              <p className="text-gray-400">
                Instant alerts and notifications when suspicious activities are
                detected on your network.
              </p>
            </div>
            <div className="bg-[#212121] p-8 rounded-xl border border-gray-800 hover:border-[#0080ff] transition-colors">
              <div className="bg-[#0080ff]/10 p-3 rounded-full w-fit mb-6">
                <Globe className="h-8 w-8 text-[#0080ff]" />
              </div>
              <h3 className="text-xl font-bold mb-4">Region-based Reporting</h3>
              <p className="text-gray-400">
                Specialized reporting for all 16 regions of Ghana, with
                localized threat intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <section id="regions" className="py-20 bg-[#121212]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Coverage Across{" "}
            <span className="text-[#0080ff]">All 16 Regions</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
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
            ].map((region) => (
              <div
                key={region}
                className="bg-[#212121] p-4 rounded-lg border border-gray-800 hover:border-[#0080ff] transition-colors text-center"
              >
                <p className="text-gray-300">{region}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-[#0080ff] mb-2">500+</h3>
              <p className="text-gray-400">Organizations Protected</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-[#0080ff] mb-2">
                10,000+
              </h3>
              <p className="text-gray-400">Threats Detected</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-[#0080ff] mb-2">16</h3>
              <p className="text-gray-400">Regions Covered</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-[#0080ff] mb-2">24/7</h3>
              <p className="text-gray-400">Monitoring & Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Secure Your Digital Infrastructure?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join Ghana's leading organizations in protecting your systems with
            SecureScanX.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-[#0080ff] hover:bg-[#0060cc] text-white w-full sm:w-auto"
              >
                Create Free Account
              </Button>
            </Link>
            <Link href="#contact">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 hover:bg-gray-800 w-full sm:w-auto"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <Shield className="h-8 w-8 text-[#0080ff]" />
              <span className="text-xl font-bold">SecureScanX</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © 2025 SecureScanX – Built for Ghana's Cyber Future
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
