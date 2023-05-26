const { contextBridge, ipcRenderer } = require('electron');
const { readFileSync } = require("fs");
const { join } = require("path");


const desktopCapturer = {
    getSources: (opts) => ipcRenderer.invoke('DESKTOP_CAPTURER_GET_SOURCES', opts)
}

window.addEventListener("DOMContentLoaded", () => {
    const rendererScript = document.createElement("script");
    rendererScript.text = readFileSync(join(__dirname, "renderer.js"), "utf8");
    document.body.appendChild(rendererScript);
});

contextBridge.exposeInMainWorld("myCustomGetDisplayMedia", async () => {
    const sources = await desktopCapturer.getSources({
        types: ["window", "screen"],
    });

    // you should create some kind of UI to prompt the user
    // to select the correct source like Google Chrome does
    const selectedSource = sources[0]; // this is just for testing purposes

    return selectedSource;
});


contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
        send: (channel, data) => {
            let validChannels = ["open-url"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        on: (channel, listener) => ipcRenderer.on(channel, listener),
        removeListener: (channel, listener) => ipcRenderer.removeListener(channel, listener),
        checkFileExists: (path) => ipcRenderer.invoke('check-file-exists', path),
    },
});