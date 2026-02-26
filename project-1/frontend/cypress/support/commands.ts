Cypress.Commands.add('login', (email, password) => {
    cy.session(
        [email, password],
        () => {
            // Setup intercepts before any navigation or interaction
            cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword*').as('firebaseLogin');
            cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:signUp*').as('firebaseSignup');

            cy.visit('/login');
            cy.get('input[type="email"]').type(email);
            cy.get('input[type="password"]').type(password);

            cy.get('button[type="submit"]').click();
            cy.wait('@firebaseLogin').then((interception) => {
                if (interception.response?.statusCode === 400) {
                    // Firebase returned 400, meaning user likely doesn't exist.
                    // Let's create the account automatically.
                    cy.visit('/signup');
                    cy.get('input[type="text"]').type('Test User');
                    cy.get('input[type="email"]').type(email);
                    cy.get('input[type="password"]').type(password);

                    // Intercept signup to wait for completion
                    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:signUp*').as('firebaseSignup');
                    cy.get('button[type="submit"]').click();
                    cy.wait('@firebaseSignup');

                    // Wait for redirect to login
                    cy.url().should('include', '/login');

                    // Login again with the newly created account!
                    cy.get('input[type="email"]').type(email);
                    cy.get('input[type="password"]').type(password);
                    cy.get('button[type="submit"]').click();
                }
            });

            cy.url().should('not.include', '/login');
            cy.url().should('not.include', '/signup');

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
