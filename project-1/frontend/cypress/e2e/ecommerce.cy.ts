describe('E-commerce Flow', () => {
    beforeEach(() => {
        cy.login('ahana@talview.com', 'Ahana@123');
    });

    it('should add products to cart and checkout', () => {
        cy.visit('/products');
        cy.get('button').contains('Add to Cart').first().click();
        cy.visit('/cart');
        cy.get('.cart-item').should('have.length.at.least', 1);
        cy.get('button').contains('Checkout').click();
        cy.url().should('include', '/checkout');

        cy.get('input[name="address"]').clear().type('123 Cypress St');
        cy.get('button').contains('Place Order').click();
        cy.url().should('include', '/orders');
        cy.contains('PENDING').should('exist');
    });
});
