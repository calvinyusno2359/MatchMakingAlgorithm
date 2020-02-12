// Define your configuration
const options = {
    rainbow: {
        host: "sandbox"
    },
    credentials: {
        login: "", // To replace with your developer credendials
        password: ""        // To replace with your developer credentials
    },
    // Application identifier
    application: {
        appID: "",
        appSecret: ""
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
