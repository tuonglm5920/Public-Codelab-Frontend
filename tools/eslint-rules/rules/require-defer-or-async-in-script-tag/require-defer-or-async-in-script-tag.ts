import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

// NOTE: The rule will be available in ESLint configs as "@nx/workspace/require-defer-or-async-in-script-tag"
export const RULE_NAME = "require-defer-or-async-in-script-tag";

export const rule = ESLintUtils.RuleCreator(() => __filename)<
  [],
  "missingDeferOrAsync"
>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "Require all <script> tags to have either 'defer' or 'async' attribute",
    },
    fixable: "code",
    schema: [],
    messages: {
      missingDeferOrAsync: "All <script> tags must have either 'defer' or 'async' attribute",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        const nodeName = node.name as TSESTree.JSXIdentifier
        if (nodeName.name === "script") {
          const hasDeferAttribute = node.attributes.some(
            (attribute) =>
              attribute.type === "JSXAttribute" &&
              attribute.name.name === "defer"
          );
          const hasAsyncAttribute = node.attributes.some(
            (attribute) =>
              attribute.type === "JSXAttribute" &&
              attribute.name.name === "async"
          );
          if (!hasDeferAttribute && !hasAsyncAttribute) {
            context.report({
              node,
              messageId: "missingDeferOrAsync",
            });
          }
        }
      },
    };
  },
});
