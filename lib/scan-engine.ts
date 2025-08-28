import vulnerabilityConfig from "@/config/vulnerabilities.json"

export type SeverityLevel = "Critical" | "High" | "Medium" | "Low"

export interface VulnerabilityResult {
  sourceid: string,
  other: string,
  method: string,
  evidence: string,
  pluginid: string,
  cweid: string,
  confidence: string,
  wascid: string,
  description: string,
  messageid: string,
  url: string,
  reference: string,
  solution: string,
  alert_name: string,
  param: string,
  attack: string,
  name: string,
  risk: "Critical" | "High" | "Medium" | "Low",
  id: string
}

export interface ScanExtra {
  critical: number
  high: number
  medium: number
  low: number
}

export interface ScanResult{
  url: string
  alerts: VulnerabilityResult[]
  id: number
  vulnerabilities: number
  progress: number
  start_time: string
  end_time: string
  critical: number
  high: number
  medium: number
  low: number
  informational: number
}

// export interface ScanResult {
//   extra: Extra
//   results: Results
// }---------------------------------