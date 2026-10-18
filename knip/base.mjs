// Base Knip configuration for Exaecut repositories.
// Usage: import this object into a consumer's knip.config.ts and spread it,
// then add repository-specific entry points and ignores:
//
//   import base from "./.standards/knip/base.mjs";
//   export default { ...base, entry: ["src/index.ts"] };
export default {
  ignoreExportsUsedInFile: true,
};
