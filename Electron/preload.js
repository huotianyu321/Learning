// preload.js
// 可以在这里引入 contextBridge 和 ipcRenderer 来暴露安全接口给渲染进程
const { contextBridge, ipcRenderer } = require('electron');

console.log('######[preload.js] 我在preload.js中被调用, 我属于渲染进程');
console.log('######[preload.js] Preload script is running');

window.electronLog = 'Hello from preload.js';

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, args) => func(event, args));
  },
  once: (channel, func) => {
    ipcRenderer.once(channel, (event, args) => func(event, args));
  },
  invoke: (channel, data) => {
    return ipcRenderer.invoke(channel, data);
  }
});
