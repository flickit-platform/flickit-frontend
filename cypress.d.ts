import { mount } from "cypress/react";

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      kcLoginUi(opts?: {
        user?: string;
        pass?: string;
        fakePass?: string;
        kcUrl?: string;
        visitPath?: string | false;
        clickAppSignInSelector?: string;
        errorSelector?: string;
        afterLoginUrlIncludes?: string | false;
        onlySuccess?:boolean
      }): Chainable<void>;
    }
  }
}
