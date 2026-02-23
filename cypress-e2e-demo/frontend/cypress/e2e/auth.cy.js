describe('Authentication', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:4002/api/reset');
    });

    it('should login successfully with valid credentials', () => {
        cy.visit('/');
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="password"]').type('password');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/');
        cy.get('h1').should('contain', 'Todo List');
    });

    it('should show error with invalid credentials', () => {
        cy.visit('/');
        cy.get('input[name="username"]').type('wrong');
        cy.get('input[name="password"]').type('wrong');
        cy.get('button[type="submit"]').click();
        cy.get('p').should('contain', 'Invalid credentials');
    });
});
