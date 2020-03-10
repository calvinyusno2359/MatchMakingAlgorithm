let express = require('express');
let bodyParser = express.urlencoded({ extended: true });
let path = require("path");

// modules
let user = require("./handlers/user");
let agent = require("./handlers/agent");
let admin = require("./handlers/admin");
let rainbow = require("./handlers/rainbow");

// get rainbowSDK
let rainbowSDK = rainbow.rainbowSDK;

// instantiate express app
let app = new express();

// app settings
app.use(bodyParser);
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '1mb' }));
app.set('view engine', 'ejs');

// routes and handlers
app.get('/', async(req, res) => res.sendFile(path.join(__dirname, "/views/main.html")));
app.get('/chat', user.chat);
app.get('/call', user.call);
app.get('/chat/request', user.requesting);
app.get('/admin', admin.selectAgents);
app.post('/admin/addagent', admin.addAgent);
app.post('/admin/updateagent', admin.updateAgent);
app.get('/admin/deleteagent/:id', admin.deleteAgent);
// app.get('/admin/selectagents', admin.selectAgents);
// app.get('/admin/selectagent', admin.selectAgent);

// starts rainbowsdk
// rainbowSDK.start();

let PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Listening to port: ${PORT}...`));