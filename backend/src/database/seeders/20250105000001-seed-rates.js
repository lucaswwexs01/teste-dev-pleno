'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Dados das tabelas de preços e tributos para 2024
    const purchaseRates = [
      // Janeiro
      { month: 1, year: 2024, fuel_type: 'gasoline', operation_type: 'purchase', unit_price: 5.92, tax_rate: 17.20 },
      { month: 1, year: 2024, fuel_type: 'ethanol', operation_type: 'purchase', unit_price: 3.38, tax_rate: 17.20 },
      { month: 1, year: 2024, fuel_type: 'diesel', operation_type: 'purchase', unit_price: 5.87, tax_rate: 17.20 },
      
      // Fevereiro
      { month: 2, year: 2024, fuel_type: 'gasoline', operation_type: 'purchase', unit_price: 5.95, tax_rate: 19.30 },
      { month: 2, year: 2024, fuel_type: 'ethanol', operation_type: 'purchase', unit_price: 3.53, tax_rate: 19.30 },
      { month: 2, year: 2024, fuel_type: 'diesel', operation_type: 'purchase', unit_price: 5.88, tax_rate: 19.30 },
      
      // Março
      { month: 3, year: 2024, fuel_type: 'gasoline', operation_type: 'purchase', unit_price: 5.90, tax_rate: 18.10 },
      { month: 3, year: 2024, fuel_type: 'ethanol', operation_type: 'purchase', unit_price: 3.56, tax_rate: 18.10 },
      { month: 3, year: 2024, fuel_type: 'diesel', operation_type: 'purchase', unit_price: 5.84, tax_rate: 18.10 },
      
      // Abril
      { month: 4, year: 2024, fuel_type: 'gasoline', operation_type: 'purchase', unit_price: 5.94, tax_rate: 19.20 },
      { month: 4, year: 2024, fuel_type: 'ethanol', operation_type: 'purchase', unit_price: 3.63, tax_rate: 19.20 },
      { month: 4, year: 2024, fuel_type: 'diesel', operation_type: 'purchase', unit_price: 5.85, tax_rate: 19.20 },
      
      // Maio
      { month: 5, year: 2024, fuel_type: 'gasoline', operation_type: 'purchase', unit_price: 5.93, tax_rate: 19.70 },
      { month: 5, year: 2024, fuel_type: 'ethanol', operation_type: 'purchase', unit_price: 3.82, tax_rate: 19.70 },
      { month: 5, year: 2024, fuel_type: 'diesel', operation_type: 'purchase', unit_price: 5.86, tax_rate: 19.70 },
      
      // Junho
      { month: 6, year: 2024, fuel_type: 'gasoline', operation_type: 'purchase', unit_price: 5.90, tax_rate: 20.10 },
      { month: 6, year: 2024, fuel_type: 'ethanol', operation_type: 'purchase', unit_price: 3.81, tax_rate: 20.10 },
      { month: 6, year: 2024, fuel_type: 'diesel', operation_type: 'purchase', unit_price: 5.83, tax_rate: 20.10 },
      
      // Julho
      { month: 7, year: 2024, fuel_type: 'gasoline', operation_type: 'purchase', unit_price: 5.89, tax_rate: 20.60 },
      { month: 7, year: 2024, fuel_type: 'ethanol', operation_type: 'purchase', unit_price: 4.09, tax_rate: 20.60 },
      { month: 7, year: 2024, fuel_type: 'diesel', operation_type: 'purchase', unit_price: 5.93, tax_rate: 20.60 },
      
      // Agosto
      { month: 8, year: 2024, fuel_type: 'gasoline', operation_type: 'purchase', unit_price: 5.99, tax_rate: 21.10 },
      { month: 8, year: 2024, fuel_type: 'ethanol', operation_type: 'purchase', unit_price: 4.06, tax_rate: 21.10 },
      { month: 8, year: 2024, fuel_type: 'diesel', operation_type: 'purchase', unit_price: 5.93, tax_rate: 21.10 },
      
      // Setembro
      { month: 9, year: 2024, fuel_type: 'gasoline', operation_type: 'purchase', unit_price: 6.04, tax_rate: 21.60 },
      { month: 9, year: 2024, fuel_type: 'ethanol', operation_type: 'purchase', unit_price: 4.07, tax_rate: 21.60 },
      { month: 9, year: 2024, fuel_type: 'diesel', operation_type: 'purchase', unit_price: 5.91, tax_rate: 21.60 },
      
      // Outubro
      { month: 10, year: 2024, fuel_type: 'gasoline', operation_type: 'purchase', unit_price: 6.01, tax_rate: 22.10 },
      { month: 10, year: 2024, fuel_type: 'ethanol', operation_type: 'purchase', unit_price: 4.03, tax_rate: 22.10 },
      { month: 10, year: 2024, fuel_type: 'diesel', operation_type: 'purchase', unit_price: 5.92, tax_rate: 22.10 },
      
      // Novembro
      { month: 11, year: 2024, fuel_type: 'gasoline', operation_type: 'purchase', unit_price: 6.03, tax_rate: 22.60 },
      { month: 11, year: 2024, fuel_type: 'ethanol', operation_type: 'purchase', unit_price: 4.02, tax_rate: 22.60 },
      { month: 11, year: 2024, fuel_type: 'diesel', operation_type: 'purchase', unit_price: 5.96, tax_rate: 22.60 },
      
      // Dezembro
      { month: 12, year: 2024, fuel_type: 'gasoline', operation_type: 'purchase', unit_price: 6.08, tax_rate: 23.10 },
      { month: 12, year: 2024, fuel_type: 'ethanol', operation_type: 'purchase', unit_price: 4.10, tax_rate: 23.10 },
      { month: 12, year: 2024, fuel_type: 'diesel', operation_type: 'purchase', unit_price: 6.01, tax_rate: 23.10 }
    ];

    const saleRates = [
      // Janeiro
      { month: 1, year: 2024, fuel_type: 'gasoline', operation_type: 'sale', unit_price: 5.94, tax_rate: 17.00 },
      { month: 1, year: 2024, fuel_type: 'ethanol', operation_type: 'sale', unit_price: 3.40, tax_rate: 17.00 },
      { month: 1, year: 2024, fuel_type: 'diesel', operation_type: 'sale', unit_price: 5.88, tax_rate: 17.00 },
      
      // Fevereiro
      { month: 2, year: 2024, fuel_type: 'gasoline', operation_type: 'sale', unit_price: 5.97, tax_rate: 19.00 },
      { month: 2, year: 2024, fuel_type: 'ethanol', operation_type: 'sale', unit_price: 3.55, tax_rate: 19.00 },
      { month: 2, year: 2024, fuel_type: 'diesel', operation_type: 'sale', unit_price: 5.90, tax_rate: 19.00 },
      
      // Março
      { month: 3, year: 2024, fuel_type: 'gasoline', operation_type: 'sale', unit_price: 5.92, tax_rate: 18.00 },
      { month: 3, year: 2024, fuel_type: 'ethanol', operation_type: 'sale', unit_price: 3.58, tax_rate: 18.00 },
      { month: 3, year: 2024, fuel_type: 'diesel', operation_type: 'sale', unit_price: 5.86, tax_rate: 18.00 },
      
      // Abril
      { month: 4, year: 2024, fuel_type: 'gasoline', operation_type: 'sale', unit_price: 5.96, tax_rate: 19.00 },
      { month: 4, year: 2024, fuel_type: 'ethanol', operation_type: 'sale', unit_price: 3.65, tax_rate: 19.00 },
      { month: 4, year: 2024, fuel_type: 'diesel', operation_type: 'sale', unit_price: 5.87, tax_rate: 19.00 },
      
      // Maio
      { month: 5, year: 2024, fuel_type: 'gasoline', operation_type: 'sale', unit_price: 5.95, tax_rate: 19.50 },
      { month: 5, year: 2024, fuel_type: 'ethanol', operation_type: 'sale', unit_price: 3.84, tax_rate: 19.50 },
      { month: 5, year: 2024, fuel_type: 'diesel', operation_type: 'sale', unit_price: 5.88, tax_rate: 19.50 },
      
      // Junho
      { month: 6, year: 2024, fuel_type: 'gasoline', operation_type: 'sale', unit_price: 5.92, tax_rate: 20.00 },
      { month: 6, year: 2024, fuel_type: 'ethanol', operation_type: 'sale', unit_price: 3.83, tax_rate: 20.00 },
      { month: 6, year: 2024, fuel_type: 'diesel', operation_type: 'sale', unit_price: 5.85, tax_rate: 20.00 },
      
      // Julho
      { month: 7, year: 2024, fuel_type: 'gasoline', operation_type: 'sale', unit_price: 5.91, tax_rate: 20.50 },
      { month: 7, year: 2024, fuel_type: 'ethanol', operation_type: 'sale', unit_price: 4.11, tax_rate: 20.50 },
      { month: 7, year: 2024, fuel_type: 'diesel', operation_type: 'sale', unit_price: 5.95, tax_rate: 20.50 },
      
      // Agosto
      { month: 8, year: 2024, fuel_type: 'gasoline', operation_type: 'sale', unit_price: 6.01, tax_rate: 21.00 },
      { month: 8, year: 2024, fuel_type: 'ethanol', operation_type: 'sale', unit_price: 4.08, tax_rate: 21.00 },
      { month: 8, year: 2024, fuel_type: 'diesel', operation_type: 'sale', unit_price: 5.95, tax_rate: 21.00 },
      
      // Setembro
      { month: 9, year: 2024, fuel_type: 'gasoline', operation_type: 'sale', unit_price: 6.06, tax_rate: 21.50 },
      { month: 9, year: 2024, fuel_type: 'ethanol', operation_type: 'sale', unit_price: 4.09, tax_rate: 21.50 },
      { month: 9, year: 2024, fuel_type: 'diesel', operation_type: 'sale', unit_price: 5.93, tax_rate: 21.50 },
      
      // Outubro
      { month: 10, year: 2024, fuel_type: 'gasoline', operation_type: 'sale', unit_price: 6.03, tax_rate: 22.00 },
      { month: 10, year: 2024, fuel_type: 'ethanol', operation_type: 'sale', unit_price: 4.05, tax_rate: 22.00 },
      { month: 10, year: 2024, fuel_type: 'diesel', operation_type: 'sale', unit_price: 5.94, tax_rate: 22.00 },
      
      // Novembro
      { month: 11, year: 2024, fuel_type: 'gasoline', operation_type: 'sale', unit_price: 6.05, tax_rate: 22.50 },
      { month: 11, year: 2024, fuel_type: 'ethanol', operation_type: 'sale', unit_price: 4.04, tax_rate: 22.50 },
      { month: 11, year: 2024, fuel_type: 'diesel', operation_type: 'sale', unit_price: 5.98, tax_rate: 22.50 },
      
      // Dezembro
      { month: 12, year: 2024, fuel_type: 'gasoline', operation_type: 'sale', unit_price: 6.10, tax_rate: 23.00 },
      { month: 12, year: 2024, fuel_type: 'ethanol', operation_type: 'sale', unit_price: 4.12, tax_rate: 23.00 },
      { month: 12, year: 2024, fuel_type: 'diesel', operation_type: 'sale', unit_price: 6.03, tax_rate: 23.00 }
    ];

    const allRates = [...purchaseRates, ...saleRates];
    
    await queryInterface.bulkInsert('rates', allRates.map(rate => ({
      ...rate,
      created_at: new Date(),
      updated_at: new Date()
    })));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('rates', null, {});
  }
};

