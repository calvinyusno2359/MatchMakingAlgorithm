// Define your configuration
const options = {
    rainbow: {
        host: "sandbox"
    },
    credentials: {
        login: "derong97@gmail.com", // To replace with your developer credendials
        password: "Qwertyuiop~123" // To replace with your developer credentials
    },
    // Application identifier
    application: {
        appID: "de6b39a0513f11ea819a43cb4a9dae9b",
        appSecret: "WzpQkTwxj6SfULL9muZJ83yKFEvxuvM1Iq59HxaXSo9S3lrTK0ST4khFlRPGErZ2"
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
            zippedArchive: false
                /*,
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