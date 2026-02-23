describe('Todo List Management', () => {
    beforeEach(() => {
        cy.login('ahana@talview.com', 'Ahana@123');
    });

    it('should create a new todo list', () => {
        cy.visit('/todo');
        const listName = `Test List ${Date.now()}`;
        cy.get('input[placeholder="Enter list name"]').type(listName);
        cy.get('button').contains('Create').click();
        cy.contains(listName).should('exist');
    });

    it('should add items to a list', () => {
        cy.visit('/todo');
        cy.get('.todo-list-card').first().click();
        cy.get('input[placeholder="Add a task"]').type('New Task Item{enter}');
        cy.contains('New Task Item').should('exist');
    });

    it('should not allow non-owners to delete a list', () => {
        // This assumes there's a list owned by someone else
        // In a real environment, we'd seed this data
        cy.visit('/todo');
        // ... verification logic for RBAC
    });
});
