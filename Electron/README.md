## 🧠 原理详解
- Electron 的架构是 多进程模型 ：

### 主进程（Main Process） ：
> 负责创建窗口、管理生命周期、调用系统功能。
>
> 只有一个。
>
> 运行的是 main.js 或你指定的入口文件。

### 渲染进程（Renderer Process） ：
> 每个窗口（BrowserWindow）都有一个独立的渲染进程。
>
> 运行网页内容（HTML/CSS/JS），相当于一个 Chromium 浏览器页面。
>
> index.html 和其中的 JS 脚本都在这里运行。
>
> preload.js 也是在这个进程中加载和执行的！

## 🔍 preload.js 的作用
> 虽然 preload.js 在渲染进程中运行，但它有特殊地位：
> 
> 它在页面加载之前就被执行；
>
> 可以提前获取到 ipcRenderer、contextBridge 等 Electron 模块；
>
> 可以安全地将某些主进程能力“桥接”给网页中的 JavaScript 使用。

## 进程间通讯
> 在 preload.js 中，可以向渲染进程暴漏 ipcRenderer 模块的API, 用于与主进程进行通信。
>
> 在主进程中, 可以使用ipcMain 模块的API, 用于与渲染进程进行通信。
>
> 有两种机制 
>
> 请求-响应式: invoke/handle, 渲染进程调用主进程方法并等待返回结果, 需要获取返回值（如读取文件、查询数据库）
>
> 事件监听式: on/send, 主动发送和监听消息（无返回值, 主进程主动推送信息给渲染进程）
>
> win.webContents.send('channel', 'message')也可以用于通讯, 适合主进程向特定窗口发消息, 渲染进程接受消息仍使用ipcRenderer.on. ipcMain.on可以监听所有窗口的消息