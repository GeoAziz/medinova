// Cypress E2E test: Receptionist login and view dashboard
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Receptionist Login and View Dashboard', () => {
  it('should log in as receptionist and view dashboard', () => {
    cy.visit('http://localhost:9002/auth');
  cy.get('input[name="email"]', { timeout: 10000 }).should('exist').and('not.be.disabled').type('receptionist@zizoverse.io');
  cy.get('input[name="password"]', { timeout: 10000 }).should('exist').and('not.be.disabled').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/reception/dashboard');
  cy.contains("Today's Appointment Queue", { timeout: 10000 }).should('be.visible');
    cy.get('table').should('exist');
  });
});
