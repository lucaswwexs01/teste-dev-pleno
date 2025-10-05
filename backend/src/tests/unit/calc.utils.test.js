const {
  calculateTotalValue,
  calculatePurchaseSaleDifference,
  isValidMonth,
  isValidYear,
  isValidQuantity,
  formatCurrency,
  formatQuantity,
  getMonthName,
  getFuelTypeName,
  getOperationTypeName
} = require('../../utils/calc.utils');

describe('Calculation Utils', () => {
  describe('calculateTotalValue', () => {
    test('should calculate total value correctly', () => {
      const quantity = 100;
      const unitPrice = 5.92;
      const taxRate = 17.20;
      const selicRate = 11.5;

      const result = calculateTotalValue(quantity, unitPrice, taxRate, selicRate);
      
      // Fórmula: Quantidade × Preço × (1 + Tributo/100) × (1 + SELIC/100)
      // 100 × 5.92 × (1 + 17.20/100) × (1 + 11.5/100)
      // 100 × 5.92 × 1.172 × 1.115
      // 100 × 5.92 × 1.30678
      // 100 × 7.7361376
      // 773.61
      expect(result).toBeCloseTo(773.61, 2);
    });

    test('should handle zero quantity', () => {
      const result = calculateTotalValue(0, 5.92, 17.20, 11.5);
      expect(result).toBe(0);
    });

    test('should handle zero price', () => {
      const result = calculateTotalValue(100, 0, 17.20, 11.5);
      expect(result).toBe(0);
    });

    test('should use default SELIC rate when not provided', () => {
      const result = calculateTotalValue(100, 5.92, 17.20);
      expect(result).toBeCloseTo(773.61, 2);
    });
  });

  describe('calculatePurchaseSaleDifference', () => {
    test('should calculate difference correctly', () => {
      const operations = [
        { type: 'purchase', totalValue: 1000 },
        { type: 'purchase', totalValue: 500 },
        { type: 'sale', totalValue: 800 },
        { type: 'sale', totalValue: 1200 }
      ];

      const result = calculatePurchaseSaleDifference(operations);
      
      expect(result.totalPurchases).toBe(1500);
      expect(result.totalSales).toBe(2000);
      expect(result.difference).toBe(500);
      expect(result.isPositive).toBe(true);
    });

    test('should handle negative difference', () => {
      const operations = [
        { type: 'purchase', totalValue: 2000 },
        { type: 'sale', totalValue: 1500 }
      ];

      const result = calculatePurchaseSaleDifference(operations);
      
      expect(result.totalPurchases).toBe(2000);
      expect(result.totalSales).toBe(1500);
      expect(result.difference).toBe(-500);
      expect(result.isPositive).toBe(false);
    });

    test('should handle empty operations array', () => {
      const result = calculatePurchaseSaleDifference([]);
      
      expect(result.totalPurchases).toBe(0);
      expect(result.totalSales).toBe(0);
      expect(result.difference).toBe(0);
      expect(result.isPositive).toBe(true);
    });
  });

  describe('Validation Functions', () => {
    describe('isValidMonth', () => {
      test('should return true for valid months', () => {
        expect(isValidMonth(1)).toBe(true);
        expect(isValidMonth(6)).toBe(true);
        expect(isValidMonth(12)).toBe(true);
      });

      test('should return false for invalid months', () => {
        expect(isValidMonth(0)).toBe(false);
        expect(isValidMonth(13)).toBe(false);
        expect(isValidMonth(-1)).toBe(false);
      });
    });

    describe('isValidYear', () => {
      test('should return true for valid years', () => {
        expect(isValidYear(2020)).toBe(true);
        expect(isValidYear(2024)).toBe(true);
        expect(isValidYear(new Date().getFullYear())).toBe(true);
      });

      test('should return false for invalid years', () => {
        expect(isValidYear(2019)).toBe(false);
        expect(isValidYear(new Date().getFullYear() + 1)).toBe(false);
      });
    });

    describe('isValidQuantity', () => {
      test('should return true for valid quantities', () => {
        expect(isValidQuantity(0.001)).toBe(true);
        expect(isValidQuantity(100)).toBe(true);
        expect(isValidQuantity(1000000)).toBe(true);
      });

      test('should return false for invalid quantities', () => {
        expect(isValidQuantity(0)).toBe(false);
        expect(isValidQuantity(-1)).toBe(false);
        expect(isValidQuantity(1000001)).toBe(false);
      });
    });
  });

  describe('Formatting Functions', () => {
    describe('formatCurrency', () => {
      test('should format currency correctly', () => {
        expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
        expect(formatCurrency(0)).toBe('R$ 0,00');
        expect(formatCurrency(1000000)).toBe('R$ 1.000.000,00');
      });
    });

    describe('formatQuantity', () => {
      test('should format quantity correctly', () => {
        expect(formatQuantity(123.456)).toBe('123,456 L');
        expect(formatQuantity(0)).toBe('0,000 L');
        expect(formatQuantity(1000)).toBe('1000,000 L');
      });
    });

    describe('getMonthName', () => {
      test('should return correct month names', () => {
        expect(getMonthName(1)).toBe('Janeiro');
        expect(getMonthName(6)).toBe('Junho');
        expect(getMonthName(12)).toBe('Dezembro');
      });

      test('should return error message for invalid month', () => {
        expect(getMonthName(0)).toBe('Mês inválido');
        expect(getMonthName(13)).toBe('Mês inválido');
      });
    });

    describe('getFuelTypeName', () => {
      test('should return correct fuel type names', () => {
        expect(getFuelTypeName('gasoline')).toBe('Gasolina');
        expect(getFuelTypeName('ethanol')).toBe('Etanol');
        expect(getFuelTypeName('diesel')).toBe('Diesel');
      });

      test('should return original value for unknown fuel type', () => {
        expect(getFuelTypeName('unknown')).toBe('unknown');
      });
    });

    describe('getOperationTypeName', () => {
      test('should return correct operation type names', () => {
        expect(getOperationTypeName('purchase')).toBe('Compra');
        expect(getOperationTypeName('sale')).toBe('Venda');
      });

      test('should return original value for unknown operation type', () => {
        expect(getOperationTypeName('unknown')).toBe('unknown');
      });
    });
  });
});

