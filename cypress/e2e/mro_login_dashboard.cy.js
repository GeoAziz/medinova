// Cypress E2E test: Medical Records Officer login and view dashboard
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Medical Records Officer Login and View Dashboard', () => {
  it('should log in as medical records officer and view dashboard', () => {
    cy.visit('http://localhost:9002/auth');
    cy.get('input[name="email"]').should('not.be.disabled').type('medicalrecordsofficer@zizoverse.io');
    cy.get('input[name="password"]').should('not.be.disabled').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/medical-records/dashboard');
    cy.contains('Medical Records', { timeout: 10000 }).should('be.visible');
    cy.get('table').should('exist');
  });
});
