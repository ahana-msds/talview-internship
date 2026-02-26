describe('Authentication Flow', () => {
    it('should login an existing user', () => {
        cy.login('ahana@talview.com', 'Ahana@123');
        cy.visit('/dashboard');
        cy.contains('ahana', { matchCase: false }).should('exist');
    });

    it('should redirect unauthenticated users from protected routes', () => {
        Cypress.session.clearAllSavedSessions();
        cy.clearLocalStorage();
        cy.window().then((win) => {
            win.sessionStorage.clear();
            win.indexedDB.deleteDatabase('firebaseLocalStorageDb');
        });
        cy.visit('/todo');
        cy.url().should('include', '/login');
    });

    it('should logout successfully', () => {
        cy.login('ahana@talview.com', 'Ahana@123');
        cy.visit('/');
        cy.get('button').contains('Logout').click();
        cy.url().should('include', '/login');
        cy.window().its('localStorage.jwt_token').should('not.exist');
    });
});
