const faker = require('faker');

describe('register', function() {
  it('should be able to register with valid data', () => {
    // Fake email generator with rare conflicts

    const newUser = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      zipcode: faker.address.zipCode(),
    };

    cy.clearCookies();
    cy.visitAndWaitFor('/join');

    cy.getCookies().should('have.length', 0);
    cy.get('h1').should('have.text', 'Join');
    cy.get('input#email').type(newUser.email);
    cy.get('input#confirm-email').type(newUser.email);
    cy.get('input#password').type(newUser.password);
    cy.get('input#confirm-password').type(newUser.password);
    cy.get('input#firstName').type(newUser.firstName);
    cy.get('input#lastName').type(newUser.lastName);
    cy.get('input#zipcode').type(newUser.zipcode);
    cy.get('button[type="submit"]').click();

    cy.url().should('contain', '/profile');
    cy.get('h1').should('have.text', 'Profile');
    cy.get('p').contains(`Hello ${newUser.firstName}!`);
    cy.getCookies()
      .should('have.length', 4)
      .then(cookies => {
        expect(cookies[1].value).to.equal(newUser.firstName);
        expect(cookies[2].value).to.equal(newUser.lastName);
        expect(cookies[3].value).to.equal(`${newUser.zipcode}`); // number to string 🤷‍♂️
      });
  });
});
