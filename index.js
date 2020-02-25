let express = require('express');
let bodyParser = express.urlencoded({extended: true});
let RainbowSDK = require("rainbow-node-sdk");
let path = require("path");

// modules
let config = require("./config");
let matchMakerEngine = require("./matchMakerEngine");
let user = require("./handlers/user");
let agent = require("./handlers/agent");

// Instantiate the SDK
let rainbowSDK = new RainbowSDK(config.options);

// instantiate matchmaker engine
let matchmaker = new matchMakerEngine.MatchMaker();

// instantiate express app
let app = new express();

// app settings
app.use(bodyParser);
app.use(express.static(path.join(__dirname, 'views')));

// get all contacts and populate agentTable when SDK is ready
rainbowSDK.events.on('rainbow_onready', (req, res) => {
  let contacts = rainbowSDK.contacts.getAll();
  // populate contact table
  console.log("Rainbow SDK is ready.")
  app.listen(config.PORT);
});

// routes and handlers
app.get('/', async (req, res) => res.sendFile(path.join(__dirname + "/views/main.html")));
app.get('/chat', user.chat);
app.get('/call', user.call);
app.get('/chat/request', user.requesting);

// starts rainbowsdk
rainbowSDK.start();

// for faster testing
// app.listen(config.PORT, () => console.log(`Listening to port: ${config.PORT}...`));

