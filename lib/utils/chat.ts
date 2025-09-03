export type ChatMessage = {
  id: number;
  type: "ai" | "user";
  message: string;
  timestamp: string;
};

export type VulnerabilityDetail = {
  id: string;
  name: string;
  risk: string;
  description: string;
  url: string;
  marked_as_false_positive?: boolean;
  resolved?: boolean;
};

export type ChatRequest = {
  message: string;
  selectedVulnerabilities: VulnerabilityDetail[];
  context?: {
    reports?: any[];
    allVulnerabilities?: VulnerabilityDetail[];
  };
};