import { TSESLint } from "@typescript-eslint/utils";
import { rule, RULE_NAME } from "./no-untranslated-text";

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
    { code: "<Text>{translatedText}</Text>" },
    { code: '<Text>{t("key")}</Text>' },
    { code: "<Text><AnotherComponent /></Text>" },
    {
      code: `
        <Text tagName="span" className="CopyButton__text">
          {isCopied ? copiedText : copyText}
        </Text>
      `,
    },
    // With "disableStrict"
    {
      code: '<Text disableStrict>Hello</Text>',
    },
  ],
  invalid: [
    {
      code: "<Text>Untranslated text</Text>",
      errors: [{ messageId: "untranslatedText" }],
    },
    {
      code: '<Text>{"Untranslated text"}</Text>',
      errors: [{ messageId: "untranslatedText" }],
    },
    {
      code: "<Text>{`Untranslated text`}</Text>",
      errors: [{ messageId: "untranslatedText" }],
    },
    {
      code: `
        <Text tagName="span" className="CopyButton__text">
          {isCopied ? "Copied" : copyText}
        </Text>
      `,
      errors: [{ messageId: "untranslatedText" }],
    },
    {
      code: `<Text>{code?.trim()}</Text>`,
      errors: [{ messageId: "untranslatedText" }],
    },
  ],
});
