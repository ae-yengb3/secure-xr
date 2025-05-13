"use client"

import { useState } from "react"
import { Shield, AlertTriangle, CheckCircle, Clock, Play, Users, FileText, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DonutChart } from "@/components/ui/chart"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for charts
  const vulnerabilityData = [
    { name: "Critical", value: 12, color: "#ff3333" },
    { name: "High", value: 24, color: "#ff9933" },
    { name: "Medium", value: 36, color: "#ffcc33" },
    { name: "Low", value: 28, color: "#0080ff" },
  ]

  // Sample data for scans
  const activeScans = [
    { id: 1, target: "192.168.1.0/24", status: "In Progress", progress: 65, startTime: "10:30 AM" },
    { id: 2, target: "10.0.0.1", status: "Starting", progress: 5, startTime: "10:45 AM" },
    { id: 3, target: "web-server.local", status: "In Progress", progress: 32, startTime: "10:15 AM" },
  ]

  // Sample data for alerts
  const recentAlerts = [
    { id: 1, message: "Open Port Detected on 192.168.1.1", severity: "Critical", time: "11:23 AM" },
    { id: 2, message: "Outdated SSL Certificate on web-server", severity: "High", time: "10:45 AM" },
    { id: 3, message: "Unusual Login Activity Detected", severity: "Medium", time: "09:30 AM" },
    { id: 4, message: "Firewall Rule Misconfiguration", severity: "High", time: "Yesterday" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Welcome back, John. Here's what's happening with your network.</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#0080ff] hover:bg-[#0060cc]">
            <Play className="mr-2 h-4 w-4" />
            Start New Scan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="bg-[#1a1a1a] border border-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="scans" className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white">
            Scans
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white">
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-[#0080ff] mr-2" />
                  <div className="text-2xl font-bold">248</div>
                </div>
                <p className="text-xs text-gray-400 mt-1">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Completed Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  <div className="text-2xl font-bold">245</div>
                </div>
                <p className="text-xs text-gray-400 mt-1">98.8% completion rate</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Active Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-[#ffcc33] mr-2" />
                  <div className="text-2xl font-bold">3</div>
                </div>
                <p className="text-xs text-gray-400 mt-1">2 scheduled for today</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Vulnerabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertTriangle className="h-6 w-6 text-[#ff3333] mr-2" />
                  <div className="text-2xl font-bold">36</div>
                </div>
                <p className="text-xs text-gray-400 mt-1">12 critical issues</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vulnerability Overview */}
            <Card className="bg-[#1a1a1a] border-gray-800 lg:col-span-1">
              <CardHeader>
                <CardTitle>Vulnerability Overview</CardTitle>
                <CardDescription className="text-gray-400">Distribution by severity</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-48 h-48">
                  <DonutChart
                    data={vulnerabilityData}
                    category="value"
                    index="name"
                    valueFormatter={(value) => `${value} issues`}
                    colors={vulnerabilityData.map((item) => item.color)}
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-gray-400">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#ff3333] mr-2"></div>
                  <span>Critical: 12</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#ff9933] mr-2"></div>
                  <span>High: 24</span>
                </div>
              </CardFooter>
            </Card>

            {/* Live Scans */}
            <Card className="bg-[#1a1a1a] border-gray-800 lg:col-span-2">
              <CardHeader>
                <CardTitle>Live Scans</CardTitle>
                <CardDescription className="text-gray-400">Currently running scans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeScans.map((scan) => (
                    <div key={scan.id} className="bg-[#212121] p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{scan.target}</div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            scan.status === "In Progress"
                              ? "bg-[#0080ff]/20 text-[#0080ff]"
                              : "bg-yellow-500/20 text-yellow-500"
                          }`}
                        >
                          {scan.status}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                        <span>Progress: {scan.progress}%</span>
                        <span>Started: {scan.startTime}</span>
                      </div>
                      <Progress value={scan.progress} className="h-1.5 bg-gray-700" indicatorClassName="bg-[#0080ff]" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 hover:text-white">
                  View All Scans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Alerts and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Alerts */}
            <Card className="bg-[#1a1a1a] border-gray-800 lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription className="text-gray-400">Latest security notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="bg-[#212121] p-3 rounded-lg flex items-start">
                      <div
                        className={`p-1.5 rounded-full mr-3 ${
                          alert.severity === "Critical"
                            ? "bg-[#ff3333]/20 text-[#ff3333]"
                            : alert.severity === "High"
                              ? "bg-[#ff9933]/20 text-[#ff9933]"
                              : "bg-[#ffcc33]/20 text-[#ffcc33]"
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="font-medium">{alert.message}</div>
                          <div className="text-xs text-gray-400">{alert.time}</div>
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            alert.severity === "Critical"
                              ? "text-[#ff3333]"
                              : alert.severity === "High"
                                ? "text-[#ff9933]"
                                : "text-[#ffcc33]"
                          }`}
                        >
                          {alert.severity} Severity
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 hover:text-white">
                  View All Alerts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription className="text-gray-400">Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-[#0080ff] hover:bg-[#0060cc] justify-start">
                  <Play className="mr-2 h-4 w-4" />
                  Start New Scan
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-700 hover:bg-gray-800 hover:text-white justify-start"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Hosts
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-700 hover:bg-gray-800 hover:text-white justify-start"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scans" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle>Scan History</CardTitle>
              <CardDescription className="text-gray-400">All your recent and scheduled scans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#212121] border-b border-gray-800">
                        <th className="px-4 py-3 text-left font-medium">Target</th>
                        <th className="px-4 py-3 text-left font-medium">Type</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-left font-medium">Start Time</th>
                        <th className="px-4 py-3 text-left font-medium">Duration</th>
                        <th className="px-4 py-3 text-left font-medium">Issues</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          target: "192.168.1.0/24",
                          type: "Full Network",
                          status: "In Progress",
                          startTime: "Today, 10:30 AM",
                          duration: "45m",
                          issues: "8",
                        },
                        {
                          target: "web-server.local",
                          type: "Web Application",
                          status: "In Progress",
                          startTime: "Today, 10:15 AM",
                          duration: "1h",
                          issues: "3",
                        },
                        {
                          target: "mail-server.local",
                          type: "Service Scan",
                          status: "Completed",
                          startTime: "Yesterday, 2:30 PM",
                          duration: "35m",
                          issues: "2",
                        },
                        {
                          target: "10.0.0.1",
                          type: "Vulnerability Scan",
                          status: "Starting",
                          startTime: "Today, 10:45 AM",
                          duration: "-",
                          issues: "-",
                        },
                        {
                          target: "database.local",
                          type: "Service Scan",
                          status: "Completed",
                          startTime: "Yesterday, 11:20 AM",
                          duration: "28m",
                          issues: "0",
                        },
                      ].map((scan, i) => (
                        <tr key={i} className="border-b border-gray-800 hover:bg-[#212121]">
                          <td className="px-4 py-3">{scan.target}</td>
                          <td className="px-4 py-3">{scan.type}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                scan.status === "Completed"
                                  ? "bg-green-500/20 text-green-500"
                                  : scan.status === "In Progress"
                                    ? "bg-[#0080ff]/20 text-[#0080ff]"
                                    : "bg-yellow-500/20 text-yellow-500"
                              }`}
                            >
                              {scan.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">{scan.startTime}</td>
                          <td className="px-4 py-3">{scan.duration}</td>
                          <td className="px-4 py-3">
                            {scan.issues !== "-" && (
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  Number.parseInt(scan.issues) > 5
                                    ? "bg-[#ff3333]/20 text-[#ff3333]"
                                    : Number.parseInt(scan.issues) > 0
                                      ? "bg-[#ff9933]/20 text-[#ff9933]"
                                      : "bg-green-500/20 text-green-500"
                                }`}
                              >
                                {scan.issues}
                              </span>
                            )}
                            {scan.issues === "-" && "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription className="text-gray-400">All detected security issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    message: "Open Port Detected on 192.168.1.1",
                    severity: "Critical",
                    time: "Today, 11:23 AM",
                    description:
                      "Port 23 (Telnet) is open and accessible from the internet. This poses a significant security risk as Telnet transmits data in plaintext.",
                  },
                  {
                    message: "Outdated SSL Certificate on web-server",
                    severity: "High",
                    time: "Today, 10:45 AM",
                    description:
                      "The SSL certificate for web-server.local is using an outdated encryption algorithm (SHA-1) which is considered insecure.",
                  },
                  {
                    message: "Unusual Login Activity Detected",
                    severity: "Medium",
                    time: "Today, 09:30 AM",
                    description:
                      "Multiple failed login attempts detected from IP 203.45.78.92 targeting admin accounts.",
                  },
                  {
                    message: "Firewall Rule Misconfiguration",
                    severity: "High",
                    time: "Yesterday, 3:15 PM",
                    description:
                      "Firewall rule #23 allows unrestricted access to internal network from external sources.",
                  },
                  {
                    message: "Outdated Software Detected",
                    severity: "Medium",
                    time: "Yesterday, 1:20 PM",
                    description:
                      "Apache server running version 2.2.15 which has known vulnerabilities. Update to latest version recommended.",
                  },
                ].map((alert, i) => (
                  <div key={i} className="bg-[#212121] p-4 rounded-lg">
                    <div className="flex items-start">
                      <div
                        className={`p-1.5 rounded-full mr-3 ${
                          alert.severity === "Critical"
                            ? "bg-[#ff3333]/20 text-[#ff3333]"
                            : alert.severity === "High"
                              ? "bg-[#ff9933]/20 text-[#ff9933]"
                              : "bg-[#ffcc33]/20 text-[#ffcc33]"
                        }`}
                      >
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div className="font-medium">{alert.message}</div>
                          <div className="text-xs text-gray-400">{alert.time}</div>
                        </div>
                        <div
                          className={`text-xs mt-1 mb-2 ${
                            alert.severity === "Critical"
                              ? "text-[#ff3333]"
                              : alert.severity === "High"
                                ? "text-[#ff9933]"
                                : "text-[#ffcc33]"
                          }`}
                        >
                          {alert.severity} Severity
                        </div>
                        <p className="text-sm text-gray-400">{alert.description}</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="bg-[#0080ff] hover:bg-[#0060cc]">
                            Resolve
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-700 hover:bg-gray-800">
                            Ignore
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
