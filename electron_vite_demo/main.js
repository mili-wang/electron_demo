const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
    // 注意：
  //  因为我们加载的是Vue 构建后的dist 目录，所以我们需要改一下， load
  //  的文件地址。
  
  // win.loadFile('index.html')

  win.loadURL('http://127.0.0.1:5173/')
  // 打开electron的开发者工具
  win.webContents.openDevTools({ mode: 'detach' })
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});