describe("First test", () => {
  it("should visit login page", () => {
    cy.visit("/login");
    cy.get('.card-body > a').click();
    cy.get(':nth-child(2) > .btn').click();
    cy.get('.me-auto > .nav-item > .nav-link').click();
    cy.get('.navbar-brand').click();


  });
});
