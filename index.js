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
// user-related routes
app.get('/', async(req, res) => res.sendFile(path.join(__dirname + "/views/main.html")));
app.get('/chat', user.chat);
app.get('/call', user.call);
app.get('/call/request', user.requesting);
app.get('/chat/request', user.requesting);
app.post('/chat/disconnect', user.disconnect);
app.get('/calling', user.calling);

// admin-related routes
app.get('/admin', admin.selectAgents);
app.post('/admin/addagent', admin.addAgent);
app.post('/admin/updateagent', admin.updateAgent);
app.get('/admin/deleteagent/:id', admin.deleteAgent);
// app.get('/admin/selectagents', admin.selectAgents);
// app.get('/admin/selectagent', admin.selectAgent);

// starts rainbowsdk
// comment this for faster load during development
rainbowSDK.start();

var fs = require('fs');
var https = require('https');

https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    }, app)
    .listen(8080, function() {
        //https://localhost:8080
        console.log('Example app listening on port 3000! Go to https://localhost:3000/')
    });

// let PORT = process.env.PORT || 8080
// app.listen(PORT, () => console.log(`Listening to port: ${PORT}...`));