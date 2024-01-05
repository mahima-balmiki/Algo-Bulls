describe('Social Media App End to End Test.', () => {

  before(() => {
    cy.visit('http://localhost:3000');
  });

  it('The sign in form can be filled.', () => {

    cy.log('Filling out the sign in.');
    cy.get('input[data-testid="usernameOrEmail"]').type('test');

    cy.get('input[data-testid="password"]').type('test');

    cy.get('button[data-testid="signInSubmit"]').click();

    cy.get('li[data-testid="createPostLink"]').click();

  });

   it('Can Create the Post.', () => {

    cy.signIn(); 
    cy.get('li[data-testid="createPostLink"]').click();

    cy.get('input[data-testid="createPostTitle"]').type('Cypress Create Post Title');

    cy.get('textarea[data-testid="createPostContent"]').type('Cypress Create Post Content');

    cy.get('button[data-testid="createPostSubmit"]').click();

    cy.get('li[data-testid="allPosts"]').click();

  });

  it('Can go to the All Posts.', () => {

    cy.signIn();

    cy.get('li[data-testid="allPosts"').click();
  });

  it('Can go to the Liked Posts.', () => {

    cy.signIn();

    cy.get('li[data-testid="likedPosts"').click();
  });

  it('Can go to the Bookmarked Posts.', () => {

    cy.signIn();

    cy.get('li[data-testid="bookmarkedPosts"').click();
  });

  it('Can go to the My Posts.', () => {

    cy.signIn();

    cy.get('li[data-testid="myPosts"').click();
  });

  it('Can go to the Profile.', () => {

    cy.signIn();

    cy.get('li[data-testid="profile"').click();
  });

  it('Can change the Profile Name and Password.', () => {

    cy.signIn();

    cy.get('li[data-testid="profile"').click();

    cy.get('input[data-testid="changeName"]').clear().type('Cypress test new Name');

    cy.get('input[data-testid="changePassword"]').clear().type('test new password');

    cy.get('button[data-testid="updateSubmit"]').click();

    cy.get('p[data-testid="name"]').should('include.text','Name: Cypress test new Name');

    // Revert the Name and Password Changes.

    cy.get('input[data-testid="changeName"]').clear().type('test');

    cy.get('input[data-testid="changePassword"]').clear().type('test');

    cy.get('button[data-testid="updateSubmit"]').click();

    cy.get('p[data-testid="name"]').should('include.text','test');

  });

  it('Can Log Out gracefully.', () => {
    cy.signIn();
    cy.get('button[data-testid="logout"]').click();
  });

  it('Run All End to End Tasks.', () => {
    cy.signIn();

    cy.get('li[data-testid="createPostLink"]').click();

    cy.get('input[data-testid="createPostTitle"]').type('Cypress Create Post Title');

    cy.get('textarea[data-testid="createPostContent"]').type('Cypress Create Post Content');

    cy.get('button[data-testid="createPostSubmit"]').click();

    cy.get('li[data-testid="allPosts"]').click();

    cy.get('li[data-testid="likedPosts"').click();

    cy.get('li[data-testid="bookmarkedPosts"').click();

    cy.get('li[data-testid="myPosts"').click();

    cy.get('li[data-testid="profile"').click();

    cy.get('input[data-testid="changeName"]').clear().type('Cypress test new Name');

    cy.get('input[data-testid="changePassword"]').clear().type('test new password');

    cy.get('button[data-testid="updateSubmit"]').click();

    cy.get('p[data-testid="name"]').should('include.text','Name: Cypress test new Name');

    // Revert the Name and Password Changes.

    cy.get('input[data-testid="changeName"]').clear().type('test');

    cy.get('input[data-testid="changePassword"]').clear().type('test');

    cy.get('button[data-testid="updateSubmit"]').click();

    cy.get('p[data-testid="name"]').should('include.text','test');

  })

});

