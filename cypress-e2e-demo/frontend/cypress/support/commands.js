Cypress.Commands.add('login', (username, password) => {
    cy.session(
        username,
        () => {
            cy.visit('/');
            cy.get('input[name="username"]').type(username);
            cy.get('input[name="password"]').type(password);
            cy.get('button[type="submit"]').click();
            cy.url().should('include', '/');
            cy.get('h1').should('contain', 'Todo List');
        },
        {
            validate: () => {
                cy.window().then((window) => {
                    expect(window.localStorage.getItem('token')).to.be.a('string');
                });
            }
        }
    );
});
