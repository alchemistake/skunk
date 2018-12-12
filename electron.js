// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, globalShortcut} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow();
    mainWindow.maximize();
    mainWindow.setSimpleFullScreen(true);
    mainWindow.setFullScreen(true);

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    mainWindow.setMenu(null);
    const menu = Menu.buildFromTemplate([{
        label: 'Electron',
        submenu: [{
            role: 'quit',
            submenu: null,
            type: 'normal',
            accelerator: null,
            icon: null,
            label: 'Quit Skunk',
            sublabel: '',
            enabled: true,
            visible: true,
            checked: false,
            commandId: 9
        }],
        type: 'submenu',
        role: null,
        accelerator: null,
        icon: null,
        sublabel: '',
        enabled: true,
        visible: true,
        checked: false,
        commandId: 10,
    }, {
        role: 'window',
        submenu: [{
            role: 'close',
            submenu: null,
            type: 'normal',
            accelerator: null,
            icon: null,
            label: 'Close Window',
            sublabel: '',
            enabled: true,
            visible: true,
            checked: false,
            commandId: 35
        }],
        type: 'submenu',
        accelerator: null,
        icon: null,
        label: 'Window',
        sublabel: '',
        enabled: true,
        visible: true,
        checked: false,
        commandId: 40
    }]);
    Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    app.quit()
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});