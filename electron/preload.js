const { contextBridge, ipcRenderer } = require("electron");
const os = require("os");
const path = require("path");
const fs = require("fs");
const { openExplorer } = require("explorer-opener")

contextBridge.exposeInMainWorld("electron", {
    path: () => path,
    __dirname: () => __dirname,
    homeDir: () => os.homedir(),
    arch: () => os.arch(),
    osVersion: () => os.version(),
    openExplorer: (p) => openExplorer(path.join(__dirname, p))
});

contextBridge.exposeInMainWorld("ipcRenderer", {
    send: (channel, ...data) => ipcRenderer.send(channel, ...data),
    on: (channel, func) =>
        ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
    removeListener: (channel, listener) => ipcRenderer.removeListener(channel, listener),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

contextBridge.exposeInMainWorld("engine", {
    currentSave: () => {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "./engine/PalServer/Pal/Saved/.pal"), { encoding: "utf-8" })).saveId
    }
})