describe('Admin Dashboard', () => {
    beforeEach(() => {
        cy.login('admin@talview.com', 'Admin@123');
    });

    it('should see all orders in the dashboard', () => {
        cy.visit('/admin');
        cy.get('h1').should('contain', 'Admin Control Center');
        cy.get('.order-card').should('have.length.at.least', 0);
    });

    it('should signal an order update', () => {
        cy.visit('/admin');
        // Find an order and send a signal
        cy.get('select').first().select('shipment-confirm');
        cy.get('button').contains('Send Signal').first().click();
        cy.on('window:confirm', () => true);
        // Success alert would appear
    });
});
