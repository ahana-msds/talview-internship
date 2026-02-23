Cypress.Commands.add('login', (email, password) => {
    cy.session(
        [email, password],
        () => {
            cy.visit('/login');
            cy.get('input[name="email"]').type(email);
            cy.get('input[name="password"]').type(password);
            cy.get('button[type="submit"]').click();
            cy.url().should('not.include', '/login');

            // Wait for JWT to be stored
            cy.window().its('localStorage.jwt_token').should('exist');
        },
        {
            validate() {
                cy.window().its('localStorage.jwt_token').should('exist');
            },
        }
    );
});

declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<void>;
        }
    }
}

export { };
