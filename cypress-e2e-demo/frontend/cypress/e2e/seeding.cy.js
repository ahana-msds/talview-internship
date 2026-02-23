describe('State Management & Sessions', () => {
    it('should demonstrate seeding state via API', () => {
        cy.request('POST', 'http://localhost:4002/api/reset');
        cy.login('testuser', 'password');
        cy.visit('/');
        cy.get('.todo-item').should('have.length', 2);
    });

    it('should reuse session for faster login', () => {
        // This will use the cached session from the previous test or custom command
        cy.login('testuser', 'password');
        cy.visit('/');
        cy.get('h1').should('contain', 'Todo List');
    });
});
