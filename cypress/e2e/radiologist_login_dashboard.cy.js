// Cypress E2E test: Radiologist login and view dashboard
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Radiologist Login and View Dashboard', () => {
  it('should log in as radiologist and view dashboard', () => {
    cy.visit('http://localhost:9002/auth');
  cy.get('input[name="email"]', { timeout: 10000 }).should('exist').and('not.be.disabled').type('radiologist@zizoverse.io');
  cy.get('input[name="password"]', { timeout: 10000 }).should('exist').and('not.be.disabled').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/radiologist/dashboard');
  cy.contains('Scan Request Queue', { timeout: 10000 }).should('be.visible');
    cy.get('table').should('exist');
  });
});
