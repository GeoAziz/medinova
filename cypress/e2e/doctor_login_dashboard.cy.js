// Cypress E2E test: Doctor login and view dashboard
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Doctor Login and View Dashboard', () => {
  it('should log in as doctor and view dashboard', () => {
    cy.visit('http://localhost:9002/auth');
    cy.get('input[name="email"]').should('not.be.disabled').type('doctor@zizoverse.io');
    cy.get('input[name="password"]').should('not.be.disabled').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/doctor/dashboard');
    cy.contains('Patients', { timeout: 10000 }).should('be.visible');
    cy.get('table').should('exist');
    cy.get('table tbody tr').its('length').should('be.gte', 1);
  });
});
