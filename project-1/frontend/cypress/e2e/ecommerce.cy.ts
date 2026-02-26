describe('E-commerce Flow', () => {
    beforeEach(() => {
        cy.login('ahana@talview.com', 'Ahana@123');
    });

    it('should add products to cart and checkout', () => {
        cy.visit('/products');
        cy.get('button').contains('View Details').first().click();
        cy.get('button').contains('Add to Cart').click();
        cy.visit('/cart');
        cy.get('.cart-item').should('have.length.at.least', 1);
        cy.get('button').contains(/checkout/i).first().click({ force: true });
        cy.url().should('include', '/checkout');

        cy.get('input[name="street"]').clear().type('123 Cypress St');
        cy.get('input[name="city"]').clear().type('Test City');
        cy.get('input[name="state"]').clear().type('Test State');
        cy.get('input[name="pincode"]').clear().type('123456');
        cy.get('input[name="phone"]').clear().type('+911234567890');

        cy.get('button').contains(/Place Order/i).click();
        cy.url().should('include', '/order-confirmation');
        cy.contains(/Order Placed/i).should('exist');
    });
});
