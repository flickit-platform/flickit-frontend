import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'yi84pu',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      ROOT: "https://stage.flickit.org",
    },
    baseUrl: "https://stage.flickit.org",
  },
});
