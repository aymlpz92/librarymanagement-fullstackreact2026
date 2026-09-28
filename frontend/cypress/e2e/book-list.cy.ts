describe('Book list', () => {
  it('should display books returned by the API', () => {
    cy.intercept('GET', 'http://localhost:3000/books', {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: 'Dune',
          author: 'Frank Herbert',
          available_copies: 3,
          total_copies: 3,
        },
      ],
    }).as('getBooks');

    cy.visit('http://localhost:4200');

    cy.wait('@getBooks');

    cy.get('.book-item')
      .should('have.length.at.least', 1)
      .and('contain.text', 'Dune');
  });

  it("permet d'ajouter un livre", () => {
  cy.visit("http://localhost:4200/add");

  cy.get('input[name="title"]').type("Fondation");
  cy.get('input[name="author"]').type("Herbert");
  cy.get('input[name="totalCopies"]').type("3");

  cy.intercept("POST", "http://localhost:3000/books")
    .as("addBook");

  cy.get("button").contains("Add Book").click();

  cy.wait("@addBook");

  cy.visit("http://localhost:4200");

  cy.contains("Fondation").should("exist");
});

  it("should add book", () => {
    cy.intercept('POST', 'http://localhost:3000/books').as('addBook');
    

    cy.visit('http://localhost:4200/add');

    cy.get('[data-cy=title]').type('Dune');
    cy.get('[data-cy=author]').type('Frank Herbert');
    cy.get('[data-cy=copies]').type('{selectall}3');

    cy.get('[data-cy="submit"]').click();

    cy.wait('@addBook');

    cy.get('@addBook')
    .its('request.body')
    .should('deep.include', {
      title: 'Dune',
      author: 'Frank Herbert',
    });
    
  })

  it('should delete book', () => {
    cy.intercept('GET', 'http://localhost:3000/books', {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: 'Fondation',
          author: 'Frank Herbert',
          available_copies: 3,
          total_copies: 3,
        },
      ],
    }).as('getBooks');


    cy.visit('http://localhost:4200');

    cy.wait('@getBooks');
    
    cy.intercept('DELETE', 'http://localhost:3000/books/1', {
      statusCode: 204,
    }).as('deleteBook');

    cy.get('[data-cy=delete-btn]').click();

    cy.wait('@deleteBook')
      .its('response.statusCode')
      .should('eq', 204);

    cy.visit('http://localhost:4200');

    cy.wait('@getBooks');

    cy.get('.book-item')
    .should('have.length', 0);


  });

  it('should borrow book', () => {
    cy.intercept('GET', 'http://localhost:3000/books', {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: 'Fondation',
          author: 'Frank Herbert',
          available_copies: 3,
          total_copies: 3,
        },
      ],
    }).as('getBooks');

    cy.visit('http://localhost:4200');

    cy.wait('@getBooks');

    cy.intercept('PUT', 'http://localhost:3000/books/1/borrow', {
      statusCode: 202,
    }).as('borrowBook');

    cy.get('[data-cy=available-copies]')
    .should('have.text', '3');

    cy.get('[data-cy=borrow-btn]').click();

    cy.wait('@borrowBook')
    .its('response.statusCode')
    .should('eq', 202)

    cy.visit('http://localhost:4200');

    cy.wait('@getBooks');

    cy.get('[data-cy=available-copies]')
    .should('have.text', '2');
    
  })

});