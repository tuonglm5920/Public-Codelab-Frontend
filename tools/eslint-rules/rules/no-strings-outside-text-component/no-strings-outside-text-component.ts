import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

// NOTE: The rule will be available in ESLint configs as "@nx/workspace/no-strings-outside-text-component"
export const RULE_NAME = "no-strings-outside-text-component";

export const rule = ESLintUtils.RuleCreator(() => __filename)<
  [],
  "translateChildren"
>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "enforce text labels in JSX to be wrapped by Text component",
    },
    schema: [],
    messages: {
      translateChildren:
        "String literals must be enclosed within the Text component. Replace the string with <Text>your string</Text> to comply with best practices.",
    },
  },
  defaultOptions: [],
  create(context) {
    const checkNode = (node: TSESTree.Node) => {
      if (node.type === "JSXExpressionContainer") {
        const expression = node.expression;

        // Check if the expression is a TemplateLiteral
        if (expression.type === "TemplateLiteral") {
          if (!isInsideTextComponent(node)) {
            context.report({ node, messageId: "translateChildren" });
          }
        }

        // Check if the expression is a Literal and a string
        else if (
          expression.type === "Literal" &&
          typeof expression.value === "string"
        ) {
          if (!isInsideTextComponent(node)) {
            context.report({ node, messageId: "translateChildren" });
          }
        }

        // Check if the expression is an Identifier (assuming it's a string variable)
        // else if (expression.type === "Identifier") {
        //   if (!isInsideTextComponent(node)) {
        //     context.report({ node, messageId: "translateChildren" });
        //   }
        // }
      } else if (node.type === "JSXText" && node.value.trim() !== "") {
        if (!isInsideTextComponent(node)) {
          context.report({ node, messageId: "translateChildren" });
        }
      }
    };

    const isInsideTextComponent = (node: TSESTree.Node) => {
      const parent = node.parent as TSESTree.JSXElement;

      // Ignore if "disableStrict" is "true"
      if (
        parent &&
        parent.openingElement &&
        parent.openingElement.attributes.some(
          (attr) =>
            attr.type === "JSXAttribute" &&
            attr.name.type === "JSXIdentifier" &&
            attr.name.name === "disableStrict" &&
            ((attr.value?.type === "Literal" && attr.value.value === true) ||
              attr.value === null),
        )
      ) {
        return true;
      }

      return (
        parent &&
        parent.openingElement &&
        parent.openingElement.name &&
        parent.openingElement.name.type === "JSXIdentifier" &&
        parent.openingElement.name.name === "Text"
      );
    };

    return {
      JSXElement(node) {
        node.children.forEach(checkNode);
      },
      JSXFragment(node) {
        node.children.forEach(checkNode);
      },
    };
  },
});
