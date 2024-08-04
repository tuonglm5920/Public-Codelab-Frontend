# Folder Structure

## Apps

### File: `project.json`

Scripts "typecheck" and "lint" are required to run lint-staged.

```json
{
  ...,
  "targets": {
    ...,
    "lint": {
      "executor": "@nx/linter:eslint",
      "outputs": ["{options.outputFile}"],
      "options": {
        "lintFilePatterns": ["apps/<APP_NAME>/**/*.{js,ts,jsx,tsx}"],
        "fix": true,
        "ignorePath": "apps/<APP_NAME>/.eslintignore"
      }
    },
    "typecheck": {
      "command": "tsc -p tsconfig.json --noEmit",
      "options": {
        "cwd": "apps/<APP_NAME>"
      }
    }
  }
}

```

## Libs

### File: `project.json`

Scripts "typecheck", "lint", and "test" (if available) are required to run lint-staged.

```json
{
  ...,
  "targets": {
    ...,
    "typecheck": {
      "executor": "nx:run-commands",
      "options": {
        "cwd": "libs/<LIB_NAME>",
        "commands": ["tsc -p tsconfig.json --noEmit"]
      }
    },
    "lint": {
      "executor": "@nx/linter:eslint",
      "outputs": ["{options.outputFile}"],
      "options": {
        "lintFilePatterns": ["libs/<LIB_NAME>/**/*.{ts,tsx,js,jsx}"],
        "fix": true
      }
    },
    "test": {
      ...
    }
  }
}
```
