"use client";
import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Search,
  FileText,
  BarChart3,
  Settings,
  Menu,
  X,
  Download,
  ExternalLink,
  AlertTriangle,
  Info,
  ArrowLeft,
  Activity,
  Copy,
  LinkIcon,
  CheckCircle,
  LayoutDashboard,
  LogOut,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ScanResult, VulnerabilityResult } from "@/lib/scan-engine";
import { useToast } from "@/components/ui/use-toast";
import { useAppSelector } from "@/lib/hook";
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
import { authenticatedFetch } from "@/lib/utils/user";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scans", label: "Scans", icon: Search },
  { href: "/results", label: "Results", icon: FileText },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
];

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export default function ScanResultDetail({
  params,
}: {
  params: { id: string };
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [report, setReport] = useState<ScanResult | null>(null);
  const [filteredReports, setFilteredReports] = useState<VulnerabilityResult[]>(
    []
  );
  const [vulnStates, setVulnStates] = useState<
    Record<string, { resolved?: boolean; marked_as_false_positive?: boolean }>
  >({});

  const { extra, reports } = useAppSelector((state) => state.scan);

  useEffect(() => {
    const id = parseInt(location.href.split("/").pop() || "0") * 1;

    if (reports && reports[id]) setReport(reports[id]);
  }, []);

  useEffect(() => {
    const id = parseInt(location.href.split("/").pop() || "0") * 1;

    setFilteredReports(
      report?.alerts.filter(
        (item) => severityFilter === "all" || item.risk === severityFilter
      ) || []
    );
  }, [report, severityFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg font-medium">Loading scan results...</p>
        </div>
      </div>
    );
  }

  if (!scanResult) {
    // return (
    //   <div className="min-h-screen bg-background text-foreground flex justify-center items-center">
    //     <div className="flex flex-col items-center gap-4">
    //       <AlertTriangle className="h-12 w-12 text-red-500" />
    //       <h1 className="text-2xl font-bold">Scan Result Not Found</h1>
    //       <p className="text-muted-foreground">
    //         The scan result you're looking for doesn't exist or has been
    //         deleted.
    //       </p>
    //       <Link href="/results">
    //         <Button className="mt-4">
    //           <ArrowLeft className="h-4 w-4 mr-2" />
    //           Back to Results
    //         </Button>
    //       </Link>
    //     </div>
    //   </div>
    // );
  }

  // Count vulnerabilities by severity
  // const vulnerabilityCounts = {
  //   Critical: scanResult.vulnerabilities.filter(
  //     (v) => v.severity === "Critical"
  //   ).length,
  //   High: scanResult.vulnerabilities.filter((v) => v.severity === "High")
  //     .length,
  //   Medium: scanResult.vulnerabilities.filter((v) => v.severity === "Medium")
  //     .length,
  //   Low: scanResult.vulnerabilities.filter((v) => v.severity === "Low").length,
  //   Total: scanResult.vulnerabilities.length,
  // };

  // Filter vulnerabilities based on selected severity
  // const filteredVulnerabilities =
  //   severityFilter === "all"
  //     ? scanResult.vulnerabilities
  //     : scanResult.vulnerabilities.filter((v) => v.severity === severityFilter);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "High":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "Medium":
        return <Info className="h-5 w-5 text-yellow-500" />;
      case "Low":
        return <Info className="h-5 w-5 text-green-500" />;
      case "Informational":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, string> = {
      Critical: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
      High: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
      Medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
      Low: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      Informational: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    };

    return (
      <Badge variant="outline" className={variants[severity] || ""}>
        {severity}
      </Badge>
    );
  };

  const getConfidenceBadge = (confidence: string) => {
    const variants: Record<string, string> = {
      Confirmed: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      Probable: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
      Possible: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    };

    return (
      <Badge variant="outline" className={variants[confidence] || ""}>
        {confidence}
      </Badge>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description:
            "The vulnerability details have been copied to your clipboard",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Failed to copy",
          description: "An error occurred while copying to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  const markResolved = async (resultId: string) => {
    try {
      const response = await authenticatedFetch(
        `${serverUrl}/secure/mark-resolved/`,
        {
          method: "POST",
          body: JSON.stringify({ unique_id: resultId }),
        }
      );

      if (response.ok) {
        setVulnStates((prev) => ({
          ...prev,
          [resultId]: { ...prev[resultId], resolved: true },
        }));
        setFilteredReports(prev => 
          prev.map(vuln => 
            vuln.unique_id === resultId 
              ? { ...vuln, resolved: true }
              : vuln
          )
        );
        toast({
          title: "Marked as resolved",
          description: "The vulnerability has been marked as resolved",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as resolved",
        variant: "destructive",
      });
    }
  };

  const markFalsePositive = async (resultId: string) => {
    try {
      const response = await authenticatedFetch(
        `${serverUrl}/secure/mark-false-positive/`,
        {
          method: "POST",
          body: JSON.stringify({ unique_id: resultId }),
        }
      );

      if (response.ok) {
        setVulnStates((prev) => ({
          ...prev,
          [resultId]: { ...prev[resultId], marked_as_false_positive: true },
        }));
        setFilteredReports(prev => 
          prev.map(vuln => 
            vuln.unique_id === resultId 
              ? { ...vuln, marked_as_false_positive: true }
              : vuln
          )
        );
        toast({
          title: "Marked as false positive",
          description: "The vulnerability has been marked as false positive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as false positive",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-[#121212] text-white flex">
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
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-5 w-5" />
                <span>Scans</span>
              </Link>
              <Link
                href="/results"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium bg-[#0080ff]/20 text-[#0080ff]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="h-5 w-5" />
                <span>Results</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-gray-800 bg-[#1a1a1a]/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-4">
              <button
                className="inline-flex md:hidden items-center justify-center rounded-md text-sm font-medium border border-gray-700 hover:bg-gray-800 h-10 w-10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle Menu</span>
              </button>

              <div className="flex-1 flex items-center gap-4">
                <Link
                  href="/results"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm">Back to Results</span>
                </Link>
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-bold">
                  Scan Report: {report?.url}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Rescan
                </Button>
              </div>
            </div>
          </header>

          {/* Results Content */}
          <main className="w-full py-6 px-6">
            {/* Summary Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Target
                    </h3>
                    <div className="flex items-center gap-2">
                      <Globe />
                      <p className="font-medium">{report?.url || ""}</p>
                    </div>
                    {/* <p className="text-sm text-muted-foreground mt-1">
                    IP: {scanResult.ipAddress}
                  </p> */}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Scan Type
                    </h3>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <p className="font-medium">{"Active"} Scan</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {/* Duration: {scanResult.duration} */}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Scan Time
                    </h3>
                    <div className="flex items-center gap-2">
                      <Clock />
                      <p className="font-medium">Completed</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(report?.start_time || "").toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Vulnerabilities
                    </h3>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                      <p className="font-medium">
                        {report?.vulnerabilities} Found
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {report?.critical} critical, {report?.high} high
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vulnerability Summary */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Vulnerabilities</CardTitle>
                    <CardDescription>
                      Security issues detected during the scan
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={severityFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSeverityFilter("all")}
                    >
                      All ({report?.vulnerabilities})
                    </Button>
                    <Button
                      variant={
                        severityFilter === "Critical" ? "default" : "outline"
                      }
                      size="sm"
                      className={
                        severityFilter !== "Critical"
                          ? "text-red-500 border-red-500/20"
                          : ""
                      }
                      onClick={() => setSeverityFilter("Critical")}
                    >
                      Critical ({report?.critical})
                    </Button>
                    <Button
                      variant={
                        severityFilter === "High" ? "default" : "outline"
                      }
                      size="sm"
                      className={
                        severityFilter !== "High"
                          ? "text-orange-500 border-orange-500/20"
                          : ""
                      }
                      onClick={() => setSeverityFilter("High")}
                    >
                      High ({report?.high})
                    </Button>
                    <Button
                      variant={
                        severityFilter === "Medium" ? "default" : "outline"
                      }
                      size="sm"
                      className={
                        severityFilter !== "Medium"
                          ? "text-yellow-500 border-yellow-500/20"
                          : ""
                      }
                      onClick={() => setSeverityFilter("Medium")}
                    >
                      Medium ({report?.medium})
                    </Button>
                    <Button
                      variant={severityFilter === "Low" ? "default" : "outline"}
                      size="sm"
                      className={
                        severityFilter !== "Low"
                          ? "text-green-500 border-green-500/20"
                          : ""
                      }
                      onClick={() => setSeverityFilter("Low")}
                    >
                      Low ({report?.low})
                    </Button>
                    <Button
                      variant={
                        severityFilter === "Informational"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className={
                        severityFilter !== "Informational"
                          ? "text-blue-500 border-blue-500/20"
                          : ""
                      }
                      onClick={() => setSeverityFilter("Informational")}
                    >
                      Informational ({report?.informational})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredReports?.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">
                        {severityFilter === "all"
                          ? "No vulnerabilities found"
                          : severityFilter === "Critical"
                          ? "No critical vulnerabilities found"
                          : severityFilter === "High"
                          ? "No high vulnerabilities found"
                          : severityFilter === "Medium"
                          ? "No medium vulnerabilities found"
                          : "No low vulnerabilities found"}
                      </h3>
                      <p className="text-muted-foreground">
                        No security issues were detected with the selected
                        filter
                      </p>
                    </div>
                  ) : (
                    <Accordion type="multiple" className="space-y-4">
                      {filteredReports?.map((vuln, index) => (
                        <AccordionItem
                          key={vuln.id}
                          value={vuln.id}
                          className={`border rounded-lg overflow-hidden ${
                            vuln.risk === "Critical"
                              ? "border-red-500/30"
                              : vuln.risk === "High"
                              ? "border-orange-500/30"
                              : vuln.risk === "Medium"
                              ? "border-yellow-500/30"
                              : "border-green-500/30"
                          }`}
                        >
                          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 [&[data-state=open]]:bg-muted/50">
                            <div className="flex items-center gap-3 w-full">
                              {getSeverityIcon(vuln.risk)}
                              <div className="flex-1 text-left">
                                <div className="font-medium">{vuln.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {vuln.alert_name} • {vuln.url}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getSeverityBadge(vuln.risk)}
                                {getConfidenceBadge(vuln.confidence)}
                                {(vulnStates[vuln.id]?.resolved || vuln.resolved) && (
                                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Resolved
                                  </Badge>
                                )}
                                {(vulnStates[vuln.id]?.marked_as_false_positive || vuln.marked_as_false_positive) && (
                                  <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                                    <X className="h-3 w-3 mr-1" />
                                    False Positive
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 pt-0">
                            <div className="pl-8 space-y-4">
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                  Description
                                </h4>
                                <p>{vuln.description}</p>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                  Solution
                                </h4>
                                <p>{vuln.solution}</p>
                              </div>

                              {/* <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Tool Information
                              </h4>
                              <p>Detected using {vuln.tool}</p>
                            </div> */}

                              <div className="flex flex-wrap gap-4">
                                {/* {vuln.cveId && (
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                    CVE Reference
                                  </h4>
                                  <a
                                    href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${vuln.cveId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-primary hover:underline"
                                  >
                                    {vuln.cveId}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              )}

                              {vuln.references &&
                                vuln.references.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                      References
                                    </h4>
                                    <ul className="space-y-1">
                                      {vuln.references.map((ref, i) => (
                                        <li key={i}>
                                          <a
                                            href={ref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-primary hover:underline"
                                          >
                                            <LinkIcon className="h-3 w-3" />
                                            Advisory {i + 1}
                                            <ExternalLink className="h-3 w-3" />
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )} */}
                              </div>

                              <div className="flex gap-2 pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    copyToClipboard(
                                      `Vulnerability: ${vuln.name}\nSeverity: ${vuln.risk}\nDescription: ${vuln.description}\nSolution: ${vuln.solution}\nID: ${vuln.id}`
                                    )
                                  }
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy Details
                                </Button>
                                {!vulnStates[vuln.id]?.resolved && 
                                  !vulnStates[vuln.id]?.marked_as_false_positive &&
                                  !vuln.resolved &&
                                  !vuln.marked_as_false_positive && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          markResolved(vuln.unique_id)
                                        }
                                      >
                                        Mark Resolved
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          markFalsePositive(vuln.unique_id)
                                        }
                                      >
                                        False Positive
                                      </Button>
                                    </>
                                  )}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Technical Details */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scanResult.ports && scanResult.ports.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Port Scan Results</CardTitle>
                  <CardDescription>
                    Open ports and services detected
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-3 gap-4 p-3 font-medium border-b">
                      <div>Port</div>
                      <div>Service</div>
                      <div>Status</div>
                    </div>
                    {scanResult.ports.map((port, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-4 p-3 border-b last:border-0"
                      >
                        <div>{port.port}</div>
                        <div>{port.service}</div>
                        <div>
                          <Badge
                            variant="outline"
                            className={
                              port.status === "open"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {port.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {scanResult.techStack && scanResult.techStack.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Technology Stack</CardTitle>
                  <CardDescription>
                    Detected technologies and versions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-3 gap-4 p-3 font-medium border-b">
                      <div>Technology</div>
                      <div>Version</div>
                      <div>Category</div>
                    </div>
                    {scanResult.techStack.map((tech, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-4 p-3 border-b last:border-0"
                      >
                        <div className="font-medium">{tech.name}</div>
                        <div>{tech.version}</div>
                        <div className="text-muted-foreground">
                          {tech.category}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div> */}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

/* Add missing icon components */
function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-primary"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-primary"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
