import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

// NOTE: The rule will be available in ESLint configs as "@nx/workspace/no-untranslated-text"
export const RULE_NAME = "no-untranslated-text";

export const rule = ESLintUtils.RuleCreator(() => __filename)<
  [],
  "untranslatedText"
>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "ensure all text within Text components is translated",
    },
    schema: [],
    messages: {
      untranslatedText:
        "Untranslated text found within Text component. Ensure all text is translated.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXElement(node) {
        if (
          node.openingElement.name.type === "JSXIdentifier" &&
          node.openingElement.name.name === "Text" &&
          !node.openingElement.attributes.some(
            (attr) =>
              attr.type === "JSXAttribute" &&
              attr.name.type === "JSXIdentifier" &&
              attr.name.name === "disableStrict" &&
              ((attr.value?.type === "Literal" && attr.value.value === true) ||
                attr.value === null),
          )
        ) {
          node.children.forEach((child) => {
            if (child.type === "JSXText" && child.value.trim()) {
              context.report({ node: child, messageId: "untranslatedText" });
            } else if (child.type === "JSXExpressionContainer") {
              const expression = child.expression;
              // Check if the expression is a ternary expression
              if (expression.type === "ConditionalExpression") {
                // Check both parts of the ternary expression
                if (
                  !isValidExpression(expression.consequent) ||
                  !isValidExpression(expression.alternate)
                ) {
                  context.report({
                    node: child,
                    messageId: "untranslatedText",
                  });
                }
              } else if (!isValidExpression(expression)) {
                context.report({ node: child, messageId: "untranslatedText" });
              }
            }
          });
        }
      },
    };
  },
});

// Helpers
const isValidExpression = (
  expression: TSESTree.Expression | TSESTree.JSXEmptyExpression,
) => {
  return (
    expression.type === "CallExpression" || expression.type === "Identifier"
  );
};
