let express = require('express');
let bodyParser = express.urlencoded({extended: true});
let RainbowSDK = require("rainbow-node-sdk");
let path = require("path");

// modules
let user = require("./handlers/user");
let agent = require("./handlers/agent");
let rainbow = require("./handlers/rainbow");

// get rainbowSDK
let rainbowSDK = rainbow.rainbowSDK;

// instantiate express app
let app = new express();

// app settings
app.use(bodyParser);
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

// routes and handlers
app.get('/', async (req, res) => res.sendFile(path.join(__dirname + "/views/main.html")));
app.get('/chat', user.chat);
app.get('/call', user.call);
app.get('/chat/request', user.requesting);

// starts rainbowsdk
rainbowSDK.start();

let PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Listening to port: ${PORT}...`));
