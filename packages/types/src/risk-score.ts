import { AlertTier, RiskFactorType } from './enums';
import { TemporalGraph, Path, Motif } from './temporal-graph';

/**
 * Uncertainty metrics for risk scores
 */
export interface UncertaintyMetrics {
  variance: number;
  credibleInterval: [number, number]; // 95% credible interval
  epistemic: number; // Model uncertainty
  aleatoric: number; // Data uncertainty
}

/**
 * Evidence supporting a risk factor
 */
export interface Evidence {
  evidenceType: string;
  description: string;
  data: unknown;
  confidence: number;
  source: string;
}

/**
 * Risk factor contributing to overall risk score
 */
export interface RiskFactor {
  factorType: RiskFactorType;
  contribution: number; // -1.0 to 1.0
  description: string;
  evidence: Evidence[];
}

/**
 * Graph context for risk assessment
 */
export interface GraphContext {
  subgraph: TemporalGraph;
  relevantPaths: Path[];
  communityMembership: string[];
  temporalMotifs: Motif[];
}

/**
 * Historical risk score
 */
export interface HistoricalScore {
  timestamp: number;
  score: number;
  tier: AlertTier;
}

/**
 * Risk score with uncertainty quantification
 */
export interface RiskScore {
  // Core score
  score: number; // 0.0 to 1.0
  tier: AlertTier;

  // Uncertainty quantification
  confidence: number; // 0.0 to 1.0
  uncertaintyMetrics: UncertaintyMetrics;

  // Contributing factors
  factors: RiskFactor[];
  graphContext: GraphContext;

  // Temporal context
  timestamp: number;
  historicalScores: HistoricalScore[];

  // Metadata
  modelVersion: string;
  computationTime: number; // milliseconds
}

/**
 * Calibrated risk score
 */
export interface CalibratedScore {
  rawScore: number;
  calibratedScore: number;
  calibrationMethod: string;
}

/**
 * Cost matrix for threshold optimization
 */
export interface CostMatrix {
  falsePositiveCost: number;
  falseNegativeCost: number;
  truePositiveBenefit: number;
  trueNegativeBenefit: number;
}

/**
 * Alert thresholds
 */
export interface Thresholds {
  informational: number;
  monitoring: number;
  investigation: number;
  critical: number;
}

/**
 * Action recommendation
 */
export interface Action {
  actionType: 'APPROVE' | 'ESCALATE' | 'INVESTIGATE' | 'BLOCK';
  expectedCost: number;
  reasoning: string;
}
