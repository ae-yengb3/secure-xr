"use client";

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
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Activity,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { getAllScanResults } from "../actions/scan-actions";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import type { ScanResult, VulnerabilityResult } from "@/lib/scan-engine";
import { getReports } from "@/lib/utils/scan";
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
import moment from "moment";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scans", label: "Scans", icon: Search },
  { href: "/results", label: "Results", icon: FileText },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
];

export default function ResultsPage() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const { extra, reports, scans } = useAppSelector((state) => state.scan);

  useEffect(() => {
    dispatch(getReports());
  }, []);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const getRiskBadge = (risk: string | null) => {
    if (!risk) return null;

    const variants: Record<string, string> = {
      Critical: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
      High: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
      Medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
      Low: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    };

    return (
      <Badge variant="outline" className={variants[risk] || ""}>
        {risk}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Completed: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      "In Progress": "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
      Failed: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    };

    return (
      <Badge variant="outline" className={variants[status] || ""}>
        {status}
      </Badge>
    );
  };

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

              <div className="flex-1 flex justify-center md:justify-start">
                <h1 className="text-xl font-bold">Scan Results</h1>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/scans">
                  <Button size="sm" className="bg-[#0080ff] hover:bg-[#0060cc]">
                    <Search className="h-4 w-4 mr-2" />
                    New Scan
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          {/* Results Content */}
          <main className="container py-6">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-white">Scan Results</CardTitle>
                    <CardDescription className="text-gray-400">
                      View and analyze your security scan results
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search targets..."
                        className="pl-8 w-full sm:w-[200px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Filter className="h-4 w-4" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <div className="p-2">
                          <p className="text-sm font-medium mb-2">Status</p>
                          <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="Completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="In Progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="Failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Separator className="my-2" />
                        <div className="p-2">
                          <p className="text-sm font-medium mb-2">Risk Level</p>
                          <Select
                            value={riskFilter}
                            onValueChange={setRiskFilter}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select risk level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Levels</SelectItem>
                              <SelectItem value="Critical">Critical</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Summary Bar */}
                <div className="mb-6 p-4 rounded-lg bg-card border border-border/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                      <div className="text-sm text-muted-foreground">
                        Total Scans
                      </div>
                      <div className="text-2xl font-bold">
                        {scans?.length || 0}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400">Critical</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-red-500">
                          {extra?.critical || 0}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400">High</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-orange-500">
                          {extra?.high || 0}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400">Medium</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-yellow-500">
                          {extra?.medium || 0}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400">Low</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-green-500">
                          {extra?.low || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Table */}
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 gap-4 p-4 font-medium border-b">
                    <button
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("target")}
                    >
                      Target {getSortIcon("target")}
                    </button>
                    <div>Status</div>
                    <button
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("vulnerabilities")}
                    >
                      Vulnerabilities {getSortIcon("vulnerabilities")}
                    </button>
                    <div>Risk Level</div>
                    <div>Scan Type</div>
                    <div>Duration</div>
                    <button
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      Date {getSortIcon("date")}
                    </button>
                  </div>

                  {reports?.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">
                        No scan results match your filters
                      </p>
                    </div>
                  ) : (
                    // @ts-ignore
                    reports?.map((report) => (
                      <div
                        key={report.id}
                        className="grid grid-cols-7 gap-4 p-4 border-b last:border-0 items-center hover:bg-muted/50 transition-colors"
                      >
                        <div className="font-medium">
                          <Link
                            href={`/results/${report.id}`}
                            className="hover:underline flex items-center gap-1"
                          >
                            {report.url}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                        <div>{getStatusBadge("Completed")}</div>
                        <div>
                          {report?.vulnerabilities > 0 ? (
                            <div className="flex items-center gap-1">
                              {report.vulnerabilities > 0 ? (
                                <AlertTriangle
                                  className={`h-3 w-3 ${
                                    report?.critical > 0
                                      ? "text-red-500"
                                      : report?.high > 0
                                      ? "text-orange-500"
                                      : report?.medium > 0
                                      ? "text-yellow-500"
                                      : "text-green-500"
                                  }`}
                                />
                              ) : (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              )}
                              <span>{report?.vulnerabilities}</span>
                              {report?.resolved_count > 0 && (
                                <span className="text-xs text-green-500">({report.resolved_count} resolved)</span>
                              )}
                              {report?.false_positive_count > 0 && (
                                <span className="text-xs text-gray-500">({report.false_positive_count} FP)</span>
                              )}
                            </div>
                          ) : (
                            <div>-</div>
                          )}
                        </div>
                        <div>
                          {report?.critical > 0
                            ? "Critical"
                            : report?.high > 0
                            ? "High"
                            : report?.medium > 0
                            ? "Medium"
                            : "Low"}
                        </div>
                        <div className="text-muted-foreground">{"Active"}</div>
                        <div className="text-muted-foreground">
                          {moment(report?.end_time || new Date()).diff(
                            moment(report?.start_time || new Date()),
                            "minutes"
                          )}{" "}
                          minutes
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            {new Date(report.start_time).toLocaleDateString()}
                          </span>
                          {/* {result.status === "Completed" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Download Report"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )} */}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
