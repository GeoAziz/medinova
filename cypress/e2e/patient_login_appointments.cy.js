// Cypress E2E test: Patient login and view appointments

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Patient Login and View Appointments', () => {
  it('should log in as patient and view appointments', () => {
  cy.visit('http://localhost:9002/auth');
  cy.get('input[name="email"]').should('not.be.disabled').type('patient@zizoverse.io');
    cy.get('input[name="password"]').type('password123');
  cy.get('button[type="submit"]').click();
  // Wait for redirect to dashboard
  cy.url({ timeout: 10000 }).should('include', '/patient/dashboard');
  // Wait for appointments section to load
  cy.contains('Upcoming Appointments', { timeout: 10000 }).should('be.visible');
  cy.get('table').should('exist');
  cy.get('table tbody tr').its('length').should('be.gte', 1);
  });
});
