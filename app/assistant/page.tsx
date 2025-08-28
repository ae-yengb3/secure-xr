"use client";

import { useState } from "react";
import Link from "next/link";
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
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const availableReports: Report[] = [
    { id: "1", url: "example.com", vulnerabilities: 12, date: "2024-01-15" },
    { id: "2", url: "test-app.vercel.app", vulnerabilities: 3, date: "2024-01-14" },
    { id: "3", url: "api.myservice.com", vulnerabilities: 8, date: "2024-01-13" },
  ];

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
        message: generateAIResponse(chatMessage, selectedReports),
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

  const toggleReportSelection = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
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
                  <CardTitle className="text-sm">Select Reports</CardTitle>
                  <CardDescription className="text-xs">
                    Choose reports to discuss with AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {availableReports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedReports.includes(report.id)
                          ? "border-[#0080ff] bg-[#0080ff]/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                      onClick={() => toggleReportSelection(report.id)}
                    >
                      <div className="font-medium text-sm">{report.url}</div>
                      <div className="text-xs text-gray-400">
                        {report.vulnerabilities} vulnerabilities
                      </div>
                      <div className="text-xs text-gray-500">{report.date}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-[#0080ff]" />
                    Chat with AI Assistant
                  </CardTitle>
                  <CardDescription>
                    Ask questions about your security reports
                    {selectedReports.length > 0 && (
                      <span className="ml-2 text-[#0080ff]">
                        ({selectedReports.length} report{selectedReports.length !== 1 ? 's' : ''} selected)
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScrollArea className="h-96 w-full border rounded-lg p-4 bg-[#0a0a0a]">
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

                  {selectedReports.length === 0 && (
                    <div className="text-center p-4 text-gray-400 text-sm">
                      Select one or more reports from the sidebar to get more specific insights
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