// Cypress E2E test: Nurse login and view dashboard
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Nurse Login and View Dashboard', () => {
  it('should log in as nurse and view dashboard', () => {
    cy.visit('http://localhost:9002/auth');
    cy.get('input[name="email"]').should('not.be.disabled').type('nurse@zizoverse.io');
    cy.get('input[name="password"]').should('not.be.disabled').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/nurse/dashboard');
    cy.contains('Assigned Patients', { timeout: 10000 }).should('be.visible');
    cy.get('table').should('exist');
  });
});
