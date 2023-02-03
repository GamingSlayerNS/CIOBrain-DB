// Modules to control application life and create native browser window
const {app, BrowserWindow, protocol} = require('electron')
const path = require('path')
const url = require('url')
const kill = require('kill-port')

const { fork } = require('child_process');
fork(path.join(__dirname, 'api', 'index'));

async function createWindow () {

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";
  mainWindow.loadURL(appURL);

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

async function end() {
  try {
    await kill('3001', 'tcp');
    app.quit();
  } catch (e) {
    app.quit();
  }
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}

app.whenReady().then(() => {
    createWindow();
    setupLocalFilesNormalizerProxy();
});

app.on('window-all-closed', function () {
  end();
});

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = "https://my-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationURL) => {
    const parsedURL = new URL(navigationURL);
    if (!allowedNavigationDestinations.includes(parsedURL.origin)) {
      event.preventDefault();
    }
  });
});