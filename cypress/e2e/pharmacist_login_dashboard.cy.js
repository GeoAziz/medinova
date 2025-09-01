// Cypress E2E test: Pharmacist login and view dashboard
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Pharmacist Login and View Dashboard', () => {
  it('should log in as pharmacist and view dashboard', () => {
    cy.visit('http://localhost:9002/auth');
  cy.get('input[name="email"]', { timeout: 10000 }).should('exist').and('not.be.disabled').type('pharmacist@zizoverse.io');
  cy.get('input[name="password"]', { timeout: 10000 }).should('exist').and('not.be.disabled').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/pharmacist/dashboard');
  cy.contains('Live Prescription Queue', { timeout: 10000 }).should('be.visible');
    cy.get('table').should('exist');
  });
});
