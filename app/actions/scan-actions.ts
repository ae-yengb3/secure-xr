"use server"

import { scanEngine, type ScanResult } from "@/lib/scan-engine"

export async function startScan(
  target: string,
  scanType: "Passive" | "Active" | "Hybrid",
  modules: Record<string, boolean>,
  scanDepth: number,
): Promise<{ success: boolean; result?: ScanResult; error?: string }> {
  try {
    // Validate inputs
    if (!target) {
      return { success: false, error: "Target is required" }
    }

    if (!["Passive", "Active", "Hybrid"].includes(scanType)) {
      return { success: false, error: "Invalid scan type" }
    }

    // Run the scan
    const result = await scanEngine.runScan(target, scanType, modules, scanDepth)

    // In a real implementation, you'd save this to a database
    // For now, we'll just return the result
    return { success: true, result }
  } catch (error) {
    console.error("Error running scan:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Mock database for demonstration purposes
const mockScanResults: Record<string, ScanResult> = {
  "1": {
    id: "1",
    target: "example.com",
    scanType: "Hybrid",
    startTime: new Date(Date.now() - 1800000).toISOString(),
    endTime: new Date().toISOString(),
    duration: "30 minutes",
    status: "Completed",
    ipAddress: "192.168.1.1",
    vulnerabilities: [
      {
        id: "CVE-2023-1234",
        name: "SQL Injection",
        tool: "SQLMap",
        severity: "Critical",
        description: "Allows attackers to execute malicious SQL statements to control a database server",
        affected: "login.php",
        details:
          'The login.php endpoint is vulnerable to SQL injection attacks through the "username" parameter. An attacker can inject malicious SQL commands that may lead to unauthorized data access.',
        confidence: "Confirmed",
        references: ["https://example.com/security/advisory/123"],
      },
      {
        id: "CVE-2023-5678",
        name: "Cross-Site Scripting",
        tool: "XSStrike",
        severity: "High",
        description: "Enables attackers to inject client-side scripts into web pages viewed by other users",
        affected: "comments.php",
        details:
          "Stored XSS vulnerability in the comments.php allows attackers to embed malicious scripts that execute when other users view the content.",
        confidence: "Confirmed",
        references: ["https://example.com/security/advisory/456"],
      },
    ],
    ports: [
      { port: 80, service: "HTTP", status: "open" },
      { port: 443, service: "HTTPS", status: "open" },
      { port: 22, service: "SSH", status: "open" },
    ],
    techStack: [
      { name: "Nginx", version: "1.18.0", category: "Web Server" },
      { name: "PHP", version: "7.4.3", category: "Programming Language" },
      { name: "WordPress", version: "5.9.3", category: "CMS" },
    ],
  },
  "2": {
    id: "2",
    target: "test-app.vercel.app",
    scanType: "Passive",
    startTime: new Date(Date.now() - 3600000).toISOString(),
    endTime: new Date(Date.now() - 3400000).toISOString(),
    duration: "15 minutes",
    status: "Completed",
    ipAddress: "192.168.2.10",
    vulnerabilities: [
      {
        id: "CVE-2023-9012",
        name: "Security Headers Missing",
        tool: "SecurityHeaders.com",
        severity: "Medium",
        description: "Missing security headers that help mitigate common web vulnerabilities",
        affected: "HTTP Headers",
        details:
          "The application is missing important security headers such as Content-Security-Policy which helps prevent XSS attacks.",
        confidence: "Confirmed",
        references: ["https://example.com/security/advisory/789"],
      },
    ],
    ports: [
      { port: 80, service: "HTTP", status: "open" },
      { port: 443, service: "HTTPS", status: "open" },
    ],
    techStack: [
      { name: "React", version: "17.0.2", category: "JavaScript Framework" },
      { name: "Node.js", version: "14.17.0", category: "Runtime Environment" },
    ],
  },
  "3": {
    id: "3",
    target: "api.myservice.com",
    scanType: "Active",
    startTime: new Date(Date.now() - 7200000).toISOString(),
    endTime: new Date(Date.now() - 6900000).toISOString(),
    duration: "45 minutes",
    status: "Completed",
    ipAddress: "192.168.3.15",
    vulnerabilities: [
      {
        id: "CVE-2023-4567",
        name: "Cross-Site Request Forgery",
        tool: "Burp Suite",
        severity: "Medium",
        description: "Forces users to execute unwanted actions on a web application in which they're authenticated",
        affected: "account-settings",
        details:
          "The account settings page lacks proper CSRF tokens, allowing attackers to force authenticated users to perform unintended actions.",
        confidence: "Probable",
        references: ["https://example.com/security/advisory/234"],
      },
      {
        id: "CVE-2023-7890",
        name: "Command Injection",
        tool: "Commix",
        severity: "Critical",
        description: "Allows execution of arbitrary commands on the host operating system",
        affected: "search-function",
        details:
          "The search function in the API endpoint is vulnerable to command injection through improperly sanitized user input.",
        confidence: "Confirmed",
        references: ["https://example.com/security/advisory/345"],
      },
      {
        id: "CVE-2023-3210",
        name: "Server-Side Request Forgery",
        tool: "SSRFmap",
        severity: "High",
        description: "Allows attackers to induce the server to make requests to an unintended location",
        affected: "webhook-processor",
        details:
          "The webhook processor endpoint allows an attacker to specify arbitrary URLs, potentially leading to server-side request forgery attacks.",
        confidence: "Possible",
        references: ["https://example.com/security/advisory/456"],
      },
    ],
    ports: [
      { port: 80, service: "HTTP", status: "open" },
      { port: 443, service: "HTTPS", status: "open" },
      { port: 8080, service: "Alternative HTTP", status: "open" },
      { port: 22, service: "SSH", status: "closed" },
    ],
    techStack: [
      { name: "Express", version: "4.17.1", category: "Web Framework" },
      { name: "Node.js", version: "16.13.0", category: "Runtime Environment" },
      { name: "MongoDB", version: "5.0.3", category: "Database" },
    ],
  },
}

// Get a specific scan result by ID
export async function getScanResult(id: string): Promise<ScanResult | null> {
  // Return from mock database if exists
  if (mockScanResults[id]) {
    return mockScanResults[id]
  }

  // Special case for "demo"
  if (id === "demo") {
    return mockScanResults["1"]
  }

  return null
}

// Get all scan results
export async function getAllScanResults(): Promise<ScanResult[]> {
  // Return all results from mock database
  return Object.values(mockScanResults)
}
