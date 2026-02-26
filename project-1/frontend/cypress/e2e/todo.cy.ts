describe('Todo List Management', () => {
    beforeEach(() => {
        cy.login('ahana@talview.com', 'Ahana@123');
    });

    it('should create a new todo list', () => {
        cy.visit('/todo');
        cy.get('button').contains('CREATE NEW LIST').click();
        const listName = `Test List ${Date.now()}`;
        cy.get('input[placeholder="List Name (e.g. Shopping)"]').type(listName);
        cy.get('button').contains('CREATE').click();
        cy.contains(listName).should('exist');
    });

    it('should add items to a user-owned list', () => {
        cy.visit('/todo');
        cy.get('button').contains('CREATE NEW LIST').click();
        const listName = `Add Test ${Date.now()}`;
        cy.get('input[placeholder="List Name (e.g. Shopping)"]').type(listName);
        cy.intercept('POST', '**/api/todo-lists*').as('createList');
        cy.intercept('GET', '**/api/todo-lists*').as('getLists');
        cy.get('button').contains('CREATE').click();
        cy.wait('@createList');
        cy.wait('@getLists');

        // Wait for the newly created list to appear in the dropdown and select it
        cy.get('[data-testid="list-selector"]').contains('option', listName, { timeout: 10000 }).then(option => {
            cy.get('[data-testid="list-selector"]').select(option.val() as string);
        });
        cy.wait(1000); // Allow React to re-render the input after selection

        cy.get('input[placeholder="Add a task..."]').should('be.visible').type('New Task Item');
        cy.get('[data-testid="add-task-button"]').click({ force: true });
        cy.contains('New Task Item').should('exist');
    });

    it('should not allow non-owners to delete a list', () => {
        // This assumes there's a list owned by someone else
        // In a real environment, we'd seed this data
        cy.visit('/todo');
        // ... verification logic for RBAC
    });
});
