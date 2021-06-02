describe("User", () => {
  it("should register user", () => {
    cy.visit("/register");
    cy.get('#firstName').type('karim');
    cy.get('#lastName').type('BELMAJDOUB');
    cy.get('#email').type('belmajkarim29@gmail.com');
    cy.get('#password').type('123456789{enter}');

    //cy.get(':nth-child(5) > .btn').click();

    cy.url().should('include', 'http://localhost:4200/register');

  });
});
