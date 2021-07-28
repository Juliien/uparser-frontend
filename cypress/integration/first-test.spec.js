describe("First test", () => {
  it("should visit home page", () => {
    cy.visit("/home");
    cy.get(':nth-child(2) > .nav-item > .nav-link').click();
    cy.get('.me-auto > .nav-item > .nav-link').click();
    cy.get('.navbar-brand').click();


  });
});
