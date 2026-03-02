import { EntityType } from './enums';

/**
 * Time window for temporal graph snapshots
 */
export interface TimeWindow {
  startTime: number;
  endTime: number;
  windowSize: number; // in milliseconds
}

/**
 * Memory state for TGN nodes
 */
export interface MemoryState {
  embedding: number[];
  lastUpdated: number;
  interactionCount: number;
}

/**
 * Feature vector
 */
export type Features = Record<string, number | string | boolean>;

/**
 * Temporal features with time-based attributes
 */
export interface TemporalFeatures {
  timeSeriesData: Array<{ timestamp: number; value: number }>;
  temporalPatterns: string[];
}

/**
 * Node in temporal graph
 */
export interface Node {
  nodeId: string;
  entityId: string;
  nodeType: EntityType;

  // Features
  staticFeatures: Features;
  temporalFeatures: TemporalFeatures;

  // Memory state (for TGN)
  memoryState?: MemoryState;
  lastUpdated: number;

  // Graph metrics
  degree: number;
  inDegree: number;
  outDegree: number;
  clusteringCoefficient: number;
  pageRank?: number;
}

/**
 * Edge in temporal graph
 */
export interface Edge {
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;

  // Temporal properties
  timestamp: number;
  duration?: number;

  // Transaction properties
  transactionId: string;
  amount: number;
  currency: string;

  // Features
  edgeFeatures: Features;

  // Graph metrics
  weight: number;
  betweennessCentrality?: number;
}

/**
 * Temporal graph snapshot
 */
export interface TemporalGraph {
  // Graph structure
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;

  // Temporal properties
  timeWindow: TimeWindow;
  snapshotTimestamp: number;

  // Metadata
  graphId: string;
  edgeNodeId: string;
  version: number;
}

/**
 * Graph event for writing to graph store
 */
export interface GraphEvent {
  eventType: 'NODE_CREATE' | 'NODE_UPDATE' | 'EDGE_CREATE' | 'EDGE_UPDATE';
  timestamp: number;
  node?: Node;
  edge?: Edge;
}

/**
 * Cypher query for Neo4j
 */
export interface CypherQuery {
  query: string;
  parameters?: Record<string, unknown>;
}

/**
 * Query result from graph store
 */
export interface QueryResult {
  records: unknown[];
  summary: {
    queryType: string;
    counters: Record<string, number>;
  };
}

/**
 * Watermarked event for stream processing
 */
export interface WatermarkedEvent {
  event: unknown;
  timestamp: number;
  watermark: number;
}

/**
 * Path in graph
 */
export interface Path {
  nodes: string[];
  edges: string[];
  length: number;
}

/**
 * Temporal motif (recurring pattern)
 */
export interface Motif {
  motifType: string;
  nodes: string[];
  edges: string[];
  frequency: number;
}
