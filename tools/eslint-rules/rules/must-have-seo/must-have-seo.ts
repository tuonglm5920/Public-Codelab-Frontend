import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import { getFilename } from "@typescript-eslint/utils/eslint-utils";

// NOTE: The rule will be available in ESLint configs as "@nx/workspace/must-have-seo"
export const RULE_NAME = "must-have-seo";

export const rule = ESLintUtils.RuleCreator(() => __filename)<
  [{ folder: string }],
  | "mustExportHandleVariable"
  | "handleVariableMustHaveSitemapProperty"
  | "namedAfterDefault"
>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce exporting a 'handle' variable with a 'sitemap' property",
    },
    schema: [
      {
        type: "object",
        properties: {
          folder: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      mustExportHandleVariable: 'Must export "handle" variable',
      namedAfterDefault:
        "Export named statements should come after export default statements",
      handleVariableMustHaveSitemapProperty:
        '"handle" must have "sitemap" property',
    },
  },
  defaultOptions: [{ folder: ".*" }], // Default folder to current directory
  create(context, [options]) {
    let defaultExportFound = false;
    let isCheckedSitemapProperty = false;
    const folderRegex = new RegExp(options.folder);
    const currentFilePath = getFilename(context);
    const isNeedCheckFile = folderRegex.test(currentFilePath);

    return {
      ExportDefaultDeclaration: () => {
        if (isNeedCheckFile) {
          defaultExportFound = true;
        }
      },
      ExportNamedDeclaration: (node) => {
        if (defaultExportFound) {
          //#region Check "handle" must have "sitemap" property
          if (node.declaration?.type === "VariableDeclaration") {
            const handleVariable = node.declaration.declarations.find(
              (declaration) => {
                return (
                  declaration.type === "VariableDeclarator" &&
                  declaration.id.type === "Identifier" &&
                  declaration.id.name === "handle"
                );
              },
            ) as TSESTree.VariableDeclarator | undefined;

            if (handleVariable) {
              const handleObject = handleVariable?.init as
                | TSESTree.ObjectExpression
                | undefined;
              const handleProperties = handleObject?.properties;
              const isExistSitemapProperty = handleProperties?.find(
                (property) => {
                  return (
                    property.type === "Property" &&
                    property.key.type === "Identifier" &&
                    property.key.name === "sitemap"
                  );
                },
              );
              if (!isExistSitemapProperty) {
                isCheckedSitemapProperty = true;
                context.report({
                  node,
                  messageId: "handleVariableMustHaveSitemapProperty",
                });
              }
            }
          }
          //#endregion
        }
      },
      "Program:exit": (node) => {
        if (defaultExportFound) {
          //#region Check file exported "handle" variable
          const exportedHandle = node.body?.some((statement) => {
            const exportStatement =
              statement as TSESTree.ExportNamedDeclaration;
            const variableDeclaration =
              exportStatement.declaration as TSESTree.VariableDeclaration;
            return (
              exportStatement.type === "ExportNamedDeclaration" &&
              variableDeclaration?.declarations?.some((declaration) => {
                const declaration_ = declaration as TSESTree.VariableDeclarator;
                const id = declaration_?.id as TSESTree.Identifier;
                return id.name === "handle";
              })
            );
          });

          if (!exportedHandle) {
            context.report({
              node,
              messageId: "mustExportHandleVariable",
            });
          }
          //#endregion

          //#region Check "handle" must have "sitemap" property
          if (!isCheckedSitemapProperty) {
            const exportHandleDeclaration = node.body?.find((statement) => {
              const exportStatement =
                statement as TSESTree.ExportNamedDeclaration;
              const variableDeclaration =
                exportStatement.declaration as TSESTree.VariableDeclaration;
              return (
                exportStatement.type === "ExportNamedDeclaration" &&
                variableDeclaration?.declarations?.some((declaration) => {
                  const declaration_ =
                    declaration as TSESTree.VariableDeclarator;
                  const id = declaration_?.id as TSESTree.Identifier;
                  return id.name === "handle";
                })
              );
            }) as TSESTree.ExportNamedDeclaration | undefined;
            if (exportHandleDeclaration) {
              const declaration =
                exportHandleDeclaration.declaration as TSESTree.VariableDeclaration;
              const handleVariable = declaration.declarations.find(
                (declaration) => {
                  return (
                    declaration.type === "VariableDeclarator" &&
                    declaration.id.type === "Identifier" &&
                    declaration.id.name === "handle"
                  );
                },
              ) as TSESTree.VariableDeclarator | undefined;

              if (handleVariable) {
                const handleObject = handleVariable?.init as
                  | TSESTree.ObjectExpression
                  | undefined;
                const handleProperties = handleObject?.properties;
                const isExistSitemapProperty = handleProperties?.find(
                  (property) => {
                    return (
                      property.type === "Property" &&
                      property.key.type === "Identifier" &&
                      property.key.name === "sitemap"
                    );
                  },
                );
                if (!isExistSitemapProperty) {
                  context.report({
                    node,
                    messageId: "handleVariableMustHaveSitemapProperty",
                  });
                }
              }
            }
          }
          //#endregion

          //#region Check order of export named & export default ==> Export named must after export default
          // let lastExportDefaultIndex = -99999;
          // let lastExportNamedIndex = 999999;
          // // Find the last index of export default and export named statements
          // node.body.forEach((statement, index) => {
          //   if (statement.type === "ExportDefaultDeclaration") {
          //     lastExportDefaultIndex = index;
          //   } else if (statement.type === "ExportNamedDeclaration") {
          //     lastExportNamedIndex = index;
          //   }
          // });
          // if (lastExportDefaultIndex > lastExportNamedIndex) {
          //   context.report({
          //     node: node.body[lastExportDefaultIndex],
          //     messageId: "namedAfterDefault",
          //   });
          // }
          //#endregion
        }
      },
    };
  },
});
