/**
 * main.js
 * electron 应用的 主进程（Main Process）入口文件 ，负责创建窗口、管理生命周期、与操作系统交互，并协调渲染进程的行为
 * 在package.json中定义的main字段指定了入口文件，Electron 会自动加载该文件并执行。
 */
/**
 * contextIsolation: true 是 Electron 提供的一项 安全机制 ，用于在渲染进程中隔离 Node.js 上下文（Node Integration） 和 网页内容的上下文（Web Content Context）
 * 可以防止网页中的 JavaScript 直接访问 Node.js API（如 require, process, module 等），从而提高 Electron 应用的安全性。
 * 启用 contextIsolation: true 后：
 * 渲染进程的 JavaScript 无法直接访问 Node.js 模块；
 * 所有对 Node.js 的调用必须通过一个“预加载脚本（preload.js）”进行；
 * 这个 preload.js 在一个隔离的上下文中(但还是渲染进程中)运行，可以安全地暴露有限接口给网页。
 */

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');

console.log('######[main.js] i am called in main.js, i belong to main process of electron');

function createWindow() {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    // autoHideMenuBar: true, // 隐藏菜单栏，通过alt键显示
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true, // 安全隔离开启
      preload: path.join(__dirname, 'preload.js') // 预加载脚本, 安全暴漏API
    }
  });

  // 窗口事件监听
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F5') {
      event.preventDefault();
      win.reload();
    }
    if (input.key === 'F12') {
      event.preventDefault();
      win.webContents.openDevTools();
    }
  });
  win.webContents.on('did-finish-load', () => {
    console.log('######[main.js] did-finish-load');
    win.webContents.send('load-success');
  });
  win.webContents.on('did-fail-load', () => {
    console.log('######[main.js] did-fail-load');
  });

  // 进程间通讯
  // IPC进程间通讯, 主进程直接通过ipcMain来注册, 渲染进程通过preload.js暴漏的ipcRenderer接口注册
  ipcMain.on('message-from-renderer', (event, arg) => {
    console.log('######[main.js] receive a mesage from renderer process: ', arg);
    event.reply('message-from-main', '我是主进程发送的消息');
  });
  ipcMain.handle('invoke-do-something', (event, arg) => {
    console.log('######[main.js] receive a invoke from renderer process: ', arg);
    return 'something did in main process: ' + arg;
  });

  // 加载Electron 应用窗口内容, 可通过本地 HTML 文件或远程 URL 加载
  // 注意：只会显示最后一次调用的 load 方法内容

  // 方式一：加载本地 HTML 页面
  win.loadFile('index.html');

  // 方式二：加载远程网页
  // win.loadURL('https://mh-sit.uicloud.com/uis/client/medical-record ');

  Menu.setApplicationMenu(null);
}

// 创建窗口
app.whenReady().then(() => {
  console.log('######[main.js] App is ready, creating window...');
  createWindow();
});

// 生命周期
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
