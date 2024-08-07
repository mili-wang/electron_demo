 // electron-main/index.ts
import { app, BrowserWindow } from "electron"
import path from "path"
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'

const { spawn } = require('child_process');

const cmd=require('node-cmd');

// 获取程序的根目录地址
const appPath = app.getAppPath();

const isDevelopment = process.env.NODE_ENV !== 'production'
 
const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      webSecurity: false,
      contextIsolation: false, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      preload: path.join(__dirname, "./preload.js"), // 需要引用js文件
    },
  })
 
  // 如果打包了，渲染index.html
  // 当使用vite启动项目的时候会存在VITE_DEV_SERVER_URL这个环境变量
  let manageExePath;
  if (process.env.VITE_DEV_SERVER_URL) {
    // 获取 manage.exe 的路径
    manageExePath = path.join(__dirname, '../backend/manage.exe');
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools()
  } else {
    // 获取 manage.exe 的路径
    manageExePath = path.join(app.getAppPath(), 'resources', '../../manage.exe');
    //或者加载打包好的html
    win.loadFile(path.join(__dirname, "./index.html"))
    win.webContents.openDevTools()
  }
  
  // const manageExePath = path.join(app.getAppPath(), 'resources', 'manage.exe'); //path.join(__dirname, './manage.exe');

  // 启动 manage.exe
  const manageProcess = spawn(manageExePath, ['runserver', '--noreload', '0.0.0.0:8000']);

  // 监听输出
  manageProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  manageProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  manageProcess.on('exit', (code) => {
    console.log(`manage.exe exited with code ${code}`);
    // 如果进程正常退出，通常 code 为 0
    if (code === 0) {
      console.log('manage.exe started successfully');
    } else {
      console.error('manage.exe did not start successfully');
    }
  });

  manageProcess.on('close', (code) => {
    console.log(`manage.exe exited with code ${code}`);
  });
}


app.whenReady().then(() => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow() // 创建窗口
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
 
// 关闭窗口
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
    cmd.run(`taskkill /F /im manage.exe`)
  }
}) 

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
        cmd.run(`taskkill /F /im manage.exe`)
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
      cmd.run(`taskkill /F /im manage.exe`)
    })
  }
}