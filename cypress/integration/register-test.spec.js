describe("User", () => {
  it("should register user", () => {
    cy.visit("/register");
    cy.get(':nth-child(1) > .form-control').type(Cypress.config('firstName'));
    cy.get(':nth-child(2) > .form-control').type(Cypress.config('lastname'));
    cy.get(':nth-child(3) > .form-control').type(Cypress.config('username'));
    cy.get(':nth-child(4) > .form-control').type(Cypress.config('password'));

    cy.get('.btn').click();

    //cy.url().should('include', 'localhost:4200/login');
    //cy.get('.alert').should('contain', 'successful');

  });
});
