console.log('####[index.js] 我在index.html中被调用, 我属于渲染进程');

window.electronAPI.on('message-from-main', (event, arg) => {
  console.log('#######[index.js] 收到主进程的消息:', event, arg);
});

const btn = document.querySelector('#myBtn');
if (btn) {
  btn.addEventListener('click', async () => {
    window.electronAPI.send('message-from-renderer', 'im a msg from renderer process')
    const response = await window.electronAPI.invoke('invoke-do-something', 'im a invoke msg from renderer process');
    console.log('#######[index.js] 收到主进程invoke响应:', response);
  });
}
