describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should be able to add book to reading list and UNDO it on clicking UNDO button in the snackbar', async () => {
    cy.get('input[type="search"]').type('angular');
    cy.get('form').submit();
    if(!(cy.get('[data-testing="book-item"]').find('button:not(:disabled)'))) return;
    const beforeLength = cy.get('.reading-list-item').then( val => val.length);
    cy.get('[data-testing="book-item"]').find('button:not(:disabled)').first().click();
    cy.get('.mat-simple-snackbar-action .mat-button').click();
    cy.get('.reading-list-item').should('have.length', beforeLength);
  });

  it('Then: I should be able to delete the book from reading list and UNDO it on clicking UNDO button in the snackbar', async () => {
    let beforeLength;
    cy.get('input[type="search"]').type('angular');
    cy.get('form').submit();
    cy.get('[data-testing="book-item"]').find('button:not(:disabled)').then((elements) => {
      if(elements.length > 0) {
        const firstEle = elements[0];
        firstEle.click();
        beforeLength = cy.get('.reading-list-item').then( vals => vals.length);
      } else return;
    });
    cy.get(('[data-testing="toggle-reading-list"]')).click();

    if (!beforeLength) return;
    cy.get('.reading-list-item .mat-icon-button').then((elements) => {
      const firstEle = elements[0];
      firstEle.click();
    })
    cy.get('.mat-simple-snackbar-action .mat-button').click();

    cy.get('.reading-list-item').should('have.length', beforeLength);

    cy.get('.reading-list-container .mat-button').click();
});

});
