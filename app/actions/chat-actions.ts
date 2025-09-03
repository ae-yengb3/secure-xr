"use server"

import { VulnerabilityDetail } from "@/lib/utils/chat";

export type ChatRequest = {
  message: string;
  selectedVulnerabilities: VulnerabilityDetail[];
  context?: {
    reports?: any[];
    allVulnerabilities?: VulnerabilityDetail[];
  };
};

export async function sendChatMessage(
  chatRequest: ChatRequest
): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    const { message, selectedVulnerabilities, context } = chatRequest;

    // Validate inputs
    if (!message.trim()) {
      return { success: false, error: "Message is required" };
    }

    // Generate AI response based on context
    const response = await generateAIResponse(message, selectedVulnerabilities, context);

    return { success: true, response };
  } catch (error) {
    console.error("Error processing chat message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

async function generateAIResponse(
  message: string,
  selectedVulns: VulnerabilityDetail[],
  context?: { reports?: any[]; allVulnerabilities?: VulnerabilityDetail[] }
): Promise<string> {
  // In a real implementation, this would call an AI service like OpenAI
  // For now, we'll generate contextual responses based on the data

  const reports = context?.reports || [];

  // Analyze the message and context to provide relevant responses
  const messageLower = message.toLowerCase();

  if (selectedVulns.length === 0) {
    return "I'd be happy to help! Please select one or more vulnerabilities from the sidebar so I can provide more specific insights about your security issues.";
  }

  if (messageLower.includes("critical") || messageLower.includes("high risk")) {
    const criticalVulns = selectedVulns.filter(v => 
      v.risk === "Critical" || v.risk === "High"
    );
    if (criticalVulns.length > 0) {
      return `I can see ${criticalVulns.length} critical/high-risk vulnerabilities in your selection. The most urgent ones are: ${criticalVulns.map(v => `${v.name} (${v.description.substring(0, 50)}...)`).join(", ")}. I recommend addressing these immediately as they pose significant security risks.`;
    }
  }

  if (messageLower.includes("fix") || messageLower.includes("remediate")) {
    const vulnDetails = selectedVulns.map(v => `${v.name} (${v.risk} risk at ${v.url})`);
    return `For the selected vulnerabilities:\n${vulnDetails.join("\n")}\n\nRecommended fixes: 1) Implement input validation and parameterized queries for SQL injection, 2) Use proper output encoding for XSS prevention, 3) Add CSRF tokens for state-changing operations, 4) Configure proper security headers. Would you like detailed remediation steps for any specific vulnerability?`;
  }

  if (messageLower.includes("priority") || messageLower.includes("order")) {
    const sortedVulns = selectedVulns.sort((a, b) => {
      const riskOrder = { "Critical": 4, "High": 3, "Medium": 2, "Low": 1 };
      return (riskOrder[b.risk] || 0) - (riskOrder[a.risk] || 0);
    });
    return `Based on risk levels, I recommend addressing vulnerabilities in this order:\n${sortedVulns.map((v, i) => `${i + 1}. ${v.name} (${v.risk}) - ${v.description.substring(0, 60)}... [${v.url}]`).join("\n")}\n\nStart with the critical and high-risk issues first.`;
  }

  if (messageLower.includes("impact") || messageLower.includes("damage")) {
    return `The selected vulnerabilities could have serious impacts: SQL injection can lead to data breaches and unauthorized access, XSS can compromise user sessions, and CSRF can allow unauthorized actions. The business impact includes potential data loss, compliance violations, and reputation damage.`;
  }

  // Default contextual response with detailed vulnerability info
  const vulnCount = selectedVulns.length;
  const riskLevels = [...new Set(selectedVulns.map(v => v.risk))];
  const uniqueUrls = [...new Set(selectedVulns.map(v => v.url))];
  
  const vulnSummary = selectedVulns.map(v => 
    `• ${v.name} (${v.risk}) - ${v.description.substring(0, 80)}... [${v.url}]`
  ).join("\n");
  
  return `I'm analyzing ${vulnCount} vulnerability${vulnCount !== 1 ? 'ies' : 'y'} with risk levels: ${riskLevels.join(", ")}. These issues span across ${uniqueUrls.length} different endpoints:\n\n${vulnSummary}\n\nWhat specific aspect would you like me to help you with - remediation steps, risk assessment, or prioritization?`;
}