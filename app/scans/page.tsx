"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Search,
  FileText,
  BarChart3,
  Settings,
  Menu,
  X,
  Upload,
  Globe,
  Package,
  AlertTriangle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { getScans, startScan } from "@/lib/utils/scan";
import { useAppDispatch, useAppSelector } from "@/lib/hook";

export default function ScanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scanType, setScanType] = useState("Passive");
  const [targetType, setTargetType] = useState("url");
  const [targetUrl, setTargetUrl] = useState("");
  const [scanDepth, setScanDepth] = useState(50);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedModules, setSelectedModules] = useState({
    portScan: true,
    vulnDetection: true,
    techStack: true,
    sslCheck: true,
    dnsEnum: false,
    dirBruteforce: false,
  });

  const scans = useAppSelector((state) => state.scan.scans);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  const handleModuleToggle = (module: string) => {
    setSelectedModules((prev) => ({
      ...prev,
      [module]: !prev[module as keyof typeof prev],
    }));
  };

  const handleStartScan = () => {
    const data = {
      scanType,
      targetUrl,
    };

    dispatch(startScan(data));
    setIsScanning(true);
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
    dispatch(getScans());
  }, []);

  useEffect(() => {
    if (scans) {
      const latestScan = scans[scans.length - 1];

      if (latestScan?.progress < 100) {
        setIsScanning(true);
        setScanProgress(latestScan.progress);
      }
    }
  }, [scans]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border/40 transform transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex h-16 items-center border-b border-border/40 px-6">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">SecureScanX</span>
          </Link>
        </div>
        <nav className="space-y-1 px-3 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-accent hover:text-foreground"
          >
            <BarChart3 className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/scans"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium bg-primary/10 text-primary"
          >
            <Search className="h-5 w-5" />
            Scans
          </Link>
          <Link
            href="/results"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-accent hover:text-foreground"
          >
            <FileText className="h-5 w-5" />
            Results
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-accent hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              className="inline-flex md:hidden items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
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
        <main className="container py-6">
          <Card>
            <CardHeader>
              <CardTitle>Start a New Security Scan</CardTitle>
              <CardDescription>
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
                    <h3 className="text-xl font-bold">Scanning in Progress</h3>
                    <p className="text-muted-foreground">
                      Please wait while we scan your target for vulnerabilities
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
                    {scanProgress >= 10 && (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Port scanning completed</span>
                      </div>
                    )}
                    {scanProgress >= 30 && (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Technology stack detection completed</span>
                      </div>
                    )}
                    {scanProgress >= 50 && scanProgress < 85 ? (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        <span>Vulnerability detection in progress</span>
                      </div>
                    ) : scanProgress >= 85 ? (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Vulnerability detection completed</span>
                      </div>
                    ) : null}
                    {scanProgress < 85 ? (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-muted" />
                        <span>SSL/TLS check pending</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        <span>SSL/TLS check in progress</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <Button variant="destructive" onClick={handleCancelScan}>
                      Cancel Scan
                    </Button>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="target" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="target">Target</TabsTrigger>
                    <TabsTrigger value="options">Scan Options</TabsTrigger>
                    <TabsTrigger value="modules">Modules</TabsTrigger>
                  </TabsList>

                  <TabsContent value="target" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Target Type
                        </h3>
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
                      </div>

                      <Separator />

                      {targetType === "url" && (
                        <div className="space-y-4">
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
                        </div>
                      )}

                      {targetType === "package" && (
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <h3 className="font-medium">
                                Upload Software Package
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Drag and drop your file here, or click to browse
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Supported formats: ZIP, JAR, WAR, EXE, APK, PY,
                                JS
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
                  </TabsContent>

                  <TabsContent value="options" className="space-y-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Scan Type</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <button
                            onClick={() => setScanType("Passive")}
                            className={`flex flex-col items-center gap-3 p-4 rounded-lg border ${
                              scanType === "Passive"
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border/50 hover:border-border hover:bg-card"
                            }`}
                          >
                            <div className="p-3 rounded-full bg-primary/10">
                              <Search className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-center">
                              <h4 className="font-medium">Passive Scan</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                Quick discovery, no target impact
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={() => setScanType("Active")}
                            className={`flex flex-col items-center gap-3 p-4 rounded-lg border ${
                              scanType === "Active"
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border/50 hover:border-border hover:bg-card"
                            }`}
                          >
                            <div className="p-3 rounded-full bg-primary/10">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-center">
                              <h4 className="font-medium">Active Scan</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                Deep inspection; may trigger alerts
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

                        {scanType === "Active" || scanType === "Hybrid" ? (
                          <div className="flex items-center gap-2 p-3 rounded-md bg-yellow-500/10 text-yellow-500">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                            <p className="text-sm">
                              Active scans may affect network performance and
                              trigger security alerts on the target system.
                            </p>
                          </div>
                        ) : null}
                      </div>

                      <Separator />

                      {/* <div className="space-y-4">
                        <h3 className="text-lg font-medium">Scan Timeout</h3>
                        <Select value={scanTimeout} onValueChange={setScanTimeout}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                            <SelectItem value="240">4 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Maximum time the scan will run before automatically stopping
                        </p>
                      </div> */}
                    </div>
                  </TabsContent>

                  {/* <TabsContent value="modules" className="space-y-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Scan Modules</h3>
                        <p className="text-sm text-muted-foreground">
                          Select which security modules to include in your scan
                        </p>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                              <Label htmlFor="port-scan" className="text-base">
                                Port Scanning
                              </Label>
                              <p className="text-sm text-muted-foreground">Detect open ports and running services</p>
                            </div>
                            <Switch
                              id="port-scan"
                              checked={selectedModules.portScan}
                              onCheckedChange={() => handleModuleToggle("portScan")}
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                              <Label htmlFor="vuln-detection" className="text-base">
                                Vulnerability Detection
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Identify known security vulnerabilities (CVEs)
                              </p>
                            </div>
                            <Switch
                              id="vuln-detection"
                              checked={selectedModules.vulnDetection}
                              onCheckedChange={() => handleModuleToggle("vulnDetection")}
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                              <Label htmlFor="tech-stack" className="text-base">
                                Technology Stack Detection
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Identify frameworks, libraries, and technologies in use
                              </p>
                            </div>
                            <Switch
                              id="tech-stack"
                              checked={selectedModules.techStack}
                              onCheckedChange={() => handleModuleToggle("techStack")}
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                              <Label htmlFor="ssl-check" className="text-base">
                                SSL/TLS Check
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Analyze SSL/TLS configuration and certificates
                              </p>
                            </div>
                            <Switch
                              id="ssl-check"
                              checked={selectedModules.sslCheck}
                              onCheckedChange={() => handleModuleToggle("sslCheck")}
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                              <Label htmlFor="dns-enum" className="text-base">
                                DNS Enumeration
                              </Label>
                              <p className="text-sm text-muted-foreground">Discover subdomains and DNS records</p>
                            </div>
                            <Switch
                              id="dns-enum"
                              checked={selectedModules.dnsEnum}
                              onCheckedChange={() => handleModuleToggle("dnsEnum")}
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                              <Label htmlFor="dir-bruteforce" className="text-base">
                                Directory Bruteforce
                              </Label>
                              <p className="text-sm text-muted-foreground">Discover hidden directories and files</p>
                            </div>
                            <Switch
                              id="dir-bruteforce"
                              checked={selectedModules.dirBruteforce}
                              onCheckedChange={() => handleModuleToggle("dirBruteforce")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent> */}

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTargetUrl("");
                        setScanType("Passive");
                        setScanDepth(50);
                        setSelectedModules({
                          portScan: true,
                          vulnDetection: true,
                          techStack: true,
                          sslCheck: true,
                          dnsEnum: false,
                          dirBruteforce: false,
                        });
                      }}
                    >
                      Reset
                    </Button>
                    <Button onClick={handleStartScan}>Start Scan</Button>
                  </div>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
