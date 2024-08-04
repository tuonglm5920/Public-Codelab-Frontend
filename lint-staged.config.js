const path = require("path");
const packageJson = require("./package.json");

module.exports = {
  "**/*.{js,ts,jsx,tsx}": [
    packageJson.scripts["typecheck"],
    packageJson.scripts["lint"],
    packageJson.scripts["stylelint"],
    packageJson.scripts["test"],
  ],
};

// const currentWorkingDirectory = process.cwd();

// module.exports = {
//   // Typecheck
//   '{apps,libs,tools}/**/*.{ts,tsx}': (files) => {
//     const filesJoinded = files
//       .map((item) => path.relative(currentWorkingDirectory, item))
//       .join(',');
//     return `nx affected --target=typecheck --files=${filesJoinded}`;
//   },

//   // Lint
//   '{apps,libs,tools}/**/*.{js,ts,jsx,tsx,json}': (files) => {
//     const filesJoinded = files
//       .map((item) => path.relative(currentWorkingDirectory, item))
//       .join(',');
//     return `nx affected --target=lint --files=${filesJoinded}`;
//   },

//   // Stylelint
//   '{apps,libs,tools}/**/*.{js,ts,jsx,tsx,json}': (files) => {
//     const filesJoinded = files
//       .map((item) => path.relative(currentWorkingDirectory, item))
//       .join(',');
//     return `nx affected --target=stylelint --files=${filesJoinded}`;
//   },
// };
