export interface AdAnalysis {
  policyScore: number;
  viralScore: number;
  overallScore: number;
  policyViolations: string[];
  warnings: string[];
  suggestions: string[];
  replacements: string[];
  optimizedCopy: string;
  targetAudienceScore: number;
  engagementPrediction: string;
  competitiveAnalysis: string;
  keywordSuggestions: string[];
}

export interface SavedAdCopy {
  id?: number;
  name: string;
  copy: string;
  timestamp: number;
  userId: number;
}

export interface User {
  id?: number;
  username: string;
  openaiKey: string;
  darkMode?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, openaiKey: string) => void;
  logout: () => void;
}

export type ToneOption = 'professional' | 'friendly' | 'confident' | 'casual' | 'authoritative' | 'empathetic';
export type StrategyOption = 'direct-response' | 'storytelling' | 'problem-solution' | 'benefit-driven' | 'scarcity-based' | 'social-proof';
export type AdTarget = 'general' | 'b2b' | 'b2c' | 'ecommerce' | 'local' | 'saas' | 'education' | 'health' | 'luxury' | 'parents';