import { TransactionSchema } from '../transaction';
import { TransactionType, DataFormat, EntityType } from '../enums';

describe('Transaction', () => {
  describe('TransactionSchema', () => {
    it('should validate a valid transaction', () => {
      const validTransaction = {
        transactionId: 'txn-123',
        timestamp: Date.now(),
        sender: {
          entityId: 'entity-1',
          entityType: EntityType.INDIVIDUAL,
          rawIdentifiers: [],
          phoneNumbers: [],
          emailAddresses: [],
          accountNumbers: [],
          bankIdentifiers: [],
          firstSeen: Date.now(),
          lastSeen: Date.now(),
          transactionCount: 0,
          totalVolume: 0,
          watchlistMatches: [],
          pepStatus: false,
          sanctionStatus: false,
        },
        receiver: {
          entityId: 'entity-2',
          entityType: EntityType.BUSINESS,
          rawIdentifiers: [],
          phoneNumbers: [],
          emailAddresses: [],
          accountNumbers: [],
          bankIdentifiers: [],
          firstSeen: Date.now(),
          lastSeen: Date.now(),
          transactionCount: 0,
          totalVolume: 0,
          watchlistMatches: [],
          pepStatus: false,
          sanctionStatus: false,
        },
        intermediaries: [],
        amount: 1000.0,
        currency: 'USD',
        transactionType: TransactionType.WIRE_TRANSFER,
        sourceFormat: DataFormat.ISO20022,
        fiboMapped: true,
        schemaVersion: '1.0.0',
        riskFlags: [],
      };

      const result = TransactionSchema.safeParse(validTransaction);
      expect(result.success).toBe(true);
    });

    it('should reject transaction with negative amount', () => {
      const invalidTransaction = {
        transactionId: 'txn-123',
        timestamp: Date.now(),
        sender: {},
        receiver: {},
        intermediaries: [],
        amount: -100,
        currency: 'USD',
        transactionType: TransactionType.WIRE_TRANSFER,
        sourceFormat: DataFormat.ISO20022,
        fiboMapped: true,
        schemaVersion: '1.0.0',
        riskFlags: [],
      };

      const result = TransactionSchema.safeParse(invalidTransaction);
      expect(result.success).toBe(false);
    });

    it('should reject transaction with invalid currency code', () => {
      const invalidTransaction = {
        transactionId: 'txn-123',
        timestamp: Date.now(),
        sender: {},
        receiver: {},
        intermediaries: [],
        amount: 1000,
        currency: 'INVALID',
        transactionType: TransactionType.WIRE_TRANSFER,
        sourceFormat: DataFormat.ISO20022,
        fiboMapped: true,
        schemaVersion: '1.0.0',
        riskFlags: [],
      };

      const result = TransactionSchema.safeParse(invalidTransaction);
      expect(result.success).toBe(false);
    });

    it('should reject transaction with empty transactionId', () => {
      const invalidTransaction = {
        transactionId: '',
        timestamp: Date.now(),
        sender: {},
        receiver: {},
        intermediaries: [],
        amount: 1000,
        currency: 'USD',
        transactionType: TransactionType.WIRE_TRANSFER,
        sourceFormat: DataFormat.ISO20022,
        fiboMapped: true,
        schemaVersion: '1.0.0',
        riskFlags: [],
      };

      const result = TransactionSchema.safeParse(invalidTransaction);
      expect(result.success).toBe(false);
    });
  });
});
