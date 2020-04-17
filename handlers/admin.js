// modules
let path = require("path");
let mysql = require('mysql');
let config = require("../config");
let matchmaker = require("./rainbow").matchmaker;

// Create connection
let db = mysql.createPool(config.dblogin);

function checkAuthentication(req, res) {
    let credentials = req.body;
    console.log(credentials);
    let sql = `SELECT * FROM admin WHERE username = ${mysql.escape(credentials.username)} and password = ${mysql.escape(credentials.password)}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        return result.length == 0 ? res.redirect('/home') : res.redirect('/admin');
    })
}

// Populate agents
function populateAgents(req, res) {
    if (req.headers.referer !== "https://localhost:8080/home" &&
        req.headers.referer !== "https://match-made-on-rainbow.herokuapp.com/home") {
        res.send("Access Denied");
    }
    let sql = 'SELECT * FROM agent';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('Agents fetched...');
        res.render('db', { data: result });
    });
};

// Add agent
function addAgent(req, res) {
    let entry = req.body;
    let sql = 'INSERT INTO agent SET ?';
    db.query(sql, [entry], async(err, result) => {
        if (err) {
            res.status(400).send(); // Bad request
        } else {
            await matchmaker.getAllAvailableAgent();
            console.log("Agent added...");
            res.status(200).send();
        }
    });
};

// Update agent, including skill tag
function updateAgent(req, res) {
    let entry = req.body;
    let sql = `UPDATE agent SET email = ${mysql.escape(entry.email)}, tag = ${mysql.escape(entry.tag)} WHERE id = ${mysql.escape(entry.id)}`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(400).send(); // Bad request
        } else if (result.affectedRows == 0) {
            res.status(304).send(); // Not modified
        } else {
            console.log("Agent updated...");
            res.status(200).send();
        }
    });
};

// Delete agent
function deleteAgent(req, res) {
    let sql = `DELETE FROM agent WHERE id = ${mysql.escape(req.params.id)}`;
    db.query(sql, async(err, result) => {
        if (err) {
            res.status(400).send(); // Bad request
        } else if (result.affectedRows == 0) {
            res.status(304).send(); // Not modified
        } else {
            await matchmaker.getAllAvailableAgent();
            console.log("Agent deleted...");
            res.status(200).send();
        }
    });
};

function updateAgentAvailability(agentId, binary) {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE agent SET availability = ${mysql.escape(binary)} WHERE id = ${mysql.escape(agentId)}`
        db.query(sql, (err, result) => {
            if (err) reject(err);
            console.log(result);
            resolve(true);
        });
    });
};

// exports
exports.checkAuthentication = checkAuthentication;
exports.populateAgents = populateAgents;
exports.addAgent = addAgent;
exports.updateAgent = updateAgent;
exports.deleteAgent = deleteAgent;
exports.updateAgentAvailability = updateAgentAvailability;
