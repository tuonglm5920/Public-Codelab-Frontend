# Path of Libs Copier

The `pathOfLibsCopier.js` script streamlines the process of replicating dependency paths from the root directory to an application-specific configuration file (`tsconfig.json`) within the `apps` folder.

## Purpose

In TypeScript projects structured with multiple apps and shared libraries, maintaining coherent dependency paths becomes crucial for seamless development. The script addresses a common hurdle encountered when configuring `tsconfig.json` within individual app folders.

When attempting to integrate paths using the `"paths"` attribute under `"baseUrl"` in the `tsconfig.json` file of an app, issues arise with resolving the library paths. This can cause challenges in the workspace's ability to resolve these paths correctly, impacting functionalities like auto-import in VSCode, especially with deeply nested files and folders.
