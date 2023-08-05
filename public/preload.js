const { contextBridge, ipcRenderer } = require('electron');

const invokes = ['transform', 'getTemplate'];
const electron = {};

invokes.forEach(name => {
  electron[name] = function () {
    return ipcRenderer.invoke(name, ...arguments);
  };
});

contextBridge.exposeInMainWorld('electron', electron);