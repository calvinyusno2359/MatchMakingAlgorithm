let express = require('express');
let bodyParser = express.urlencoded({ extended: true });
let https = require("https");
let path = require("path");

// modules
let user = require("./handlers/user");
let agent = require("./handlers/agent");
let admin = require("./handlers/admin");
let rainbow = require("./handlers/rainbow");
let config = require("./config");

// get rainbowSDK
let rainbowSDK = rainbow.rainbowSDK;

// instantiate express app
let app = new express();

// app settings
app.use(bodyParser);
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '1mb' }));

// routes and handlers
// user-related routes
app.get('/', async(req, res) => res.sendFile(path.join(__dirname + "/views/main.html")));
app.get('/chat', user.chat);
app.get('/call', user.call);
app.get('/call/request', user.requesting);
app.get('/chat/request', user.requesting);
app.post('/chat/disconnect', user.disconnect);
app.get('/calling',user.calling);

// admin-related routes
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname + "/views/admin.html")));
app.post('/admin/addagent', admin.addAgent);
app.get('/admin/deleteagent/:id', admin.deleteAgent);
// app.get('/selectagents', admin.selectAgents);
// app.get('/selectagent', admin.selectAgent);
// app.get('/updateagentskilltag/:id', admin.updateAgentSkillTag);


// starts rainbowsdk
// comment this for faster load during development
rainbowSDK.start();

let PORT = process.env.PORT || 8080

// for localhost deployment: use self-issued ssh found in config.js
https.createServer({ key: config.key, cert: config.cert }, app).listen(PORT, () => {
  console.log(`App listening on port ${PORT}! Go to https://localhost:${PORT}/`);
});

// for heroku deployment: ssl certificate for https is managed by heroku's Auto Cert Management
// app.listen(PORT, () => console.log(`Listening to port: ${PORT}...`));
