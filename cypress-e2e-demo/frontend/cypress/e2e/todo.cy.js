describe('Todo List', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:4002/api/reset');
        cy.login('testuser', 'password');
        cy.visit('/');
    });

    it('should display initial todos', () => {
        cy.get('.todo-item').should('have.length', 2);
    });

    it('should add a new todo', () => {
        cy.get('input[placeholder="New todo"]').type('Mastering Cypress');
        cy.get('button[type="submit"]').click();
        cy.get('.todo-item').should('have.length', 3);
        cy.get('.todo-item').last().should('contain', 'Mastering Cypress');
    });
});
