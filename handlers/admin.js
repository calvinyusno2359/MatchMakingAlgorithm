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

// Add agent
function addAgent(req, res) {
    let entry = req.body;
    let sql = 'INSERT INTO agent SET ?';
    let query = db.query(sql, entry, (err, result) => {
        if (err) throw err;
        console.log(result);
        console.log("Agent added...")
    });
    res.end();
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
        console.log('Agent deleted...');
    });
    res.end();
};

// exports
exports.addAgent = addAgent;
exports.selectAgents = selectAgents;
exports.selectAgent = selectAgent;
exports.updateAgentSkillTag = updateAgentSkillTag;
exports.deleteAgent = deleteAgent;