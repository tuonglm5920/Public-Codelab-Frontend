import { TSESLint } from "@typescript-eslint/utils";
import { rule, RULE_NAME } from "./must-have-seo";

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: `
        export const handle = {
          sitemap: {}
        };
        export default Component;
      `,
      options: [{ folder: "app/routes/.*.tsx" }],
      filename: "app/routes/_index.tsx",
    },
    {
      code: `
        export const handle = {};
        export default Component;
      `,
      options: [{ folder: "app/routes/.*.tsx" }],
      filename: "app/root.tsx",
    },
    {
      code: `
        export default Component;
      `,
      options: [{ folder: "app/routes/.*.tsx" }],
      filename: "app/entry.server.tsx",
    },
  ],
  invalid: [
    {
      code: `
        export const handle = {};
        export default Component;
      `,
      options: [{ folder: "app/routes/.*.tsx" }],
      filename: "app/routes/_index.tsx",
      errors: [{ messageId: "handleVariableMustHaveSitemapProperty" }],
    },
    {
      code: `
        export default Component;
      `,
      options: [{ folder: "app/routes/.*.tsx" }],
      filename: "app/routes/_index.tsx",
      errors: [{ messageId: "mustExportHandleVariable" }],
    },
  ],
});
