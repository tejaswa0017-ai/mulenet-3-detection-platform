import {
  TransactionType,
  DataFormat,
  EntityType,
  AlertTier,
  Jurisdiction,
} from '../enums';

describe('Enums', () => {
  describe('TransactionType', () => {
    it('should have all expected transaction types', () => {
      expect(TransactionType.WIRE_TRANSFER).toBe('WIRE_TRANSFER');
      expect(TransactionType.ACH).toBe('ACH');
      expect(TransactionType.CARD_PAYMENT).toBe('CARD_PAYMENT');
      expect(TransactionType.CRYPTO_TRANSFER).toBe('CRYPTO_TRANSFER');
      expect(TransactionType.CASH_DEPOSIT).toBe('CASH_DEPOSIT');
      expect(TransactionType.CASH_WITHDRAWAL).toBe('CASH_WITHDRAWAL');
    });
  });

  describe('DataFormat', () => {
    it('should have all expected data formats', () => {
      expect(DataFormat.ISO20022).toBe('ISO20022');
      expect(DataFormat.SWIFT_MT103).toBe('SWIFT_MT103');
      expect(DataFormat.STIX21).toBe('STIX21');
      expect(DataFormat.INTERNAL).toBe('INTERNAL');
    });
  });

  describe('EntityType', () => {
    it('should have all expected entity types', () => {
      expect(EntityType.INDIVIDUAL).toBe('INDIVIDUAL');
      expect(EntityType.BUSINESS).toBe('BUSINESS');
      expect(EntityType.ACCOUNT).toBe('ACCOUNT');
      expect(EntityType.DEVICE).toBe('DEVICE');
      expect(EntityType.IP_ADDRESS).toBe('IP_ADDRESS');
      expect(EntityType.CRYPTO_WALLET).toBe('CRYPTO_WALLET');
    });
  });

  describe('AlertTier', () => {
    it('should have all expected alert tiers', () => {
      expect(AlertTier.INFORMATIONAL).toBe('INFORMATIONAL');
      expect(AlertTier.MONITORING).toBe('MONITORING');
      expect(AlertTier.INVESTIGATION).toBe('INVESTIGATION');
      expect(AlertTier.CRITICAL).toBe('CRITICAL');
    });
  });

  describe('Jurisdiction', () => {
    it('should have all expected jurisdictions', () => {
      expect(Jurisdiction.EU_GDPR).toBe('EU_GDPR');
      expect(Jurisdiction.UK_GDPR).toBe('UK_GDPR');
      expect(Jurisdiction.UK_MLR_2017).toBe('UK_MLR_2017');
      expect(Jurisdiction.INDIA_DPDP_2023).toBe('INDIA_DPDP_2023');
      expect(Jurisdiction.US_GLBA).toBe('US_GLBA');
      expect(Jurisdiction.US_BSA).toBe('US_BSA');
    });
  });
});
