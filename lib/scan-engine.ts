import vulnerabilityConfig from "@/config/vulnerabilities.json"

export type SeverityLevel = "Critical" | "High" | "Medium" | "Low"

export interface VulnerabilityResult {
  id: string
  name: string
  tool: string
  severity: SeverityLevel
  description: string
  affected: string
  details: string
  confidence: "Confirmed" | "Probable" | "Possible"
  cveId?: string
  references?: string[]
}

export interface ScanResult {
  id: string
  target: string
  scanType: "Passive" | "Active" | "Hybrid"
  startTime: string
  endTime: string
  duration: string
  status: "Completed" | "In Progress" | "Failed"
  ipAddress: string
  vulnerabilities: VulnerabilityResult[]
  ports?: { port: number; service: string; status: string }[]
  techStack?: { name: string; version: string; category: string }[]
}

// Simulated scan engine - in a real implementation, this would integrate with actual tools
export class ScanEngine {
  async runScan(
    target: string,
    scanType: "Passive" | "Active" | "Hybrid",
    modules: Record<string, boolean>,
    scanDepth: number,
  ): Promise<ScanResult> {
    const startTime = new Date()

    // Simulate scan duration based on scan type and depth
    const scanDuration =
      scanType === "Passive"
        ? 5000 + Math.random() * 5000
        : scanType === "Active"
          ? 10000 + Math.random() * 10000
          : 15000 + Math.random() * 15000

    // For simulation purposes, we'll wait to simulate the scan running
    await new Promise((resolve) => setTimeout(resolve, Math.min(scanDuration, 2000)))

    const vulnerabilities = await this.detectVulnerabilities(target, scanType, modules, scanDepth)

    const endTime = new Date()
    const durationMs = endTime.getTime() - startTime.getTime()
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)

