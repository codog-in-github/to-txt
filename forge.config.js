const path = require('path');
module.exports = {
  packagerConfig: {
    asar: {
      unpackDir: '{dist,template}'
    },
    ignore: [
      /^\/public\//,
      /^\/\.vscode\//,
      /^\/src\//,
    ],
    platform: "all"
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
