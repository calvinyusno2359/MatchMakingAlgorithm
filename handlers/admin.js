const mysql = require('mysql');

// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tinder-on-rainbow'
});

// Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...')
})

// Add agent 1
function addAgent1(req, res) {
    let agentId = '5e4a2f6ee9f1273063697382';
    let entry = { id: agentId, email: 'user.one@rainbow.com', availability: true };
    let sql = 'INSERT INTO agent SET ?';
    let query = db.query(sql, entry, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Agent 1 added...');
    });
};

// Add agent 2
function addAgent2(req, res) {
    let agentId = '5e4a303ae9f127306369738a';
    let entry = { id: agentId, email: 'user.two@rainbow.com', availability: false };
    let sql = 'INSERT INTO agent SET ?';
    let query = db.query(sql, entry, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Agent 2 added....');
    });
};

// Select agents
function selectAgents(req, res) {
    let sql = 'SELECT * FROM agent';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send('Agents fetched...');
    });
};

// Select single agent
function selectAgent(req, res) {
    let sql = `SELECT * FROM agent WHERE id = '${req.params.id}'`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Agent fetched...');
    });
};

// Update agent skill tag
function updateAgentSkillTag(req, res) {
    let newSkillTag = 'rubbish collecting';
    let sql = `UPDATE agent SET tag = '${newSkillTag}' WHERE id = '${req.params.id}'`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Agent skill tag updated...');
    });
};

// Delete agent
function deleteAgent(req, res) {
    let sql = `DELETE FROM agent WHERE id = '${req.params.id}'`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Agent deleted...');
    });
};

// exports
exports.addAgent1 = addAgent1;
exports.addAgent2 = addAgent2;
exports.selectAgents = selectAgents;
exports.selectAgent = selectAgent;
exports.updateAgentSkillTag = updateAgentSkillTag;
exports.deleteAgent = deleteAgent;