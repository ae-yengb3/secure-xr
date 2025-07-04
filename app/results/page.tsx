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

export default function ResultsPage() {
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
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-accent hover:text-foreground"
          >
            <Search className="h-5 w-5" />
            Scan
          </Link>
          <Link
            href="/results"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium bg-primary/10 text-primary"
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
              <h1 className="text-xl font-bold">Scan Results</h1>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/scan">
                <Button size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  New Scan
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Results Content */}
        <main className="container py-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Scan Results</CardTitle>
                  <CardDescription>
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
                            <SelectItem value="Completed">Completed</SelectItem>
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
                    <div className="text-sm text-muted-foreground">
                      Critical
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-red-500">
                        {extra?.critical || 0}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">High</div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-orange-500">
                        {extra?.high || 0}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Medium</div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-yellow-500">
                        {extra?.medium || 0}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Low</div>
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
                        {/* {result.duration} */}
                        {"30 minutes"}
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
  );
}
