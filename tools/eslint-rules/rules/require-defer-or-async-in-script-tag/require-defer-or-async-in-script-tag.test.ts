import { TSESLint } from "@typescript-eslint/utils";
import { rule, RULE_NAME } from "./require-defer-or-async-in-script-tag";

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
      code: '<script src="script.js" defer></script>',
    },
    {
      code: '<script src="script.js" async></script>',
    },
    {
      code: '<script src="script.js" defer async></script>',
    },
    {
      code: '<script src="script.js" defer="defer"></script>',
    },
  ],
  invalid: [
    {
      code: '<script src="script.js"></script>',
      errors: [{ messageId: "missingDeferOrAsync" }],
    },
    {
      code: '<script src="script.js" type="text/javascript"></script>',
      errors: [{ messageId: "missingDeferOrAsync" }],
    },
  ],
});
