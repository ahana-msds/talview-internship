describe('Authentication Flow', () => {
    it('should login an existing user', () => {
        cy.visit('/login');
        cy.get('input[type="email"]').type('ahana@talview.com');
        cy.get('input[type="password"]').type('Ahana@123');
        cy.get('button[type="submit"]').click();

        // Should redirect to dashboard/home
        cy.url().should('not.include', '/login');
        cy.contains('Ahana@talview.com').should('exist');
    });

    it('should redirect unauthenticated users from protected routes', () => {
        cy.visit('/todo');
        cy.url().should('include', '/login');
    });

    it('should logout successfully', () => {
        cy.login('ahana@talview.com', 'Ahana@123');
        cy.visit('/');
        cy.get('button').contains('Log out').click();
        cy.url().should('include', '/login');
        cy.window().its('localStorage.jwt_token').should('not.exist');
    });
});
