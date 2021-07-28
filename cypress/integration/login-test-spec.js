describe("Login", () => {

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      localStorage.setItem('users', JSON.stringify(users));
    });
  });

  it("should login user", () => {
    cy.visit("/login");
    cy.get(':nth-child(1) > .form-control').type(Cypress.config('username'));
    cy.get(':nth-child(2) > .form-control').type(Cypress.config('password'));
    cy.get('form.ng-dirty > .d-grid > .btn').click();
    cy.location('pathname').should('eq', '/home')

  });
});