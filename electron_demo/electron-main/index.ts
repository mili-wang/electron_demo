 // electron-main/index.ts
import { app, BrowserWindow } from "electron"
import path from "path"
const isDevelopment = process.env.NODE_ENV !== 'production'
 
const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      contextIsolation: false, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      preload: path.join(__dirname, "./preload.js"), // 需要引用js文件
    },
  })
 
  // 如果打包了，渲染index.html
  // 当使用vite启动项目的时候会存在VITE_DEV_SERVER_URL这个环境变量
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools()
  } else {
    //或者加载打包好的html
    win.loadFile(path.join(__dirname, "./index.html"))
  }
}


app.whenReady().then(() => {
  createWindow() // 创建窗口
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
 
// 关闭窗口
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
}) 

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}