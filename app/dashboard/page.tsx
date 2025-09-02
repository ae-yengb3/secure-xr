"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Users,
  FileText,
  ArrowRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonutChart } from "@/components/ui/chart";
import { useAppSelector, useAppDispatch } from "@/lib/hook";
import { useRouter } from "next/navigation";
import { getMe, loginUser } from "@/lib/utils/user";
import { getReports, getScans } from "@/lib/utils/scan";
import { ScanResult, VulnerabilityResult } from "@/lib/scan-engine";
import moment from "moment";
import { wsManager } from "@/lib/utils/websocket";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [scanResults, setScanResults] = useState<VulnerabilityResult[]>([]);
  const [lastReport, setLastReport] = useState<ScanResult | null>(null);
  const [dashboardData, setDashboardData] = useState({
    total_scans: 0,
    completed_scans: 0,
    activeScans: 0,
    vulnerabilities: 0,
  });

  const [liveScans, setLiveScans] = useState([]);

  const { user, token } = useAppSelector((state) => state.user);
  const { scans, extra, reports } = useAppSelector((state) => state.scan);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user) {
      const token = sessionStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      wsManager.connect(token).catch(console.error);
    }
  }, [user, token]);

  useEffect(() => {
    if (!token) {
      const token = sessionStorage.getItem("token");
      if (token) {
        dispatch(getMe());
      }
    }
  }, []);

  useEffect(() => {
    dispatch(getMe());
    dispatch(getScans());
    dispatch(getReports());
  }, []);

  useEffect(() => {
    if (reports) {
      const lastReport = reports[reports.length - 1];

      setScanResults([...(lastReport?.alerts || [])].splice(0, 5));
      setLastReport(lastReport);
    }
  }, [reports]);

  useEffect(() => {
    setDashboardData({
      total_scans: scans?.length,
      // @ts-ignore
      completed_scans: scans?.filter((scan) => scan.progress === 100).length,
      // @ts-ignore
      activeScans: scans?.filter((scan) => scan.progress < 100).length,
      vulnerabilities: extra
        ? extra?.critical + extra?.high + extra?.medium + extra?.low
        : 0,
    });

    // @ts-ignore
    setLiveScans(scans?.filter((scan) => scan.progress < 100));
  }, [scans]);

  // Sample data for charts
  const vulnerabilityData = [
    { name: "Critical", value: extra?.critical as number, color: "#ff3333" },
    { name: "High", value: extra?.high as number, color: "#ff9933" },
    { name: "Medium", value: extra?.medium as number, color: "#ffcc33" },
    { name: "Low", value: extra?.low as number, color: "#0080ff" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, {user?.fullname?.split(" ")[0]}. Here's what's
            happening with your network.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-[#0080ff] hover:bg-[#0060cc]"
            onClick={() => {
              router.push("/scans");
            }}
          >
            <Play className="mr-2 h-4 w-4" />
            Start New Scan
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        className="space-y-6"
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-[#1a1a1a] border border-gray-800">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="scans"
            className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white"
          >
            Scans
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white"
          >
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Total Scans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-[#0080ff] mr-2" />
                  <div className="text-2xl font-bold">
                    {dashboardData.total_scans}
                  </div>
                </div>
                {/* <p className="text-xs text-gray-400 mt-1">
                  +12% from last month
                </p> */}
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Completed Scans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  <div className="text-2xl font-bold">
                    {dashboardData.completed_scans}
                  </div>
                </div>
                {/* <p className="text-xs text-gray-400 mt-1">
                  98.8% completion rate
                </p> */}
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Active Scans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-[#ffcc33] mr-2" />
                  <div className="text-2xl font-bold">
                    {dashboardData.activeScans}
                  </div>
                </div>
                {/* <p className="text-xs text-gray-400 mt-1">
                  2 scheduled for today
                </p> */}
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Vulnerabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertTriangle className="h-6 w-6 text-[#ff3333] mr-2" />
                  <div className="text-2xl font-bold">
                    {dashboardData?.vulnerabilities || 0}
                  </div>
                </div>
                {/* <p className="text-xs text-gray-400 mt-1">12 critical issues</p> */}
              </CardContent>
            </Card>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vulnerability Overview */}
            <Card className="bg-[#1a1a1a] border-gray-800 lg:col-span-1">
              <CardHeader>
                <CardTitle>Vulnerability Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  Distribution by severity
                </CardDescription>
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
                  <span>Critical: {extra?.critical || 0}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#ff9933] mr-2"></div>
                  <span>High: {extra?.high || 0}</span>
                </div>
              </CardFooter>
            </Card>

            {/* Live Scans */}
            <Card className="bg-[#1a1a1a] border-gray-800 lg:col-span-2">
              <CardHeader>
                <CardTitle>Live Scans</CardTitle>
                <CardDescription className="text-gray-400">
                  Currently running scans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveScans?.map((scan: any) => (
                    <div
                      // @ts-ignore
                      key={scan.scan_id}
                      className="bg-[#212121] p-3 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        {/* @ts-ignore */}
                        <div className="font-medium">{scan.url}</div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full"bg-[#0080ff]/20 text-[#0080ff]"`}
                        >
                          {/* @ts-ignore */}
                          In Progress
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                        {/* @ts-ignore */}
                        <span>Progress: {scan.progress}%</span>
                        {/* @ts-ignore */}
                        <span>
                          Started:{" "}
                          {moment(scan?.start_time || new Date()).fromNow()}
                        </span>
                      </div>
                      <Progress
                        // @ts-ignore
                        value={scan.progress}
                        className="h-1.5 bg-gray-700"
                        indicatorClassName="bg-[#0080ff]"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-gray-700 hover:bg-gray-800 hover:text-white"
                  onClick={() => router.push("/results")}
                >
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
                <CardDescription className="text-gray-400">
                  Latest security notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scanResults.map((alert) => (
                    <div
                      key={alert.id}
                      className={`bg-[#212121] p-3 rounded-lg flex items-start ${
                        alert.resolved ? "opacity-60" : ""
                      } ${alert.marked_as_false_positive ? "opacity-40" : ""}`}
                    >
                      <div
                        className={`p-1.5 rounded-full mr-3 ${
                          alert.resolved
                            ? "bg-green-500/20 text-green-500"
                            : alert.marked_as_false_positive
                            ? "bg-gray-500/20 text-gray-500"
                            : alert.risk === "Critical"
                            ? "bg-[#ff3333]/20 text-[#ff3333]"
                            : alert.risk === "High"
                            ? "bg-[#ff9933]/20 text-[#ff9933]"
                            : "bg-[#ffcc33]/20 text-[#ffcc33]"
                        }`}
                      >
                        {alert.resolved ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : alert.marked_as_false_positive ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <div className="font-medium">
                              {alert.alert_name}
                            </div>
                            <div className="flex gap-2 mt-1">
                              {alert.resolved && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">
                                  Resolved
                                </span>
                              )}
                              {alert.marked_as_false_positive && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-500">
                                  False Positive
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {moment(lastReport?.start_time).fromNow()}
                          </div>
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            alert.resolved || alert.marked_as_false_positive
                              ? "text-gray-500"
                              : alert.risk === "Critical"
                              ? "text-[#ff3333]"
                              : alert.risk === "High"
                              ? "text-[#ff9933]"
                              : "text-[#ffcc33]"
                          }`}
                        >
                          {alert.risk} Severity
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-gray-700 hover:bg-gray-800 hover:text-white"
                >
                  View All Alerts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription className="text-gray-400">
                  Common tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full bg-[#0080ff] hover:bg-[#0060cc] justify-start"
                  onClick={() => {
                    router.push("/scans");
                  }}
                >
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

        <TabsContent value="scans" className="space-y-6 w-[80vw]">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle>Scan History</CardTitle>
              <CardDescription className="text-gray-400">
                All your recent and scheduled scans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#212121] border-b border-gray-800">
                        <th className="px-4 py-3 text-left font-medium">
                          Target
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          Start Time
                        </th>
                        <th className="px-4 py-3 text-left font-medium">
                          Issues
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* @ts-ignore */}
                      {Array.isArray(scans) &&
                        scans?.map((scan, i) => (
                          <tr
                            key={i}
                            className="border-b border-gray-800 hover:bg-[#212121]"
                          >
                            <td className="px-4 py-3">{scan?.url}</td>
                            <td className="px-4 py-3">{"Active"}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  scan?.progress === 100
                                    ? "bg-green-500/20 text-green-500"
                                    : scan.status === "In Progress"
                                    ? "bg-[#0080ff]/20 text-[#0080ff]"
                                    : "bg-yellow-500/20 text-yellow-500"
                                }`}
                              >
                                {scan?.progress === 100
                                  ? "Completed"
                                  : "In Progress"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {moment(scan?.start_time).fromNow()}
                            </td>
                            <td className="px-4 py-3">
                              {/* {scan.issues !== "-" && (
                              <span
                                // className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                //   Number.parseInt(scan.issues) > 5
                                //     ? "bg-[#ff3333]/20 text-[#ff3333]"
                                //     : Number.parseInt(scan.issues) > 0
                                //     ? "bg-[#ff9933]/20 text-[#ff9933]"
                                //     : "bg-green-500/20 text-green-500"
                                // }`}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ff9933]/20"
                              >

                                -
                              </span>
                            )} */}
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

        <TabsContent value="alerts" className="space-y-6 w-[80vw]">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription className="text-gray-400">
                All detected security issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scanResults.map((alert, i) => (
                  <div
                    key={i}
                    className={`bg-[#212121] p-4 rounded-lg ${
                      alert.resolved ? "opacity-60" : ""
                    } ${alert.marked_as_false_positive ? "opacity-40" : ""}`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`p-1.5 rounded-full mr-3 ${
                          alert.resolved
                            ? "bg-green-500/20 text-green-500"
                            : alert.marked_as_false_positive
                            ? "bg-gray-500/20 text-gray-500"
                            : alert.risk === "Critical"
                            ? "bg-[#ff3333]/20 text-[#ff3333]"
                            : alert.risk === "High"
                            ? "bg-[#ff9933]/20 text-[#ff9933]"
                            : "bg-[#ffcc33]/20 text-[#ffcc33]"
                        }`}
                      >
                        {alert.resolved ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : alert.marked_as_false_positive ? (
                          <X className="h-5 w-5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div className="flex flex-col">
                            <div className="font-medium">
                              {alert.alert_name}
                            </div>
                            <div className="flex gap-2 mt-1">
                              {alert.resolved && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">
                                  Resolved
                                </span>
                              )}
                              {alert.marked_as_false_positive && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-500">
                                  False Positive
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {moment(lastReport?.start_time).fromNow()}
                          </div>
                        </div>
                        <div
                          className={`text-xs mt-1 mb-2 ${
                            alert.resolved || alert.marked_as_false_positive
                              ? "text-gray-500"
                              : alert.risk === "Critical"
                              ? "text-[#ff3333]"
                              : alert.risk === "High"
                              ? "text-[#ff9933]"
                              : "text-[#ffcc33]"
                          }`}
                        >
                          {alert.risk} Severity
                        </div>
                        <p className="text-sm text-gray-400">
                          {alert.description}
                        </p>
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
  );
}
