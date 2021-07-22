describe("Parser", () => {

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      localStorage.setItem('users', JSON.stringify(users));
    });
  });

  it("should test the parser", () => {
    const fixtureFile = 'text.txt';
    cy.visit("/login");
    cy.get(':nth-child(1) > .form-control').type(Cypress.config('username'));
    cy.get(':nth-child(2) > .form-control').type(Cypress.config('password'));
    cy.get('form.ng-dirty > .d-grid > .btn').click();
    cy.get(':nth-child(2) > .btn').click();
    cy.get('[ng-reflect-model="python"]').select('python');
    cy.get('.form-control.ng-untouched').type('json')
    cy.get('input[type="file"]').attachFile(fixtureFile);
    cy.get('.my-5 > .btn').click()
  });
});
