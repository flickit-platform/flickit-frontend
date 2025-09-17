/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("ifElementExist", (selector, cb) => {
  cy.get("body").then(($body) => {
    const element = $body.find(selector);
    if (element.length > 0) {
      return cb(element) || cy.wrap(element);
    }
  });
});

Cypress.Commands.add(
  "runXTimesEveryYSeconds",
  (cb, iterationCount, timeBetweenEachIteration = 1000) => {
    for (let i = 0; i < iterationCount; i++) {
      cb();
      cy.wait(timeBetweenEachIteration);
    }
  },
);

// cypress/support/commands.ts

type KcLoginUiOptions = {
  user?: string;
  pass?: string;
  fakePass?: string;
  kcUrl?: string;
  visitPath?: string | false;
  errorSelector?: string;
  afterLoginUrlIncludes?: string | false;
  onlySuccess?: boolean; // 👈 جدید: فقط لاگین موفق
};

Cypress.Commands.add("kcLoginUi", (opts: KcLoginUiOptions = {}) => {
  const user = opts.user || (Cypress.env("E2E_USER") as string) || "admin@asta.ir";
  const pass = opts.pass || (Cypress.env("E2E_PASS") as string) || "demodemo654321";
  const fakePass = opts.fakePass || "wrong-pass-123";
  const kcUrlEnv = (Cypress.env("KEYCLOAK_URL") as string) || "https://stage.flickit.org/accounts";
  const kcUrl = opts.kcUrl || kcUrlEnv;
  const visitPath = typeof opts.visitPath !== "undefined" ? opts.visitPath : "/";
  const errorSelector =
    typeof opts.errorSelector !== "undefined"
      ? opts.errorSelector
      : "#input-error, #kc-error-message, .kc-feedback-text";
  const baseUrlConfig = (Cypress.config("baseUrl") as string) || "http://localhost:3000";
  const afterLoginUrlIncludes =
    typeof opts.afterLoginUrlIncludes !== "undefined" ? opts.afterLoginUrlIncludes : baseUrlConfig;
  const onlySuccess = !!opts.onlySuccess; // 👈

  const kcOrigin = new URL(kcUrl).origin;

  if (visitPath !== false) {
    cy.visit(visitPath as string);
  }

  cy.origin(
    kcOrigin,
    { args: { user, pass, fakePass, errorSelector, onlySuccess } },
    ({ user, pass, fakePass, errorSelector, onlySuccess }) => {
      function clickLogin() {
        cy.get("body", { timeout: 20000 }).then(($body) => {
          if ($body.find("#kc-login").length) {
            cy.get("#kc-login", { timeout: 20000 }).should("be.enabled").click({ force: true });
            return;
          }
          if ($body.find('input[name="login"]').length) {
            cy.get('input[name="login"]').click({ force: true });
            return;
          }
          if ($body.find('button[name="login"]').length) {
            cy.get('button[name="login"]').click({ force: true });
            return;
          }
          if ($body.find('input[type="submit"][value="ورود"]').length) {
            cy.get('input[type="submit"][value="ورود"]').click({ force: true });
            return;
          }
          cy.contains('button, input[type="submit"]', /ورود|sign in|log in|continue/i, { timeout: 20000 })
            .click({ force: true });
        });
      }

      const assertError = () => cy.get(errorSelector, { timeout: 20000 }).should("exist");

      if (onlySuccess) {
        // ✅ فقط لاگین موفق
        cy.get("#username", { timeout: 20000 }).clear().type(user);
        cy.get("#password", { timeout: 20000 }).clear().type(pass, { log: false });
        clickLogin();
        return;
      }

      // 🚧 فلو کامل قبلی (خطاها + موفق)
      cy.get("#username", { timeout: 20000 }).clear();
      cy.get("#password", { timeout: 20000 }).clear();
      clickLogin();  assertError();

      cy.get("#username").clear().type(user);
      cy.get("#password").clear();
      clickLogin();  assertError();

      cy.get("#username").clear();
      cy.get("#password").clear().type(fakePass, { log: false });
      clickLogin();  assertError();

      cy.get("#username").clear().type(user);
      cy.get("#password").clear().type(fakePass, { log: false });
      clickLogin();  assertError();

      cy.get("#password").clear().type(pass, { log: false });
      clickLogin();
    }
  );

});

export {};
