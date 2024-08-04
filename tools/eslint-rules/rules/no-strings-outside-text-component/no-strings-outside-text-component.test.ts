import { TSESLint } from "@typescript-eslint/utils";
import { rule, RULE_NAME } from "./no-strings-outside-text-component";

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

const errorsJSX = [{ messageId: "translateChildren" }] as const;

ruleTester.run(RULE_NAME, rule, {
  valid: [
    { code: "<Text>text</Text>" },
    { code: "<Text> text </Text>" },
    { code: '<Text>"text"</Text>' },
    { code: "<Text>'text'</Text>" },
    { code: "<Text>`text`</Text>" },
    { code: '<Text>{"text"}</Text>' },
    { code: "<Text>{'text'}</Text>" },
    { code: "<Text>{`text`}</Text>" },
    { code: "<Text>{text}</Text>" },
    { code: "<Text> {text} </Text>" },
    {
      code: `
        <Text id="homepage.title" description="The homepage welcome message">
          Welcome to my website
        </Text>
      `,
    },
    {
      code: `
        <Text values={{firstName: 'Sébastien'}}>
          {'Welcome, {firstName}! How are you?'}
        </Text>
      `,
    },
    {
      code: `<Text>{'This'} is {\`valid\`}</Text>`,
    },
    { code: "<Text>&#8203;</Text>" },
    { code: `<Text>{a}</Text>`, options: [] },
    // With "disableStrict"
    {
      code: `
        <View disableStrict className={className} style={style} ref={ref}>
          {children}
        </View>
      `,
    },
  ],
  invalid: [
    { code: "<Component>text</Component>", errors: errorsJSX },
    { code: "<Component> text </Component>", errors: errorsJSX },
    { code: '<Component>"text"</Component>', errors: errorsJSX },
    { code: "<Component>'text'</Component>", errors: errorsJSX },
    { code: "<Component>`text`</Component>", errors: errorsJSX },
    { code: '<Component>{"text"}</Component>', errors: errorsJSX },
    { code: "<Component>{'text'}</Component>", errors: errorsJSX },
    { code: "<Component>{`text`}</Component>", errors: errorsJSX },
    { code: "<>text</>", errors: errorsJSX },
    { code: "<Component>· — ×</Component>", errors: errorsJSX },
    { code: "<Component>··</Component>", errors: errorsJSX },
    { code: "<Component> ·· </Component>", errors: errorsJSX },
    { code: '<Component>"·"</Component>', errors: errorsJSX },
    { code: "<Component>'·'</Component>", errors: errorsJSX },
    { code: "<Component>`·`</Component>", errors: errorsJSX },
  ],
});
