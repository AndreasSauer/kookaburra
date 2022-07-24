export const getGreeting = () => cy.get('h1');

export const loadTestingEnviroment = async () => {
  console.log();
  //   if (!Cypress.env('MONGODB')) {
  //     throw new Error('no mongodb variable is defiend');
  //   }
};
