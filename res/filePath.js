const { resolve } = require('path');
const { app } = require('electron');
const isPa = app.isPackaged;

const distDir = isPa ? resolve(process.resourcesPath, 'app.asar.unpacked/dist') : null;

const preloadJs = isPa
  ? resolve(distDir, 'preload.js')
  : resolve(__dirname, '../public/preload.js');

const templateDir = isPa
  ? resolve(process.resourcesPath, 'app.asar.unpacked/template')
  : resolve(__dirname, '../template');

module.exports = {
  preloadJs,
  templateDir,
  distDir
};