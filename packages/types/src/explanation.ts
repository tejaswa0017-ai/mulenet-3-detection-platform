import {
  FindingType,
  Severity,
  EvidenceType,
  VerificationStatus,
  LLMProvider,
  Jurisdiction,
} from './enums';

/**
 * Evidence supporting an explanation
 */
export interface Evidence {
  evidenceType: EvidenceType;
  description: string;
  data: unknown;
  confidence: number;
  source: string;
}

/**
 * Finding in an explanation
 */
export interface Finding {
  findingType: FindingType;
  severity: Severity;
  description: string;
  evidence: Evidence[];
  recommendation?: string;
}

/**
 * Verified fact
 */
export interface Fact {
  statement: string;
  verified: boolean;
  source: string;
  confidence: number;
}

/**
 * Regulatory citation
 */
export interface Citation {
  regulation: string;
  section: string;
  text: string;
  url?: string;
}

/**
 * Visualization data
 */
export interface Visualization {
  visualizationType: 'GRAPH' | 'TIMELINE' | 'HEATMAP' | 'CHART';
  data: unknown;
  metadata: Record<string, unknown>;
}

/**
 * Explanation for a risk score
 */
export interface Explanation {
  // Core explanation
  explanationId: string;
  riskScoreId: string;
  text: string;

  // Structure
  summary: string;
  detailedAnalysis: string;
  keyFindings: Finding[];

  // Evidence
  supportingEvidence: Evidence[];
  graphVisualizations: Visualization[];

  // Regulatory compliance
  jurisdiction: Jurisdiction;
  regulatoryCitations: Citation[];
  legalBasis: string;

  // Fact verification
  verificationStatus: VerificationStatus;
  verifiedFacts: Fact[];
  confidenceScore: number;

  // Multi-LLM ensemble
  llmProviders: LLMProvider[];
  ensembleAgreement: number; // 0.0 to 1.0

  // Metadata
  generationTime: number; // milliseconds
  timestamp: number;
  version: string;
}

/**
 * LLM response
 */
export interface LLMResponse {
  provider: LLMProvider;
  text: string;
  confidence: number;
  tokensUsed: number;
  latency: number;
}

/**
 * Ensembled response from multiple LLMs
 */
export interface EnsembledResponse {
  text: string;
  agreement: number;
  responses: LLMResponse[];
}

/**
 * Context retrieved for RAG
 */
export interface Context {
  text: string;
  source: string;
  relevanceScore: number;
  metadata: Record<string, unknown>;
}

/**
 * Ranked context
 */
export interface RankedContext {
  contexts: Context[];
  query: string;
  topK: number;
}

/**
 * Verification result
 */
export interface VerificationResult {
  verified: boolean;
  unverifiedFacts: string[];
  verifiedFacts: Fact[];
  confidence: number;
}

/**
 * Grounded text with fact links
 */
export interface GroundedText {
  text: string;
  facts: Fact[];
  groundingLinks: Array<{
    textSpan: string;
    factId: string;
  }>;
}

/**
 * Formatted explanation for specific jurisdiction
 */
export interface FormattedExplanation extends Explanation {
  jurisdictionSpecificFormat: string;
  localizedText: string;
}

/**
 * Explanation with regulatory citations
 */
export interface ExplanationWithCitations extends Explanation {
  citationCount: number;
  citationsByRegulation: Map<string, Citation[]>;
}

/**
 * Ground truth data for fact verification
 */
export interface GroundTruth {
  facts: Map<string, Fact>;
  sources: Map<string, string>;
}

/**
 * Query for context retrieval
 */
export interface Query {
  text: string;
  filters?: Record<string, unknown>;
  topK?: number;
}

/**
 * Regulatory context
 */
export interface RegulatoryContext {
  jurisdiction: Jurisdiction;
  applicableRegulations: string[];
  complianceRequirements: string[];
}
