import type { ScanResult } from "@/lib/scan-engine";

export const exportReportsToCSV = (reports: ScanResult[]) => {
  const headers = [
    "Scan ID",
    "URL",
    "Vulnerability ID",
    "Alert Name",
    "Risk",
    "Confidence",
    "Description",
    "Solution",
    "CWE ID",
    "Method",
    "Evidence",
    "Resolved",
    "False Positive"
  ];

  const rows = reports.flatMap(report => 
    report.alerts.map(alert => [
      report.id,
      `"${report.url}"`,
      `"${alert.unique_id}"`,
      `"${alert.alert_name}"`,
      alert.risk,
      alert.confidence,
      `"${alert.description.replace(/"/g, '""')}"`,
      `"${alert.solution.replace(/"/g, '""')}"`,
      alert.cweid,
      alert.method,
      `"${alert.evidence.replace(/"/g, '""')}"`,
      alert.resolved,
      alert.marked_as_false_positive
    ].join(","))
  );

  const csvContent = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `vulnerabilities-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};