const fs = require("fs");
const path = require("path");


const devDependenciesKeys = [
  // "@remix-run/dev",
  // "autoprefixer",
  "electron-builder",
  "electron-devtools-installer",
  "electron",
  // "postcss",
  // "tailwindcss",
];

// Read and parse the root package.json file
const rootPackagePath = path.resolve(__dirname, "../../package.json");
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, "utf8"));

// Extract the required devDependencies
const selectedDevDependencies = {};
devDependenciesKeys.forEach((key) => {
  if (rootPackage.devDependencies && rootPackage.devDependencies[key]) {
    selectedDevDependencies[key] = rootPackage.devDependencies[key];
  }
});

// Get the target package.json file path from command line arguments
const targetPackagePath = process.argv[2];
if (!targetPackagePath) {
  console.error(
    "Error: Please provide the path to the target package.json file.",
  );
  process.exit(1);
}

// Resolve the target package path
const resolvedTargetPackagePath = path.resolve(
  __dirname,
  `../../${targetPackagePath}`,
);

// Check if the target package.json exists
if (!fs.existsSync(resolvedTargetPackagePath)) {
  console.error(
    `Error: The file at ${resolvedTargetPackagePath} does not exist.`,
  );
  process.exit(1);
}

// Read and parse the target application's package.json file
const targetPackage = JSON.parse(
  fs.readFileSync(resolvedTargetPackagePath, "utf8"),
);
targetPackage.version = targetPackage.version ?? "0.0.0";
// Merge the extracted dependencies with the target application's package.json
targetPackage.dependencies = {
  ...rootPackage.dependencies,
};
targetPackage.devDependencies = {
  ...targetPackage.devDependencies,
  ...selectedDevDependencies,
};

// Write the updated package.json back to the target application
fs.writeFileSync(
  resolvedTargetPackagePath,
  JSON.stringify(targetPackage, null, 2),
  "utf8",
);

console.log(
  "dependenciesCopier.js: package.json has been updated successfully.",
);
