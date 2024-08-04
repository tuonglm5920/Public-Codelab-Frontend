const { readFileSync, readdirSync, statSync, writeFileSync } = require("fs");
const { getRootTsConfigPath } = require("@nx/js");
const path = require("path");
const { parse } = require('comment-json')

const baseTsConfig = parse(readFileSync(getRootTsConfigPath(), "utf-8"));
const pathsOfBaseTsConfig_ = baseTsConfig?.compilerOptions?.paths;
const pathsOfBaseTsConfig =
  pathsOfBaseTsConfig_ && typeof pathsOfBaseTsConfig_ === "object"
    ? pathsOfBaseTsConfig_
    : {};

const directoryOfAppsFolder = path.join(process.cwd(), "apps");
const directoryOfApps = readdirSync(directoryOfAppsFolder).reduce(
  (result, item) => {
    const directoryOfApp = `${directoryOfAppsFolder}/${item}`;
    if (statSync(directoryOfApp).isDirectory()) {
      result.push(directoryOfApp);
    }
    return result;
  },
  [],
);
directoryOfApps.forEach((folder) => {
  try {
    const data = readFileSync(path.join(folder, "tsconfig.json"), "utf-8");
    const tsConfig = parse(data);
    const paths_ = tsConfig?.compilerOptions?.paths;
    const paths = paths_ && typeof paths_ === "object" ? paths_ : {};
    tsConfig.compilerOptions.paths = {
      ...paths,
      ...Object.keys(pathsOfBaseTsConfig).reduce((result, absolutePath) => {
        const mapping = pathsOfBaseTsConfig[absolutePath];
        return {
          ...result,
          [absolutePath]: mapping.map((item) => `../../${item}`),
        };
      }, {}),
    };
    writeFileSync(
      path.join(folder, "tsconfig.json"),
      JSON.stringify(tsConfig, undefined, 2),
    );
  } catch {
    console.log(
      `"${folder}" can't parse. Please remove comment in tsconfig.json`,
    );
  }
});
