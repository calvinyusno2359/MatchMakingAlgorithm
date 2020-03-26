// modules
const mysql = require('mysql');
let config = require("../config");

// Create connection
const db = mysql.createPool(config.dblogin);

// Populate agents
function populateAgents(req, res) {
    // will remove localhost and tinder-on-rainbow eventually
    if (req.headers.referer !== "https://localhost:8080/home" &&
        req.headers.referer !== "https://tinder-on-rainbow.herokuapp.com/home" &&
        req.headers.referer !== "https://match-made-on-rainbow.herokuapp.com/.herokuapp.com/home") {
        res.send("Access Denied");
        return;
    }
    let sql = 'SELECT * FROM agent';
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        console.log('Agents fetched...');
        res.render('db', { data: results });
    });
};

// Add agent
function addAgent(req, res) {
    let entry = req.body;
    let sql = 'INSERT INTO agent SET ?';
    db.query(sql, entry, (err, result) => {
        if (err) {
            res.status(400).send(); // Bad request
        } else {
            console.log(result);
            console.log("Agent added...");
            res.status(200).send();
        }
    });
};

// Update agent, including skill tag
function updateAgent(req, res) {
    let entry = req.body;
    let sql = `UPDATE agent SET email = '${entry.email}', tag = '${entry.tag}' WHERE id = '${entry.id}'`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(400).send(); // Bad request
        } else if (result.affectedRows == 0) {
            res.status(304).send(); // Not modified
        } else {
            console.log(result);
            console.log("Agent updated...");
            res.status(200).send();
        }
    });
};

// Delete agent
function deleteAgent(req, res) {
    let sql = `DELETE FROM agent WHERE id = '${req.params.id}'`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(400).send(); // Bad request
        } else if (result.affectedRows == 0) {
            res.status(304).send(); // Not modified
        } else {
            console.log(result);
            console.log("Agent deleted...");
            res.status(200).send();
        }
    });
};

function getAgents(req, res) {
    const tag = req.params.id
    let sql = `SELECT id, matched_user, availability FROM agent WHERE tag = '${tag}'`
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.json({ result: result });
    })
}

function updateAgentAvailability(req, res) {
    const id = req.params.id
    let sql = `UPDATE agent SET availability = 0 WHERE id = '${id}'`
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.json({ result: result });
    })
}

function adminLogin(req, res) {
    let credentials = req.body;
    console.log(credentials);
    let sql = `SELECT * FROM admin WHERE username = '${credentials.username}' and password = '${credentials.password}'`;
    db.query(sql, (err, result) => {
        data = JSON.stringify(result);
        parseData = (JSON.parse(data))[0];
        if (JSON.stringify(parseData) == JSON.stringify(credentials)) {
            res.status(200).send();
        } else {
            res.status(550).send(); // Permission denied
        }
    })
}

// exports
exports.addAgent = addAgent;
exports.populateAgents = populateAgents;
exports.updateAgent = updateAgent;
exports.deleteAgent = deleteAgent;
exports.getAgents = getAgents;
exports.updateAgentAvailability = updateAgentAvailability;
exports.adminLogin = adminLogin;