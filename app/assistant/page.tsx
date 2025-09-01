"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/lib/hook";
import { getReports } from "@/lib/utils/scan";
import {
  Shield,
  Bot,
  Send,
  User,
  LayoutDashboard,
  Search,
  FileText,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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

type ChatMessage = {
  id: number;
  type: "ai" | "user";
  message: string;
  timestamp: Date;
};

type Report = {
  id: string;
  url: string;
  vulnerabilities: number;
  date: string;
};

type VulnerabilityResult = {
  id: string;
  name: string;
  risk: string;
  description: string;
  url: string;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scans", label: "Scans", icon: Search },
  { href: "/results", label: "Results", icon: FileText },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
];

export default function AssistantPage() {
  const pathname = usePathname();
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "ai" as const,
      message: "Hello! I'm your AI security assistant. I can help you analyze vulnerabilities and provide security recommendations. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [selectedVulns, setSelectedVulns] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { reports } = useAppSelector((state) => state.scan);

  useEffect(() => {
    dispatch(getReports());
  }, [dispatch]);

  const availableReports = reports?.map((report, index) => ({
    id: index.toString(),
    url: report.url,
    vulnerabilities: report.vulnerabilities,
    date: new Date(report.start_time).toLocaleDateString(),
  })) || [];

  const vulnerabilities = reports?.flatMap((report) => 
    report.alerts?.map((alert) => ({
      id: alert.id,
      name: alert.alert_name,
      risk: alert.risk,
      description: alert.description,
      url: alert.url,
      marked_as_false_positive: alert.marked_as_false_positive,
      resolved: alert.resolved,
    })) || []
  ) || [];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      id: chatHistory.length + 1,
      type: "user" as const,
      message: chatMessage,
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage("");

    setTimeout(() => {
      const aiResponse = {
        id: chatHistory.length + 2,
        type: "ai" as const,
        message: generateAIResponse(chatMessage, selectedVulns),
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (message: string, reports: string[]) => {
    const responses = [
      "Based on the selected reports, I can see several critical vulnerabilities that need immediate attention. The SQL injection vulnerability poses the highest risk.",
      "The scan results show a mix of security issues. I recommend prioritizing the critical and high-severity vulnerabilities first.",
      "Looking at the vulnerability patterns across your reports, there seems to be a common theme around input validation issues.",
      "The selected reports indicate good security posture overall, but there are some areas for improvement in SSL/TLS configuration.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const toggleVulnSelection = (vulnId: string) => {
    setSelectedVulns(prev => 
      prev.includes(vulnId) 
        ? prev.filter(id => id !== vulnId)
        : [...prev, vulnId]
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-[#121212] text-white flex">
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

        <div className="flex-1">
          <header className="sticky top-0 z-40 border-b border-gray-800 bg-[#1a1a1a]/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-4">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Bot className="h-6 w-6 text-[#0080ff]" />
                AI Security Assistant
              </h1>
            </div>
          </header>

          <main className="w-full py-6 px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-sm">Vulnerabilities</CardTitle>
                  <CardDescription className="text-xs">
                    All detected security issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-12rem)]">
                    <div className="space-y-2">
                      {vulnerabilities?.map((vuln) => (
                        <div
                          key={vuln.id}
                          className={`p-2 rounded border cursor-pointer transition-colors ${
                            selectedVulns.includes(vuln.id)
                              ? "border-[#0080ff] bg-[#0080ff]/10"
                              : "border-gray-700 hover:border-gray-600"
                          } ${
                            vuln.resolved ? "opacity-60" : ""
                          } ${
                            vuln.marked_as_false_positive ? "opacity-40" : ""
                          }`}
                          onClick={() => toggleVulnSelection(vuln.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium text-xs">{vuln.name}</div>
                            <div className="flex gap-1">
                              {vuln.resolved && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">
                                  ✓
                                </span>
                              )}
                              {vuln.marked_as_false_positive && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-400">
                                  FP
                                </span>
                              )}
                              <div className={`text-xs px-1.5 py-0.5 rounded ${
                                vuln.resolved || vuln.marked_as_false_positive
                                  ? "bg-gray-500/20 text-gray-400"
                                  : vuln.risk === "Critical" ? "bg-red-500/20 text-red-400" :
                                  vuln.risk === "High" ? "bg-orange-500/20 text-orange-400" :
                                  vuln.risk === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                                  "bg-green-500/20 text-green-400"
                              }`}>
                                {vuln.risk}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mb-1">{vuln.description.length > 50 ? vuln.description.substring(0, 50) + '...' : vuln.description}</div>
                          <div className="text-xs text-gray-500">{vuln.url}</div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3 flex flex-col h-[calc(100vh-8rem)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-[#0080ff]" />
                    Chat with AI Assistant
                  </CardTitle>
                  <CardDescription>
                    Ask questions about your security reports
                    {selectedVulns.length > 0 && (
                      <span className="ml-2 text-[#0080ff]">
                        ({selectedVulns.length} vulnerability{selectedVulns.length !== 1 ? 'ies' : 'y'} selected)
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 space-y-4">
                  <ScrollArea className="flex-1 w-full border rounded-lg p-4 bg-[#0a0a0a]">
                    <div className="space-y-4">
                      {chatHistory.map((chat) => (
                        <div
                          key={chat.id}
                          className={`flex gap-3 ${
                            chat.type === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {chat.type === "ai" && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-[#0080ff]/20 flex items-center justify-center">
                                <Bot className="h-4 w-4 text-[#0080ff]" />
                              </div>
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              chat.type === "user"
                                ? "bg-[#0080ff] text-white"
                                : "bg-gray-800 text-gray-100"
                            }`}
                          >
                            <p className="text-sm">{chat.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {chat.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          {chat.type === "user" && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask about vulnerabilities, security recommendations, or report analysis..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 min-h-[60px] bg-[#212121] border-gray-700 resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!chatMessage.trim()}
                      className="bg-[#0080ff] hover:bg-[#0060cc] px-4"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {selectedVulns.length === 0 && (
                    <div className="text-center p-4 text-gray-400 text-sm">
                      Select one or more vulnerabilities from the sidebar to get more specific insights
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}