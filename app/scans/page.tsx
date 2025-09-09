"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  Upload,
  Globe,
  AlertTriangle,
  Shield,
  FileText,
  LayoutDashboard,
  LogOut,
  BarChart3,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { getScans, startScan } from "@/lib/utils/scan";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { getMe } from "@/lib/utils/user";
import { updateScansFromSocket } from "@/lib/features/scanSlice";
import { wsManager } from "@/lib/utils/websocket";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scans", label: "Scans", icon: Search },
  { href: "/results", label: "Results", icon: FileText },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
];

export default function ScanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scanType, setScanType] = useState("Vuln");
  const [targetType, setTargetType] = useState("url");
  const [targetUrl, setTargetUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanningRemark, setScanningRemark] = useState("");

  const scans = useAppSelector((state) => state.scan.scans);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  const handleStartScan = () => {
    const data = {
      scanType,
      targetUrl,
    };

    dispatch(startScan(data));
    setIsScanning(true);
    dispatch(getScans());
  };

  const handleCancelScan = () => {
    setIsScanning(false);
    setScanProgress(0);
    toast({
      title: "Scan cancelled",
      description: "The scan has been cancelled",
    });
  };

  useEffect(() => {
    dispatch(getMe());
    dispatch(getScans());

    // Handle socket messages for scan progress
    wsManager.onMessage('scan_progress', (data) => {
      // Update Redux with all scans
      dispatch(updateScansFromSocket(data.all_scans));
      
      // Temporarily update progress and remark on this page
      setScanProgress(data.progress);
      setScanningRemark(data.remark);
      
      if (data.progress < 100) {
        setIsScanning(true);
      } else {
        setIsScanning(false);
      }
    });
  }, []);

  useEffect(() => {
    if (scans && scans.length > 0) {
      const latestScan = scans[scans.length - 1];

      if (latestScan?.progress < 100) {
        setIsScanning(true);
        setScanProgress(latestScan.progress);
        setScanningRemark(latestScan.remark);
      }
    }
  }, [scans]);

  return (
    <SidebarProvider className="bg-red-500">
      <div className="min-h-screen w-full  bg-[#121212] text-white flex">
        {/* Sidebar for desktop */}
        <Sidebar className="hidden md:flex border-r border-gray-800">
          <SidebarHeader className="p-4 border-b border-gray-800">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-[#0080ff]" />
              <span className="text-xl font-bold">SecureScanX</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="py-4">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={
                      pathname === item.href
                        ? "bg-[#0080ff]/20 text-[#0080ff]"
                        : ""
                    }
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-gray-800">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-80 z-40 md:hidden ${
            mobileMenuOpen ? "block" : "hidden"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        <div
          className={`fixed inset-y-0 left-0 w-64 bg-[#1a1a1a] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-[#0080ff]" />
              <span className="text-lg font-bold">SecureScanX</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="py-4">
            <nav className="space-y-1 px-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/scans"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium bg-[#0080ff]/20 text-[#0080ff]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-5 w-5" />
                <span>Scans</span>
              </Link>
              <Link
                href="/results"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="h-5 w-5" />
                <span>Results</span>
              </Link>
              <Link
                href="/assistant"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bot className="h-5 w-5" />
                <span>AI Assistant</span>
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex-1">
          <header className="sticky top-0 z-40 border-b border-gray-800 bg-[#1a1a1a]/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-4">
              <button
                className="inline-flex md:hidden items-center justify-center rounded-md text-sm font-medium border border-gray-700 hover:bg-gray-800 h-10 w-10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle Menu</span>
              </button>

              <div className="flex-1 flex justify-center md:justify-start">
                <h1 className="text-xl font-bold">Security Scan</h1>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/results">
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          {/* Scan Content */}
          <main className="w-full py-6 px-6">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  Start a New Security Scan
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure your scan settings to detect vulnerabilities in your
                  target
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isScanning ? (
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10">
                        <Search className="h-8 w-8 text-primary animate-pulse" />
                      </div>
                      <h3 className="text-xl font-bold">
                        Scanning in Progress
                      </h3>
                      <p className="text-muted-foreground">
                        Please wait while we scan your target for
                        vulnerabilities
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{scanProgress}%</span>
                      </div>
                      <Progress value={scanProgress} className="h-2" />
                    </div>

                    <div className="space-y-2 text-sm">
                      {scanningRemark ? (
                        <p className="text-center text-muted-foreground">
                          {scanningRemark}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex justify-center">
                      <Button variant="destructive" onClick={handleCancelScan}>
                        Cancel Scan
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Target Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Target Type</h3>
                      <RadioGroup
                        defaultValue="url"
                        value={targetType}
                        onValueChange={setTargetType}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="url" id="url" />
                          <Label
                            htmlFor="url"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Globe className="h-5 w-5" />
                            URL / Domain
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bulk" id="bulk" />
                          <Label
                            htmlFor="bulk"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <FileText className="h-5 w-5" />
                            Bulk Scan (CSV)
                          </Label>
                        </div>
                      </RadioGroup>

                      {targetType === "url" && (
                        <div className="space-y-2">
                          <Label htmlFor="url-input">URL or Domain</Label>
                          <Input
                            id="url-input"
                            placeholder="https://example.com"
                            value={targetUrl}
                            onChange={(e) => setTargetUrl(e.target.value)}
                          />
                          <p className="text-sm text-muted-foreground">
                            Enter a full URL (https://example.com/path) or
                            domain name (example.com)
                          </p>
                        </div>
                      )}

                      {targetType === "bulk" && (
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <h3 className="font-medium">Upload CSV File</h3>
                              <p className="text-sm text-muted-foreground">
                                Upload a CSV file with one URL or domain per
                                line
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                              >
                                Browse Files
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 rounded-md bg-yellow-500/10 text-yellow-500">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                            <p className="text-sm">This is not yet available</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Scan Type Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Scan Type</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={() => setScanType("Vuln")}
                          className={`flex flex-col items-center gap-3 p-4 rounded-lg border ${
                            scanType === "Vuln"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border/50 hover:border-border hover:bg-card"
                          }`}
                        >
                          <div className="p-3 rounded-full bg-primary/10">
                            <Search className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-center">
                            <h4 className="font-medium">Vulnerability Scan</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Find Vulnerabilities
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => setScanType("Leak")}
                          className={`flex flex-col items-center gap-3 p-4 rounded-lg border ${
                            scanType === "Leak"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border/50 hover:border-border hover:bg-card"
                          }`}
                        >
                          <div className="p-3 rounded-full bg-primary/10">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-center">
                            <h4 className="font-medium">Leaks Scan</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Get Data Leaked on internet
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() => setScanType("Hybrid")}
                          className={`flex flex-col items-center gap-3 p-4 rounded-lg border ${
                            scanType === "Hybrid"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border/50 hover:border-border hover:bg-card"
                          }`}
                        >
                          <div className="p-3 rounded-full bg-primary/10">
                            <Shield className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-center">
                            <h4 className="font-medium">Both (Hybrid)</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Comprehensive (slower but thorough)
                            </p>
                          </div>
                        </button>
                      </div>

                      {scanType === "Vuln" || scanType === "Hybrid" ? (
                        <div className="flex items-center gap-2 p-3 rounded-md bg-yellow-500/10 text-yellow-500">
                          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                          <p className="text-sm">
                            Vulnerability Scan scans may affect network
                            performance and trigger security alerts on the
                            target system.
                          </p>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTargetUrl("");
                          setScanType("Vuln");
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        onClick={handleStartScan}
                        className="bg-[#0080ff] hover:bg-[#0060cc]"
                      >
                        Start Scan
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
