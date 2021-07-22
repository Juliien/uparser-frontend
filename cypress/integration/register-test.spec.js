describe("User", () => {
  it("should register user", () => {
    cy.visit("/register");
    cy.get(':nth-child(1) > .form-control').type('karim');
    cy.get(':nth-child(2) > .form-control').type('BELMAJDOUB');
    cy.get(':nth-child(3) > .form-control').type('belmajkarim9@gmail.com');
    cy.get(':nth-child(4) > .form-control').type('123456789{enter}');

    cy.get('.btn').click();

    //cy.url().should('include', 'localhost:4200/login');
    //cy.get('.alert').should('contain', 'successful');

  });
});