    return {
      id: this.generateId(),
      target,
      scanType,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: `${minutes} ${minutes === 1 ? "minute" : "minutes"} ${seconds} ${seconds === 1 ? "second" : "seconds"}`,
      status: "Completed",
      ipAddress: this.generateIpAddress(),
      vulnerabilities,
      ports: this.detectPorts(modules.portScan),
      techStack: this.detectTechStack(modules.techStack),
    }
  }

  private async detectVulnerabilities(
    target: string,
    scanType: "Passive" | "Active" | "Hybrid",
    modules: Record<string, boolean>,
    scanDepth: number,
  ): Promise<VulnerabilityResult[]> {
    const results: VulnerabilityResult[] = []

    // For each vulnerability type in our config, check if we should run it based on scan type
    for (const [vulnId, vulnInfo] of Object.entries(vulnerabilityConfig)) {
      // Only run vulnerability detection if appropriate for the scan type
      const shouldRun =
        scanType === "Hybrid" ||
        (scanType === "Passive" && vulnInfo.passiveScan) ||
        (scanType === "Active" && vulnInfo.activeScan)

      // Skip this vulnerability check if not appropriate for scan type
      if (!shouldRun) continue

      // For demonstration, add vulnerabilities based on random chance, influenced by scan depth
      const detectionRate = (scanDepth / 100) * 0.7 // Higher depth = higher chance of detection
      const detected = Math.random() < detectionRate

      // For some specific vulnerabilities in demo, always find them
      const forceDetect = ["SQL_Injection", "XSS", "CSRF"].includes(vulnId)

      if (detected || forceDetect) {
        // Simulate finding a vulnerability
        results.push(this.createVulnerabilityResult(vulnId, vulnInfo, target))
      }
    }

    // Sort by severity (Critical first, Low last)
    return results.sort((a, b) => {
      const severityOrder: Record<SeverityLevel, number> = {
        Critical: 0,
        High: 1,
        Medium: 2,
        Low: 3,
      }

      return severityOrder[a.severity] - severityOrder[b.severity]
    })
  }

  private createVulnerabilityResult(vulnId: string, vulnInfo: any, target: string): VulnerabilityResult {
    // Generate realistic vulnerability details
    const affected = this.generateAffectedComponent(vulnId, target)
    const details = this.generateVulnerabilityDetails(vulnId, vulnInfo.name, affected)

    return {
      id: `CVE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: vulnInfo.name,
      tool: vulnInfo.tool,
      severity: vulnInfo.severity as SeverityLevel,
      description: vulnInfo.description,
      affected,
      details,
      confidence: Math.random() > 0.3 ? "Confirmed" : Math.random() > 0.5 ? "Probable" : "Possible",
      references: [`https://example.com/security/advisory/${Math.floor(100 + Math.random() * 900)}`],
    }
  }

  private generateAffectedComponent(vulnId: string, target: string): string {
    // Generate realistic affected component based on vulnerability type
    const components: Record<string, string[]> = {
      SQL_Injection: ["login.php", "search.php", "products.php", "/api/user"],
      XSS: ["comments.php", "profile.php", "review-form", "/forum/post"],
      CSRF: ["account-settings", "password-change", "payment-process"],
      Security_Headers: ["HTTP Headers", "Response Headers", "CSP Configuration"],
      SSL_TLS: ["HTTPS Configuration", "TLS 1.0/1.1 Support", "Weak Cipher Suites"],
      Sensitive_Data_Exposure: ["user-data.json", "config.php", ".env file", "API Keys"],
      Brute_Force: ["/admin/login", "/wp-login.php", "Authentication Endpoint"],
      Directory_Traversal: ["/includes/", "/uploads/", "/config/", "File Upload Feature"],
      Command_Injection: ["search-function", "ping-utility", "export-feature"],
      SSRF: ["image-proxy", "webhook-processor", "external-api-connector"],
    }

    const defaultComponents = ["index.php", "main.js", "api-endpoint"]
    const vulnComponents = components[vulnId] || defaultComponents

    return vulnComponents[Math.floor(Math.random() * vulnComponents.length)]
  }

  private generateVulnerabilityDetails(vulnId: string, vulnName: string, affected: string): string {
    // Generate realistic vulnerability details based on type
    const detailsByType: Record<string, string[]> = {
      SQL_Injection: [
        `The ${affected} endpoint is vulnerable to SQL injection attacks through the 'id' parameter. An attacker can inject malicious SQL commands that may lead to unauthorized data access.`,
        `Improper input validation in the ${affected} allows SQL injection via the search parameter. This could lead to database compromise.`,
      ],
      XSS: [
        `The ${affected} does not properly sanitize user input, allowing attackers to inject JavaScript code that executes in other users' browsers.`,
        `Stored XSS vulnerability in the ${affected} allows attackers to embed malicious scripts that execute when other users view the content.`,
      ],
      CSRF: [
        `The ${affected} feature lacks proper CSRF tokens, allowing attackers to force authenticated users to perform unintended actions.`,
        `Missing CSRF protection in ${affected} enables attackers to submit unauthorized requests on behalf of authenticated users.`,
      ],
      Security_Headers: [
        `The application is missing important security headers such as Content-Security-Policy which helps prevent XSS attacks.`,
        `X-Frame-Options header is not set properly, potentially allowing clickjacking attacks.`,
      ],
    }

    const defaultDetails = [
      `The ${affected} component contains a vulnerability that could allow attackers to exploit ${vulnName}.`,
      `A ${vulnName} vulnerability was detected in the ${affected} component which could lead to security breaches.`,
    ]

    const possibleDetails = detailsByType[vulnId] || defaultDetails
    return possibleDetails[Math.floor(Math.random() * possibleDetails.length)]
  }

  private detectPorts(enabled: boolean): { port: number; service: string; status: string }[] {
    if (!enabled) return []

    // Return simulated port scan results
    return [
      { port: 80, service: "HTTP", status: "open" },
      { port: 443, service: "HTTPS", status: "open" },
      { port: 22, service: "SSH", status: Math.random() > 0.5 ? "open" : "closed" },
      { port: 21, service: "FTP", status: Math.random() > 0.7 ? "open" : "closed" },
      { port: 3306, service: "MySQL", status: Math.random() > 0.6 ? "open" : "closed" },
    ]
  }

  private detectTechStack(enabled: boolean): { name: string; version: string; category: string }[] {
    if (!enabled) return []

    // Return simulated tech stack detection results
    const possibleTechnologies = [
      { name: "Nginx", version: "1.18.0", category: "Web Server" },
      { name: "Apache", version: "2.4.41", category: "Web Server" },
      { name: "PHP", version: "7.4.3", category: "Programming Language" },
      { name: "PHP", version: "8.1.5", category: "Programming Language" },
      { name: "WordPress", version: "5.9.3", category: "CMS" },
      { name: "Drupal", version: "9.3.8", category: "CMS" },
      { name: "MySQL", version: "5.7.33", category: "Database" },
      { name: "PostgreSQL", version: "12.3", category: "Database" },
      { name: "jQuery", version: "3.5.1", category: "JavaScript Library" },
      { name: "React", version: "17.0.2", category: "JavaScript Framework" },
      { name: "Bootstrap", version: "4.6.0", category: "CSS Framework" },
      { name: "Laravel", version: "8.6.0", category: "PHP Framework" },
    ]

    // Randomly select 3-6 technologies
    const result = []
    const techCount = Math.floor(3 + Math.random() * 4)

    // Make a copy and shuffle
    const shuffled = [...possibleTechnologies].sort(() => 0.5 - Math.random())

    for (let i = 0; i < techCount && i < shuffled.length; i++) {
      result.push(shuffled[i])
    }

    return result
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private generateIpAddress(): string {
    return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
  }
}

// Create and export a singleton instance
export const scanEngine = new ScanEngine()
