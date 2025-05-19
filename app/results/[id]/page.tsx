"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getScanResult } from "@/app/actions/scan-actions"
import type { ScanResult } from "@/lib/scan-engine"
import { useToast } from "@/components/ui/use-toast"

export default function ScanResultDetail({ params }: { params: { id: string } }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [severityFilter, setSeverityFilter] = useState("all")
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchScanResult() {
      try {
        const result = await getScanResult(params.id)
        setScanResult(result)
      } catch (error) {
        console.error("Error fetching scan result:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchScanResult()
  }, [params.id])

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
    )
  }

  if (!scanResult) {
    return (
      <div className="min-h-screen bg-background text-foreground flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h1 className="text-2xl font-bold">Scan Result Not Found</h1>
          <p className="text-muted-foreground">The scan result you're looking for doesn't exist or has been deleted.</p>
          <Link href="/results">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Count vulnerabilities by severity
  const vulnerabilityCounts = {
    Critical: scanResult.vulnerabilities.filter((v) => v.severity === "Critical").length,
    High: scanResult.vulnerabilities.filter((v) => v.severity === "High").length,
    Medium: scanResult.vulnerabilities.filter((v) => v.severity === "Medium").length,
    Low: scanResult.vulnerabilities.filter((v) => v.severity === "Low").length,
    Total: scanResult.vulnerabilities.length,
  }

  // Filter vulnerabilities based on selected severity
  const filteredVulnerabilities =
    severityFilter === "all"
      ? scanResult.vulnerabilities
      : scanResult.vulnerabilities.filter((v) => v.severity === severityFilter)

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "High":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "Medium":
        return <Info className="h-5 w-5 text-yellow-500" />
      case "Low":
        return <Info className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, string> = {
      Critical: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
      High: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
      Medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
      Low: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    }

    return (
      <Badge variant="outline" className={variants[severity] || ""}>
        {severity}
      </Badge>
    )
  }

  const getConfidenceBadge = (confidence: string) => {
    const variants: Record<string, string> = {
      Confirmed: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      Probable: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
      Possible: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    }

    return (
      <Badge variant="outline" className={variants[confidence] || ""}>
        {confidence}
      </Badge>
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "The vulnerability details have been copied to your clipboard",
        })
      },
      (err) => {
        console.error("Could not copy text: ", err)
        toast({
          title: "Failed to copy",
          description: "An error occurred while copying to clipboard",
          variant: "destructive",
        })
      },
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border/40 transform transition-transform duration-200 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
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
            href="/scan"
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
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="sr-only">Toggle Menu</span>
            </button>

            <div className="flex-1 flex items-center gap-4">
              <Link href="/results" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back to Results</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl font-bold">Scan Report: {scanResult.target}</h1>
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
        <main className="container py-6">
          {/* Summary Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Target</h3>
                  <div className="flex items-center gap-2">
                    <Globe />
                    <p className="font-medium">{scanResult.target}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">IP: {scanResult.ipAddress}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Scan Type</h3>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <p className="font-medium">{scanResult.scanType} Scan</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Duration: {scanResult.duration}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Scan Time</h3>
                  <div className="flex items-center gap-2">
                    <Clock />
                    <p className="font-medium">Completed</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{new Date(scanResult.endTime).toLocaleString()}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Vulnerabilities</h3>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    <p className="font-medium">{vulnerabilityCounts.Total} Found</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {vulnerabilityCounts.Critical} critical, {vulnerabilityCounts.High} high
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
                  <CardDescription>Security issues detected during the scan</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={severityFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSeverityFilter("all")}
                  >
                    All ({vulnerabilityCounts.Total})
                  </Button>
                  <Button
                    variant={severityFilter === "Critical" ? "default" : "outline"}
                    size="sm"
                    className={severityFilter !== "Critical" ? "text-red-500 border-red-500/20" : ""}
                    onClick={() => setSeverityFilter("Critical")}
                  >
                    Critical ({vulnerabilityCounts.Critical})
                  </Button>
                  <Button
                    variant={severityFilter === "High" ? "default" : "outline"}
                    size="sm"
                    className={severityFilter !== "High" ? "text-orange-500 border-orange-500/20" : ""}
                    onClick={() => setSeverityFilter("High")}
                  >
                    High ({vulnerabilityCounts.High})
                  </Button>
                  <Button
                    variant={severityFilter === "Medium" ? "default" : "outline"}
                    size="sm"
                    className={severityFilter !== "Medium" ? "text-yellow-500 border-yellow-500/20" : ""}
                    onClick={() => setSeverityFilter("Medium")}
                  >
                    Medium ({vulnerabilityCounts.Medium})
                  </Button>
                  <Button
                    variant={severityFilter === "Low" ? "default" : "outline"}
                    size="sm"
                    className={severityFilter !== "Low" ? "text-green-500 border-green-500/20" : ""}
                    onClick={() => setSeverityFilter("Low")}
                  >
                    Low ({vulnerabilityCounts.Low})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVulnerabilities.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No vulnerabilities found</h3>
                    <p className="text-muted-foreground">No security issues were detected with the selected filter</p>
                  </div>
                ) : (
                  <Accordion type="multiple" className="space-y-4">
                    {filteredVulnerabilities.map((vuln, index) => (
                      <AccordionItem
                        key={vuln.id}
                        value={vuln.id}
                        className={`border rounded-lg overflow-hidden ${
                          vuln.severity === "Critical"
                            ? "border-red-500/30"
                            : vuln.severity === "High"
                              ? "border-orange-500/30"
                              : vuln.severity === "Medium"
                                ? "border-yellow-500/30"
                                : "border-green-500/30"
                        }`}
                      >
                        <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 [&[data-state=open]]:bg-muted/50">
                          <div className="flex items-center gap-3 w-full">
                            {getSeverityIcon(vuln.severity)}
                            <div className="flex-1 text-left">
                              <div className="font-medium">{vuln.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {vuln.id} • {vuln.affected}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getSeverityBadge(vuln.severity)}
                              {getConfidenceBadge(vuln.confidence)}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-0">
                          <div className="pl-8 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                              <p>{vuln.description}</p>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">Details</h4>
                              <p>{vuln.details}</p>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">Tool Information</h4>
                              <p>Detected using {vuln.tool}</p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                              {vuln.cveId && (
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground mb-1">CVE Reference</h4>
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

                              {vuln.references && vuln.references.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground mb-1">References</h4>
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
                              )}
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  copyToClipboard(
                                    `Vulnerability: ${vuln.name}\nSeverity: ${vuln.severity}\nDescription: ${
                                      vuln.description
                                    }\nDetails: ${vuln.details}\nAffected: ${
                                      vuln.affected
                                    }\nID: ${vuln.id}\nReferences: ${vuln.references?.join(", ") || "None"}`,
                                  )
                                }
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy Details
                              </Button>
                              <Button variant="outline" size="sm">
                                Flag as False Positive
                              </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Port Scan Results */}
            {scanResult.ports && scanResult.ports.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Port Scan Results</CardTitle>
                  <CardDescription>Open ports and services detected</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-3 gap-4 p-3 font-medium border-b">
                      <div>Port</div>
                      <div>Service</div>
                      <div>Status</div>
                    </div>
                    {scanResult.ports.map((port, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
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

            {/* Technology Stack */}
            {scanResult.techStack && scanResult.techStack.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Technology Stack</CardTitle>
                  <CardDescription>Detected technologies and versions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-3 gap-4 p-3 font-medium border-b">
                      <div>Technology</div>
                      <div>Version</div>
                      <div>Category</div>
                    </div>
                    {scanResult.techStack.map((tech, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                        <div className="font-medium">{tech.name}</div>
                        <div>{tech.version}</div>
                        <div className="text-muted-foreground">{tech.category}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
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
  )
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
  )
}
