import { EncryptionScheme } from './enums';

/**
 * Tensor representation for model weights
 */
export interface Tensor {
  shape: number[];
  data: number[];
  dtype: string;
}

/**
 * Model weights
 */
export interface ModelWeights {
  layers: Map<string, Tensor>;
  version: string;
  architecture: string;
}

/**
 * Gradients for model training
 */
export type Gradients = Map<string, Tensor>;

/**
 * Differential privacy parameters
 */
export interface DPParameters {
  epsilon: number;
  delta: number;
  noiseMultiplier: number;
  clippingNorm: number;
}

/**
 * Training metrics
 */
export interface TrainingMetrics {
  loss: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;

  // Convergence metrics
  gradientNorm: number;
  parameterNorm: number;

  // Computational metrics
  trainingTime: number; // milliseconds
  memoryUsage: number; // bytes
}

/**
 * Federated model update
 */
export interface FederatedModelUpdate {
  // Round information
  roundId: string;
  roundNumber: number;
  timestamp: number;

  // Model update
  modelDelta: ModelWeights;
  gradients?: Gradients;

  // Privacy guarantees
  differentialPrivacy: DPParameters;
  encryptionScheme: EncryptionScheme;

  // Metadata
  edgeNodeId: string;
  trainingMetrics: TrainingMetrics;
  datasetSize: number; // Number of samples used

  // Validation
  signature: string;
  checksum: string;
}

/**
 * Global model
 */
export interface GlobalModel {
  modelWeights: ModelWeights;
  version: string;
  roundNumber: number;
  timestamp: number;
}

/**
 * Global model update
 */
export interface GlobalModelUpdate {
  model: GlobalModel;
  aggregationMethod: string;
  participatingNodes: string[];
}

/**
 * Encrypted features for privacy-preserving computation
 */
export interface EncryptedFeatures {
  ciphertext: string;
  publicKey: string;
  encryptionScheme: EncryptionScheme;
}

/**
 * Private data with differential privacy applied
 */
export interface PrivateData {
  data: unknown;
  epsilon: number;
  delta: number;
  noiseAdded: boolean;
}

/**
 * Bloom filter for privacy-preserving entity matching
 */
export interface BloomFilter {
  bitArray: Uint8Array;
  hashFunctions: number;
  expectedElements: number;
  falsePositiveRate: number;
}
