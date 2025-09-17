/// <reference types="cypress" />

context("Auth", () => {
  it("logs in via Keycloak UI (try fake password first)", () => {
    cy.kcLoginUi({
      visitPath: "http://localhost:3000",
      kcUrl: "https://stage.flickit.org/accounts",
    });
  });
});
