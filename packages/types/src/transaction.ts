import { z } from 'zod';

import { DataFormat, TransactionType } from './enums';
import { Entity } from './entity';

/**
 * Risk flag attached to a transaction
 */
export interface RiskFlag {
  flagType: string;
  severity: string;
  description: string;
}

/**
 * Transaction data model
 * Represents a financial transaction in the MuleNet system
 */
export interface Transaction {
  // Core identifiers
  transactionId: string;
  timestamp: number; // Unix timestamp in milliseconds

  // Parties
  sender: Entity;
  receiver: Entity;
  intermediaries: Entity[];

  // Financial details
  amount: number;
  currency: string; // ISO 4217 code
  transactionType: TransactionType;

  // Metadata
  sourceFormat: DataFormat;
  fiboMapped: boolean;
  schemaVersion: string;

  // Risk indicators
  riskFlags: RiskFlag[];
  anomalyScore?: number;
}

/**
 * Zod schema for Transaction validation
 */
export const TransactionSchema = z.object({
  transactionId: z.string().min(1),
  timestamp: z.number().int().positive(),
  sender: z.any(), // Will be validated by EntitySchema
  receiver: z.any(),
  intermediaries: z.array(z.any()),
  amount: z.number().positive(),
  currency: z.string().length(3), // ISO 4217 is 3 characters
  transactionType: z.nativeEnum(TransactionType),
  sourceFormat: z.nativeEnum(DataFormat),
  fiboMapped: z.boolean(),
  schemaVersion: z.string(),
  riskFlags: z.array(
    z.object({
      flagType: z.string(),
      severity: z.string(),
      description: z.string(),
    })
  ),
  anomalyScore: z.number().min(0).max(1).optional(),
});

/**
 * Validation result for transactions
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Result of transaction ingestion
 */
export interface IngestResult {
  success: boolean;
  transactionId: string;
  timestamp: number;
  errors?: string[];
}
