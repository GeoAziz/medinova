// Cypress E2E test: Lab Scientist login and view dashboard
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Lab Scientist Login and View Dashboard', () => {
  it('should log in as lab scientist and view dashboard', () => {
    cy.visit('http://localhost:9002/auth');
  cy.get('input[name="email"]', { timeout: 10000 }).should('exist').and('not.be.disabled').type('labscientist@zizoverse.io');
  cy.get('input[name="password"]', { timeout: 10000 }).should('exist').and('not.be.disabled').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/lab/dashboard');
    cy.contains('Lab Results', { timeout: 10000 }).should('be.visible');
    cy.get('table').should('exist');
  });
});
