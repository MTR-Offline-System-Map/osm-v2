// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const tsParser = require("@typescript-eslint/parser");
const { ESLintUtils } = require("@typescript-eslint/utils");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: [
          "./tsconfig.json",
          "./tsconfig.app.json",
          "./tsconfig.spec.json",
        ],
      },
    },
    plugins: {
      local: {
        rules: {
          "enforce-signal-call": {
            meta: {
              type: 'problem',
              docs: { description: 'Do not use Signal directly' },
              messages: {
                signalNotCalled: 'Do not use Signal directly',
              },
              schema: [],
            },
            create(context) {
              const parserServices = context.sourceCode.parserServices;
              if (!parserServices?.program || !parserServices.esTreeNodeToTSNodeMap) {
                throw new Error('Must enable TypeScript type check');
              }

              const checker = parserServices.program.getTypeChecker();

              function isSignalType(type) {
                const typeName = checker.typeToString(type);
                return /^(Signal|WritableSignal|InputSignal|ModelSignal)</.test(typeName);
              }

              function isLegalUsage(node) {
                const parent = node.parent;
                if (!parent) return false;

                if (parent.type === 'VariableDeclarator' && parent.id === node) return true;
                if (parent.type === 'PropertyDefinition' && parent.key === node) return true;
                if (parent.type === 'AssignmentPattern' && parent.left === node) return true;
                if (parent.type.includes('Function') && parent.params?.includes(node)) return true;
                if (parent.type.includes('TS')) return true;


                if (parent.type === 'CallExpression' && parent.callee === node) return true;

                if (
                  parent.type === 'MemberExpression' &&
                  parent.object === node &&
                  parent.property.type === 'Identifier' &&
                  ['set', 'update', 'asReadonly', 'mutate'].includes(parent.property.name)
                ) {
                  return true;
                }

                if (parent.type === 'AssignmentExpression' && parent.left === node) {
                  return true;
                }

                if (parent.type === 'VariableDeclarator' && parent.init === node && parent.id.type === 'ObjectPattern') {
                  return true;
                }

                return false;
              }

              // ---------- 核心检查 ----------
              function checkNode(node) {
                if (!node) return;

                const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
                if (!tsNode) return;

                const type = checker.getTypeAtLocation(tsNode);
                if (!isSignalType(type)) return;

                if (isLegalUsage(node)) return;

                context.report({
                  node,
                  messageId: 'signalNotCalled',
                });
              }

              return {
                Identifier(node) {
                  if (node.parent?.type === 'MemberExpression' && node.parent.property === node) {
                    return;
                  }
                  checkNode(node);
                },
                MemberExpression(node) {
                  checkNode(node);
                },
              };
            },
          },
        },
      },
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/no-empty-function": "off",
      "local/enforce-signal-call": "error",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/click-events-have-key-events": "off",
      "@angular-eslint/template/interactive-supports-focus": "off",
    },
  },
]);
