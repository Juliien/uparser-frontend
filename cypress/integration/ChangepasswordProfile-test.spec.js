describe("Profile", () => {

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      localStorage.setItem('users', JSON.stringify(users));
    });
  });

  it("should login user & show his profile", () => {
    cy.visit("/login");
    cy.get(':nth-child(1) > .form-control').type(Cypress.config('username'));
    cy.get(':nth-child(2) > .form-control').type(Cypress.config('password'));
    cy.get('form.ng-dirty > .d-grid > .btn').click();


    cy.location('pathname').should('eq', '/home')
    cy.get(':nth-child(2) > :nth-child(1) > .nav-link').click()
    cy.location('pathname').should('eq', '/profile')
    cy.get('.form-control').type('123456789{enter}')
    cy.get(':nth-child(5) > .btn').click()
  });
});
