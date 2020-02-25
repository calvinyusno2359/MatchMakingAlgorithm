// Define your configuration
const options = {
    rainbow: {
        host: "sandbox"
    },
    credentials: {
        login: "spam.xyz999@gmail.com", // To replace with your developer credendials
        password: "Cain186Leon!"        // To replace with your developer credentials
    },
    // Application identifier
    application: {
        appID: "30088dc04d5411ea819a43cb4a9dae9b",
        appSecret: "2Z3DnzBTREuuoVfFRA6uvlbKxmwTi4Ri8RwWxLsaCQA7TDf41vqKe7N63rVroLm6"
    },
    // Logs options
    logs: {
        enableConsoleLogs: true,
        enableFileLogs: false,
        "color": true,
        "level": 'debug',
        "customLabel": "match-made-on-rainbow",
        "system-dev": {
            "internals": false,
            "http": false,
        },
        file: {
            path: "/var/tmp/rainbowsdk/",
            customFileName: "R-SDK-Node-Sample2",
            level: "debug",
            zippedArchive : false/*,
            maxSize : '10m',
            maxFiles : 10 // */
        }
    },
    // IM options
    im: {
        sendReadReceipt: true
    }
};

exports.options = options;
