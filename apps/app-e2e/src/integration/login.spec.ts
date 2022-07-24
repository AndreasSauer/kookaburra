describe('login', () => {
  beforeEach(() => cy.visit('/'));

  it('login button should be disabled when no password and mail is given', async () => {
    cy.getByTestId('login-button')
      .should('be.visible')
      .should('have.class', 'button-disabled');
  });

  it('login button should not be disabled when mail and password is filled', async () => {
    cy.getByTestId('mail-input').type('cypress-user@mail.de');
    cy.getByTestId('password-input').type('test');
    cy.getByTestId('login-button')
      .should('be.visible')
      .should('not.have.class', 'button-disabled');
  });

  it('should navigate to recipes when loged in', async () => {
    cy.getByTestId('mail-input').type('cypress-user@mail.de');
    cy.getByTestId('password-input').type('test');
    cy.getByTestId('login-button').click();
    cy.getByTestId('recipe-header').should('be.visible');
  });
});
